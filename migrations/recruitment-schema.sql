-- ============================================================
-- MÓDULO DE RECLUTAMIENTO — Ejecutar en Supabase SQL Editor
-- Es seguro ejecutarlo aunque las tablas ya existan.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.candidates (
    id                        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name                 text NOT NULL,
    email                     text NOT NULL,
    phone                     text,
    jornada_disponible        text,   -- 'matutina' | 'vespertina' | 'ambas'
    pretension_salarial       numeric NOT NULL,   -- Q mensuales declarados por el candidato
    acepta_jornada            boolean NOT NULL DEFAULT false,
    interes_mineduc           boolean NOT NULL DEFAULT false,  -- informativo, NO filtra
    compromiso_finalizar_programa boolean NOT NULL DEFAULT false,
    status                    text NOT NULL DEFAULT 'aplicado'
        CHECK (status IN ('aplicado','rechazado_filtro','evaluacion_pendiente',
                           'evaluado','contratado','desertado','rechazado')),
    rejection_reason          text,   -- 'salario' | 'jornada_compromiso' | null — por qué no pasó el filtro
    access_token              uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    applied_at                timestamptz DEFAULT now(),
    updated_at                timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.candidate_evaluations (
    id                        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id              uuid REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL UNIQUE,
    technical_score           int,
    soft_score                int,
    overall_score             int,
    passed                    boolean,
    feedback                  jsonb DEFAULT '{}',
    weak_areas                text[] DEFAULT '{}',
    recommended_path_ids      text[] DEFAULT '{}',   -- ids de LEARNING_PATHS (admin.js)
    raw_responses             jsonb DEFAULT '{}',    -- {case_id: answer_text, ...}
    candidate_decision        text CHECK (candidate_decision IN ('continuar','retirar') OR candidate_decision IS NULL),
    created_at                timestamptz DEFAULT now()
);

-- RLS: habilitado, CERO políticas para anon/authenticated.
-- Todo acceso pasa por Edge Functions con el service-role key
-- (submit-application, evaluate-candidate, admin-users), que
-- bypassean RLS. Estas tablas guardan PII de candidatos — a
-- diferencia de otras tablas del schema (courses, schools,
-- coordinators) que sí tienen alguna política USING(true) o
-- public.is_admin(), NO agregar una política de lectura aquí
-- por costumbre/copiar-pegar. El panel admin también lee vía
-- Edge Function (admin-users → listCandidates), no vía RLS.
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_evaluations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_candidates_access_token ON public.candidates(access_token);
CREATE INDEX IF NOT EXISTS idx_candidates_status        ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email          ON public.candidates(email);
