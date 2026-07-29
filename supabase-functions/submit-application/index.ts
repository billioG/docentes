// Edge Function: submit-application
// Recibe la postulación de un candidato al programa STEEAM y aplica
// el filtro duro de elegibilidad. Pública — el candidato aún no tiene
// cuenta, no requiere JWT.
// Recibe: { full_name, email, phone, jornada_disponible, pretension_salarial,
//           acepta_jornada, interes_mineduc, compromiso_finalizar_programa, tenant_id }
// `tenant_id` (uuid|null) viene de window.TENANT.id en el HTML — null para
// candidatos del 1bot original. Se valida por la propia FK a `tenants`:
// un tenant_id inexistente hace fallar el insert, no hay que revalidarlo aquí.
// Devuelve: { ok: true, passed_filter: boolean, rejection_reason: 'salario'|'jornada_compromiso'|null, access_token: string | null }
//
// El cliente NUNCA decide el resultado del filtro ni el status — los
// valores que envía son solo la intención declarada; el server los
// revalida y es la única fuente de verdad para `status`.
//
// Presupuesto default: Q3,100/mes, tope default Q3,200 — usado cuando el
// tenant no configuró su propio `salario_maximo` en la tabla `tenants`
// (o para el 1bot original, tenant_id null). Si lo configuró, ESE valor
// (leído server-side, nunca del body) es el que manda. Por encima del
// tope se rechaza con un mensaje específico de desajuste salarial.
//
// `interes_mineduc` es SOLO informativo — estar en proceso de optar una
// plaza MINEDUC no descalifica al candidato, se guarda para que el admin
// lo vea en el panel. El filtro real es `compromiso_finalizar_programa`
// (finalizar el programa aunque surja otra oportunidad).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL           = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
const APP_URL              = Deno.env.get('APP_URL') || 'https://yoaprendo.online';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JORNADAS_VALIDAS = ['matutina', 'vespertina', 'ambas'];
const SALARIO_MAXIMO_DEFAULT = 3200;

