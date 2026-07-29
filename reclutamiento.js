// ============================================================
// reclutamiento.js — Panel de Reclutamiento STEEAM (solo-admin)
// ============================================================

const SUPABASE_URL = "https://grkjhzkgcmackbafqudu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya2poemtnY21hY2tiYWZxdWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjg5MzQsImV4cCI6MjA5NjcwNDkzNH0.2nVTRlhey6HkGs_KZxtCaEp8L2QrvD0NUwY8ZFwZVHY";
const ADMIN_EMAILS  = ['billy@1bot.org'];

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = null;
let candidatesCache = [];
let activeFilter = 'all';

// Espejo de LEARNING_PATHS (admin.js:11-17 / evaluate-candidate) — mismos ids.
const LEARNING_PATHS = {
    steam20:      { label: 'Docente STEAM 2.0' },
    creativo:     { label: 'Docente Creativo' },
    metodologias: { label: 'Metodologías Activas' },
    ia:           { label: 'Docente y la IA' },
    convivencia:  { label: 'Clima y Convivencia Escolar' },
};

const STATUS_LABELS = {
    aplicado: 'Aplicado',
    rechazado_filtro: 'Rechazado (filtro)',
    evaluacion_pendiente: 'Pendiente de evaluación',
    evaluado: 'Evaluado',
    contratado: 'Contratado',
    desertado: 'Desertó',
    rechazado: 'Rechazado',
};

function escapeHtml(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toast(msg, type = 'info') {
    alert(msg); // panel simple — sin sistema de toasts propio en esta página
}

// NOTA: este gate del lado cliente es solo UX/redirección. El límite de
// seguridad real está en admin-users/index.ts, que valida server-side.
// Sin tenant (1bot, comportamiento actual): ADMIN_EMAILS. Con tenant: se
// permite si el usuario es admin de ESE tenant, O si es super admin
// (tenant_id NULL + role='admin', ej. billy@1bot.org) — el super admin
// puede entrar a cualquier colegio, igual que en admin-users.
async function checkAdminAuth() {
    await window.TENANT_READY;
    const tenant = window.TENANT;

    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
        const params = new URLSearchParams({ redirect: 'reclutamiento.html' });
        if (tenant?.slug) params.set('tenant', tenant.slug);
        window.location.href = 'admin-login.html?' + params.toString();
        return false;
    }
    currentUser = session.user;

    let isAdmin;
    let isSuperAdmin;
    if (tenant) {
        const { data: roleRows } = await sb.from('user_roles').select('role, tenant_id').eq('user_id', currentUser.id);
        isSuperAdmin = (roleRows || []).some(r => r.tenant_id === null && r.role === 'admin');
        const isTenantAdmin = (roleRows || []).some(r => r.tenant_id === tenant.id && r.role === 'admin');
        isAdmin = isSuperAdmin || isTenantAdmin;
    } else {
        isSuperAdmin = ADMIN_EMAILS.includes(currentUser.email);
        isAdmin = isSuperAdmin;
    }

    if (!isAdmin) {
        alert('Acceso denegado. Solo administradores pueden entrar.');
        await sb.auth.signOut();
        window.location.href = 'admin-login.html';
        return false;
    }

    if (tenant && !isSuperAdmin) {
        document.getElementById('adminHomeLink').style.display = 'none'; // el admin de un tenant no entra al panel de 1bot
    }
    if (tenant) {
        document.getElementById('settingsBtn').style.display = 'flex'; // salario/áreas CNB son configuración propia del colegio
    }

    document.getElementById('adminEmail').textContent = currentUser.email;
    return true;
}

async function callAdminUsers(body) {
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('No autenticado');
    const EDGE_URL = `${SUPABASE_URL}/functions/v1/admin-users`;
    const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tenantId: window.TENANT?.id || null, ...body }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
    return json;
}

