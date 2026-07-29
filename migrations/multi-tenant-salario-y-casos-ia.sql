-- ============================================================
-- Salario configurable por colegio + casos de estudio generados por IA.
-- Ejecutar en Supabase SQL Editor.
-- ============================================================

-- Presupuesto informativo mostrado al candidato + tope real del filtro
-- duro. NULL = usa los defaults actuales (Q3,100 / Q3,200), así 1bot no
-- cambia de comportamiento si no configura estos campos.
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS salario_presupuesto numeric;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS salario_maximo numeric;

-- Áreas que el admin quiere evaluar en los casos de estudio. Vacío/NULL =
-- mezcla general (didáctica + pedagogía + manejo de grupo + tecnología).
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS evaluation_areas text[];

-- Cache de los casos de estudio generados por IA para un candidato — se
-- genera una sola vez (evita llamadas repetidas a Groq y evita que un
-- refresh de la página le cambie las preguntas antes de responder).
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS generated_cases jsonb;
