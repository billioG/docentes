-- ============================================================
-- MIGRACIÓN: Historial de avisos y notificaciones push enviadas
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.broadcast_log (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at    timestamptz DEFAULT now(),
    title         text,
    message       text,
    ann_type      text,           -- info | maintenance | new_course | event (null si fue solo push)
    is_announcement boolean DEFAULT false,
    is_push       boolean DEFAULT false,
    push_sent     integer,        -- suscripciones a las que sí llegó
    push_total    integer,        -- suscripciones activas al momento del envío
    push_expired  integer,        -- suscripciones muertas limpiadas en ese envío
    created_by    text            -- email del admin que lo envió
);

ALTER TABLE public.broadcast_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "broadcast_log_admin_all" ON public.broadcast_log;
CREATE POLICY "broadcast_log_admin_all" ON public.broadcast_log
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_broadcast_log_created_at ON public.broadcast_log(created_at DESC);