async function loadCandidates() {
    document.getElementById('tableWrap').innerHTML = '<div class="loader">Cargando candidatos…</div>';
    try {
        const { candidates } = await callAdminUsers({ action: 'listCandidates' });
        candidatesCache = candidates || [];
        renderTable();
    } catch (e) {
        document.getElementById('tableWrap').innerHTML = `<div class="empty">Error al cargar: ${escapeHtml(e.message)}</div>`;
    }
}

function renderTable() {
    const filtered = activeFilter === 'all'
        ? candidatesCache
        : candidatesCache.filter(c => c.status === activeFilter);

    if (filtered.length === 0) {
        document.getElementById('tableWrap').innerHTML = '<div class="empty">No hay candidatos en esta categoría.</div>';
        return;
    }

    const rows = filtered.map(c => {
        const evalRow = Array.isArray(c.candidate_evaluations) ? c.candidate_evaluations[0] : c.candidate_evaluations;
        const score = evalRow?.overall_score;
        const weak = (evalRow?.weak_areas || []).join(', ');
        const canHire = c.status === 'evaluado';
        const fecha = c.applied_at ? new Date(c.applied_at).toLocaleDateString('es-GT', { day:'numeric', month:'short', year:'numeric' }) : '—';

        const salario = c.pretension_salarial != null ? `Q${Number(c.pretension_salarial).toLocaleString('es-GT')}` : '—';
        const reasonNote = c.rejection_reason === 'salario' ? '<br><span class="weak">Rechazado por salario</span>' : '';

        return `
          <tr class="candidate-row" data-id="${c.id}">
            <td class="name">${escapeHtml(c.full_name)}${c.interes_mineduc ? ` <span title="En proceso o interesado en plaza MINEDUC">${window.svgIcon('bank', 14)}</span>` : ''}</td>
            <td>${escapeHtml(c.email)}<br><span class="weak">${escapeHtml(c.phone || '')}</span></td>
            <td>${escapeHtml(c.jornada_disponible || '—')}</td>
            <td>${salario}</td>
            <td><span class="badge ${escapeHtml(c.status)}">${escapeHtml(STATUS_LABELS[c.status] || c.status)}</span>${reasonNote}</td>
            <td>${score != null ? `<span class="score">${score}</span>` : '—'}${weak ? `<br><span class="weak">Débil: ${escapeHtml(weak)}</span>` : ''}</td>
            <td>${fecha}</td>
            <td><button class="hire" data-id="${c.id}" ${canHire ? '' : 'style="display:none"'}>Contratar</button></td>
          </tr>`;
    }).join('');

    document.getElementById('tableWrap').innerHTML = `
      <table>
        <thead><tr><th>Nombre</th><th>Contacto</th><th>Jornada</th><th>Pretensión</th><th>Estado</th><th>Puntaje</th><th>Postuló</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;

    document.querySelectorAll('button.hire').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); hireCandidate(btn.dataset.id, btn); });
    });
    document.querySelectorAll('tr.candidate-row').forEach(row => {
        row.addEventListener('click', () => showDetail(row.dataset.id));
    });
}

function showDetail(candidateId) {
    const c = candidatesCache.find(x => x.id === candidateId);
    if (!c) return;
    const evalRow = Array.isArray(c.candidate_evaluations) ? c.candidate_evaluations[0] : c.candidate_evaluations;
    const salario = c.pretension_salarial != null ? `Q${Number(c.pretension_salarial).toLocaleString('es-GT')}` : '—';

    let body;
    if (!evalRow || evalRow.overall_score == null) {
        body = `<p class="empty" style="padding:20px 0">Este candidato todavía no tiene evaluación de casos de estudio.</p>`;
    } else {
        const paths = (evalRow.weak_areas || []).map(id => LEARNING_PATHS[id]?.label || id);
        const decisionLabel = evalRow.candidate_decision === 'continuar' ? `${window.svgIcon('check', 14)} Decidió continuar`
            : evalRow.candidate_decision === 'retirar' ? `${window.svgIcon('exit', 14)} Decidió no continuar`
            : `${window.svgIcon('clock', 14)} Aún no decide`;

        body = `
          <div class="score-row">
            <div class="score-box"><div class="num">${evalRow.technical_score}</div><div class="lbl">Técnica</div></div>
            <div class="score-box"><div class="num">${evalRow.soft_score}</div><div class="lbl">Blandas</div></div>
            <div class="score-box"><div class="num">${evalRow.overall_score}</div><div class="lbl">General</div></div>
          </div>
          <div class="feedback">
            <strong>Técnica:</strong> ${escapeHtml(evalRow.feedback?.technical || '')}<br><br>
            <strong>Blandas:</strong> ${escapeHtml(evalRow.feedback?.soft || '')}<br><br>
            <strong>Resumen:</strong> ${escapeHtml(evalRow.feedback?.summary || '')}
          </div>
          <p style="font-size:12px;font-weight:700;color:#0F172A;margin:14px 0 6px">Ruta de formación sugerida</p>
          ${paths.length ? paths.map(p => `<div class="roadmap-item">${window.svgIcon('book', 14)} ${escapeHtml(p)}</div>`).join('') : '<div class="roadmap-item">Sin áreas débiles específicas.</div>'}
          <p style="font-size:12px;color:#475569;margin-top:14px">${decisionLabel}</p>`;
    }

    document.getElementById('modalBody').innerHTML = `
        <h2>${escapeHtml(c.full_name)}</h2>
        <p class="sub">${escapeHtml(c.email)} · ${escapeHtml(c.phone || '—')} · Jornada: ${escapeHtml(c.jornada_disponible || '—')} · Pretensión: ${salario}</p>
        ${body}`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function getCnbAreas() {
    return Array.from(document.querySelectorAll('input[name="cnb_areas"]:checked')).map(el => el.value);
}
function setCnbAreas(areas) {
    const set = new Set(areas || []);
    document.querySelectorAll('input[name="cnb_areas"]').forEach(el => { el.checked = set.has(el.value); });
}

async function openSettings() {
    document.getElementById('settingsErrMsg').textContent = '';
    document.getElementById('settingsOkMsg').textContent = '';
    document.getElementById('settingsOverlay').style.display = 'flex';
    try {
        const { settings } = await callAdminUsers({ action: 'getTenantSettings' });
        document.getElementById('cfgPresupuesto').value = settings?.salario_presupuesto || '';
        document.getElementById('cfgMaximo').value = settings?.salario_maximo || '';
        setCnbAreas(settings?.cnb_areas);
    } catch (e) {
        document.getElementById('settingsErrMsg').textContent = 'Error al cargar configuración: ' + e.message;
    }
}

function closeSettings() {
    document.getElementById('settingsOverlay').style.display = 'none';
}

document.getElementById('settingsBtn').addEventListener('click', openSettings);

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errMsg = document.getElementById('settingsErrMsg');
    const okMsg = document.getElementById('settingsOkMsg');
    const submitBtn = document.getElementById('settingsSubmitBtn');
    errMsg.textContent = '';
    okMsg.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
        await callAdminUsers({
            action: 'updateTenantSettings',
            salario_presupuesto: Number(document.getElementById('cfgPresupuesto').value) || null,
            salario_maximo: Number(document.getElementById('cfgMaximo').value) || null,
            cnb_areas: getCnbAreas(),
        });
        okMsg.textContent = 'Configuración guardada.';
    } catch (err) {
        errMsg.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar configuración';
    }
});

async function hireCandidate(candidateId, btn) {
    const candidate = candidatesCache.find(c => c.id === candidateId);
    if (!confirm(`¿Contratar a ${candidate?.full_name}? Se creará su cuenta en la plataforma de formación.`)) return;

    btn.disabled = true;
    btn.textContent = 'Contratando...';
    try {
        await callAdminUsers({ action: 'provisionCandidate', candidateId });
        toast('Candidato contratado. Se envió invitación por correo.', 'success');
        await loadCandidates();
    } catch (e) {
        toast('Error: ' + e.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Contratar';
    }
}

document.getElementById('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-status]');
    if (!btn) return;
    document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.status;
    renderTable();
});

(async function init() {
    const ok = await checkAdminAuth();
    if (ok) await loadCandidates();
})();
