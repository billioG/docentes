import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Todo invite (admin de colegio, docente en lote, candidato contratado)
// debe aterrizar en aceptar-invitacion.html — es la única página que sabe
// procesar el link de invitación de Supabase y pedir contraseña. Sin esto,
// el link redirige al Site URL default y la persona nunca puede loguearse.
const APP_URL = Deno.env.get('APP_URL') || 'https://yoaprendo.online'
const INVITE_REDIRECT_TO = `${APP_URL}/aceptar-invitacion.html`

// Áreas curriculares del CNB (Guatemala) — opcional, contextualiza los
// casos de estudio generados por IA dentro de una materia concreta. Las
// 4 áreas pedagógicas base (didáctica/pedagogía/manejo de grupo/
// tecnología, ver generate-cases) SIEMPRE se evalúan, no son configurables.
const VALID_CNB_AREAS = [
  'comunicacion_lenguaje', 'matematicas', 'medio_social_natural', 'expresion_artistica',
  'educacion_fisica', 'formacion_ciudadana', 'emprendimiento', 'tecnologia_aprendizaje',
]

function cleanCnbAreas(areas: unknown): string[] {
  if (!Array.isArray(areas)) return []
  return areas.filter((a) => VALID_CNB_AREAS.includes(a))
}

// Supabase Auth devuelve sus errores en inglés — traduce los más comunes
// para que nunca se le muestre texto en inglés al usuario final.
function translateAuthError(msg: string): string {
  const m = (msg || '').toLowerCase()
  if (m.includes('already been registered') || m.includes('already registered')) {
    return 'Ya existe una cuenta con ese correo.'
  }
  if (m.includes('invalid') && m.includes('email')) return 'El correo no es válido.'
  if (m.includes('rate limit')) return 'Se alcanzó el límite de invitaciones — intenta de nuevo en unos minutos.'
  return 'No se pudo completar la acción. Intenta de nuevo o contacta soporte.'
}

// Busca el user_id de una cuenta ya existente por correo (paginado, igual
// que bulkImportTeachers) — se usa cuando inviteUserByEmail falla porque
// el correo ya está registrado, para VINCULAR esa cuenta en vez de fallar.
async function findUserIdByEmail(admin: ReturnType<typeof createClient>, email: string): Promise<string | null> {
  const target = email.trim().toLowerCase()
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) return null
    const match = data.users.find((u: any) => u.email?.toLowerCase() === target)
    if (match) return match.id
    if (data.users.length < 1000) break
  }
  return null
}

