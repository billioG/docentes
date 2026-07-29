-- ============================================================
-- MIGRACIÓN: Avisos del admin + suscripciones de notificaciones push
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.
-- ============================================================

-- ============================================================
-- 0. DEPENDENCIAS BASE — user_roles + is_admin()
-- Se crean aquí por si supabase_schema.sql aún no corrió completo en
-- este proyecto. CREATE TABLE IF NOT EXISTS no pisa datos existentes;
-- CREATE OR REPLACE FUNCTION es seguro de re-ejecutar.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role        text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Si tu cuenta admin (billy@1bot.org) todavía no tiene fila en
-- user_roles, esto la crea/actualiza sin tocar las demás.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'billy@1bot.org'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';


-- ============================================================
-- 1. AVISOS — usa la tabla app_config (key/value genérica).
-- Se crea aquí por si portfolio_schema.sql aún no se ha ejecutado
-- en este proyecto (CREATE TABLE IF NOT EXISTS, no pisa la existente).
-- Estructura del value (jsonb) para la clave 'announcement':
--   {
--     "id": 1234567890,          -- timestamp, cambia con cada aviso nuevo
--     "active": true,
--     "type": "maintenance" | "info" | "new_course" | "event",
--     "title": "Texto corto",
--     "message": "Texto largo del aviso",
--     "expiresAt": "2026-07-10T00:00:00.000Z" | null
--   }
-- ============================================================

CREATE TABLE IF NOT EXISTS public.app_config (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de config" ON public.app_config;
DROP POLICY IF EXISTS "Solo admin escribe config"  ON public.app_config;

CREATE POLICY "Lectura pública de config"
  ON public.app_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admin escribe config"
  ON public.app_config FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

INSERT INTO public.app_config (key, value) VALUES (
  'announcement',
  '{"id": 0, "active": false, "type": "info", "title": "", "message": "", "expiresAt": null}'::jsonb
) ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- 2. SUSCRIPCIONES DE NOTIFICACIONES PUSH (Web Push / VAPID)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    endpoint    text NOT NULL,
    p256dh      text NOT NULL,
    auth        text NOT NULL,
    user_agent  text,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "push_subscriptions_own"        ON public.push_subscriptions;
DROP POLICY IF EXISTS "push_subscriptions_admin_read"  ON public.push_subscriptions;

-- Cada usuario gestiona sus propias suscripciones (crear/borrar desde su dispositivo)
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- El admin puede leer todas (para ver cuántos docentes tienen push activo)
CREATE POLICY "push_subscriptions_admin_read" ON public.push_subscriptions
    FOR SELECT USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
