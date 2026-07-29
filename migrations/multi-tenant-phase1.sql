-- ============================================================
-- MULTI-TENANT FASE 1 — reclutamiento white-label por colegio
-- Ejecutar en Supabase SQL Editor. Seguro de correr aunque ya exista.
-- ============================================================

-- ============================================================
-- 1. TABLA tenants (marca por colegio — sin datos sensibles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenants (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug            text NOT NULL UNIQUE,          -- 'vdf' -> yoaprendo.online/vdf/
    name            text NOT NULL,                 -- "Colegio VDF"
    program_name    text NOT NULL DEFAULT 'Programa STEEAM',
    primary_color   text NOT NULL DEFAULT '#07B0E4',
    secondary_color text,
    logo_url        text,
    active          boolean NOT NULL DEFAULT true,
    created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Público: solo lectura de tenants activos. No hay PII en esta tabla
-- (nombre/colores/logo), por eso se permite lectura anon directa —
-- a diferencia de candidates/candidate_evaluations, que NO tienen
-- políticas y solo se acceden vía Edge Function con service-role.
DROP POLICY IF EXISTS tenants_public_read ON public.tenants;
CREATE POLICY tenants_public_read ON public.tenants FOR SELECT USING (active);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);

-- ============================================================
-- 2. user_roles: agregar tenant_id, permitir un rol POR tenant
-- ============================================================
-- tenant_id IS NULL = 1bot original (billy@1bot.org). Filas existentes
-- quedan con tenant_id NULL automáticamente — cero cambio de comportamiento
-- para el uso actual. UNIQUE(user_id) se reemplaza por UNIQUE(tenant_id,
-- user_id) porque un mismo login podría, en teoría, administrar más de un
-- tenant (el super admin) o distintas personas del mismo colegio necesitan
-- cada una su propia fila con el mismo tenant_id.
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_key'
  ) THEN
    ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_user_id_key;
  END IF;
END $$;

-- NULLS NOT DISTINCT (Postgres 15+, Supabase ya corre en 15+) hace que
-- múltiples filas con tenant_id NULL para el mismo user_id SÍ choquen como
-- duplicado — sin esto, Postgres trata cada NULL como distinto y un mismo
-- usuario podría terminar con más de una fila "sin tenant" (bug sutil).
-- Si esta línea falla por versión de Postgres, avisar antes de continuar.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_tenant_user_unique'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_tenant_user_unique UNIQUE NULLS NOT DISTINCT (tenant_id, user_id);
  END IF;
END $$;

-- ============================================================
-- 3. candidates / candidate_evaluations: agregar tenant_id
-- ============================================================
-- tenant_id NULL = candidatos que postularon antes de esta fase (1bot).
-- Sigue sin haber políticas RLS — el acceso pasa por submit-application /
-- evaluate-candidate / admin-users (service-role), que ahora filtran por
-- tenant_id en el código de la función, no en Postgres.
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id);
ALTER TABLE public.candidate_evaluations ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id);

CREATE INDEX IF NOT EXISTS idx_candidates_tenant ON public.candidates(tenant_id);
