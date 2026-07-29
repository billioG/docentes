-- ============================================================
-- MIGRACIONES DE AUDITORÍA — Ejecutar en Supabase SQL Editor
-- ============================================================

-- ============================================================
-- FIX 1.1: Correo del admin en trigger (profebillio@gmail.com → billy@1bot.org)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        new.id,
        CASE
            WHEN new.email IN ('billy@1bot.org', 'profebillio@gmail.com') THEN 'admin'
            ELSE 'student'
        END
    )
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar roles ya existentes en la tabla user_roles
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
    SELECT id FROM auth.users
    WHERE email IN ('billy@1bot.org', 'profebillio@gmail.com')
);


-- ============================================================
-- FIX 1.2: Agregar columna user_name a card_comments
-- (El código JS la usa para mostrar el nombre del docente sin
--  hacer una consulta extra a la tabla progress)
-- ============================================================

ALTER TABLE public.card_comments
    ADD COLUMN IF NOT EXISTS user_name text;


-- ============================================================
-- FIX 3.1a: RPC para estadísticas globales de resource_views
-- (evita descargar todas las filas al browser)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_resource_views_stats()
RETURNS TABLE (total_seconds bigint, avg_seconds numeric, total_rows bigint)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT
        COALESCE(SUM(time_spent_seconds), 0)::bigint        AS total_seconds,
        COALESCE(ROUND(AVG(time_spent_seconds), 1), 0)      AS avg_seconds,
        COUNT(*)::bigint                                     AS total_rows
    FROM public.resource_views
    WHERE time_spent_seconds IS NOT NULL
      AND time_spent_seconds > 0;
$$;


-- ============================================================
-- FIX 3.1b: RPC para tiempo por tarjeta (Top más vistas)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_card_time_aggregates()
RETURNS TABLE (card_id text, views_count bigint, avg_seconds numeric)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT
        resource_id::text                           AS card_id,
        COUNT(*)::bigint                            AS views_count,
        ROUND(AVG(time_spent_seconds), 1)           AS avg_seconds
    FROM public.resource_views
    WHERE resource_type = 'card'
      AND time_spent_seconds IS NOT NULL
      AND time_spent_seconds > 0
    GROUP BY resource_id
    ORDER BY views_count DESC, avg_seconds DESC
    LIMIT 50;
$$;

-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.get_resource_views_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_card_time_aggregates() TO authenticated;


-- ============================================================
-- FIX 4.2: Tablas faltantes en schema (schools, user_schools, coordinators)
-- (ya existen en producción pero faltaban en el archivo de documentación)
-- ============================================================

-- TABLA: schools (centros educativos registrados por el admin)
CREATE TABLE IF NOT EXISTS public.schools (
    id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name                    text NOT NULL,
    code                    text,
    director_name           text,
    director_role           text,
    director_signature_url  text,
    created_at              timestamptz DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin gestiona escuelas"     ON public.schools;
DROP POLICY IF EXISTS "Autenticados leen escuelas"  ON public.schools;

CREATE POLICY "Autenticados leen escuelas"
    ON public.schools FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Admin gestiona escuelas"
    ON public.schools FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- TABLA: user_schools (asignación docente ↔ centro educativo)
CREATE TABLE IF NOT EXISTS public.user_schools (
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    school_id   uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, school_id)
);

ALTER TABLE public.user_schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin gestiona asignaciones"     ON public.user_schools;
DROP POLICY IF EXISTS "Usuario ve sus asignaciones"     ON public.user_schools;

CREATE POLICY "Usuario ve sus asignaciones"
    ON public.user_schools FOR SELECT
    TO authenticated USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin gestiona asignaciones"
    ON public.user_schools FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- TABLA: coordinators (coordinadores asignados a centros educativos)
CREATE TABLE IF NOT EXISTS public.coordinators (
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    school_id   uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    name        text NOT NULL,
    email       text,
    created_at  timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, school_id)
);

ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin gestiona coordinadores"    ON public.coordinators;
DROP POLICY IF EXISTS "Autenticados leen coordinadores" ON public.coordinators;

CREATE POLICY "Autenticados leen coordinadores"
    ON public.coordinators FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Admin gestiona coordinadores"
    ON public.coordinators FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- ============================================================
-- FIX 5: RLS más estricto en portfolios
-- Los docentes solo pueden insertar estado 'pending' y no pueden
-- modificar campos calculados por la IA o el servidor.
-- ============================================================

-- Eliminar política de UPDATE actual (permite modificar todo)
DROP POLICY IF EXISTS "Docente actualiza su portafolio" ON public.portfolios;

-- Nueva política de UPDATE: solo permite editar campos de entregables,
-- no los campos de resultado (ai_*, combined_score, status, evaluated_at)
CREATE POLICY "Docente actualiza entregables propios"
    ON public.portfolios FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        -- El docente no puede auto-asignarse estado evaluated/passed/failed
        AND (status = 'pending' OR status IS NULL)
    );

-- Política de INSERT: solo permite estado 'pending'
DROP POLICY IF EXISTS "Docente inserta su portafolio" ON public.portfolios;

CREATE POLICY "Docente inserta su portafolio"
    ON public.portfolios FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND (status = 'pending' OR status IS NULL)
    );

-- Admin puede leer y actualizar todos los portafolios (para evaluación manual)
DROP POLICY IF EXISTS "Admin ve todos los portafolios" ON public.portfolios;

CREATE POLICY "Admin ve todos los portafolios"
    ON public.portfolios FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
