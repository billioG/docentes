-- ============================================================
-- Áreas curriculares del CNB (Guatemala) para contextualizar los casos
-- de estudio generados por IA. Ejecutar en Supabase SQL Editor.
-- ============================================================
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS cnb_areas text[];
