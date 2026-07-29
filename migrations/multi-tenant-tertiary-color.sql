-- ============================================================
-- Tercer color de marca por colegio. Ejecutar en Supabase SQL Editor.
-- ============================================================
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS tertiary_color text;
