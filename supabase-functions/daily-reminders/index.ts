// Edge Function: daily-reminders
// Envía recordatorios diarios:
//   1. Usuario inactivo 1+ días → "te extrañamos"
//   2. Usuario con módulo desbloqueado pero sin pagar XP
// Programar: cada día a las 9am Guatemala (15:00 UTC)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
const APP_URL        = Deno.env.get('APP_URL') || 'https://billiog.github.io/curso-steam';
const SUPABASE_URL   = Deno.env.get('SUPABASE_URL')!;

// Costo en XP para desbloquear un módulo (ajusta si cambia en app.js)
const MODULE_UNLOCK_COST = 50;

// Link de un clic para dejar de recibir estos correos (unsubscribe-email
// function) — se usa como header List-Unsubscribe (RFC 8058, one-click)
// y como texto visible en el footer. Sin esto los proveedores de correo
// (Gmail/Outlook) penalizan el envío masivo y lo mandan a spam.
function unsubscribeUrl(userId: string, email: string): string {
  return `${SUPABASE_URL}/functions/v1/unsubscribe-email?user_id=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`;
}

function localDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD local
}

// ── Email: usuario inactivo ────────────────────────────────────
function buildInactiveEmail(p: any, daysMissed: number, unsubUrl: string): string {
  const name = p.daily_missions?.fullName || p.daily_missions?.displayName || p.email?.split('@')[0] || 'Docente';
  const streak = p.streak || 0;
  const xp = p.xp || 0;
  const msg = daysMissed === 1
    ? 'Hace 1 día que no nos visitas. ¡Tu racha te está esperando!'
    : `Han pasado <strong>${daysMissed} días</strong> desde tu última visita. ¡No pierdas tu progreso!`;
  const streakWarning = streak > 0
    ? `<div style="background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;padding:14px 16px;margin:16px 0;text-align:center">
        <p style="margin:0;font-size:14px;color:#c2410c">🔥 Tu racha de <strong>${streak} días</strong> está en riesgo</p>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#f97316 0%,#ef4444 100%);border-radius:20px 20px 0 0;padding:32px;text-align:center">
          <div style="font-size:56px;margin-bottom:8px">😢</div>
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">¡Te extrañamos, ${name}!</h1>
          <p style="color:rgba(255,255,255,.85);margin:8px 0 0;font-size:14px">${msg}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:white;padding:28px 32px">
          ${streakWarning}
          <p style="margin:0;font-size:14px;color:#374151">Tus compañeros docentes siguen avanzando. Cada tarjeta que completas cuenta como <strong>3 minutos de formación</strong> que impacta directamente en tus estudiantes.</p>

          <!-- Stats actuales -->
          <div style="background:#f8fafc;border-radius:16px;padding:20px;margin:20px 0">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Tu progreso actual</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;padding:0 8px">
                  <div style="font-size:24px;font-weight:900;color:#f97316">🔥 ${streak}</div>
                  <div style="font-size:11px;color:#6b7280;margin-top:2px">Días racha</div>
                </td>
                <td style="text-align:center;padding:0 8px">
                  <div style="font-size:24px;font-weight:900;color:#f59e0b">⭐ ${xp}</div>
                  <div style="font-size:11px;color:#6b7280;margin-top:2px">XP</div>
                </td>
                <td style="text-align:center;padding:0 8px">
                  <div style="font-size:24px;font-weight:900;color:#6366f1">📚 ${(p.completed_cards || []).length}</div>
                  <div style="font-size:11px;color:#6b7280;margin-top:2px">Tarjetas</div>
                </td>
              </tr>
            </table>
          </div>

          <p style="margin:0;font-size:13px;color:#6b7280;text-align:center">Solo necesitas <strong>5 minutos hoy</strong> para mantener tu racha activa.</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:white;padding:0 32px 32px;text-align:center">
          <a href="${APP_URL}" style="display:inline-block;background:#f97316;color:white;font-size:15px;font-weight:700;padding:14px 40px;border-radius:100px;text-decoration:none">
            Retomar mi aprendizaje
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Formación Docente en Pedagogía Innovadora · Guatemala</p>
          <p style="margin:8px 0 0;font-size:11px;color:#9ca3af"><a href="${unsubUrl}" style="color:#9ca3af;text-decoration:underline">Dejar de recibir estos correos</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email: módulo sin desbloquear ─────────────────────────────
function buildLockedModuleEmail(p: any, unsubUrl: string): string {
  const name = p.daily_missions?.fullName || p.daily_missions?.displayName || p.email?.split('@')[0] || 'Docente';
  const xp   = p.xp || 0;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);border-radius:20px 20px 0 0;padding:32px;text-align:center">
          <div style="font-size:56px;margin-bottom:8px">🔓</div>
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">¡Tienes un módulo esperándote!</h1>
          <p style="color:rgba(255,255,255,.85);margin:8px 0 0;font-size:14px">Ya puedes desbloquear el siguiente módulo con tus XP</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:white;padding:28px 32px">
          <p style="margin:0;font-size:15px;color:#374151">Hola <strong>${name}</strong>, has acumulado <strong style="color:#f59e0b">⭐ ${xp} XP</strong> y tienes suficiente para desbloquear el siguiente módulo de tu curso.</p>

          <div style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-radius:16px;padding:20px 24px;margin:20px 0;text-align:center">
            <p style="margin:0 0 4px;font-size:28px">⭐ → 🔓</p>
            <p style="margin:0;font-size:18px;font-weight:900;color:#4f46e5">Usa ${MODULE_UNLOCK_COST} XP para continuar</p>
            <p style="margin:6px 0 0;font-size:13px;color:#7c3aed">Te quedarán ${Math.max(0, xp - MODULE_UNLOCK_COST)} XP después del desbloqueo</p>
          </div>

          <p style="margin:0;font-size:13px;color:#6b7280">No dejes que tu progreso se detenga aquí. Cada módulo desbloqueado te acerca más a obtener tu certificado.</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:white;padding:0 32px 32px;text-align:center">
          <a href="${APP_URL}" style="display:inline-block;background:#4f46e5;color:white;font-size:15px;font-weight:700;padding:14px 40px;border-radius:100px;text-decoration:none">
            Desbloquear ahora
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Formación Docente en Pedagogía Innovadora · Guatemala</p>
          <p style="margin:8px 0 0;font-size:11px;color:#9ca3af"><a href="${unsubUrl}" style="color:#9ca3af;text-decoration:underline">Dejar de recibir estos correos</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const today     = localDate(0);
    const yesterday = localDate(-1);

    const { data: users } = await sb
      .from('progress')
      .select('user_id, email, xp, streak, completed_cards, last_activity_date, daily_missions, last_reminder_date')
      .not('email', 'is', null)
      .is('unsubscribed_at', null);

    let inactiveSent = 0, lockedSent = 0, failed = 0, skipped = 0;

    for (const user of users || []) {
      if (!user.email) continue;

      // Idempotencia: si ya se le envió recordatorio hoy, saltarlo. Evita
      // duplicados si la función se dispara más de una vez el mismo día
      // (doble cron, trigger manual, retry). Máx. un recordatorio por día.
      if (user.last_reminder_date === today) { skipped++; continue; }
      let sentToUser = false;

      const last = user.last_activity_date;
      const isInactive = last && last !== today;
      const daysMissed = last
        ? Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000)
        : 0;

      // ── Recordatorio de inactividad (1+ días sin entrar) ──
      if (isInactive && daysMissed >= 1) {
        const unsubUrl = unsubscribeUrl(user.user_id, user.email);
        const html = buildInactiveEmail(user, daysMissed, unsubUrl);
        const name = user.daily_missions?.fullName || user.email.split('@')[0];
        const subject = daysMissed === 1
          ? `${name}, hace 1 día que no aprendes`
          : `${name}, tu racha lleva ${daysMissed} días en pausa`;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `Formación Docente <${FROM_EMAIL}>`,
            to: [user.email],
            subject,
            html,
            headers: {
              'List-Unsubscribe': `<${unsubUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }),
        });
        if (res.ok) { inactiveSent++; sentToUser = true; } else failed++;
        await new Promise(r => setTimeout(r, 100));
      }

      // ── Módulo bloqueado pero tiene XP suficiente ──
      // Solo enviar si estuvo activo ayer (usuario comprometido pero no desbloqueó)
      const wasActiveYesterday = last === yesterday;
      const hasEnoughXP = (user.xp || 0) >= MODULE_UNLOCK_COST;
      // Heurística: si tiene menos tarjetas que el módulo siguiente esperaría
      const cards = (user.completed_cards || []).length;
      const steamCards = (user.completed_cards || []).filter((id: string) => /^\d+$/.test(String(id))).length;
      const isLikelyBlocked = steamCards > 0 && steamCards < 73 && steamCards % 13 === 0;

      // !sentToUser: si ya recibió el de inactividad, no lo doble-emaileamos.
      if (!sentToUser && wasActiveYesterday && hasEnoughXP && isLikelyBlocked) {
        const unsubUrl = unsubscribeUrl(user.user_id, user.email);
        const html = buildLockedModuleEmail(user, unsubUrl);
        const name = user.daily_missions?.fullName || user.email.split('@')[0];
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `Formación Docente <${FROM_EMAIL}>`,
            to: [user.email],
            subject: `${name}, tienes XP suficiente para continuar`,
            html,
            headers: {
              'List-Unsubscribe': `<${unsubUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }),
        });
        if (res.ok) { lockedSent++; sentToUser = true; } else failed++;
        await new Promise(r => setTimeout(r, 100));
      }

      // Marca la fecha SOLO si se le envió algo con éxito — así un envío
      // fallido se reintenta en la próxima corrida, y el guard de arriba
      // evita duplicados dentro del mismo día.
      if (sentToUser) {
        await sb.from('progress').update({ last_reminder_date: today }).eq('user_id', user.user_id);
      }
    }

    return new Response(JSON.stringify({ inactiveSent, lockedSent, failed, skipped }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
});
