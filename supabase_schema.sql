-- ============================================================
-- SCHEMA COMPLETO - Curso STEAM
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Es seguro ejecutarlo aunque las tablas ya existan.
-- ============================================================


-- ============================================================
-- 1. TABLAS
-- ============================================================

-- ============================================================
-- 0. ROLES DE USUARIO
-- ============================================================

-- TABLA: user_roles (roles de cada usuario)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role        text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at  timestamptz DEFAULT now()
);

-- Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: cada usuario puede leer su propio rol
DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Función helper: verifica si el usuario es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para registrar el rol automáticamente al crear un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        new.id,
        CASE 
            WHEN new.email = 'profebillio@gmail.com' THEN 'admin'
            ELSE 'student'
        END
    )
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Insertar roles para usuarios ya existentes (ejecución inicial)
INSERT INTO public.user_roles (user_id, role)
SELECT id, CASE WHEN email = 'profebillio@gmail.com' THEN 'admin' ELSE 'student' END
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;


-- TABLA: progress (progreso de cada usuario)
CREATE TABLE IF NOT EXISTS public.progress (
    id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email               text,
    current_module      int DEFAULT 1,
    current_card        int DEFAULT 0,
    completed_cards     jsonb DEFAULT '[]',
    xp                  int DEFAULT 0,
    level               int DEFAULT 1,
    badges              jsonb DEFAULT '[]',
    redeemed_prizes     jsonb DEFAULT '[]',
    quiz_correct_count  int DEFAULT 0,
    streak              int DEFAULT 0,
    last_activity_date  text,
    daily_missions      jsonb DEFAULT '{}',
    raffle_tickets      int DEFAULT 0,
    module_feedback     jsonb DEFAULT '{}',
    nps_history         jsonb DEFAULT '[]',
    updated_at          timestamptz DEFAULT now()
);

-- Si la tabla ya existía, agrega las columnas que puedan faltar
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS email               text;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS current_module      int DEFAULT 1;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS current_card        int DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS completed_cards     jsonb DEFAULT '[]';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS xp                  int DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS level               int DEFAULT 1;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS badges              jsonb DEFAULT '[]';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS redeemed_prizes     jsonb DEFAULT '[]';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS quiz_correct_count  int DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS streak              int DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS last_activity_date  text;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS daily_missions      jsonb DEFAULT '{}';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS raffle_tickets      int DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS module_feedback     jsonb DEFAULT '{}';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS nps_history         jsonb DEFAULT '[]';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS updated_at          timestamptz DEFAULT now();


-- TABLA: feedback (feedback por módulo — leído por el admin)
CREATE TABLE IF NOT EXISTS public.feedback (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id   int NOT NULL,
    module_name text,
    rating      int CHECK (rating BETWEEN 1 AND 5),
    nps         int CHECK (nps BETWEEN 0 AND 10),
    comment     text,
    created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS module_name text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS comment     text;


-- TABLA: resource_views (tiempo por tarjeta)
CREATE TABLE IF NOT EXISTS public.resource_views (
    id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type       text DEFAULT 'card',
    resource_id         text NOT NULL,
    time_spent_seconds  int DEFAULT 0,
    created_at          timestamptz DEFAULT now()
);


-- TABLA: user_events (eventos de analítica)
CREATE TABLE IF NOT EXISTS public.user_events (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type  text NOT NULL,
    metadata    jsonb DEFAULT '{}',
    created_at  timestamptz DEFAULT now()
);


-- TABLA: user_sessions (sesiones de usuario)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time       timestamptz DEFAULT now(),
    end_time         timestamptz,
    duration_seconds int
);


-- TABLA: courses (gestión de cursos desde admin)
-- El CMS guarda cursos con campo "id" como texto (slug), no uuid autogenerado
CREATE TABLE IF NOT EXISTS public.courses (
    id          text PRIMARY KEY,           -- slug identificador (ej: "abp", "mi-curso")
    title       text NOT NULL,
    description text,
    cover_image text,
    content     jsonb DEFAULT '{}',         -- contenido completo del curso (módulos, tarjetas)
    duration_hours int DEFAULT 0,
    created_by  uuid REFERENCES auth.users(id),
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
);
-- Migración si ya existe la tabla con uuid
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS content        jsonb DEFAULT '{}';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration_hours int DEFAULT 0;


