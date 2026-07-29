// Edge Function: recurrente-webhook
// Recibe la confirmación de pago de Recurrente (evento intent.succeeded,
// type:"payment") y marca la fila correspondiente en certificate_payments
// como 'paid'. Es la ÚNICA fuente de verdad de que el dinero llegó — el
// frontend nunca decide esto por sí mismo.
//
// PÚBLICA y SIN verificación de JWT (debe desactivarse "Enforce JWT
// Verification" al crear esta función en el Dashboard) — la llama
// Recurrente directamente, sin poder mandar un Authorization nuestro.
// La autenticidad se valida con la firma Svix (svix-id/svix-timestamp/
// svix-signature), no con un JWT.
//
// Referencia: https://docs.recurrente.com/guias-espanol/comenzar/webhooks

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RECURRENTE_WEBHOOK_SECRET = Deno.env.get('RECURRENTE_WEBHOOK_SECRET')!; // formato "whsec_<base64>"

function base64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// Verificación Svix: HMAC-SHA256 de "${svix_id}.${svix_timestamp}.${rawBody}"
// con la parte después de "whsec_" (base64) como llave. svix-signature puede
// traer varias firmas separadas por espacio ("v1,firma1 v1,firma2"); basta
// con que UNA coincida.
function verifySignature(svixId: string, svixTimestamp: string, rawBody: string, svixSignatureHeader: string): boolean {
  const secretB64 = RECURRENTE_WEBHOOK_SECRET.split('_').slice(1).join('_');
  if (!secretB64) return false;
  const secretBytes = base64ToBytes(secretB64);
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedB64 = createHmac('sha256', secretBytes).update(signedContent).digest('base64');
  const expectedBytes = base64ToBytes(expectedB64);

  return svixSignatureHeader.split(' ').some((part) => {
    const sigB64 = part.replace(/^v1,/, '');
    try {
      const sigBytes = base64ToBytes(sigB64);
      if (sigBytes.length !== expectedBytes.length) return false;
      return timingSafeEqual(sigBytes, expectedBytes);
    } catch {
      return false;
    }
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Método no permitido', { status: 405 });

  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  // CRÍTICO: verificar sobre el body crudo — si se parsea a JSON y se
  // re-serializa antes de verificar, la firma nunca coincide.
  const rawBody = await req.text();

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Faltan headers de firma', { status: 400 });
  }
  if (!verifySignature(svixId, svixTimestamp, rawBody, svixSignature)) {
    return new Response('Firma inválida', { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);

    if (event?.event_type === 'intent.succeeded' && event?.type === 'payment') {
      const checkoutId = event?.checkout?.id;
      if (checkoutId) {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        // .eq('status','pending') además de idempotencia evita reprocesar
        // un evento duplicado (Recurrente puede reintentar el webhook).
        await admin
          .from('certificate_payments')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('recurrente_checkout_id', checkoutId)
          .eq('status', 'pending');
      }
    }

    return new Response('ok', { status: 200 });
  } catch (e) {
    return new Response('Error: ' + String(e), { status: 500 });
  }
});
