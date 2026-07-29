-- ============================================================
-- ÍNDICES DE RENDIMIENTO — Ejecutar en Supabase SQL Editor
-- ============================================================
-- Contexto: el panel de admin consulta 'progress' por updated_at
-- cada 30s (contador de "en línea") y estas tablas de tracking
-- (resource_views, user_sessions, feedback) se filtran por user_id
-- constantemente sin índice, forzando sequential scans en cada
-- consulta. Esto se detectó al investigar un aviso de Supabase de
-- "exhausting multiple resources" en el proyecto.
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_progress_updated_at     ON public.progress(updated_at);
CREATE INDEX IF NOT EXISTS idx_resource_views_user_id  ON public.resource_views(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_views_resource ON public.resource_views(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id   ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session   ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id        ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id     ON public.user_events(user_id);
