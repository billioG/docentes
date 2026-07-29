// Edge Function: weekly-stats
// Envía un email semanal personalizado a cada usuario con sus estadísticas
// Programar: cada lunes a las 8am Guatemala (14:00 UTC)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
const ADMIN_EMAIL    = 'billy@1bot.org';
const APP_URL        = Deno.env.get('APP_URL') || 'https://billiog.github.io/curso-steam';
const SUPABASE_URL   = Deno.env.get('SUPABASE_URL')!;

// Ver daily-reminders/index.ts para la explicación completa — mismo
// mecanismo de un clic (RFC 8058) para no penalizar la entregabilidad.
function unsubscribeUrl(userId: string, email: string): string {
  return `${SUPABASE_URL}/functions/v1/unsubscribe-email?user_id=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`;
}

const COURSES = [
  { id: 'steam',             title: 'Metodología STEAM',        prefix: null    },
  { id: 'abp',               title: 'ABP',                      prefix: 'abp-'  },
  { id: 'design-thinking',   title: 'Design Thinking',          prefix: 'dt-'   },
  { id: 'evaluacion',        title: 'Evaluación Formativa',     prefix: 'ev-'   },
  { id: 'tipos-estudiantes', title: 'Conoce a Quien Enseñas',   prefix: 'te-'   },
];

function getCoursePct(completedCards: string[], course: typeof COURSES[0]): number {
  const TOTALS: Record<string, number> = { steam: 73, abp: 61, 'design-thinking': 45, evaluacion: 38, 'tipos-estudiantes': 60 };
  const done = completedCards.filter(id => {
    const s = String(id);
    if (course.id === 'steam') return /^\d+$/.test(s);
    return course.prefix && s.startsWith(course.prefix);
  }).length;
  return Math.min(100, Math.round(done / (TOTALS[course.id] || 1) * 100));
}

function hasCert(p: any, courseId: string): boolean {
  const sc = p.daily_missions?.examScores || {};
  return (sc[courseId] || 0) >= 70 || (courseId === 'steam' && (p.daily_missions?.examScore || 0) >= 70);
}

function weekDots(lastActivityDate: string | null): string {
  const days = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
  const today = new Date();
  return days.map((d, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + i);
    const dayStr = day.toLocaleDateString('en-CA');
    const isActive = lastActivityDate === dayStr;
    const isPast = day < today;
    return `
      <td align="center" style="padding:0 4px">
        <div style="font-size:11px;color:#9ca3af;margin-bottom:4px">${d}</div>
        <div style="width:32px;height:32px;border-radius:50%;background:${isActive ? '#58cc02' : isPast ? '#e5e7eb' : '#f3f4f6'};
          display:flex;align-items:center;justify-content:center;margin:0 auto">
          ${isActive ? '<span style="color:white;font-size:16px">✓</span>' : ''}
        </div>
      </td>`;
  }).join('');
}

