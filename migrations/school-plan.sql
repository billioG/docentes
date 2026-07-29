-- ============================================================
-- Plan por centro educativo: 'free' o 'paid'. Flag manual — lo
-- activa el admin desde el panel (Centros educativos).
--
-- paid desbloquea: 1) reportería del panel de coordinador
-- (coordinator.html), 2) firma del director en los diplomas
-- generados (app.js). free sigue usando la app de docentes sin
-- restricciones — el gate es solo sobre coordinación/diplomas.
--
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.
-- ============================================================

ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

ALTER TABLE public.schools
  DROP CONSTRAINT IF EXISTS schools_plan_check;

ALTER TABLE public.schools
  ADD CONSTRAINT schools_plan_check CHECK (plan IN ('free', 'paid'));
