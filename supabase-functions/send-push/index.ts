// Edge Function: send-push
// Envía notificaciones push (Web Push / VAPID) a las suscripciones guardadas
// en push_subscriptions. Solo el admin puede invocarla.
// Requiere: secrets VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;

webpush.setVapidDetails('mailto:billy@1bot.org', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // 1. Verificar que quien llama es un admin autenticado
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authErr } = await authedClient.auth.getUser();
  if (authErr || !user) return json({ error: 'Invalid token', detail: authErr?.message }, 401);

  const { data: roleRow } = await authedClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();
  if (roleRow?.role !== 'admin') return json({ error: 'Solo administradores pueden enviar notificaciones' }, 403);

  try {
    const { title, body, url, userIds } = await req.json();
    if (!title && !body) return json({ error: 'title o body requerido' }, 400);

    // 2. Cliente con service role — necesario para leer TODAS las suscripciones (RLS solo deja ver las propias)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    let query = admin.from('push_subscriptions').select('id, endpoint, p256dh, auth');
    if (Array.isArray(userIds) && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }
    const { data: subs, error: subsErr } = await query;
    if (subsErr) throw subsErr;

    const payload = JSON.stringify({
      title: title || 'Formación Docente',
      body: body || '',
      url: url || './index.html',
    });

    let sent = 0;
    const expiredIds: string[] = [];

    await Promise.allSettled((subs || []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        sent++;
      } catch (e: any) {
        // 404/410 = la suscripción ya no existe en el navegador (desinstalada, permiso revocado, etc.)
        const status = e?.statusCode || e?.status;
        if (status === 404 || status === 410) expiredIds.push(s.id);
      }
    }));

    // Limpieza de suscripciones muertas — evita reintentarlas en el próximo envío
    if (expiredIds.length > 0) {
      await admin.from('push_subscriptions').delete().in('id', expiredIds);
    }

    return json({ sent, total: subs?.length || 0, expired: expiredIds.length });

  } catch (e: any) {
    const detail = e?.message || e?.error_description || (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
    return json({ error: detail }, 500);
  }
});