function buildEmail(p: any, unsubUrl: string): string {
  const name = p.daily_missions?.fullName || p.daily_missions?.displayName || p.email?.split('@')[0] || 'Docente';
  const xp = p.xp || 0;
  const streak = p.streak || 0;
  const cards = (p.completed_cards || []).length;
  const certCount = COURSES.filter(c => hasCert(p, c.id)).length;
  const hours = Math.round(cards * 3 / 60);

  const courseRows = COURSES.map(c => {
    const pct = getCoursePct(p.completed_cards || [], c);
    const cert = hasCert(p, c.id);
    return `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#374151">${c.title}</td>
        <td style="padding:8px 0;width:120px">
          <div style="background:#f3f4f6;border-radius:100px;height:8px;overflow:hidden">
            <div style="background:${cert ? '#58cc02' : '#4f46e5'};height:8px;width:${pct}%;border-radius:100px"></div>
          </div>
        </td>
        <td style="padding:8px 0 8px 12px;font-size:12px;color:${cert ? '#16a34a' : '#6b7280'};white-space:nowrap">
          ${cert ? '✓ Certificado' : pct + '%'}
        </td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1A6B68 0%,#059669 100%);border-radius:20px 20px 0 0;padding:32px 32px 24px;text-align:center">
          <div style="font-size:40px;margin-bottom:8px">🎓</div>
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">Tu resumen semanal</h1>
          <p style="color:rgba(255,255,255,.8);margin:8px 0 0;font-size:14px">Formación Docente · Pedagogía Innovadora</p>
        </td></tr>

        <!-- Saludo -->
        <tr><td style="background:white;padding:28px 32px 8px">
          <p style="margin:0;font-size:16px;color:#111827">Hola, <strong>${name}</strong> 👋</p>
          <p style="margin:8px 0 0;font-size:14px;color:#6b7280">Aquí tienes tu progreso de esta semana. ¡Cada tarjeta completada es un paso hacia ser un mejor docente!</p>
        </td></tr>

        <!-- Stats grid -->
        <tr><td style="background:white;padding:20px 32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="25%" align="center" style="padding:0 4px">
                <div style="background:#fff7ed;border-radius:16px;padding:16px 8px;text-align:center">
                  <div style="font-size:28px;font-weight:900;color:#f97316">🔥 ${streak}</div>
                  <div style="font-size:11px;color:#9a3412;font-weight:600;margin-top:4px">Días de racha</div>
                </div>
              </td>
              <td width="25%" align="center" style="padding:0 4px">
                <div style="background:#fefce8;border-radius:16px;padding:16px 8px;text-align:center">
                  <div style="font-size:28px;font-weight:900;color:#ca8a04">⭐ ${xp}</div>
                  <div style="font-size:11px;color:#713f12;font-weight:600;margin-top:4px">XP total</div>
                </div>
              </td>
              <td width="25%" align="center" style="padding:0 4px">
                <div style="background:#eff6ff;border-radius:16px;padding:16px 8px;text-align:center">
                  <div style="font-size:28px;font-weight:900;color:#2563eb">📚 ${cards}</div>
                  <div style="font-size:11px;color:#1e3a8a;font-weight:600;margin-top:4px">Tarjetas</div>
                </div>
              </td>
              <td width="25%" align="center" style="padding:0 4px">
                <div style="background:#f0fdf4;border-radius:16px;padding:16px 8px;text-align:center">
                  <div style="font-size:28px;font-weight:900;color:#16a34a">🏆 ${certCount}</div>
                  <div style="font-size:11px;color:#14532d;font-weight:600;margin-top:4px">Certificados</div>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Actividad semanal -->
        <tr><td style="background:white;padding:0 32px 20px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151">Tu actividad esta semana</p>
          <table cellpadding="0" cellspacing="0">
            <tr>${weekDots(p.last_activity_date)}</tr>
          </table>
          ${streak === 0 ? '<p style="margin:12px 0 0;font-size:12px;color:#ef4444">😢 Tu racha se reinició. ¡Entra hoy para empezar una nueva!</p>' :
            streak >= 7 ? `<p style="margin:12px 0 0;font-size:12px;color:#16a34a">🔥 ¡Increíble! Llevas ${streak} días seguidos. ¡Sigue así!</p>` :
            `<p style="margin:12px 0 0;font-size:12px;color:#6b7280">Llevas <strong>${streak} días de racha</strong>. ¡No la rompas!</p>`}
        </td></tr>

        <!-- Divider -->
        <tr><td style="background:white;padding:0 32px"><div style="height:1px;background:#f3f4f6"></div></td></tr>

        <!-- Progreso por curso -->
        <tr><td style="background:white;padding:20px 32px 8px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151">Tu progreso en los cursos</p>
          <table width="100%" cellpadding="0" cellspacing="0">${courseRows}</table>
        </td></tr>

        <!-- Horas -->
        <tr><td style="background:white;padding:0 32px 24px">
          <div style="background:#f0f9ff;border-radius:12px;padding:12px 16px;text-align:center">
            <span style="font-size:13px;color:#0369a1">⏱ Has invertido aproximadamente <strong>${hours} horas</strong> en tu formación docente</span>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:white;padding:0 32px 32px;text-align:center">
          <a href="${APP_URL}" style="display:inline-block;background:#4f46e5;color:white;font-size:15px;font-weight:700;padding:14px 40px;border-radius:100px;text-decoration:none">
            Continuar aprendiendo
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Formación Docente en Pedagogía Innovadora · Guatemala</p>
          <p style="margin:6px 0 0;font-size:11px;color:#9ca3af">Este correo se envía automáticamente cada semana con tu progreso.</p>
          <p style="margin:8px 0 0;font-size:11px;color:#9ca3af"><a href="${unsubUrl}" style="color:#9ca3af;text-decoration:underline">Dejar de recibir este resumen</a></p>
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

    const { data: users, error } = await sb
      .from('progress')
      .select('user_id, email, xp, streak, completed_cards, last_activity_date, daily_missions')
      .not('email', 'is', null)
      .is('unsubscribed_at', null);

    if (error) throw error;

    let sent = 0, failed = 0;

    for (const user of users || []) {
      if (!user.email) continue;

      const unsubUrl = unsubscribeUrl(user.user_id, user.email);
      const html = buildEmail(user, unsubUrl);
      const name = user.daily_missions?.fullName || user.email.split('@')[0];

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Formación Docente <${FROM_EMAIL}>`,
          to: [user.email],
          subject: `Tu resumen semanal, ${name} — sigue aprendiendo`,
          html,
          headers: {
            'List-Unsubscribe': `<${unsubUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });

      if (res.ok) sent++; else { failed++; console.error('Failed:', user.email, await res.text()); }

      // Pausa para no exceder rate limit de Resend
      await new Promise(r => setTimeout(r, 100));
    }

    return new Response(JSON.stringify({ sent, failed }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
