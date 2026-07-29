// Edge Function: daily-push-reminder
// Push a los docentes que tienen notificaciones activas y NO han entrado
// hoy a la plataforma. Pensada para dispararse una vez al día a las 3pm
// hora Guatemala (21:00 UTC, sin horario de verano) vía pg_cron.
//
// No valida un JWT de admin — se invoca con la service role key desde
// pg_cron, igual que weekly-stats y daily-reminders (el gateway de
// Supabase ya exige un JWT válido; la service role key lo es).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;

webpush.setVapidDetails('mailto:billy@1bot.org', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Guatemala no usa horario de verano — offset fijo UTC-6, pero se calcula
// con Intl por si el runtime cambia, en vez de restar 6 horas a mano.
function todayGuatemala(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' });
}

Deno.serve(async (_req) => {
  try {
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const today = todayGuatemala();

    const { data: subs, error: subsErr } = await sb
      .from('push_subscriptions')
      .select('id, user_id, endpoint, p256dh, auth');
    if (subsErr) throw subsErr;
    if (!subs || subs.length === 0) {
      return json({ sent: 0, total: 0, skipped: 0, expired: 0, reason: 'sin suscripciones activas' });
    }

    const userIds = [...new Set(subs.map((s) => s.user_id))];
    const { data: progressRows, error: progErr } = await sb
      .from('progress')
      .select('user_id, last_activity_date')
      .in('user_id', userIds);
    if (progErr) throw progErr;

    const lastActivityByUser = new Map((progressRows || []).map((p) => [p.user_id, p.last_activity_date]));
    const inactiveToday = subs.filter((s) => lastActivityByUser.get(s.user_id) !== today);

    const payload = JSON.stringify({
      title: '¿Ya entraste hoy? 👋',
      body: 'Dedica unos minutos a tu curso antes de que termine el día — no pierdas tu racha.',
      url: './index.html',
    });

    let sent = 0;
    const expiredIds: string[] = [];
    await Promise.allSettled(
      inactiveToday.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
          );
          sent++;
        } catch (e: any) {
          const status = e?.statusCode || e?.status;
          if (status === 404 || status === 410) expiredIds.push(s.id);
        }
      })
    );

    if (expiredIds.length > 0) {
      await sb.from('push_subscriptions').delete().in('id', expiredIds);
    }

    return json({
      sent,
      total: inactiveToday.length,
      skipped: subs.length - inactiveToday.length,
      expired: expiredIds.length,
    });
  } catch (e: any) {
    const detail = e?.message || (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
    return json({ error: detail }, 500);
  }
});
