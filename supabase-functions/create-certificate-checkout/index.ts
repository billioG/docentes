// Edge Function: create-certificate-checkout
// Crea un checkout de pago en Recurrente para un diploma de curso (Q10) o
// el Certificado Maestro de una ruta (Q50), y registra el intento como
// 'pending' en certificate_payments ANTES de redirigir — es lo que
// recurrente-webhook busca luego por recurrente_checkout_id para
// marcarlo 'paid'.
//
// Requiere JWT del usuario autenticado (candidato/docente real con
// sesión, no público) — a diferencia de submit-application etc.
//
// Recibe: { cert_type: 'diploma'|'master', ref_id: string, course_id?: string, score?: number }
// Devuelve: { ok:true, checkout_url } | { error }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RECURRENTE_SECRET_KEY = Deno.env.get('RECURRENTE_SECRET_KEY')!;
const APP_URL                = Deno.env.get('APP_URL') || 'https://yoaprendo.online';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// Precios fijos en centavos (Recurrente usa amount_in_cents) — Q10 / Q50.
const PRICES: Record<string, number> = { diploma: 1000, master: 5000 };
const NAMES:  Record<string, string> = { diploma: 'Diploma de Participación', master: 'Certificado Maestro' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'No autorizado' }, 401);

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return json({ error: 'No autenticado' }, 401);

    const body = await req.json();
    const cert_type = String(body.cert_type || '');
    const ref_id = String(body.ref_id || '').trim();
    const course_id = body.course_id ? String(body.course_id).trim() : null;

    if (!['diploma', 'master'].includes(cert_type)) return json({ error: 'cert_type inválido' }, 400);
    if (!ref_id) return json({ error: 'ref_id es requerido' }, 400);

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Si ya pagó este certificado antes, no generar un checkout nuevo —
    // evita cobrar dos veces por lo mismo si reintenta el flujo. .limit(1)
    // en vez de maybeSingle() a secas: si hubo más de un intento pagado
    // (o pending+paid mezclados), maybeSingle() lanzaría error por
    // "multiple rows returned".
    const { data: existingPaidRows } = await admin
      .from('certificate_payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('cert_type', cert_type)
      .eq('ref_id', ref_id)
      .eq('status', 'paid')
      .limit(1);
    if (existingPaidRows && existingPaidRows.length > 0) {
      return json({ error: 'Ya pagaste este certificado.', already_paid: true }, 409);
    }

    const amount_in_cents = PRICES[cert_type];
    const successUrl = `${APP_URL}/index.html?paid_cert=${encodeURIComponent(cert_type)}&ref=${encodeURIComponent(ref_id)}${course_id ? `&course=${encodeURIComponent(course_id)}` : ''}`;
    const cancelUrl = `${APP_URL}/index.html`;

    const recRes = await fetch('https://app.recurrente.com/api/checkouts', {
      method: 'POST',
      headers: { 'X-SECRET-KEY': RECURRENTE_SECRET_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: NAMES[cert_type], amount_in_cents, currency: 'GTQ', quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });
    const recData = await recRes.json();
    if (!recRes.ok || !recData?.checkout_url || !recData?.id) {
      return json({ error: 'No se pudo iniciar el pago con Recurrente.', detail: recData }, 502);
    }

    const { error: insErr } = await admin.from('certificate_payments').insert({
      user_id: user.id,
      cert_type,
      ref_id,
      course_id,
      amount_in_cents,
      currency: 'GTQ',
      recurrente_checkout_id: recData.id,
      status: 'pending',
    });
    if (insErr) return json({ error: 'Error al registrar el pago: ' + insErr.message }, 500);

    return json({ ok: true, checkout_url: recData.checkout_url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