// Avisa al/los admin del colegio que llegó una postulación nueva — NO se
// dispara en reanudaciones ni en re-intentos sobre una fila existente
// (ver comentario "Anti re-intento" más abajo), solo en la primera vez
// que alguien aparece para ese tenant. tenant_id null = 1bot original,
// se avisa directo a billy@1bot.org (mismo patrón que new-user-alert).
async function notifyTenantAdmins(
  admin: ReturnType<typeof createClient>,
  tenantId: string | null,
  tenantName: string | null,
  tenantSlug: string | null,
  candidate: {
    full_name: string; email: string; phone: string; jornada_disponible: string;
    pretension_salarial: number; passedFilter: boolean; rejection_reason: string | null;
  }
): Promise<void> {
  if (!RESEND_API_KEY) return; // sin key configurada, no bloquea la postulación

  let recipientEmails: string[] = [];
  if (tenantId) {
    const { data: adminRoles } = await admin
      .from('user_roles')
      .select('user_id')
      .eq('tenant_id', tenantId)
      .eq('role', 'admin');
    for (const r of adminRoles || []) {
      const { data: u } = await admin.auth.admin.getUserById(r.user_id);
      if (u?.user?.email) recipientEmails.push(u.user.email);
    }
  } else {
    recipientEmails = ['billy@1bot.org'];
  }
  if (recipientEmails.length === 0) return;

  const panelUrl = tenantSlug ? `${APP_URL}/${tenantSlug}/reclutamiento.html` : `${APP_URL}/reclutamiento.html`;
  const statusLabel = candidate.passedFilter
    ? 'Pasó el filtro inicial — pendiente de evaluación de casos.'
    : `No pasó el filtro inicial (${candidate.rejection_reason === 'salario' ? 'pretensión salarial fuera de presupuesto' : 'jornada o compromiso de permanencia'}).`;
  const salario = `Q${Number(candidate.pretension_salarial).toLocaleString('es-GT')}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#1A6B68 0%,#059669 100%);border-radius:20px 20px 0 0;padding:28px 32px;text-align:center">
          <h1 style="color:white;margin:0;font-size:20px;font-weight:900">Nueva postulación docente</h1>
          ${tenantName ? `<p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px">${tenantName}</p>` : ''}
        </td></tr>
        <tr><td style="background:white;padding:28px 32px">
          <div style="background:#f8fafc;border-radius:16px;padding:20px 24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Nombre</span><br>
                <span style="font-size:14px;color:#1e293b;font-weight:600">${candidate.full_name}</span>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Correo</span><br>
                <span style="font-size:14px;color:#1e293b">${candidate.email}</span>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Teléfono</span><br>
                <span style="font-size:14px;color:#1e293b">${candidate.phone || '—'}</span>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Jornada / Pretensión</span><br>
                <span style="font-size:14px;color:#1e293b">${candidate.jornada_disponible} · ${salario}</span>
              </td></tr>
              <tr><td style="padding:8px 0">
                <span style="font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase">Estado</span><br>
                <span style="font-size:14px;color:#1e293b">${statusLabel}</span>
              </td></tr>
            </table>
          </div>
        </td></tr>
        <tr><td style="background:white;padding:0 32px 32px;text-align:center">
          <a href="${panelUrl}" style="display:inline-block;background:#1A6B68;color:white;font-size:14px;font-weight:700;padding:12px 32px;border-radius:100px;text-decoration:none">
            Ver en panel de reclutamiento
          </a>
        </td></tr>
        <tr><td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Notificación automática · Formación Docente Guatemala</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  for (const to of recipientEmails) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `Formación Docente <${FROM_EMAIL}>`, to: [to], subject: `Nueva postulación: ${candidate.full_name}`, html }),
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = await req.json();

    const full_name = String(body.full_name || '').trim().slice(0, 200);
    const email      = String(body.email || '').trim().toLowerCase().slice(0, 200);
    const phone      = String(body.phone || '').trim().slice(0, 40);
    const jornada_disponible = JORNADAS_VALIDAS.includes(body.jornada_disponible) ? body.jornada_disponible : null;

    const pretension_salarial = Number(body.pretension_salarial);

    if (!full_name) return json({ error: 'full_name es requerido' }, 400);
    if (!EMAIL_RE.test(email)) return json({ error: 'email inválido' }, 400);
    if (!jornada_disponible) return json({ error: 'jornada_disponible inválida' }, 400);
    if (!Number.isFinite(pretension_salarial) || pretension_salarial <= 0 || pretension_salarial > 100000) {
      return json({ error: 'pretension_salarial inválida' }, 400);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const tenant_id = body.tenant_id || null;

    // El tope de salario SIEMPRE se lee de la tabla `tenants` (nunca del
    // body) — si el cliente mandara su propio salario_maximo podría
    // inflarlo para colarse por encima del presupuesto real del colegio.
    let salarioMaximo = SALARIO_MAXIMO_DEFAULT;
    let tenantName: string | null = null;
    let tenantSlug: string | null = null;
    if (tenant_id) {
      const { data: tenantRow } = await admin
        .from('tenants')
        .select('salario_maximo, name, slug')
        .eq('id', tenant_id)
        .maybeSingle();
      // Solo un tope explícito y positivo reemplaza el default; 0/null/negativo
      // (config no puesta o inválida) cae al default, nunca rechaza a todos.
      if (tenantRow && Number(tenantRow.salario_maximo) > 0) salarioMaximo = Number(tenantRow.salario_maximo);
      tenantName = tenantRow?.name || null;
      tenantSlug = tenantRow?.slug || null;
    }

    // Filtro duro — revalidado server-side, el cliente solo declara intención.
    // interes_mineduc NO participa del filtro (ver nota arriba).
    const acepta_jornada                 = body.acepta_jornada === true;
    const interes_mineduc                = body.interes_mineduc === true;
    const compromiso_finalizar_programa  = body.compromiso_finalizar_programa === true;
    const salarioOk = pretension_salarial <= salarioMaximo;
    const passedFilter = salarioOk && acepta_jornada && compromiso_finalizar_programa;

    let rejection_reason: string | null = null;
    if (!passedFilter) rejection_reason = !salarioOk ? 'salario' : 'jornada_compromiso';

    // Anti re-intento: una persona (mismo correo + mismo colegio) no puede
    // volver a hacer la evaluación para "farmear" un mejor puntaje. Se busca
    // su postulación previa y se decide según en qué punto quedó:
    //   - evaluado/contratado/desertado  → ya completó o cerró su proceso:
    //     se bloquea, NO se crea fila nueva ni token nuevo (already_applied).
    //   - evaluacion_pendiente           → pasó el filtro pero no terminó la
    //     evaluación (ej. cerró la pestaña): se REANUDA con el MISMO token,
    //     así ve los mismos casos cacheados, no un intento fresco.
    //   - rechazado_filtro/rechazado     → nunca llegó a la evaluación: se le
    //     deja corregir sus datos y re-enviar SOBRE la misma fila (sin
    //     duplicar), re-evaluando el filtro server-side.
    let existingQuery = admin
      .from('candidates')
      .select('id, status, access_token')
      .eq('email', email);
    existingQuery = tenant_id ? existingQuery.eq('tenant_id', tenant_id) : existingQuery.is('tenant_id', null);
    const { data: existingRows, error: existErr } = await existingQuery
      .order('applied_at', { ascending: false })
      .limit(1);
    if (existErr) return json({ error: existErr.message }, 500);
    const existing = existingRows?.[0] || null;

    if (existing) {
      if (existing.status === 'evaluado' || existing.status === 'contratado' || existing.status === 'desertado') {
        return json({ ok: true, already_applied: true });
      }
      if (existing.status === 'evaluacion_pendiente') {
        // Reanuda la evaluación en curso — mismo token, mismos casos.
        return json({ ok: true, passed_filter: true, resumed: true, access_token: existing.access_token });
      }
      // Estaba rechazado por filtro: actualiza la misma fila con los datos nuevos.
      const { data: updated, error: updErr } = await admin
        .from('candidates')
        .update({
          full_name,
          phone,
          jornada_disponible,
          pretension_salarial,
          acepta_jornada,
          interes_mineduc,
          compromiso_finalizar_programa,
          status: passedFilter ? 'evaluacion_pendiente' : 'rechazado_filtro',
          rejection_reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('access_token')
        .single();
      if (updErr) return json({ error: updErr.message }, 500);
      return json({
        ok: true,
        passed_filter: passedFilter,
        rejection_reason,
        access_token: passedFilter ? updated.access_token : null,
      });
    }

    const { data: inserted, error } = await admin
      .from('candidates')
      .insert({
        full_name,
        email,
        phone,
        jornada_disponible,
        pretension_salarial,
        acepta_jornada,
        interes_mineduc,
        compromiso_finalizar_programa,
        status: passedFilter ? 'evaluacion_pendiente' : 'rechazado_filtro',
        rejection_reason,
        tenant_id,
      })
      .select('access_token')
      .single();

    if (error) return json({ error: error.message }, 500);

    // Solo aquí (postulación NUEVA, no resume/retry de las ramas de arriba)
    // se avisa al admin — no bloquea la respuesta al candidato si Resend falla.
    try {
      await notifyTenantAdmins(admin, tenant_id, tenantName, tenantSlug, {
        full_name, email, phone, jornada_disponible, pretension_salarial, passedFilter, rejection_reason,
      });
    } catch (_e) { /* no interrumpe la postulación del candidato */ }

    return json({
      ok: true,
      passed_filter: passedFilter,
      rejection_reason,
      access_token: passedFilter ? inserted.access_token : null,
    });

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
