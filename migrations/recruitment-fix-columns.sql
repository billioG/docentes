-- ============================================================
-- FIX: agregar columnas que faltan en candidates (esquema desactualizado)
-- Ejecutar en Supabase SQL Editor. Seguro de correr aunque ya existan.
-- ============================================================

ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS pretension_salarial numeric;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS interes_mineduc boolean NOT NULL DEFAULT false;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS compromiso_finalizar_programa boolean NOT NULL DEFAULT false;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Si existía el checkbox viejo "compromiso_no_mineduc", migra su valor
-- al nuevo campo antes de borrarlo (evita perder el filtro de quienes
-- ya postularon con el formulario anterior).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='candidates' AND column_name='compromiso_no_mineduc'
  ) THEN
    UPDATE public.candidates
    SET compromiso_finalizar_programa = compromiso_no_mineduc
    WHERE compromiso_no_mineduc IS NOT NULL;
  END IF;
END $$;

ALTER TABLE public.candidates DROP COLUMN IF EXISTS compromiso_no_mineduc;
ALTER TABLE public.candidates DROP COLUMN IF EXISTS acepta_salario;
