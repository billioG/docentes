-- ============================================================
-- Unsubscribe de correos recurrentes (daily-reminders, weekly-stats)
-- Ejecutar en Supabase SQL Editor. Seguro re-ejecutar.
-- ============================================================
--
-- NULL = sigue recibiendo los correos normalmente.
-- timestamp = se dio de baja (vía el link "unsubscribe-email" en el
-- correo o el One-Click Unsubscribe de Gmail/Yahoo) — daily-reminders y
-- weekly-stats deben excluir estas filas de su envío.

ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;
