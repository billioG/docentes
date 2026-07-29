-- =============================================
-- Tabla: portfolios
-- Portafolio de práctica docente (evaluado por IA)
-- Ejecutar en Supabase SQL Editor
-- Seguro de re-ejecutar (usa IF NOT EXISTS / IF EXISTS)
-- =============================================

CREATE TABLE IF NOT EXISTS portfolios (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users NOT NULL,

  -- Entregables (texto libre del docente)
  entregable_steam  text,
  entregable_abp    text,
  entregable_dt     text,
  entregable_eval   text,
  entregable_tipos  text,

  -- Resultado de evaluación IA
  ai_scores     jsonb,   -- [8, 7, 9, 6, 8]
  ai_feedback   jsonb,   -- ["...", "...", "...", "...", "..."]
  ai_total      int,     -- 0-50
  ai_summary    text,

  -- Puntaje examen al momento de envío
  exam_score_50 int,     -- masterExamScore * 0.5

  -- Puntaje combinado final
  combined_score int,    -- ai_total + exam_score_50

  -- URLs de archivos adjuntos por entregable
  file_urls     jsonb,  -- { steam: "url", abp: "url", ... }

  -- Estado
  status        text DEFAULT 'pending',  -- pending | evaluated | passed | failed
  submitted_at  timestamptz DEFAULT now(),
  evaluated_at  timestamptz
);

-- Agregar columnas si la tabla ya existía sin ellas
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS file_urls jsonb;
-- Soporte multi-ruta: cada ruta tiene su propio portafolio independiente
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS path_id text;         -- ej. 'steam20', 'creativo', 'metodologias'
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS entregables jsonb;    -- { "<courseId>": "texto", ... }
-- Una fila por (usuario, ruta)
CREATE UNIQUE INDEX IF NOT EXISTS portfolios_user_path_uniq
  ON portfolios (user_id, path_id);

-- RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes antes de recrear (evita error 42710)
DROP POLICY IF EXISTS "Docente ve su propio portafolio"   ON portfolios;
DROP POLICY IF EXISTS "Docente inserta su portafolio"     ON portfolios;
DROP POLICY IF EXISTS "Docente actualiza su portafolio"   ON portfolios;
DROP POLICY IF EXISTS "Admin ve todos los portafolios"    ON portfolios;

CREATE POLICY "Docente ve su propio portafolio"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Docente inserta su portafolio"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Docente actualiza su portafolio"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- Tabla: app_config
-- Configuración de la app editable desde el admin
-- Clave learning_paths: array de rutas con sus cursos ordenados
-- =============================================

CREATE TABLE IF NOT EXISTS app_config (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de config" ON app_config;
DROP POLICY IF EXISTS "Solo admin escribe config"  ON app_config;

-- Cualquier usuario autenticado puede leer la config (rutas, certs, etc.)
CREATE POLICY "Lectura pública de config"
  ON app_config FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden escribir
CREATE POLICY "Solo admin escribe config"
  ON app_config FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed inicial: rutas por defecto (no sobreescribe si ya existe)
INSERT INTO app_config (key, value) VALUES (
  'learning_paths',
  '[
    {
      "id": "steam20",
      "label": "Docente STEAM 2.0",
      "color": "#07B0E4",
      "gradient": "linear-gradient(135deg,#1A6B68,#07B0E4)",
      "courses": ["steam","abp","design-thinking","evaluacion","tipos-estudiantes"]
    },
    {
      "id": "creativo",
      "label": "Docente Creativo",
      "color": "#E83C8D",
      "gradient": "linear-gradient(135deg,#7C3AED,#E83C8D)",
      "courses": ["creatividad","herramientas-tec","abp"]
    },
    {
      "id": "metodologias",
      "label": "Metodologías Activas",
      "color": "#10B981",
      "gradient": "linear-gradient(135deg,#065F46,#10B981)",
      "courses": ["abp","m-learning","flipped-classroom","abv","micro-learning"]
    }
  ]'::jsonb
) ON CONFLICT (key) DO NOTHING;
