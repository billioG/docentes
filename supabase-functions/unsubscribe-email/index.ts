// Edge Function: unsubscribe-email
// Enlace de un clic para dejar de recibir los correos recurrentes
// (recordatorios diarios, resumen semanal) — referenciado en el header
// List-Unsubscribe y en el footer de esos correos.
//
// PÚBLICA y SIN verificación de JWT: al crear esta función en el
// Dashboard hay que DESACTIVAR "Enforce JWT Verification" (o el toggle
// equivalente). La abre un cliente de correo o navegador directo desde
// el link — no puede mandar Authorization, así que si el gateway exige
// JWT esto siempre daría 401.
//
// Acepta GET (clic humano desde el cuerpo del correo, muestra una página
// de confirmación) y POST (One-Click Unsubscribe de Gmail/Yahoo, RFC
// 8058 — el cliente de correo lo dispara solo, sin abrir nada visible,
// solo necesita un 2xx de vuelta).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function page(body: string) {
  return new Response(
    `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0F172A;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',Arial,sans-serif">
      <div style="background:white;border-radius:20px;max-width:420px;width:100%;margin:20px;padding:32px 28px;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,.35)">
        ${body}
      </div>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');
  const email = url.searchParams.get('email');

  if (!userId || !email) {
    if (req.method === 'POST') return new Response(null, { status: 200 });
    return page('<p style="color:#334155;font-size:14px">Enlace inválido.</p>');
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  await admin
    .from('progress')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('email', email.toLowerCase());

  // One-Click Unsubscribe (RFC 8058) — el cliente de correo no muestra
  // esta respuesta, solo necesita un 2xx.
  if (req.method === 'POST') return new Response(null, { status: 200 });

  return page(`
    <div style="font-size:36px;margin-bottom:8px">✅</div>
    <h1 style="font-size:17px;color:#0F172A;margin-bottom:8px">Listo, ya no recibirás estos correos</h1>
    <p style="font-size:13px;color:#64748B;line-height:1.5">Puedes seguir usando la plataforma normalmente — solo dejamos de enviarte recordatorios y resúmenes por correo.</p>
  `);
});