-- TABLA: project_evidence (evidencias de proyectos del Módulo 2)
CREATE TABLE IF NOT EXISTS public.project_evidence (
    id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id        text NOT NULL,
    project_title  text,
    evidence_text  text,
    evidence_url   text,
    created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.project_evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "project_evidence_own"        ON public.project_evidence;
DROP POLICY IF EXISTS "project_evidence_admin_read" ON public.project_evidence;
CREATE POLICY "project_evidence_own" ON public.project_evidence
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "project_evidence_admin_read" ON public.project_evidence
    FOR SELECT USING (public.is_admin());


-- TABLA: card_feedback (rating por tarjeta individual)
CREATE TABLE IF NOT EXISTS public.card_feedback (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id    text NOT NULL,
    rating     int CHECK (rating BETWEEN 1 AND 5),
    created_at timestamptz DEFAULT now()
);


-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_feedback  ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 3. POLÍTICAS (DROP primero para evitar conflictos si ya existen)
-- ============================================================

DROP POLICY IF EXISTS "progress_own"              ON public.progress;
DROP POLICY IF EXISTS "progress_admin_read"       ON public.progress;
DROP POLICY IF EXISTS "feedback_insert"           ON public.feedback;
DROP POLICY IF EXISTS "feedback_read_own"         ON public.feedback;
DROP POLICY IF EXISTS "feedback_admin_read"       ON public.feedback;
DROP POLICY IF EXISTS "resource_views_own"        ON public.resource_views;
DROP POLICY IF EXISTS "resource_views_admin_read" ON public.resource_views;
DROP POLICY IF EXISTS "user_events_own"           ON public.user_events;
DROP POLICY IF EXISTS "user_events_admin_read"    ON public.user_events;
DROP POLICY IF EXISTS "user_sessions_own"         ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_admin_read"  ON public.user_sessions;
DROP POLICY IF EXISTS "courses_read"              ON public.courses;
DROP POLICY IF EXISTS "courses_admin_write"       ON public.courses;
DROP POLICY IF EXISTS "card_feedback_own"         ON public.card_feedback;


-- progress: cada usuario gestiona su propio registro
CREATE POLICY "progress_own" ON public.progress
    FOR ALL USING (auth.uid() = user_id);

-- progress: el admin puede leer todos los registros
CREATE POLICY "progress_admin_read" ON public.progress
    FOR SELECT USING (public.is_admin());

-- feedback: cualquier usuario autenticado puede insertar su propio feedback
CREATE POLICY "feedback_insert" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- feedback: cada usuario puede leer su propio feedback
CREATE POLICY "feedback_read_own" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);

-- feedback: el admin puede leer todo el feedback
CREATE POLICY "feedback_admin_read" ON public.feedback
    FOR SELECT USING (public.is_admin());

-- resource_views: cada usuario gestiona sus propios datos
CREATE POLICY "resource_views_own" ON public.resource_views
    FOR ALL USING (auth.uid() = user_id);

-- resource_views: el admin puede leer todo
CREATE POLICY "resource_views_admin_read" ON public.resource_views
    FOR SELECT USING (public.is_admin());

-- user_events: cada usuario gestiona sus propios eventos
CREATE POLICY "user_events_own" ON public.user_events
    FOR ALL USING (auth.uid() = user_id);

-- user_events: el admin puede leer todo
CREATE POLICY "user_events_admin_read" ON public.user_events
    FOR SELECT USING (public.is_admin());

-- user_sessions: cada usuario gestiona sus propias sesiones
CREATE POLICY "user_sessions_own" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- user_sessions: el admin puede leer todo
CREATE POLICY "user_sessions_admin_read" ON public.user_sessions
    FOR SELECT USING (public.is_admin());

-- courses: cualquier usuario autenticado puede leer cursos
CREATE POLICY "courses_read" ON public.courses
    FOR SELECT USING (auth.role() = 'authenticated');

-- courses: solo el admin puede crear/editar/borrar cursos
CREATE POLICY "courses_admin_write" ON public.courses
    FOR ALL USING (public.is_admin());

-- card_feedback: cada usuario gestiona su propio feedback de tarjetas
CREATE POLICY "card_feedback_own" ON public.card_feedback
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- 4. COMENTARIOS Y LIKES POR TARJETA (visibles para todos)
-- ============================================================

