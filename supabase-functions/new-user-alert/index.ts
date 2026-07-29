// Edge Function: new-user-alert
// Notifica a billy@1bot.org cuando un nuevo usuario se registra en la plataforma
// Activar como Database Webhook: tabla "progress", evento INSERT

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
const ADMIN_EMAIL    = 'billy@1bot.org';
const APP_URL        = Deno.env.get('APP_URL') || 'https://billiog.github.io/curso-steam';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    // El webhook de Supabase envía { type, table, record, old_record }
    const record = payload.record;
    if (!record) return new Response('No record', { status: 200 });

    const email   = record.email || '(sin email)';
    const name    = record.daily_missions?.fullName || record.daily_missions?.displayName || email.split('@')[0];
    const school  = record.daily_missions?.school || 'No especificada';
    const dept    = record.daily_missions?.department || 'No especificado';
    const now     = new Date().toLocaleString('es-GT', {
      timeZone: 'America/Guatemala',
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1A6B68 0%,#059669 100%);border-radius:20px 20px 0 0;padding:28px 32px;text-align:center">
          <div style="font-size:48px;margin-bottom:8px">🎉</div>
          <h1 style="color:white;margin:0;font-size:20px;font-weight:900">¡Nuevo docente inscrito!</h1>
          <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px">${now}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:white;padding:28px 32px">
          <p style="margin:0 0 20px;font-size:15px;color:#374151">Un nuevo docente acaba de unirse a la plataforma de <strong>Formación Docente en Pedagogía Innovadora</strong>.</p>

          <!-- Info del usuario -->
          <div style="background:#f8fafc;border-radius:16px;padding:20px 24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                  <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Nombre</span><br>
                  <span style="font-size:14px;color:#1e293b;font-weight:600">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                  <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Correo</span><br>
                  <span style="font-size:14px;color:#1e293b">${email}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                  <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Escuela</span><br>
                  <span style="font-size:14px;color:#1e293b">${school}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0">
                  <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Departamento</span><br>
                  <span style="font-size:14px;color:#1e293b">${dept}</span>
                </td>
              </tr>
            </table>
          </div>

          <p style="margin:20px 0 0;font-size:13px;color:#64748b">Puedes ver su perfil completo y asignarle un centro educativo desde el panel de administración.</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:white;padding:0 32px 32px;text-align:center">
          <a href="${APP_URL}/admin.html#users" style="display:inline-block;background:#1A6B68;color:white;font-size:14px;font-weight:700;padding:12px 32px;border-radius:100px;text-decoration:none">
            Ver en panel admin
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Notificación automática · Formación Docente Guatemala</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Formación Docente <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `Nuevo docente inscrito: ${name}`,
        html,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
});