// inviteUserByEmail SOLO envía correo para cuentas nuevas — si el correo ya
// está registrado (ej. se le había quitado el acceso y se le vuelve a
// invitar), Supabase la rechaza y el flujo de arriba solo VINCULA el rol en
// silencio, sin avisarle a la persona que ya puede entrar. Esta función
// cubre ese caso: genera un magic link (no crea cuenta nueva, la cuenta ya
// existe) y lo manda por Resend — misma infra que daily-reminders, mismos
// secrets (RESEND_API_KEY/FROM_EMAIL son project-wide, no hace falta
// configurarlos de nuevo para esta función).
async function sendAccessEmail(admin: ReturnType<typeof createClient>, email: string, tenantName: string | null): Promise<void> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) return // sin key configurada — la acción ya se completó, solo no se pudo avisar por correo
  const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev'

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: INVITE_REDIRECT_TO },
  })
  if (linkErr || !linkData?.properties?.action_link) return

  const label = tenantName ? `de "${tenantName}"` : 'a la plataforma'
  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:'Segoe UI',Arial,sans-serif;padding:24px">
    <p>Se te otorgó acceso ${label}.</p>
    <p><a href="${linkData.properties.action_link}" style="display:inline-block;background:#07B0E4;color:white;font-weight:700;padding:12px 28px;border-radius:100px;text-decoration:none">Entrar ahora</a></p>
    <p style="font-size:12px;color:#94A3B8">Si no esperabas este correo, puedes ignorarlo.</p>
  </body></html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Formación Docente <${FROM_EMAIL}>`, to: [email], subject: 'Tienes acceso — Formación Docente', html }),
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // 1. Verificar que el caller tiene un JWT válido
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'No autorizado' }, 401)

    // Cliente con el JWT del usuario (para verificar su identidad)
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authErr } = await userClient.auth.getUser()
    if (authErr || !user) return json({ error: 'No autenticado' }, 401)

    const body = await req.json()
    const { action, tenantId } = body

    // 2. Verificar rol del caller — un mismo usuario puede tener una fila
    // por tenant en user_roles (composite unique tenant_id+user_id).
    // - "super admin" = fila con tenant_id NULL y role='admin' (1bot,
    //   billy@1bot.org como hoy) — puede actuar sobre CUALQUIER tenant.
    // - "admin de tenant" = fila con tenant_id = ese colegio y role='admin'
    //   — SOLO puede usar las acciones de reclutamiento para SU tenant, no
    //   las acciones de la plataforma de cursos (fuera de alcance Fase 1).
    const { data: roleRows, error: roleErr } = await userClient
      .from('user_roles')
      .select('role, tenant_id')
      .eq('user_id', user.id)

    if (roleErr) return json({ error: roleErr.message }, 500)

    const isSuperAdmin = (roleRows || []).some(r => r.tenant_id === null && r.role === 'admin')
    const isTenantAdminForRequest = !!tenantId && (roleRows || []).some(r => r.tenant_id === tenantId && r.role === 'admin')
    const TENANT_ADMIN_ACTIONS = ['listCandidates', 'provisionCandidate', 'getTenantSettings', 'updateTenantSettings', 'listInvitedUsers']
    const allowed = isSuperAdmin || (TENANT_ADMIN_ACTIONS.includes(action) && isTenantAdminForRequest)

    if (!allowed) return json({ error: 'Acceso denegado — solo admins' }, 403)

    // 3. Cliente con service role (puede modificar auth.users y user_roles)
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // ── Cambiar rol ──────────────────────────────────────────
    if (action === 'setRole') {
      const { userId, role } = body
      if (!userId || !role) return json({ error: 'userId y role son requeridos' }, 400)
      if (!['student', 'coordinator', 'admin'].includes(role))
        return json({ error: 'Rol inválido' }, 400)

      const { error } = await admin
        .from('user_roles')
        .upsert({ user_id: userId, role, tenant_id: null }, { onConflict: 'tenant_id,user_id' })

      if (error) return json({ error: error.message }, 500)
      return json({ ok: true, userId, role })
    }

    // ── Invitar usuario ──────────────────────────────────────
    // tenantId opcional: onboarding manual del primer admin de un colegio
    // nuevo (solo super admin puede pasarlo — invite no está en
    // TENANT_ADMIN_ACTIONS, así que un admin de tenant nunca llega aquí).
    if (action === 'invite') {
      const { email, role = 'student' } = body
      if (!email) return json({ error: 'email es requerido' }, 400)

      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { invited_by: user.email },
        redirectTo: INVITE_REDIRECT_TO,
      })

      let targetUserId = invited?.user?.id
      let linked = false

      if (invErr) {
        // Si el correo ya tiene cuenta, vincúlala a este tenant/rol en vez
        // de fallar — es un caso normal (ej. invitar a alguien que ya es
        // estudiante de otro colegio como admin de este).
        if (invErr.message?.toLowerCase().includes('already') && invErr.message?.toLowerCase().includes('registered')) {
          targetUserId = await findUserIdByEmail(admin, email)
          if (!targetUserId) return json({ error: 'Ya existe una cuenta con ese correo, pero no se pudo vincular. Contacta soporte.' }, 500)
          linked = true
        } else {
          return json({ error: translateAuthError(invErr.message) }, 500)
        }
      }

      // Asignar rol inicial
      if (targetUserId) {
        await admin.from('user_roles').upsert(
          { user_id: targetUserId, role, tenant_id: tenantId || null },
          { onConflict: 'tenant_id,user_id' }
        )
      }

      // Cuenta ya existía (linked=true) — inviteUserByEmail NO le mandó
      // correo (Supabase la rechaza para cuentas ya registradas). Avisarle
      // por otra vía o nunca sabe que ya puede entrar (ej. se le quitó el
      // acceso antes y se le vuelve a dar).
      if (linked) {
        let tenantName: string | null = null
        if (tenantId) {
          const { data: t } = await admin.from('tenants').select('name').eq('id', tenantId).maybeSingle()
          tenantName = t?.name || null
        }
        await sendAccessEmail(admin, email, tenantName)
      }
      return json({ ok: true, email, role, linked })
    }

    // ── Importar docentes en lote (CSV) + asignar a un centro ─
    if (action === 'bulkImportTeachers') {
      const { schoolId, teachers } = body
      if (!schoolId) return json({ error: 'schoolId es requerido' }, 400)
      if (!Array.isArray(teachers) || !teachers.length) return json({ error: 'teachers debe ser un array no vacío' }, 400)
      if (teachers.length > 500) return json({ error: 'Máximo 500 docentes por importación' }, 400)

      // Mapa email → userId de cuentas ya existentes (una sola pasada, evita N búsquedas)
      const emailToId: Record<string, string> = {}
      for (let page = 1; ; page++) {
        const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
        if (listErr) return json({ error: listErr.message }, 500)
        for (const u of listData.users) if (u.email) emailToId[u.email.toLowerCase()] = u.id
        if (listData.users.length < 1000) break
      }

      const results: Array<{ email: string, status: string, message?: string }> = []

      for (const row of teachers) {
        const email = String(row?.email || '').trim().toLowerCase()
        const name = String(row?.name || '').trim()

        if (!email || !email.includes('@')) {
          results.push({ email: row?.email || '(vacío)', status: 'error', message: 'Correo inválido' })
          continue
        }

        try {
          let userId = emailToId[email]
          let status = 'linked'

          if (!userId) {
            const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
              data: { invited_by: user.email, ...(name ? { name } : {}) },
              redirectTo: INVITE_REDIRECT_TO,
            })
            if (invErr) { results.push({ email, status: 'error', message: invErr.message }); continue }
            userId = invited.user.id
            emailToId[email] = userId
            status = 'invited'
            await admin.from('user_roles').upsert({ user_id: userId, role: 'student', tenant_id: null }, { onConflict: 'tenant_id,user_id' })
          }

          const { error: linkErr } = await admin
            .from('user_schools')
            .upsert({ user_id: userId, school_id: schoolId }, { onConflict: 'user_id,school_id' })
          if (linkErr) { results.push({ email, status: 'error', message: linkErr.message }); continue }

          results.push({ email, status })
        } catch (e) {
          results.push({ email, status: 'error', message: String(e) })
        }
      }

      return json({ ok: true, results })
    }

    // ── Listar invitaciones enviadas — admin del tenant (o super admin) ──
    // tenantId null/omitido = invitaciones del 1bot original. Cruza
    // user_roles (quién quedó asignado a este tenant) con auth.users (para
    // ver el correo y si ya usó el link de invitación) — no hay tabla
    // propia de invitaciones, la fuente de verdad es auth.users.
    if (action === 'listInvitedUsers') {
      let roleQuery = admin.from('user_roles').select('user_id, role, created_at')
      roleQuery = tenantId ? roleQuery.eq('tenant_id', tenantId) : roleQuery.is('tenant_id', null)
      const { data: roleRows, error: roleRowsErr } = await roleQuery
      if (roleRowsErr) return json({ error: roleRowsErr.message }, 500)
      if (!roleRows || roleRows.length === 0) return json({ ok: true, invites: [] })

      const roleInfoByUserId: Record<string, { role: string, created_at: string }> = {}
      for (const r of roleRows) roleInfoByUserId[r.user_id] = { role: r.role, created_at: r.created_at }
      const wantedIds = new Set(roleRows.map((r) => r.user_id))

      const invites: Array<{ user_id: string, email: string, role: string, invited_at: string | null, last_sign_in_at: string | null, accepted: boolean }> = []
      for (let page = 1; ; page++) {
        const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
        if (listErr) return json({ error: listErr.message }, 500)
        for (const u of listData.users) {
          if (wantedIds.has(u.id)) {
            const info = roleInfoByUserId[u.id]
            // invited_at = cuándo se le dio acceso a ESTE colegio (user_roles.
            // created_at), no la fecha de la cuenta global — así al quitar y
            // volver a invitar, la fecha se resetea en vez de mostrar la
            // primera vez que esa persona se registró hace meses.
            // accepted = inició sesión DESPUÉS de que se le dio (o devolvió)
            // este acceso — un login viejo de antes de una revocación no
            // cuenta como "ya aceptó" la invitación actual.
            const accepted = !!u.last_sign_in_at && !!info?.created_at
              && new Date(u.last_sign_in_at).getTime() >= new Date(info.created_at).getTime()
            invites.push({
              user_id: u.id,
              email: u.email || '(sin correo)',
              role: info?.role || 'student',
              invited_at: info?.created_at || u.invited_at || u.created_at || null,
              last_sign_in_at: u.last_sign_in_at || null,
              accepted,
            })
          }
        }
        if (listData.users.length < 1000) break
      }
      invites.sort((a, b) => new Date(b.invited_at || 0).getTime() - new Date(a.invited_at || 0).getTime())
      return json({ ok: true, invites })
    }

    // ── Quitar acceso de admin a un colegio — solo super admin ──────
    // Borra SOLO la fila (tenant_id, user_id) de user_roles — no borra la
    // cuenta de auth.users. Si esa persona es admin/estudiante de OTRO
    // colegio o del 1bot original, esas filas quedan intactas; solo pierde
    // acceso a ESTE tenant específico.
    if (action === 'revokeTenantAccess') {
      const { targetUserId } = body
      if (!targetUserId) return json({ error: 'targetUserId es requerido' }, 400)
      if (!tenantId) return json({ error: 'tenantId es requerido' }, 400)

      const { error } = await admin
        .from('user_roles')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('user_id', targetUserId)

      if (error) return json({ error: error.message }, 500)
      return json({ ok: true })
    }

    // ── Listar colegios (tenants) — solo super admin ─────────
    // Solo identidad/marca — salario y áreas los configura el propio
    // admin del colegio en reclutamiento.html (getTenantSettings).
    if (action === 'listTenants') {
      const { data, error } = await admin
        .from('tenants')
        .select('id, slug, name, program_name, primary_color, secondary_color, tertiary_color, logo_url, active, created_at')
        .order('created_at', { ascending: false })

      if (error) return json({ error: error.message }, 500)
      return json({ ok: true, tenants: data })
    }

    // ── Crear colegio (tenant) — solo super admin ────────────
    // Solo identidad/marca. El admin del colegio configura su propio
    // salario/áreas después, desde su panel (updateTenantSettings).
    if (action === 'createTenant') {
      const { name, slug, program_name, primary_color, secondary_color, tertiary_color, logo_url } = body
      if (!name || !String(name).trim()) return json({ error: 'name es requerido' }, 400)

      const cleanSlug = String(slug || '').trim().toLowerCase()
      if (!/^[a-z0-9-]{2,40}$/.test(cleanSlug)) {
        return json({ error: 'slug inválido — usa solo minúsculas, números y guiones (2-40 caracteres)' }, 400)
      }
      const RESERVED_SLUGS = ['recursos', 'supabase', 'migrations', 'admin', 'app', 'data']
      if (RESERVED_SLUGS.includes(cleanSlug)) return json({ error: 'slug reservado, elige otro' }, 400)

      const { data: tenant, error } = await admin
        .from('tenants')
        .insert({
          slug: cleanSlug,
          name: String(name).trim(),
          program_name: (program_name && String(program_name).trim()) || 'Programa de Reclutamiento Docente 4.0',
          primary_color: primary_color || '#07B0E4',
          secondary_color: secondary_color || null,
          tertiary_color: tertiary_color || null,
          logo_url: logo_url || null,
        })
        .select()
        .single()

      if (error) {
        const msg = error.message.includes('duplicate') ? 'Ya existe un colegio con ese slug' : error.message
        return json({ error: msg }, 500)
      }
      return json({ ok: true, tenant })
    }

    // ── Editar colegio — solo super admin ────────────────────
    if (action === 'updateTenant') {
      const { targetTenantId, name, slug, program_name, primary_color, secondary_color, tertiary_color, logo_url } = body
      if (!targetTenantId) return json({ error: 'targetTenantId es requerido' }, 400)
      if (!name || !String(name).trim()) return json({ error: 'name es requerido' }, 400)

      const cleanSlug = String(slug || '').trim().toLowerCase()
      if (!/^[a-z0-9-]{2,40}$/.test(cleanSlug)) {
        return json({ error: 'slug inválido — usa solo minúsculas, números y guiones (2-40 caracteres)' }, 400)
      }
      const RESERVED_SLUGS = ['recursos', 'supabase', 'migrations', 'admin', 'app', 'data']
      if (RESERVED_SLUGS.includes(cleanSlug)) return json({ error: 'slug reservado, elige otro' }, 400)

      const { data: tenant, error } = await admin
        .from('tenants')
        .update({
          slug: cleanSlug,
          name: String(name).trim(),
          program_name: (program_name && String(program_name).trim()) || 'Programa de Reclutamiento Docente 4.0',
          primary_color: primary_color || '#07B0E4',
          secondary_color: secondary_color || null,
          tertiary_color: tertiary_color || null,
          logo_url: logo_url || null,
        })
        .eq('id', targetTenantId)
        .select()
        .single()

      if (error) {
        const msg = error.message.includes('duplicate') ? 'Ya existe un colegio con ese slug' : error.message
        return json({ error: msg }, 500)
      }
      return json({ ok: true, tenant })
    }

    // ── Leer configuración operativa del colegio — admin del tenant ──
    // (o super admin pasando cualquier tenantId). Solo los campos que
    // el admin del colegio puede ver/editar — nunca identidad/marca.
    if (action === 'getTenantSettings') {
      if (!tenantId) return json({ error: 'tenantId es requerido' }, 400)

      const { data, error } = await admin
        .from('tenants')
        .select('salario_presupuesto, salario_maximo, cnb_areas')
        .eq('id', tenantId)
        .maybeSingle()

      if (error) return json({ error: error.message }, 500)
      if (!data) return json({ error: 'Colegio no encontrado' }, 404)
      return json({ ok: true, settings: data })
    }

    // ── Editar configuración operativa del colegio — admin del tenant ──
    if (action === 'updateTenantSettings') {
      if (!tenantId) return json({ error: 'tenantId es requerido' }, 400)
      const { salario_presupuesto, salario_maximo, cnb_areas } = body

      const { error } = await admin
        .from('tenants')
        .update({
          salario_presupuesto: salario_presupuesto || null,
          salario_maximo: salario_maximo || null,
          cnb_areas: cleanCnbAreas(cnb_areas),
        })
        .eq('id', tenantId)

      if (error) return json({ error: error.message }, 500)
      return json({ ok: true })
    }

    // ── Activar/desactivar colegio — solo super admin ────────
    if (action === 'setTenantActive') {
      const { targetTenantId, active } = body
      if (!targetTenantId) return json({ error: 'targetTenantId es requerido' }, 400)

      const { error } = await admin.from('tenants').update({ active: !!active }).eq('id', targetTenantId)
      if (error) return json({ error: error.message }, 500)
      return json({ ok: true })
    }

    // ── Eliminar usuario ─────────────────────────────────────
    if (action === 'deleteUser') {
      const { userId } = body
      if (!userId) return json({ error: 'userId es requerido' }, 400)
      // No permitir auto-eliminación
      if (userId === user.id) return json({ error: 'No puedes eliminarte a ti mismo' }, 400)

      const { error } = await admin.auth.admin.deleteUser(userId)
      if (error) return json({ error: error.message }, 500)
      // Limpiar tablas relacionadas
      await Promise.all([
        admin.from('user_roles').delete().eq('user_id', userId),
        admin.from('progress').delete().eq('user_id', userId),
      ])
      return json({ ok: true, userId })
    }

    // ── Listar candidatos de reclutamiento ───────────────────
    // tenantId null/omitido = candidatos del 1bot original.
    if (action === 'listCandidates') {
      let query = admin
        .from('candidates')
        .select('id, full_name, email, phone, jornada_disponible, pretension_salarial, interes_mineduc, status, rejection_reason, applied_at, candidate_evaluations(technical_score, soft_score, overall_score, passed, feedback, weak_areas, candidate_decision)')
      query = tenantId ? query.eq('tenant_id', tenantId) : query.is('tenant_id', null)

      const { data, error } = await query.order('applied_at', { ascending: false })

      if (error) return json({ error: error.message }, 500)
      return json({ ok: true, candidates: data })
    }

    // ── Contratar candidato: crea cuenta real + rol student ──
    if (action === 'provisionCandidate') {
      const { candidateId } = body
      if (!candidateId) return json({ error: 'candidateId es requerido' }, 400)

      const { data: candidate, error: candErr } = await admin
        .from('candidates')
        .select('id, full_name, email, status, tenant_id')
        .eq('id', candidateId)
        .maybeSingle()

      if (candErr) return json({ error: candErr.message }, 500)
      if (!candidate) return json({ error: 'Candidato no encontrado' }, 404)
      // Defensa en profundidad: un admin de tenant no puede contratar un
      // candidato de OTRO tenant aunque adivine su candidateId.
      if (candidate.tenant_id !== (tenantId || null) && !isSuperAdmin) {
        return json({ error: 'Este candidato no pertenece a tu institución' }, 403)
      }
      if (candidate.status !== 'evaluado') return json({ error: 'El candidato debe estar evaluado antes de contratar' }, 409)

      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(candidate.email, {
        data: { invited_by: user.email, name: candidate.full_name, source: 'reclutamiento' },
        redirectTo: INVITE_REDIRECT_TO,
      })

      let hiredUserId = invited?.user?.id

      let hireLinked = false
      if (invErr) {
        // El candidato ya tenía cuenta (ej. ya era estudiante de otro
        // colegio) — vincúlala en vez de fallar la contratación.
        if (invErr.message?.toLowerCase().includes('already') && invErr.message?.toLowerCase().includes('registered')) {
          hiredUserId = await findUserIdByEmail(admin, candidate.email)
          if (!hiredUserId) return json({ error: 'Ya existe una cuenta con ese correo, pero no se pudo vincular. Contacta soporte.' }, 500)
          hireLinked = true
        } else {
          return json({ error: translateAuthError(invErr.message) }, 500)
        }
      }

      if (hiredUserId) {
        await admin.from('user_roles').upsert(
          { user_id: hiredUserId, role: 'student', tenant_id: candidate.tenant_id },
          { onConflict: 'tenant_id,user_id' }
        )
      }

      // Cuenta ya existía — inviteUserByEmail no le mandó correo, avisarle
      // por otra vía que ya fue contratado y puede entrar.
      if (hireLinked) {
        let tenantName: string | null = null
        if (candidate.tenant_id) {
          const { data: t } = await admin.from('tenants').select('name').eq('id', candidate.tenant_id).maybeSingle()
          tenantName = t?.name || null
        }
        await sendAccessEmail(admin, candidate.email, tenantName)
      }

      const { error: statusErr } = await admin
        .from('candidates')
        .update({ status: 'contratado', updated_at: new Date().toISOString() })
        .eq('id', candidateId)
      if (statusErr) return json({ error: statusErr.message }, 500)

      return json({ ok: true, candidateId, email: candidate.email })
    }

    return json({ error: 'Acción desconocida' }, 400)

  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}
