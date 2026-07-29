-- ============================================================
-- Pago de diplomas/certificados vía Recurrente
-- Ejecutar en Supabase SQL Editor. Seguro re-ejecutar.
-- ============================================================
--
-- NO toca la tabla `certificates` existente (donde ya se registran los
-- diplomas emitidos) — esta tabla solo rastrea el PAGO, es una capa
-- separada que se consulta ANTES de dejar generar el certificado.
--
-- ref_id: course_id para cert_type='diploma'; el id de la ruta
-- (LEARNING_PATHS[].id) para cert_type='master' — un usuario puede pagar
-- el certificado maestro de más de una ruta si completa varias.

CREATE TABLE IF NOT EXISTS public.certificate_payments (
    id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 uuid REFERENCES auth.users(id) NOT NULL,
    cert_type               text NOT NULL CHECK (cert_type IN ('diploma','master')),
    ref_id                  text NOT NULL,
    course_id               text,
    amount_in_cents         int NOT NULL,
    currency                text NOT NULL DEFAULT 'GTQ',
    recurrente_checkout_id  text UNIQUE,
    status                  text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
    created_at              timestamptz DEFAULT now(),
    paid_at                 timestamptz
);

CREATE INDEX IF NOT EXISTS idx_cert_payments_lookup
    ON public.certificate_payments(user_id, cert_type, ref_id, status);

-- RLS: el usuario puede LEER sus propios pagos (así el frontend consulta
-- directo si ya pagó, sin edge function extra). Solo SELECT — el INSERT
-- (create-certificate-checkout) y el UPDATE a 'paid' (recurrente-webhook)
-- corren con service-role, nunca desde el cliente — evita que alguien se
-- auto-marque como pagado.
ALTER TABLE public.certificate_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS certificate_payments_read_own ON public.certificate_payments;
CREATE POLICY certificate_payments_read_own ON public.certificate_payments
    FOR SELECT USING (auth.uid() = user_id);