-- TABLA: card_comments (comentarios públicos por tarjeta)
-- NOTA: columna real es "comment" (no "body"), module_id es NOT NULL, user_name no existe
CREATE TABLE IF NOT EXISTS public.card_comments (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id     text NOT NULL,
    module_id   int NOT NULL DEFAULT 1,
    comment     text NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 1000),
    created_at  timestamptz DEFAULT now()
);
-- Migración segura si la tabla ya existe con el schema antiguo
ALTER TABLE public.card_comments ADD COLUMN IF NOT EXISTS module_id int NOT NULL DEFAULT 1;
ALTER TABLE public.card_comments ADD COLUMN IF NOT EXISTS comment   text;
-- Si la columna "body" existe, copiar datos y renombrarla
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='card_comments' AND column_name='body') THEN
        UPDATE public.card_comments SET comment = body WHERE comment IS NULL;
        ALTER TABLE public.card_comments DROP COLUMN IF EXISTS body;
    END IF;
END $$;

ALTER TABLE public.card_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_read_all"    ON public.card_comments;
DROP POLICY IF EXISTS "comments_insert_own"  ON public.card_comments;
DROP POLICY IF EXISTS "comments_delete_own"  ON public.card_comments;
DROP POLICY IF EXISTS "comments_admin_delete" ON public.card_comments;

-- Cualquier usuario autenticado puede leer todos los comentarios
CREATE POLICY "comments_read_all" ON public.card_comments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Cada usuario puede insertar su propio comentario
CREATE POLICY "comments_insert_own" ON public.card_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cada usuario puede eliminar solo sus propios comentarios
CREATE POLICY "comments_delete_own" ON public.card_comments
    FOR DELETE USING (auth.uid() = user_id);

-- El admin puede eliminar cualquier comentario
CREATE POLICY "comments_admin_delete" ON public.card_comments
    FOR DELETE USING (public.is_admin());


-- TABLA: comment_likes (likes/unlikes de comentarios)
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment_id  uuid REFERENCES public.card_comments(id) ON DELETE CASCADE NOT NULL,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (user_id, comment_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_read_all"   ON public.comment_likes;
DROP POLICY IF EXISTS "likes_insert_own" ON public.comment_likes;
DROP POLICY IF EXISTS "likes_delete_own" ON public.comment_likes;

-- Cualquier usuario autenticado puede leer todos los likes
CREATE POLICY "likes_read_all" ON public.comment_likes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Cada usuario puede insertar su propio like
CREATE POLICY "likes_insert_own" ON public.comment_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cada usuario puede eliminar solo su propio like
CREATE POLICY "likes_delete_own" ON public.comment_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_card_comments_card_id   ON public.card_comments(card_id);
CREATE INDEX IF NOT EXISTS idx_card_comments_user_id   ON public.card_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id    ON public.comment_likes(user_id);

-- ============================================================
-- 5. CENTROS EDUCATIVOS Y COORDINADORES
-- ============================================================

-- TABLA: schools (centros educativos)
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
    ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin gestiona escuelas"
    ON public.schools FOR ALL
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TABLA: user_schools (asignación docente ↔ centro)
CREATE TABLE IF NOT EXISTS public.user_schools (
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    school_id   uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, school_id)
);

ALTER TABLE public.user_schools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuario ve sus asignaciones"  ON public.user_schools;
DROP POLICY IF EXISTS "Admin gestiona asignaciones"  ON public.user_schools;
CREATE POLICY "Usuario ve sus asignaciones"
    ON public.user_schools FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin gestiona asignaciones"
    ON public.user_schools FOR ALL
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TABLA: coordinators (coordinadores por centro)
CREATE TABLE IF NOT EXISTS public.coordinators (
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    school_id   uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    name        text NOT NULL,
    email       text,
    created_at  timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, school_id)
);

ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Autenticados leen coordinadores" ON public.coordinators;
DROP POLICY IF EXISTS "Admin gestiona coordinadores"    ON public.coordinators;
CREATE POLICY "Autenticados leen coordinadores"
    ON public.coordinators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin gestiona coordinadores"
    ON public.coordinators FOR ALL
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- AUDITORÍA DE SEGURIDAD — Ejecutar para verificar RLS
-- ============================================================
-- Muestra todas las tablas públicas y si tienen RLS habilitado.
-- Cualquier tabla con rowsecurity = false es potencialmente vulnerable.
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Muestra todas las políticas RLS activas por tabla.
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;

-- Habilitar RLS en tablas que pudieran haberlo perdido
ALTER TABLE public.card_comments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses        ENABLE ROW LEVEL SECURITY;
