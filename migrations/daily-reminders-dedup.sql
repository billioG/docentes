-- ============================================================
-- daily-reminders — guard de idempotencia (una vez por día por usuario)
-- Ejecutar en Supabase SQL Editor. Seguro re-ejecutar.
-- ============================================================
--
-- Sin esto, cada invocación de la función daily-reminders reenvía el
-- correo a TODOS los usuarios inactivos. Si el cron se dispara dos veces,
-- o alguien la invoca manualmente para probar, cada usuario recibe el
-- correo repetido (fue lo que pasó en pruebas). Esta columna registra el
-- último día en que se le envió recordatorio a cada usuario; la función
-- salta a quien ya tenga la fecha de hoy.

ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS last_reminder_date date;
