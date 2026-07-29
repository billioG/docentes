// ============================================================
// admin.js — Panel Administrativo · Formación Docente
// ============================================================

const SUPABASE_URL  = "https://grkjhzkgcmackbafqudu.supabase.co";
const SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya2poemtnY21hY2tiYWZxdWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjg5MzQsImV4cCI6MjA5NjcwNDkzNH0.2nVTRlhey6HkGs_KZxtCaEp8L2QrvD0NUwY8ZFwZVHY";
const ADMIN_EMAILS  = ['billy@1bot.org'];

// Cursos estáticos del programa (datos reales de data.js)
// Rutas de aprendizaje disponibles
const LEARNING_PATHS = [
    { id:'steam20',       label:'Docente STEAM 2.0',    color:'#07B0E4', gradient:'#07B0E4',  courses:['steam','abp','design-thinking','evaluacion','tipos-estudiantes'] },
    { id:'creativo',      label:'Docente Creativo',      color:'#E83C8D', gradient:'linear-gradient(135deg,#7C3AED,#E83C8D)',  courses:['creatividad','herramientas-tec','abp'] },
    { id:'metodologias',  label:'Metodologías Activas',  color:'#F59E0B', gradient:'linear-gradient(135deg,#b45309,#F59E0B)',  courses:['abp','m-learning','flipped-classroom','abv','micro-learning'] },
    { id:'ia',            label:'Docente y la IA',        color:'#10B981', gradient:'linear-gradient(135deg,#065F46,#10B981)',  courses:['ia-fundamentos','ia-tiempo','ia-herramientas','ia-inclusion','ia-ciudadania'] },
    { id:'convivencia',   label:'Clima y Convivencia Escolar', color:'#0891B2', gradient:'linear-gradient(135deg,#155E75,#0891B2)',  courses:['manejo-conductas','sel-docentes','comunicacion-asertiva','disciplina-positiva','bienestar-docente'] },
    { id:'inclusion',     label:'Educación Inclusiva',    color:'#8B5CF6', gradient:'linear-gradient(135deg,#5B21B6,#8B5CF6)',  courses:['educacion-inclusiva','tea-profundidad','discapacidad-down-tdah','lengua-senas-docentes'] },
];

const STATIC_COURSES = [
    { id:'steam',            title:'Metodología STEAM 2.0',               durationHours:5,  totalCards:73, modules:5, ruta:'steam20',  masterCert:true  },
    { id:'abp',              title:'Aprendizaje Basado en Proyectos',      durationHours:4,  totalCards:61, modules:5, ruta:'steam20',  masterCert:true  },
    { id:'design-thinking',  title:'Design Thinking para Docentes',        durationHours:3,  totalCards:45, modules:4, ruta:'steam20',  masterCert:true  },
    { id:'evaluacion',       title:'Evaluación Formativa',                 durationHours:3,  totalCards:38, modules:4, ruta:'steam20',  masterCert:true  },
    { id:'tipos-estudiantes',title:'Conoce a Quien Enseñas',               durationHours:5,  totalCards:60, modules:5, ruta:'steam20',  masterCert:true  },
    { id:'storytelling',     title:'Storytelling para Docentes',           durationHours:4,  totalCards:50, modules:5, ruta:'steam20',      masterCert:false },
    { id:'creatividad',       title:'Despertando la Creatividad',              durationHours:4,  totalCards:50, modules:5, ruta:'creativo',     masterCert:true  },
    { id:'herramientas-tec',  title:'Herramientas Tecnológicas para Docentes', durationHours:3,  totalCards:45, modules:4, ruta:'creativo',     masterCert:true  },
    { id:'m-learning',        title:'Mobile Learning · Aprender con el Celular',durationHours:3, totalCards:40, modules:4, ruta:'metodologias', masterCert:true  },
    { id:'flipped-classroom', title:'Flipped Classroom · El Aula Invertida',   durationHours:3,  totalCards:40, modules:4, ruta:'metodologias', masterCert:true  },
    { id:'abv',               title:'Aprendizaje Basado en Videos',            durationHours:3,  totalCards:35, modules:4, ruta:'metodologias', masterCert:true  },
    { id:'micro-learning',    title:'Micro-learning · Aprender en Pequeñas Dosis', durationHours:3, totalCards:35, modules:4, ruta:'metodologias', masterCert:true  },
    { id:'ia-fundamentos',    title:'Docente y la Inteligencia Artificial',        durationHours:4, totalCards:35, modules:4, ruta:'ia', masterCert:true  },
    { id:'ia-tiempo',         title:'IA para Ahorrar Tiempo',                      durationHours:3, totalCards:22, modules:4, ruta:'ia', masterCert:true  },
    { id:'ia-herramientas',   title:'Herramientas de IA Gratuitas para el Aula',   durationHours:3, totalCards:19, modules:4, ruta:'ia', masterCert:true  },
    { id:'ia-inclusion',      title:'IA e Inclusión Educativa',                    durationHours:3, totalCards:18, modules:4, ruta:'ia', masterCert:true  },
    { id:'ia-ciudadania',     title:'Ciudadanía Digital con IA',                   durationHours:3, totalCards:17, modules:4, ruta:'ia', masterCert:true  },
    { id:'manejo-conductas',  title:'Manejo de Conductas Desafiantes en el Aula',  durationHours:4, totalCards:31, modules:4, ruta:'convivencia', masterCert:true  },
    { id:'sel-docentes',      title:'Aprendizaje Socioemocional (SEL) para Docentes', durationHours:4, totalCards:26, modules:4, ruta:'convivencia', masterCert:true  },
    { id:'comunicacion-asertiva', title:'Comunicación Asertiva y Resolución de Conflictos', durationHours:4, totalCards:25, modules:4, ruta:'convivencia', masterCert:true  },
    { id:'disciplina-positiva',   title:'Disciplina Positiva y Motivación Intrínseca', durationHours:4, totalCards:24, modules:4, ruta:'convivencia', masterCert:true  },
    { id:'bienestar-docente',     title:'Bienestar Docente: Prevención del Desgaste',  durationHours:3, totalCards:24, modules:4, ruta:'convivencia', masterCert:true  },
    { id:'educacion-inclusiva',   title:'Educación Inclusiva y Necesidades Educativas Especiales', durationHours:5, totalCards:27, modules:5, ruta:'inclusion', masterCert:false },
    { id:'tea-profundidad',       title:'TEA en el Aula: Estrategias Avanzadas',        durationHours:4, totalCards:20, modules:4, ruta:'inclusion', masterCert:false },
    { id:'discapacidad-down-tdah', title:'Síndrome de Down y TDAH: Estrategias para el Aula', durationHours:4, totalCards:20, modules:4, ruta:'inclusion', masterCert:false },
    { id:'lengua-senas-docentes', title:'Lengua de Señas para Docentes: Fundamentos Prácticos', durationHours:3, totalCards:20, modules:4, ruta:'inclusion', masterCert:false },
];

// ────────────────────────────────────────────────────────────
// DATOS REALES DESDE data.js (allCourses)
// admin.html carga data.js, así que podemos calcular los IDs y
// totales reales de tarjetas en vez de usar cifras hardcodeadas.
// Replica la normalización de app.js: IDs numéricos de cursos
// nuevos se prefijan con el id del curso (ej. 'creatividad-1').
// ────────────────────────────────────────────────────────────
const COURSE_CARD_IDS   = {};  // courseId -> Set de IDs de tarjeta
const COURSE_MODULE_IDS = {};  // courseId -> [[ids módulo 1], [ids módulo 2], ...]
const ALL_VALID_CARD_IDS = new Set();

if (typeof allCourses !== 'undefined') {
    allCourses.forEach(course => {
        if (course.id !== 'steam') {
            (course.modules || []).forEach(mod => (mod.cards || []).forEach(card => {
                if (card.id != null && /^[0-9]+$/.test(String(card.id))) {
                    card.id = `${course.id}-${card.id}`;
                }
            }));
        }
        const mods = (course.modules || []).map(m => (m.cards || []).map(c => String(c.id)));
        COURSE_MODULE_IDS[course.id] = mods;
        const ids = new Set(mods.flat());
        COURSE_CARD_IDS[course.id] = ids;
        ids.forEach(id => ALL_VALID_CARD_IDS.add(id));
        // Sincronizar totales reales en STATIC_COURSES (los hardcodeados divergen de data.js)
        const sc = STATIC_COURSES.find(s => s.id === course.id);
        if (sc) { sc.totalCards = ids.size; sc.modules = mods.length; }
    });
}

// ¿La tarjeta `id` pertenece al curso `courseId`? (con fallback por prefijo si data.js no cargó)
const _LEGACY_PREFIX = { abp:'abp-', 'design-thinking':'dt-', evaluacion:'ev-', 'tipos-estudiantes':'te-', storytelling:'st-' };
function _cardBelongsTo(courseId, id) {
    const set = COURSE_CARD_IDS[courseId];
    const s = String(id);
    if (set && set.size) return set.has(s);
    if (courseId === 'steam') return /^\d+$/.test(s);
    return s.startsWith(_LEGACY_PREFIX[courseId] || (courseId + '-'));
}

// Tarjetas completadas VÁLIDAS de un usuario (únicas y existentes en el contenido actual)
function _validCompletedSet(p) {
    const out = new Set();
    (p.completed_cards || []).forEach(id => {
        const s = String(id);
        if (!ALL_VALID_CARD_IDS.size || ALL_VALID_CARD_IDS.has(s)) out.add(s);
    });
    return out;
}

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = null;
let _allProgress = [];   // cache global de progreso
let _charts = {};        // cache de instancias Chart.js
let _cmsState = { step:1, courseId:null, isStatic:false, data:{ modules:[] } };
let _currentModuleIdx = -1;
let _usersCache = [];
let _dbCourses = [];     // cursos adicionales desde BD
let _coursesList = [];   // STATIC_COURSES + _dbCourses (para columnas dinámicas)
let _rvCardsCache = [];  // último resultado de get_card_time_aggregates(), para el mapa de calor

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function toast(msg, ok=true) {
    const el = document.getElementById('adminToast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast ${ok ? '' : 'bg-red-600'}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
}

function fmt(n) { return new Intl.NumberFormat('es').format(n); }

function fmtTime(s) {
    if (!s || s <= 0) return '—';
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.round(s/60)} min`;
    return `${(s/3600).toFixed(1)}h`;
}

function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateShort(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-GT', { day:'2-digit', month:'short' });
}

function fmtDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-GT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getName(p) {
    return p?.daily_missions?.fullName || (p?.email ? p.email.split('@')[0] : 'Docente');
}

function getSchool(p) {
    // Primero usa la asignación admin (_userSchoolMap), luego el campo de perfil
    const schoolId = _userSchoolMap?.[p.user_id];
    if (schoolId) {
        const found = _schools?.find(s => s.id === schoolId);
        if (found) return found.name;
    }
    const selfReported = p?.daily_missions?.school;
    return (selfReported && selfReported !== 'Individual') ? selfReported : '';
}
function getDept(p)   { return p?.daily_missions?.department || 'Individual'; }

function getEmail(p) { return p?.email || '—'; }

function destroyChart(key) {
    if (_charts[key]) { try { _charts[key].destroy(); } catch(e){} _charts[key] = null; }
}

function buildChart(key, ctx, config) {
    destroyChart(key);
    if (!ctx) return;
    _charts[key] = new Chart(ctx, config);
    return _charts[key];
}

function isActive7d(p) {
    if (!p.updated_at) return false;
    const d = new Date(p.updated_at);
    return (Date.now() - d.getTime()) < 7 * 86400000;
}

function hasCertificate(p) {
    const scores = p?.daily_missions?.examScores || {};
    if (p?.daily_missions?.examScore >= 70) return true;
    return Object.values(scores).some(s => s >= 70);
}

// Cuenta tarjetas completadas de UN curso específico (únicas, no mezcladas entre cursos)
function _courseCardsCompleted(p, c) {
    const done = new Set();
    (p.completed_cards || []).forEach(id => { if (_cardBelongsTo(c.id, id)) done.add(String(id)); });
    return done.size;
}
function hasCompletedAnyCourse(p) {
    return STATIC_COURSES.some(c => _courseCardsCompleted(p, c) >= c.totalCards);
}

function getProgressPct(p, courseId='steam') {
    const done = new Set();
    (p.completed_cards || []).forEach(id => { if (_cardBelongsTo(courseId, id)) done.add(String(id)); });
    const total = COURSE_CARD_IDS[courseId]?.size
        || STATIC_COURSES.find(c => c.id === courseId)?.totalCards || 73;
    return Math.min(100, Math.round((done.size / total) * 100));
}

function loader(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="loader"><i class="fas fa-circle-notch fa-spin"></i> Cargando…</div>';
}

function empty(id, msg='Sin datos aún.') {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<p class="text-slate-400 text-sm text-center py-8">${msg}</p>`;
}

// ────────────────────────────────────────────────────────────
// AUTH
// ────────────────────────────────────────────────────────────
async function checkAdminAuth() {
    const { data:{ session } } = await sb.auth.getSession();
    if (!session) { window.location.href = 'admin-login.html'; return false; }
    currentUser = session.user;

    const isAdmin = ADMIN_EMAILS.includes(currentUser.email);

    if (!isAdmin) {
        alert('Acceso denegado. Solo administradores pueden entrar.');
        await sb.auth.signOut();
        window.location.href = 'admin-login.html';
        return false;
    }
    document.getElementById('adminEmail').textContent = currentUser.email;
    return true;
}

// ────────────────────────────────────────────────────────────
// CARGAR PROGRESO GLOBAL (base de todos los cálculos)
// ────────────────────────────────────────────────────────────
function showConnectionError(show) {
    let el = document.getElementById('adminConnError');
    if (show) {
        if (el) return; // ya visible
        el = document.createElement('div');
        el.id = 'adminConnError';
        el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999;background:#DC2626;color:white;padding:12px 20px;text-align:center;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:12px';
        el.innerHTML = `<span>⚠️ No se pudo conectar con el servidor. Revisa tu conexión a internet (no es un problema de los datos).</span>
            <button style="background:white;color:#DC2626;border:none;padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:12px">Reintentar</button>`;
        el.querySelector('button').onclick = () => location.reload();
        document.body.prepend(el);
    } else if (el) {
        el.remove();
    }
}

async function fetchAllProgress() {
    const { data, error } = await sb
        .from('progress')
        .select('user_id, email, xp, level, streak, completed_cards, updated_at, daily_missions, quiz_correct_count, badges')
        .order('xp', { ascending: false });
    if (error) {
        console.error('progress fetch:', error);
        showConnectionError(true);
        return [];
    }
    showConnectionError(false);
    _allProgress = (data || []).filter(p => !ADMIN_EMAILS.includes(p.email));
    _usersCache  = [..._allProgress];
    return _allProgress;
}

// ────────────────────────────────────────────────────────────
// HELPER — módulos por curso
// ────────────────────────────────────────────────────────────
function getModuleCompletion(progress, courseId) {
    // IDs reales por módulo desde data.js — funciona para los 12 cursos
    const moduleIds = COURSE_MODULE_IDS[courseId];
    if (!progress.length || !moduleIds || !moduleIds.length) return { labels: [], data: [], enrolled: 0 };

    // denominador: solo usuarios con al menos 1 tarjeta del curso (inscritos de facto)
    const enrolled = progress.filter(p =>
        (p.completed_cards||[]).some(id => _cardBelongsTo(courseId, id))
    );
    const enrolledCount = enrolled.length || 1;

    return {
        labels: moduleIds.map((_, i) => `Módulo ${i+1}`),
        data: moduleIds.map(ids => {
            const c = enrolled.filter(p => {
                const done = new Set((p.completed_cards||[]).map(id => String(id)));
                return ids.length > 0 && ids.every(id => done.has(id));
            }).length;
            return Math.round((c / enrolledCount) * 100);
        }),
        enrolled: enrolledCount
    };
}

function buildModuleChart(chartKey, canvasId, progress, courseId) {
    const { labels, data, enrolled } = getModuleCompletion(progress, courseId);
    buildChart(chartKey, document.getElementById(canvasId)?.getContext('2d'), {
        type:'bar',
        data:{
            labels,
            datasets:[{ label:`% de inscritos que completaron (n=${enrolled})`,
                data,
                backgroundColor:['#e0f2fe','#bfdbfe','#a5b4fc','#818cf8','#4f46e5'],
                borderRadius:8, borderSkipped:false }]
        },
        options:{
            plugins:{legend:{display:true, labels:{font:{size:10},boxWidth:0}}},
            scales:{ y:{beginAtZero:true,max:100,grid:{color:'#f8fafc'},ticks:{callback:v=>v+'%',font:{size:10}}},
                     x:{grid:{display:false},ticks:{font:{size:10}}} } }
    });
}

// ────────────────────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────────────────────
async function loadDashboard() {
    const progress = await fetchAllProgress();
    const total = progress.length;
    const active30 = progress.filter(isActive7d).length;
    const totalCards = progress.reduce((a,p) => a + (p.completed_cards?.length||0), 0);
    // Total de certificados = misma lógica que la tabla de cursos (garantiza coincidencia)
    const totalCertificados = STATIC_COURSES.reduce((sum, c) => {
        return sum + progress.filter(p => {
            const sc = p?.daily_missions?.examScores || {};
            return (sc[c.id] || 0) >= 70 ||
                   (c.id === 'steam' && (p?.daily_missions?.examScore || 0) >= 70);
        }).length;
    }, 0);

    // Tasa finalización unificada: docentes con ≥1 curso certificado (misma que KPI)
    const certifiedAnyBanner = progress.filter(p => {
        const sc = p?.daily_missions?.examScores || {};
        return STATIC_COURSES.some(c => (sc[c.id]||0)>=70 || (c.id==='steam'&&(p?.daily_missions?.examScore||0)>=70));
    }).length;
    const tasaFinalizacion = total ? Math.round((certifiedAnyBanner / total) * 100) : 0;

    // Tiempo real acumulado — agregado en Postgres (evita descargar filas individuales)
    const { data: rvStats } = await sb.rpc('get_resource_views_stats');
    const totalSeconds = rvStats?.[0]?.total_seconds || 0;
    const avgS         = rvStats?.[0]?.avg_seconds   || 0;

    // Horas de formación — estimado basado en tarjetas (3 min/tarjeta)
    const horasFormacion = Math.round(totalCards * 3 / 60);
    // Tiempo real calculado: avgS × totalCards (si hay datos)
    const horasRealesCalc = avgS > 0 ? Math.round(totalCards * avgS / 3600) : null;
    const metodoLabel = horasRealesCalc !== null
        ? `≈${horasRealesCalc}h reales (${avgS}s × ${fmt(totalCards)} tarjetas)`
        : '';

    // Banner de impacto
    const now = new Date();
    document.getElementById('dashPeriod').textContent =
        `Actualizado ${now.toLocaleDateString('es-GT',{day:'2-digit',month:'long',year:'numeric'})}`;
    document.getElementById('impactDocentes').textContent = fmt(active30);
    document.getElementById('impactHoras').textContent = fmt(horasFormacion)+'h';
    const horasRealEl = document.getElementById('impactHorasReal');
    if (horasRealEl) horasRealEl.textContent = metodoLabel;
    document.getElementById('impactCertificados').textContent = fmt(totalCertificados);

    // Portafolios — docentes certificados que tienen portafolio enviado
    const portfolioSubmitted = progress.filter(p => {
        const pb = p?.daily_missions?.portfolioByPath;
        return pb && Object.values(pb).some(v => v?.submitted || v?.score != null);
    }).length;
    const portEl = document.getElementById('kpiPortfolios');
    if (portEl) portEl.textContent = portfolioSubmitted + ' / ' + totalCertificados;

    // Métricas de sesiones
    const { data: sessions } = await sb.from('user_sessions')
        .select('duration_seconds, user_id, start_time, device_info')
        .not('duration_seconds', 'is', null)
        .gt('duration_seconds', 0);
    if (sessions?.length) {
        const totalTime = sessions.reduce((a,s) => a + (s.duration_seconds||0), 0);
        const sesEl = document.getElementById('kpiAvgSession');
        if (sesEl) sesEl.textContent = fmtTime(totalTime);
        const totalSesEl = document.getElementById('kpiTotalSessions');
        if (totalSesEl) totalSesEl.textContent = fmt(sessions.length);

        // Móvil vs PC
        const mobileCount = sessions.filter(s => s.device_info?.mobile).length;
        const mobilePct = Math.round((mobileCount / sessions.length) * 100);
        const kpiMob = document.getElementById('kpiMobile');
        if (kpiMob) kpiMob.textContent = mobilePct + '%';
        const kpiMobSub = document.getElementById('kpiMobileSub');
        if (kpiMobSub) kpiMobSub.textContent = `móvil · ${100-mobilePct}% PC`;

        await renderSessionsChart(sessions);
        renderDeviceChart(mobileCount, sessions.length - mobileCount);
    }

    // NPS (excluye admins)
    const { data: fbRaw } = await sb.from('feedback').select('nps,rating,user_id');
    const _nonAdminIds = new Set(progress.map(p => p.user_id));
    const fb = (fbRaw || []).filter(f => _nonAdminIds.has(f.user_id));
    let npsText = 'N/A';
    if (fb.length) {
        const promoters = fb.filter(f=>f.nps>=9).length;
        const detractors = fb.filter(f=>f.nps<=6).length;
        const nps = Math.round(((promoters-detractors)/fb.length)*100);
        npsText = nps;
    }
    document.getElementById('kpiNps').textContent = npsText;

    // Embudo de conversión
    renderFunnelChart(progress, total);

    // Departamentos
    renderDeptChart(progress);

    // Tiempo por tarjeta — agregado en Postgres (se cachea para el mapa de calor)
    const { data: rvCards } = await sb.rpc('get_card_time_aggregates');
    _rvCardsCache = rvCards || [];
    renderCardTimeTable(_rvCardsCache);
    renderCardHeatmap();

    // Gráfico XP top 10
    const top10 = progress.slice(0,10);
    buildChart('xp', document.getElementById('xpChart')?.getContext('2d'), {
        type:'bar',
        data:{
            labels: top10.map(p => getName(p).substring(0,15)),
            datasets:[{ label:'XP', data: top10.map(p=>p.xp||0),
                backgroundColor: top10.map((_,i)=>`hsl(${230+i*8},70%,${60-i*2}%)`),
                borderRadius:8, borderSkipped:false }]
        },
        options:{ plugins:{legend:{display:false}}, scales:{
            y:{beginAtZero:true,grid:{color:'#f8fafc'},ticks:{font:{size:10}}},
            x:{grid:{display:false},ticks:{font:{size:10}}}
        }}
    });

    // Gráfico distribución de niveles
    const lvlBuckets = { 'Inicio (0-20%)':0, 'Básico (21-50%)':0, 'Intermedio (51-80%)':0, 'Avanzado (81-100%)':0 };
    progress.forEach(p => {
        const pct = getProgressPct(p,'steam');
        if (pct <= 20) lvlBuckets['Inicio (0-20%)']++;
        else if (pct <= 50) lvlBuckets['Básico (21-50%)']++;
        else if (pct <= 80) lvlBuckets['Intermedio (51-80%)']++;
        else lvlBuckets['Avanzado (81-100%)']++;
    });
    buildChart('levels', document.getElementById('levelsChart')?.getContext('2d'), {
        type:'doughnut',
        data:{
            labels: Object.keys(lvlBuckets),
            datasets:[{ data: Object.values(lvlBuckets),
                backgroundColor:['#f1f5f9','#bfdbfe','#818cf8','#4f46e5'],
                borderWidth:2, borderColor:'#fff' }]
        },
        options:{ plugins:{ legend:{ position:'bottom', labels:{ font:{size:10}, boxWidth:12 } } }, cutout:'65%' }
    });

    // Progreso por módulo — curso seleccionado
    const dashModSel = document.getElementById('dashModuleCourseSel');
    buildModuleChart('module', 'moduleChart', progress, dashModSel?.value || 'steam');
    dashModSel?.addEventListener('change', () => buildModuleChart('module', 'moduleChart', _allProgress, dashModSel.value));

    // Actividad reciente
    const recent = [...progress].sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,6);
    const act = document.getElementById('recentActivity');
    if (act) {
        if (!recent.length) { act.innerHTML='<p class="text-slate-400 text-sm text-center py-6">Sin actividad registrada.</p>'; }
        else act.innerHTML = recent.map(p=>`
            <div class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                    ${esc(getName(p).charAt(0).toUpperCase())}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-700 truncate">${esc(getName(p))}</p>
                    <p class="text-xs text-slate-400">${esc(getEmail(p))}</p>
                </div>
                <div class="text-right shrink-0">
                    <p class="text-xs font-bold text-amber-600"><i class="fas fa-star"></i> ${p.xp||0} XP</p>
                    <p class="text-[10px] text-slate-400">${fmtDateTime(p.updated_at)}</p>
                </div>
            </div>`).join('');
    }

    // Tabla resumen por curso
    renderCourseSummary(progress);
}

function renderCourseSummary(progress) {
    const el = document.getElementById('courseSummaryTable');
    if (!el) return;
    const rows = STATIC_COURSES.map(c => {
        const enrolled = progress.filter(p =>
            (p.completed_cards || []).some(id => _cardBelongsTo(c.id, id))
        );
        const certified = enrolled.filter(p => {
            const sc = p?.daily_missions?.examScores || {};
            return (sc[c.id]||0) >= 70 || (c.id==='steam' && (p?.daily_missions?.examScore||0)>=70);
        }).length;
        const avgPct = enrolled.length
            ? Math.round(enrolled.reduce((a,p)=>a+getProgressPct(p,c.id),0)/enrolled.length) : 0;
        return `<tr>
            <td><p class="font-semibold text-slate-700 text-sm">${c.title}</p></td>
            <td><span class="badge tag-blue">${enrolled.length} docentes</span></td>
            <td>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[60px]">
                        <div class="bg-indigo-500 h-1.5 rounded-full" style="width:${avgPct}%"></div>
                    </div>
                    <span class="text-xs font-bold text-slate-600">${avgPct}%</span>
                </div>
            </td>
            <td><span class="badge tag-green">${certified} certificados</span></td>
            <td><span class="text-xs text-slate-500">${c.durationHours}h · ${c.totalCards} tarjetas</span></td>
        </tr>`;
    });
    el.innerHTML = `<table>
        <thead><tr>
            <th>Curso</th><th>Inscritos</th><th>Progreso promedio</th><th>Certificados</th><th>Datos</th>
        </tr></thead>
        <tbody>${rows.join('')}</tbody>
    </table>`;
}

// ────────────────────────────────────────────────────────────
// SESIONES
// ────────────────────────────────────────────────────────────
async function renderSessionsChart(sessions) {
    const ctx = document.getElementById('sessionsChart');
    if (!ctx) return;
    // Agrupar sesiones por día (últimos 14 días)
    const days = {};
    const now = Date.now();
    for (let i = 13; i >= 0; i--) {
        const d = new Date(now - i * 86400000).toLocaleDateString('en-CA');
        days[d] = { count: 0, totalSec: 0 };
    }
    sessions.forEach(s => {
        const d = new Date(s.start_time).toLocaleDateString('en-CA');
        if (days[d]) { days[d].count++; days[d].totalSec += s.duration_seconds || 0; }
    });
    const labels = Object.keys(days).map(d => d.slice(5)); // MM-DD
    const counts = Object.values(days).map(d => d.count);
    const avgMins = Object.values(days).map(d => d.count ? Math.round(d.totalSec / d.count / 60) : 0);
    if (window._sessChart) window._sessChart.destroy();
    window._sessChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Sesiones', data: counts, backgroundColor: '#07B0E4', borderRadius: 6, yAxisID: 'y' },
                { label: 'Min promedio', data: avgMins, type: 'line', borderColor: '#6366f1', backgroundColor: 'transparent', tension: 0.4, yAxisID: 'y1' }
            ]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Sesiones' } },
                      y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Min promedio' }, grid: { drawOnChartArea: false } } } }
    });
}

// ── Embudo de conversión ──────────────────────────────────
function renderFunnelChart(progress, total) {
    const el = document.getElementById('funnelChart');
    if (!el) return;

    const startedAny = progress.filter(p => (p.completed_cards?.length||0) > 0).length;
    const completed80 = progress.filter(p => {
        return STATIC_COURSES.some(c => getProgressPct(p, c.id) >= 80);
    }).length;
    const certifiedAny = progress.filter(p => {
        const sc = p?.daily_missions?.examScores || {};
        return STATIC_COURSES.some(c => (sc[c.id]||0)>=70 || (c.id==='steam'&&(p?.daily_missions?.examScore||0)>=70));
    }).length;
    const withPortfolio = progress.filter(p => {
        const pb = p?.daily_missions?.portfolioByPath;
        return pb && Object.values(pb).some(v => v?.submitted || v?.score != null);
    }).length;

    const steps = [
        { label: 'Registrados', val: total, color: '#6366f1' },
        { label: 'Iniciaron curso', val: startedAny, color: '#07B0E4' },
        { label: 'Completaron 80%', val: completed80, color: '#10b981' },
        { label: 'Aprobaron examen', val: certifiedAny, color: '#f59e0b' },
        { label: 'Enviaron portafolio', val: withPortfolio, color: '#8b5cf6' },
    ];

    const maxVal = total || 1;
    el.innerHTML = steps.map((s, i) => {
        const pct = Math.round((s.val / maxVal) * 100);
        const width = Math.max(pct, 8);
        const convRate = i > 0 && steps[i-1].val > 0
            ? ` <span style="color:#94a3b8;font-size:10px">(${Math.round(s.val/steps[i-1].val*100)}% del paso anterior)</span>` : '';
        return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px">
                <span style="font-size:12px;font-weight:600;color:#374151">${s.label}</span>
                <span style="font-size:12px;font-weight:800;color:#1e293b">${fmt(s.val)}${convRate}</span>
            </div>
            <div style="background:#f1f5f9;border-radius:8px;height:10px;overflow:hidden">
                <div style="width:${width}%;background:${s.color};height:100%;border-radius:8px;transition:width .6s ease"></div>
            </div>
        </div>`;
    }).join('');
}

// ── Gráfico dispositivos ──────────────────────────────────
function renderDeviceChart(mobile, desktop) {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;
    if (window._devChart) window._devChart.destroy();
    window._devChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Móvil', 'Computadora'],
            datasets: [{ data: [mobile, desktop],
                backgroundColor: ['#8b5cf6','#07B0E4'],
                borderWidth: 3, borderColor: '#fff' }]
        },
        options: { cutout: '68%', plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } },
            tooltip: { callbacks: { label: ctx => {
                const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
                return ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw/total*100)}%)`;
            }}}
        }}
    });
}

// ── Mapa de departamentos ─────────────────────────────────
function renderDeptChart(progress) {
    const counts = {};
    progress.forEach(p => {
        const dept = p?.daily_missions?.department;
        const key = (dept && dept !== 'Individual' && dept.trim()) ? dept.trim() : 'Sin departamento';
        counts[key] = (counts[key]||0) + 1;
    });
    // "Sin departamento" siempre al final
    const sorted = Object.entries(counts)
        .filter(([k]) => k !== 'Sin departamento')
        .sort((a,b) => b[1]-a[1])
        .concat(counts['Sin departamento'] ? [['Sin departamento', counts['Sin departamento']]] : []);
    const tableEl = document.getElementById('deptTable');
    if (!tableEl) return;
    if (!sorted.length) {
        tableEl.innerHTML = '<p class="text-slate-400 text-sm text-center py-8">Sin datos de departamento aún.<br><span class="text-xs">Los docentes deben completar su perfil.</span></p>';
        return;
    }
    // maxN debe considerar TODOS los valores incluido "Sin departamento"
    const maxN = Math.max(...sorted.map(([,n]) => n), 1);
    const total = progress.length;
    const colors = ['#06b6d4','#3b82f6','#6366f1','#8b5cf6','#a78bfa'];
    tableEl.innerHTML = sorted.map(([dept, n], i) => {
        const pct = Math.round(n / total * 100);
        const barW = Math.round(n / maxN * 100);
        const isSinDept = dept === 'Sin departamento';
        const bg = isSinDept ? '#94a3b8' : colors[Math.min(i, colors.length-1)];
        const isTop3 = i < 3 && !isSinDept;
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9">
            <span style="width:20px;text-align:center;font-size:11px;font-weight:700;color:${isTop3?bg:'#94a3b8'}">${i+1}</span>
            <div style="flex:1;min-width:0">
                <div style="display:flex;justify-content:space-between;margin-bottom:3px">
                    <span style="font-size:13px;font-weight:${isTop3?'700':'500'};color:#1e293b">${esc(dept)}</span>
                    <span style="font-size:12px;font-weight:700;color:${bg}">${n} <span style="color:#94a3b8;font-weight:400">(${pct}%)</span></span>
                </div>
                <div style="background:#f1f5f9;border-radius:4px;height:6px">
                    <div style="width:${barW}%;background:${bg};height:100%;border-radius:4px;transition:width .5s ease"></div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Tiempo por tarjeta ────────────────────────────────────
function renderCardTimeTable(rows) {
    const el = document.getElementById('cardTimeTable');
    if (!el) return;
    if (!rows.length) {
        el.innerHTML = '<p class="text-slate-400 text-sm text-center py-8">Sin datos de tiempo por tarjeta aún.</p>';
        return;
    }
    // Mapear card IDs a nombres usando allCourses de data.js (cargado en admin.html)
    const cardNames = {};
    const courseSrc = (typeof allCourses !== 'undefined' && allCourses.length) ? allCourses
        : (typeof _coursesList !== 'undefined' ? _coursesList : []);
    courseSrc.filter(c => Array.isArray(c.modules)).forEach(c => {
        c.modules.forEach(m => {
            (m.cards||[]).forEach(card => {
                const clean = (card.title||'').replace(/^[\p{Emoji}\s]+/u,'').trim();
                const fromQuestion = (card.question||'').substring(0, 50) || '';
                cardNames[String(card.id)] = clean || fromQuestion || (card.title && card.title.trim()) || String(card.id);
            });
        });
    });

    // Soporta formato RPC {card_id, views_count, avg_seconds} y formato legacy {resource_id, time_spent_seconds}
    const sorted = (rows[0]?.card_id !== undefined
        ? rows.map(r => ({ id: String(r.card_id), avg: Math.round(r.avg_seconds), count: Number(r.views_count) }))
        : (() => {
            const map = {};
            rows.forEach(r => {
                const id = String(r.resource_id);
                if (!map[id]) map[id] = { total: 0, count: 0 };
                map[id].total += r.time_spent_seconds || 0;
                map[id].count++;
            });
            return Object.entries(map).map(([id, d]) => ({ id, avg: Math.round(d.total / d.count), count: d.count }));
        })()
    ).sort((a,b) => b.count - a.count || b.avg - a.avg).slice(0, 15);

    const maxAvg = Math.max(...sorted.map(s => s.avg)) || 1;
    el.innerHTML = `<div style="font-size:10px;color:#94a3b8;display:grid;grid-template-columns:1fr auto auto;gap:4px 12px;padding:0 0 6px;border-bottom:1px solid #f1f5f9;font-weight:700;text-transform:uppercase">
        <span>Tarjeta</span><span style="text-align:right">Vistas</span><span style="text-align:right">Promedio</span>
    </div>` +
    sorted.map(({ id, avg, count }) => {
        const name = cardNames[id];
        const label = name ? (name.length > 28 ? name.substring(0,27)+'…' : name) : 'ID: '+id;
        const barW = Math.round(avg / maxAvg * 100);
        const color = avg > 120 ? '#f59e0b' : avg > 60 ? '#06b6d4' : '#10b981';
        return `<div style="padding:7px 0;border-bottom:1px solid #f8fafc">
            <div style="display:grid;grid-template-columns:1fr auto auto;gap:4px 12px;align-items:center;margin-bottom:3px">
                <span style="font-size:12px;font-weight:600;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(name||id)}">
                    ${esc(label)}
                </span>
                <span style="font-size:11px;color:#94a3b8;text-align:right">${count}</span>
                <span style="font-size:12px;font-weight:700;color:${color};text-align:right">${fmtTime(avg)}</span>
            </div>
            <div style="background:#f1f5f9;border-radius:4px;height:4px">
                <div style="width:${barW}%;background:${color};height:100%;border-radius:4px"></div>
            </div>
        </div>`;
    }).join('');
}

// ── Mapa de calor: tiempo promedio por tarjeta, agrupado por módulo ──
function renderCardHeatmap() {
    const el = document.getElementById('cardHeatmap');
    if (!el) return;
    const courseId = document.getElementById('heatmapCourseSel')?.value || 'steam';
    const moduleIds = COURSE_MODULE_IDS[courseId];
    if (!moduleIds || !moduleIds.length) {
        el.innerHTML = '<p class="text-slate-400 text-sm text-center py-8">No se pudo cargar la estructura de este curso.</p>';
        return;
    }

    // avg_seconds por card_id, desde la cache del RPC get_card_time_aggregates
    const avgById = {};
    (_rvCardsCache || []).forEach(r => { avgById[String(r.card_id)] = { avg: Number(r.avg_seconds) || 0, count: Number(r.views_count) || 0 }; });

    // Nombres de tarjeta, para el tooltip
    const cardNames = {};
    const courseObj = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === courseId) : null;
    (courseObj?.modules || []).forEach(m => (m.cards || []).forEach(card => {
        const clean = (card.title || '').replace(/^[\p{Emoji}\s]+/u, '').trim();
        cardNames[String(card.id)] = clean || String(card.id);
    }));

    const allAvgs = moduleIds.flat().map(id => avgById[id]?.avg).filter(v => v > 0);
    const maxAvg = Math.max(...allAvgs, 1);

    const colorFor = (avg) => {
        if (!avg) return '#f1f5f9'; // sin datos
        const t = Math.min(1, avg / maxAvg); // 0..1
        // Escala de azul claro a azul/índigo oscuro
        const light = 92 - t * 55; // 92% -> 37% lightness
        return `hsl(230, 70%, ${light}%)`;
    };

    el.innerHTML = moduleIds.map((cardIds, mi) => `
        <div style="margin-bottom:12px">
            <p style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:6px">Módulo ${mi + 1}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${cardIds.map((cid, ci) => {
                    const data = avgById[cid];
                    const avg = data?.avg || 0;
                    const title = data
                        ? `${esc(cardNames[cid] || cid)} — ${fmtTime(Math.round(avg))} promedio, ${data.count} vistas`
                        : `${esc(cardNames[cid] || cid)} — sin datos aún`;
                    const textColor = avg && avg / maxAvg > 0.55 ? '#fff' : '#475569';
                    return `<div title="${title}" style="width:30px;height:30px;border-radius:6px;background:${colorFor(avg)};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${textColor};cursor:default">${ci + 1}</div>`;
                }).join('')}
            </div>
        </div>`).join('') +
        `<div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:10px;color:#94a3b8">
            <span>Menos tiempo</span>
            <div style="display:flex;gap:2px">${[0, .25, .5, .75, 1].map(t => `<div style="width:14px;height:10px;border-radius:2px;background:hsl(230,70%,${92 - t * 55}%)"></div>`).join('')}</div>
            <span>Más tiempo</span>
            <div style="width:14px;height:10px;border-radius:2px;background:#f1f5f9;margin-left:10px"></div>
            <span>Sin datos</span>
        </div>`;
}

// ── Cambio de rol via Edge Function ──
async function changeUserRole(userId, newRole) {
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) { toast('No autenticado', 'error'); return; }
    const EDGE_URL = `${sb.supabaseUrl}/functions/v1/admin-users`;
    const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'setRole', userId, role: newRole })
    });
    const json = await res.json();
    if (!res.ok) { toast('Error: ' + (json.error || res.status), 'error'); return; }
    toast(`Rol actualizado a "${newRole}"`, 'success');
    loadUsers();
}

async function inviteUser(email, role = 'student') {
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) { toast('No autenticado', 'error'); return; }
    const EDGE_URL = `${sb.supabaseUrl}/functions/v1/admin-users`;
    const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'invite', email, role })
    });
    const json = await res.json();
    if (!res.ok) { toast('Error: ' + (json.error || res.status), 'error'); return; }
    toast(`Invitación enviada a ${email}`, 'success');
}

// ────────────────────────────────────────────────────────────
// ANALYTICS
// ────────────────────────────────────────────────────────────
async function loadAnalytics() {
    const progress = _allProgress.length ? _allProgress : await fetchAllProgress();
    const total = progress.length;

    // Completitud por módulo — curso seleccionado
    const anModSel = document.getElementById('analyticsModuleCourseSel');
    buildModuleChart('analyticsModule', 'analyticsModuleChart', progress, anModSel?.value || 'steam');
    anModSel?.addEventListener('change', () => buildModuleChart('analyticsModule', 'analyticsModuleChart', _allProgress, anModSel.value));

    // Donut distribución
    const totalCardsAll = progress.reduce((a,p)=>a+(p.completed_cards?.length||0),0);
    const totalQuizzes  = progress.reduce((a,p)=>a+(p.quiz_correct_count||0),0);
    const totalBadges   = progress.reduce((a,p)=>a+(p.badges?.length||0),0);
    const certified     = progress.filter(hasCertificate).length;
    buildChart('analyticsDonut', document.getElementById('analyticsDonut')?.getContext('2d'), {
        type:'doughnut',
        data:{ labels:['Tarjetas completadas','Quizzes correctos','Logros desbloqueados','Certificados emitidos'],
            datasets:[{data:[totalCardsAll,totalQuizzes,totalBadges,certified],
                backgroundColor:['#818cf8','#34d399','#fbbf24','#4f46e5'],borderWidth:2,borderColor:'#fff'}]},
        options:{ plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:12}}},cutout:'60%' }
    });

    // Barras por curso — todos los cursos, con conteo real de tarjetas por curso
    const courseAvg = STATIC_COURSES.map(c => {
        const enrolled = progress.filter(p=>(p.completed_cards||[]).some(id=>_cardBelongsTo(c.id, id)));
        return enrolled.length ? Math.round(enrolled.reduce((a,p)=>a+getProgressPct(p,c.id),0)/enrolled.length) : 0;
    });
    const _coursePalette = ['#07B0E4','#2563EB','#E83C8D','#E9A037','#7C3AED','#F59E0B','#EC4899','#8B5CF6','#10B981','#06B6D4','#6366F1','#F97316'];
    buildChart('analyticsCourseBar', document.getElementById('analyticsCourseBar')?.getContext('2d'), {
        type:'bar',
        data:{ labels: STATIC_COURSES.map(c=>c.title.substring(0,20)),
            datasets:[{label:'Progreso promedio %',data:courseAvg,
                backgroundColor: STATIC_COURSES.map((_,i)=>_coursePalette[i % _coursePalette.length]),
                borderRadius:8,borderSkipped:false}]},
        options:{ indexAxis:'y', plugins:{legend:{display:false}},
            scales:{ x:{beginAtZero:true,max:100,ticks:{callback:v=>v+'%',font:{size:10}}},
                     y:{grid:{display:false},ticks:{font:{size:10}}} } }
    });

    // Diagnóstico — leer desde daily_missions.diagLevel si existe
    const diagCounts = { inicial:0, proceso:0, satisfactorio:0, destacado:0, 'sin datos':0 };
    progress.forEach(p => {
        const dr = p?.daily_missions?.diagResult;
        if (dr?.level && diagCounts[dr.level] !== undefined) diagCounts[dr.level]++;
        else diagCounts['sin datos']++;
    });
    buildChart('analyticsDiag', document.getElementById('analyticsDiagChart')?.getContext('2d'), {
        type:'doughnut',
        data:{ labels:['Inicial','En Proceso','Satisfactorio','Destacado','Sin dato'],
            datasets:[{data:Object.values(diagCounts),
                backgroundColor:['#fca5a5','#fde68a','#86efac','#c4b5fd','#e2e8f0'],
                borderWidth:2,borderColor:'#fff'}]},
        options:{ plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:12}}},cutout:'55%' }
    });

    // Engagement por docente — calculado desde progress (compatible con RLS)
    const tbl = document.getElementById('analyticsSessionsTable');
    if (tbl) {
        const active = progress.filter(p => (p.completed_cards?.length || 0) > 0);
        if (!active.length) { empty('analyticsSessionsTable', 'Sin registros de actividad aún.'); return; }

        // Tiempo estimado: cada tarjeta ≈ 3 min de estudio
        const MINS_PER_CARD = 3;
        const sorted = [...active]
            .sort((a, b) => (b.completed_cards?.length || 0) - (a.completed_cards?.length || 0))
            .slice(0, 15);
        const maxCards = sorted[0]?.completed_cards?.length || 1;

        tbl.innerHTML = `<table>
            <thead><tr><th>Docente</th><th>Tarjetas completadas · Tiempo estimado</th><th>XP</th><th>Último acceso</th></tr></thead>
            <tbody>${sorted.map(p => {
                const cards = p.completed_cards?.length || 0;
                const mins  = cards * MINS_PER_CARD;
                const hStr  = mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;
                const lastSeen = p.updated_at ? new Date(p.updated_at).toLocaleDateString('es-GT',{day:'2-digit',month:'short',year:'numeric'}) : '—';
                return `<tr>
                <td class="font-medium text-slate-700">${esc(getName(p))}</td>
                <td>
                    <div class="flex items-center gap-2">
                        <div class="flex-1 bg-slate-100 rounded-full h-2 min-w-[80px]">
                            <div class="bg-indigo-500 h-2 rounded-full" style="width:${Math.round(cards/maxCards*100)}%"></div>
                        </div>
                        <span class="text-xs text-slate-600 whitespace-nowrap">${cards} tarjetas · <strong class="text-indigo-600">${hStr}</strong></span>
                    </div>
                </td>
                <td><span class="badge tag-blue">${p.xp || 0} XP</span></td>
                <td class="text-xs text-slate-500">${lastSeen}</td>
            </tr>`;
            }).join('')}</tbody>
        </table>`;
    }
}

// ── Recursos más descargados (user_events: resource_download) ──
async function loadResourceDownloadsPanel() {
    const container = document.getElementById('analyticsResourcesPanel');
    if (!container) return;
    const { data, error } = await sb.from('user_events')
        .select('metadata')
        .eq('event_type', 'resource_download')
        .limit(5000);
    if (error) { container.innerHTML = `<p class="text-xs text-red-500 text-center py-4">Error: ${esc(error.message)}</p>`; return; }
    if (!data || !data.length) { container.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Todavía no hay descargas registradas.</p>`; return; }

    const counts = {};
    data.forEach(row => {
        const url = row.metadata?.resourceUrl;
        const courseId = row.metadata?.courseId;
        if (!url) return;
        const key = courseId + '|' + url;
        counts[key] = (counts[key] || 0) + 1;
    });

    const ranked = Object.entries(counts)
        .map(([key, count]) => {
            const [courseId, url] = key.split('|');
            const course = STATIC_COURSES.find(c => c.id === courseId);
            const fileName = (url.split('/').pop() || url).replace('.html', '').replace(/-/g, ' ');
            return { courseTitle: course?.title || courseId, fileName, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const maxCount = ranked[0]?.count || 1;
    container.innerHTML = ranked.map(r => `
        <div style="padding:8px 0;border-bottom:1px solid #f8fafc">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
                <span style="font-size:12px;font-weight:600;color:#1e293b;text-transform:capitalize">${esc(r.fileName)}</span>
                <span style="font-size:11px;color:#94a3b8;flex-shrink:0;margin-left:8px">${esc(r.courseTitle)} · <strong style="color:#4f46e5">${r.count}</strong></span>
            </div>
            <div style="background:#f1f5f9;border-radius:6px;height:6px;overflow:hidden">
                <div style="background:#4f46e5;height:100%;width:${Math.round(r.count / maxCount * 100)}%"></div>
            </div>
        </div>`).join('');
}

// ────────────────────────────────────────────────────────────
// USUARIOS
// ────────────────────────────────────────────────────────────
// user_id → school_id (asignaciones cargadas con loadUsers)
let _userSchoolMap  = {};
let _coordUserIds   = new Set(); // user_ids que son coordinadores

async function loadUsers() {
    const progress = _allProgress.length ? _allProgress : await fetchAllProgress();
    _usersCache = progress.filter(p => !ADMIN_EMAILS.includes(p.email));

    // Fetch DB courses
    if (!_dbCourses.length) {
        const { data } = await sb.from('courses').select('id, title').order('created_at', { ascending: true });
        _dbCourses = data || [];
    }
    _coursesList = [
        ...STATIC_COURSES,
        ..._dbCourses.filter(c => !STATIC_COURSES.find(s => s.id === c.id))
    ];

    // Fetch schools, asignaciones y coordinadores en paralelo
    const [{ data: schoolsData }, { data: assignments }, { data: coordRows }] = await Promise.all([
        sb.from('schools').select('id, name').order('name'),
        sb.from('user_schools').select('user_id, school_id'),
        sb.from('coordinators').select('user_id')
    ]);
    _schools = schoolsData || [];
    _userSchoolMap = {};
    (assignments || []).forEach(a => { _userSchoolMap[a.user_id] = a.school_id; });
    _coordUserIds = new Set((coordRows || []).map(c => c.user_id));

    const { data: roleRows } = await sb.from('user_roles').select('user_id, role');
    const roleMap = {};
    (roleRows || []).forEach(r => { roleMap[r.user_id] = r.role; });

    _roleMapCache = roleMap;
    _applyUsersView();
}

async function assignTeacherSchool(userId, schoolId) {
    if (!schoolId) {
        await sb.from('user_schools').delete().eq('user_id', userId);
        delete _userSchoolMap[userId];
        toast('Centro removido.', 'success');
        return;
    }
    const { error } = await sb.from('user_schools').upsert(
        { user_id: userId, school_id: schoolId },
        { onConflict: 'user_id,school_id' }
    );
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    _userSchoolMap[userId] = schoolId;
    toast('Centro asignado.', 'success');
}

function hasCourseExamPassed(p, courseId) {
    const scores = p?.daily_missions?.examScores || {};
    if (courseId === 'steam') return (scores['steam'] ?? p?.daily_missions?.examScore ?? -1) >= 70;
    return (scores[courseId] ?? -1) >= 70;
}

function hasCourseStarted(p, courseId) {
    return (p.completed_cards || []).some(id => _cardBelongsTo(courseId, id));
}

function renderUsersTable(users, roleMap = {}, groupBySchool = false) {
    const total = users.length;
    const active = users.filter(isActive7d).length;
    const certified = users.filter(hasCertificate).length;
    document.getElementById('uTotal').textContent = total;
    document.getElementById('uActive').textContent = active;
    document.getElementById('uCert').textContent = certified;

    const cont = document.getElementById('usersTableContainer');
    if (!cont) return;
    if (!users.length) { cont.innerHTML='<div class="loader">Sin docentes registrados aún.</div>'; return; }

    const courses = _coursesList.length ? _coursesList : STATIC_COURSES;
    // Total tarjetas únicas reales en la plataforma (desde data.js; fallback a suma hardcodeada)
    const _totalUniqueCards = ALL_VALID_CARD_IDS.size
        || STATIC_COURSES.reduce((a, c) => a + (c.totalCards || 0), 0) || 572;

    const thead = `<thead><tr>
        <th>Docente</th><th>Escuela</th><th>XP</th><th>Certificados</th><th title="Tarjetas completadas del total disponible en la plataforma">Avance global</th><th>Último acceso</th>
    </tr></thead>`;

    const rowHtml = p => {
            const activo = isActive7d(p);
            const certCount = courses.filter(c => hasCourseExamPassed(p, c.id)).length;
        // Avance global: tarjetas únicas VÁLIDAS completadas / total real de la plataforma.
        // Filtra duplicados e IDs legacy que ya no existen (evita ver 605/572 = >100%)
        const _validDone = _validCompletedSet(p);
        const completedCount = _validDone.size;
        const globalPct = Math.min(100, Math.round((completedCount / _totalUniqueCards) * 100));
        const role = roleMap[p.user_id] || 'student';
        const roleLabel = role === 'admin' ? '<span class="badge tag-violet" style="font-size:9px">Admin</span>'
            : role === 'coordinator' ? '<span class="badge tag-blue" style="font-size:9px">Coord.</span>' : '';
        const school = getSchool(p);
        const name = getName(p);
        return `<tr style="cursor:pointer" onclick="openUserPanel('${p.user_id}')" title="Ver perfil">
            <td>
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 text-white" style="background:${avatarColor(name)}">${esc(name.charAt(0).toUpperCase())}</div>
                    <div>
                        <p class="font-semibold text-slate-800 text-sm">${esc(name)}</p>
                        <div class="flex items-center gap-1 mt-0.5">
                            ${activo ? '<span class="badge tag-green" style="font-size:9px">Activo</span>' : '<span class="badge tag-slate" style="font-size:9px">Inactivo</span>'}
                            ${roleLabel}
                        </div>
                    </div>
                </div>
            </td>
            <td class="text-xs text-slate-500">${esc(school || '—')}</td>
            <td><span class="font-bold text-amber-600 text-sm"><i class="fas fa-star text-yellow-400 text-xs"></i> ${fmt(p.xp||0)}</span></td>
            <td>${certCount > 0 ? `<span class="badge tag-green">${certCount} cert.</span>` : `<span class="text-slate-300 text-xs">—</span>`}</td>
            <td>
                <div class="flex items-center gap-2">
                    <div style="flex:1;background:#f1f5f9;border-radius:4px;height:6px">
                        <div style="width:${globalPct}%;background:${globalPct>=80?'#10b981':globalPct>=40?'#07B0E4':'#f59e0b'};height:100%;border-radius:4px;transition:width .4s"></div>
                    </div>
                    <span class="text-xs font-bold text-slate-500">${globalPct}%</span>
                </div>
                <span class="text-[10px] text-slate-400">${completedCount}/${_totalUniqueCards} tarjetas</span>
            </td>
            <td class="text-slate-400 text-xs whitespace-nowrap">${fmtDateTime(p.updated_at)}</td>
        </tr>`;
    };

    const tableStyle = `style="table-layout:fixed;width:100%"`;
    const colGroup = `<colgroup>
        <col style="width:28%"><col style="width:20%"><col style="width:10%">
        <col style="width:10%"><col style="width:17%"><col style="width:15%">
    </colgroup>`;

    if (!groupBySchool) {
        cont.innerHTML = `<table ${tableStyle}>${colGroup}${thead}<tbody>${users.map(rowHtml).join('')}</tbody></table>`;
    } else {
        // Agrupar por escuela
        const groups = {};
        users.forEach(p => {
            const school = getSchool(p) || 'Sin centro asignado';
            if (!groups[school]) groups[school] = [];
            groups[school].push(p);
        });
        const sorted = Object.entries(groups).sort((a, b) => {
            if (a[0] === 'Sin centro asignado') return 1;
            if (b[0] === 'Sin centro asignado') return -1;
            return a[0].localeCompare(b[0], 'es');
        });
        cont.innerHTML = sorted.map(([school, members], idx) => {
            const totalXP = members.reduce((a,p) => a+(p.xp||0), 0);
            const certs = members.reduce((a,p) => a + courses.filter(c=>hasCourseExamPassed(p,c.id)).length, 0);
            const gid = `sg_${idx}`;
            return `<div class="school-group-header" style="cursor:pointer;user-select:none"
                    onclick="(function(el){const t=document.getElementById('${gid}');const open=t.style.display!=='none';t.style.display=open?'none':'';el.querySelector('.sg-chevron').style.transform=open?'rotate(-90deg)':'rotate(0deg)'})(this)">
                <i class="fas fa-school" style="color:#818cf8"></i>
                <span style="flex:1">${esc(school)}</span>
                <span style="font-weight:500;color:#94a3b8;font-size:10px;text-transform:none;letter-spacing:0">${members.length} docentes &nbsp;·&nbsp; ${fmt(totalXP)} XP &nbsp;·&nbsp; ${certs} cert.</span>
                <i class="fas fa-chevron-down sg-chevron" style="color:#94a3b8;font-size:10px;margin-left:8px;transition:transform .2s;transform:rotate(-90deg)"></i>
            </div>
            <div id="${gid}" style="display:none">
                <table ${tableStyle} style="margin-bottom:0">${colGroup}${thead}<tbody>${members.map(rowHtml).join('')}</tbody></table>
            </div>`;
        }).join('');
    }
}

function avatarColor(name) {
    const colors = ['#4f46e5','#07B0E4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];
    let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h<<5)-h);
    return colors[Math.abs(h) % colors.length];
}

let _roleMapCache = {};
let _activePanelUserId = null;
let _usersSort = 'xp';
let _usersGroupBySchool = false;
let _usersFilterQ = '';

function setUsersSort(key) {
    _usersSort = key;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sort' + key.charAt(0).toUpperCase() + key.slice(1) + 'Btn')?.classList.add('active');
    _applyUsersView();
}

function toggleGroupSchool() {
    _usersGroupBySchool = !_usersGroupBySchool;
    document.getElementById('groupSchoolBtn')?.classList.toggle('active', _usersGroupBySchool);
    _applyUsersView();
}

function filterUsers(q) {
    _usersFilterQ = q;
    _applyUsersView();
}

function _applyUsersView() {
    const courses = _coursesList.length ? _coursesList : STATIC_COURSES;
    let users = _usersCache;

    // Filtro de búsqueda
    if (_usersFilterQ.trim()) {
        const ql = _usersFilterQ.toLowerCase();
        users = users.filter(p =>
            getName(p).toLowerCase().includes(ql)  ||
            getEmail(p).toLowerCase().includes(ql) ||
            getSchool(p).toLowerCase().includes(ql)||
            getDept(p).toLowerCase().includes(ql)
        );
    }

    // Ordenar
    const _lastAccess = p => p.updated_at ? new Date(p.updated_at).getTime() : 0;
    users = [...users].sort((a, b) => {
        if (_usersSort === 'xp')   return (b.xp||0) - (a.xp||0);
        if (_usersSort === 'cert') {
            const ca = courses.filter(c => hasCourseExamPassed(a, c.id)).length;
            const cb = courses.filter(c => hasCourseExamPassed(b, c.id)).length;
            return cb - ca || (b.xp||0) - (a.xp||0);
        }
        if (_usersSort === 'access') return _lastAccess(b) - _lastAccess(a);
        if (_usersSort === 'active') {
            // Activos (7d) primero, luego por acceso más reciente
            const aa = isActive7d(a) ? 1 : 0, ab = isActive7d(b) ? 1 : 0;
            return ab - aa || _lastAccess(b) - _lastAccess(a);
        }
        return getName(a).localeCompare(getName(b), 'es');
    });

    renderUsersTable(users, _roleMapCache, _usersGroupBySchool);
}

// ── Panel lateral docente ─────────────────────────────────
function openUserPanel(userId) {
    const p = _usersCache.find(u => u.user_id === userId);
    if (!p) return;
    _activePanelUserId = userId;

    const name = getName(p);
    const color = avatarColor(name);
    const courses = _coursesList.length ? _coursesList : STATIC_COURSES;

    // Header
    const av = document.getElementById('panelAvatar');
    if (av) { av.textContent = name.charAt(0).toUpperCase(); av.style.background = color; }
    setText('panelName', name);
    setText('panelEmail', getEmail(p));
    setText('panelXP', fmt(p.xp||0));
    setText('panelStreak', (p.streak||0)+'d');
    setText('panelCards', fmt(p.completed_cards?.length||0));
    setText('panelDept', getDept(p) || 'No especificado');
    setText('panelLastAccess', fmtDateTime(p.updated_at));

    // Badges de estado
    const badgesEl = document.getElementById('panelBadges');
    if (badgesEl) {
        const isActive = isActive7d(p);
        const role = _roleMapCache[userId] || 'student';
        const roleBadge = role==='admin' ? '<span class="badge tag-violet">Admin</span>'
            : role==='coordinator' ? '<span class="badge tag-blue">Coordinador</span>'
            : '<span class="badge tag-slate">Docente</span>';
        badgesEl.innerHTML = (isActive ? '<span class="badge tag-green">Activo</span>' : '<span class="badge tag-slate">Inactivo</span>') + roleBadge;
    }

    // Rol select
    const roleEl = document.getElementById('panelRoleSelect');
    if (roleEl) roleEl.value = _roleMapCache[userId] || 'student';

    // Escuela select
    const schoolEl = document.getElementById('panelSchoolSelect');
    if (schoolEl) {
        schoolEl.innerHTML = '<option value="">— Sin centro —</option>' +
            _schools.map(s => `<option value="${s.id}" ${_userSchoolMap[userId]===s.id?'selected':''}>${esc(s.name)}</option>`).join('');
    }

    // Logros desbloqueados
    const logrosEl = document.getElementById('panelLogros');
    if (logrosEl) {
        const userBadges = p.badges || [];
        if (userBadges.length === 0) {
            logrosEl.innerHTML = '<span class="text-slate-400 text-xs">Sin logros aún</span>';
        } else {
            const BADGE_DEFS = {
                firstCard:'🌱',module1:'📘',module2:'🔧',module3:'🧠',module4:'📊',module5:'⭐',
                quizMaster:'🎯',quiz25:'🏹',perfect10:'💎',feedbackGiver:'💬',examPass:'🎓',
                allModules:'🏆',streak7:'🔥',streak30:'⚡',streak3:'✨',earlyBird:'🌅',
                noteWriter:'📝',applied5:'🍎',weeklyChamp:'🥇',level5:'🌟',level10:'💫'
            };
            const BADGE_NAMES = {
                firstCard:'Primer paso',module1:'Primer módulo',module2:'En profundidad',
                module3:'Metodólogo',module4:'Aplicador',module5:'Experto local',
                quizMaster:'Maestro de quizzes',quiz25:'Imparable',perfect10:'Perfeccionista',
                feedbackGiver:'Tu voz importa',examPass:'Certificado STEAM',allModules:'STEAM Master',
                streak7:'Racha 7d',streak30:'Leyenda',streak3:'Constante',earlyBird:'Madrugadora',
                noteWriter:'Apuntes de oro',applied5:'Docente en acción',weeklyChamp:'Campeón semanal',
                level5:'Nivel 5',level10:'Nivel 10'
            };
            logrosEl.innerHTML = userBadges.map(b =>
                `<span title="${BADGE_NAMES[b]||b}" style="display:inline-flex;align-items:center;gap:4px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:600;color:#334155">
                    ${BADGE_DEFS[b]||'🏅'} ${BADGE_NAMES[b]||b}
                </span>`
            ).join('');
        }
    }

    // Diagnóstico
    const diagEl = document.getElementById('panelDiag');
    if (diagEl) {
        const diag = p?.daily_missions?.diagResult;
        const diagStyles = {
            inicial:       { bg:'#fee2e2', color:'#991b1b', label:'Inicial' },
            proceso:       { bg:'#fef3c7', color:'#92400e', label:'En proceso' },
            satisfactorio: { bg:'#dcfce7', color:'#166534', label:'Satisfactorio' },
            destacado:     { bg:'#f3e8ff', color:'#6b21a8', label:'Destacado' },
        };
        const ds = diag?.level ? diagStyles[diag.level] : null;
        diagEl.innerHTML = ds
            ? `<span class="badge" style="background:${ds.bg};color:${ds.color}">${ds.label}</span>`
            : '<span class="text-slate-400 text-sm">No completado</span>';
    }

    // Progreso por curso
    const coursesEl = document.getElementById('panelCourses');
    if (coursesEl) {
        coursesEl.innerHTML = courses.map(c => {
            const passed = hasCourseExamPassed(p, c.id);
            const started = hasCourseStarted(p, c.id);
            const pct = getProgressPct(p, c.id);
            const barColor = passed ? '#10b981' : pct >= 40 ? '#07B0E4' : '#f59e0b';
            const shortT = c.title.length > 32 ? c.title.substring(0,31)+'…' : c.title;
            return `<div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-semibold text-slate-700">${esc(shortT)}</span>
                    ${passed ? '<span class="badge tag-green" style="font-size:9px">✓ Cert.</span>'
                        : started ? `<span class="text-xs font-bold" style="color:${barColor}">${pct}%</span>`
                        : '<span class="text-slate-300 text-xs">Sin iniciar</span>'}
                </div>
                ${started || passed ? `<div style="background:#f1f5f9;border-radius:4px;height:5px">
                    <div style="width:${passed?100:pct}%;background:${barColor};height:100%;border-radius:4px;transition:width .4s"></div>
                </div>` : ''}
            </div>`;
        }).join('');
    }

    // Mostrar panel
    document.getElementById('userPanelOverlay')?.classList.remove('hidden');
    const panel = document.getElementById('userPanel');
    if (panel) { panel.style.transform = 'translateX(0)'; }
}

function closeUserPanel() {
    _activePanelUserId = null;
    document.getElementById('userPanelOverlay')?.classList.add('hidden');
    const panel = document.getElementById('userPanel');
    if (panel) panel.style.transform = 'translateX(100%)';
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

async function changePanelRole(role) {
    if (!_activePanelUserId) return;
    await changeUserRole(_activePanelUserId, role);
    _roleMapCache[_activePanelUserId] = role;
    renderUsersTable(_usersCache, _roleMapCache);
}

async function changePanelSchool(schoolId) {
    if (!_activePanelUserId) return;
    await assignTeacherSchool(_activePanelUserId, schoolId);
}

async function deletePanelUser() {
    if (!_activePanelUserId) return;
    const p = _usersCache.find(u => u.user_id === _activePanelUserId);
    if (!confirm(`¿Eliminar permanentemente a ${getName(p)}? Esta acción no se puede deshacer.`)) return;
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    const EDGE_URL = `${sb.supabaseUrl}/functions/v1/admin-users`;
    const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'deleteUser', userId: _activePanelUserId })
    });
    const json = await res.json();
    if (!res.ok) { toast('Error: ' + (json.error || res.status), false); return; }
    toast(`Docente eliminado.`);
    closeUserPanel();
    loadUsers();
}

function showInviteModal() {
    const existing = document.getElementById('inviteModal');
    if (existing) existing.remove();
    const m = document.createElement('div');
    m.id = 'inviteModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    m.innerHTML = `
    <div style="background:white;border-radius:20px;width:100%;max-width:400px;padding:28px 24px">
        <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:6px">Invitar docente</h3>
        <p style="font-size:13px;color:#64748b;margin-bottom:20px">Se enviará un correo con enlace de acceso a la plataforma.</p>
        <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Correo electrónico</label>
        <input id="inviteEmail" type="email" placeholder="docente@escuela.edu.gt"
            style="width:100%;border:1.5px solid #e2e8f0;border-radius:12px;padding:10px 14px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:6px">
        <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px;margin-top:12px">Rol inicial</label>
        <select id="inviteRole" style="width:100%;border:1.5px solid #e2e8f0;border-radius:12px;padding:10px 14px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:20px">
            <option value="student">Docente</option>
            <option value="coordinator">Coordinador</option>
            <option value="admin">Admin</option>
        </select>
        <div style="display:flex;gap:10px">
            <button onclick="document.getElementById('inviteModal').remove()"
                style="flex:1;padding:11px;border-radius:12px;border:1.5px solid #e2e8f0;background:white;color:#64748b;font-weight:600;font-size:14px;cursor:pointer">
                Cancelar
            </button>
            <button onclick="_doInvite()"
                style="flex:1;padding:11px;border-radius:12px;border:none;background:#5C35C5;color:white;font-weight:700;font-size:14px;cursor:pointer">
                Enviar invitación
            </button>
        </div>
    </div>`;
    document.body.appendChild(m);
    document.getElementById('inviteEmail').focus();
}

async function _doInvite() {
    const email = document.getElementById('inviteEmail')?.value.trim();
    const role  = document.getElementById('inviteRole')?.value || 'student';
    if (!email || !email.includes('@')) { toast('Ingresa un correo válido', 'error'); return; }
    document.getElementById('inviteModal').remove();
    await inviteUser(email, role);
}

// ────────────────────────────────────────────────────────────
// FEEDBACK
// ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
// COMENTARIOS EN TARJETAS
// ══════════════════════════════════════════════════════════════
let _allAdminComments = [];
let _adminCommentsPage = 0;
const _COMMENTS_PER_PAGE = 25;

async function loadAdminComments() {
    const listEl = document.getElementById('adminCommentsList');
    if (!listEl) return;
    listEl.innerHTML = `<div class="card text-center text-slate-400 py-8">Cargando comentarios…</div>`;
    _adminCommentsPage = 0;

    const { data, error } = await sb
        .from('card_comments')
        .select('id, user_id, card_id, module_id, comment, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

    if (error || !data) { listEl.innerHTML = `<div class="card text-center text-slate-400 py-8">Error al cargar: ${error?.message}</div>`; return; }

    _allAdminComments = data;

    // KPIs
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = data.filter(c => new Date(c.created_at) >= weekAgo).length;
    const uniqueUsers = new Set(data.map(c => c.user_id)).size;
    const uniqueCards = new Set(data.map(c => c.card_id)).size;
    document.getElementById('cTotal').textContent = data.length;
    document.getElementById('cUsers').textContent = uniqueUsers;
    document.getElementById('cCards').textContent = uniqueCards;
    document.getElementById('cWeek').textContent  = thisWeek;

    // Badge en sidebar
    const badge = document.getElementById('commentsBadge');
    if (badge && thisWeek > 0) { badge.textContent = thisWeek; badge.style.display = 'inline-block'; }

    // Poblar filtro de cursos a partir de los card_id (formato "módulo-índice" o número)
    const courseFilter = document.getElementById('commentsFilterCourse');
    if (courseFilter && courseFilter.options.length <= 1) {
        (STATIC_COURSES || []).forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id; opt.textContent = c.title;
            courseFilter.appendChild(opt);
        });
    }

    // Cargar nombres de usuarios
    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await sb.from('progress')
        .select('user_id, email, daily_missions')
        .in('user_id', userIds);
    const _nameMap = {};
    (profiles || []).forEach(p => {
        _nameMap[p.user_id] = p.daily_missions?.fullName || p.email?.split('@')[0] || 'Docente';
    });
    _allAdminComments = data.map(c => ({ ...c, _userName: _nameMap[c.user_id] || 'Docente' }));

    _renderAdminComments();
}

function _getCardLabel(cardId) {
    // cardId puede ser número (id de tarjeta) o string "modulo-indice"
    if (!cardId) return `Tarjeta ${cardId}`;
    // Buscar por ID numérico en allCourses
    if (typeof allCourses !== 'undefined') {
        for (const course of allCourses) {
            for (const mod of (course.modules || [])) {
                const card = (mod.cards || []).find(c => String(c.id) === String(cardId));
                if (card) return `${card.title || cardId} — ${mod.title || ''}`;
            }
        }
    }
    return `Tarjeta ${cardId}`;
}

function _renderAdminComments(filtered) {
    const listEl = document.getElementById('adminCommentsList');
    const moreEl = document.getElementById('adminCommentsLoadMore');
    if (!listEl) return;

    const src = filtered ?? _allAdminComments;
    const page = src.slice(0, (_adminCommentsPage + 1) * _COMMENTS_PER_PAGE);

    if (!src.length) {
        listEl.innerHTML = `<div class="card text-center text-slate-400 py-8">No hay comentarios aún.</div>`;
        if (moreEl) moreEl.classList.add('hidden');
        return;
    }

    listEl.innerHTML = page.map(c => {
        const date = new Date(c.created_at);
        const dateStr = date.toLocaleDateString('es', { day:'numeric', month:'short', year:'numeric' });
        const timeStr = date.toLocaleTimeString('es', { hour:'2-digit', minute:'2-digit' });
        const cardLabel = _getCardLabel(c.card_id);
        const initial = esc((c._userName || 'D')[0].toUpperCase());

        return `
        <div class="card hover:shadow-md transition-shadow" style="border-left:3px solid #6366f1">
            <div class="flex items-start gap-3">
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a5b4fc);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0">
                    ${initial}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                        <span class="font-bold text-sm text-slate-800">${esc(c._userName)}</span>
                        <span class="text-[10px] text-slate-400">${dateStr} · ${timeStr}</span>
                    </div>
                    <p class="text-sm text-slate-700 leading-relaxed mb-2">${esc(c.comment)}</p>
                    <div class="flex items-center gap-1.5">
                        <span style="background:#eef2ff;color:#4f46e5;font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px">
                            📍 ${cardLabel}
                        </span>
                        ${c.module_id ? `<span style="background:#f0fdf4;color:#16a34a;font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px">Módulo ${c.module_id}</span>` : ''}
                    </div>
                </div>
                <button onclick="deleteAdminComment('${c.id}')" title="Eliminar" style="flex-shrink:0;background:none;border:none;color:#cbd5e1;cursor:pointer;padding:4px;border-radius:6px;transition:.15s" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#cbd5e1'">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        </div>`;
    }).join('');

    if (moreEl) moreEl.classList.toggle('hidden', page.length >= src.length);
}

function filterAdminComments() {
    const q     = (document.getElementById('commentsSearch')?.value || '').toLowerCase();
    const course = document.getElementById('commentsFilterCourse')?.value || '';
    _adminCommentsPage = 0;

    let filtered = _allAdminComments;
    if (q) filtered = filtered.filter(c =>
        c.comment?.toLowerCase().includes(q) ||
        c._userName?.toLowerCase().includes(q) ||
        String(c.card_id).toLowerCase().includes(q)
    );
    if (course) {
        // Filtrar por curso usando los IDs reales de data.js (cubre los 12 cursos)
        filtered = filtered.filter(c => _cardBelongsTo(course, c.card_id));
    }

    _renderAdminComments(filtered);
}

function loadMoreAdminComments() {
    _adminCommentsPage++;
    _renderAdminComments();
}

async function deleteAdminComment(commentId) {
    if (!confirm('¿Eliminar este comentario?')) return;
    const { error } = await sb.from('card_comments').delete().eq('id', commentId);
    if (error) { toast('Error al eliminar: ' + error.message, false); return; }
    _allAdminComments = _allAdminComments.filter(c => c.id !== commentId);
    document.getElementById('cTotal').textContent = _allAdminComments.length;
    _renderAdminComments();
    toast('Comentario eliminado');
}

async function loadFeedback() {
    const { data:fbRaw, error } = await sb.from('feedback').select('*').order('created_at',{ascending:false});
    if (error || !fbRaw) { empty('feedbackList','Error al cargar feedback.'); return; }

    // Build name map from progress cache
    const nameMap = {};
    _allProgress.forEach(p => { if (p.user_id) nameMap[p.user_id] = { name: getName(p), email: getEmail(p) }; });

    // Excluir admins de KPIs, gráficos y listado
    const _adminSet = new Set(ADMIN_EMAILS.map(e => e.toLowerCase()));
    const fb = fbRaw.filter(f => !_adminSet.has((nameMap[f.user_id]?.email || '').toLowerCase()));

    document.getElementById('fbTotal').textContent = fb.length || 0;

    if (fb.length) {
        const promoters  = fb.filter(f=>f.nps>=9).length;
        const detractors = fb.filter(f=>f.nps<=6).length;
        const nps = Math.round(((promoters-detractors)/fb.length)*100);
        document.getElementById('fbNps').textContent = nps;
        const avgRating = (fb.reduce((a,f)=>a+(f.rating||0),0)/fb.length).toFixed(1);
        document.getElementById('fbRating').textContent = avgRating+' / 5';

        // NPS distribution chart
        const npsBuckets = { 'Promotores (9-10)': promoters, 'Neutros (7-8)': fb.filter(f=>f.nps>=7&&f.nps<=8).length, 'Detractores (0-6)': detractors };
        buildChart('nps', document.getElementById('npsChart')?.getContext('2d'), {
            type:'doughnut',
            data:{ labels: Object.keys(npsBuckets),
                datasets:[{data:Object.values(npsBuckets),backgroundColor:['#34d399','#fbbf24','#f87171'],borderWidth:2,borderColor:'#fff'}]},
            options:{ plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:12}}},cutout:'60%' }
        });

        // Rating por módulo — agrupa por module_name (título real, distingue el curso)
        // con fallback a "Módulo N" para registros antiguos sin nombre
        const modRating = {};
        fb.forEach(f => {
            const name = (f.module_name || '').trim();
            const k = name || (f.module_id ? `Módulo ${f.module_id}` : 'General');
            if (!modRating[k]) modRating[k] = [];
            modRating[k].push(f.rating||0);
        });
        // Ordenar por cantidad de respuestas (los módulos con más feedback arriba)
        const modKeys = Object.keys(modRating).sort((a,b) => modRating[b].length - modRating[a].length);
        const modAvg  = modKeys.map(k => (modRating[k].reduce((a,b)=>a+b,0)/modRating[k].length).toFixed(1));
        const modN    = modKeys.map(k => modRating[k].length);
        buildChart('rating', document.getElementById('ratingChart')?.getContext('2d'), {
            type:'bar',
            data:{ labels:modKeys.map(k => k.length > 34 ? k.substring(0,32)+'…' : k),
                datasets:[{label:'Rating promedio',data:modAvg,backgroundColor:'#fbbf24',borderRadius:8,borderSkipped:false}]},
            options:{ indexAxis:'y', plugins:{
                    legend:{display:false},
                    tooltip:{ callbacks:{
                        title: items => modKeys[items[0].dataIndex],
                        label: item => `Rating promedio: ${item.raw} · ${modN[item.dataIndex]} respuesta${modN[item.dataIndex]===1?'':'s'}`
                    } } },
                scales:{ x:{beginAtZero:true,max:5,ticks:{font:{size:10}}},y:{grid:{display:false},ticks:{font:{size:9}}} } }
        });
    } else {
        ['fbNps','fbRating'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent='N/A'; });
    }

    const list = document.getElementById('feedbackList');
    if (!list) return;
    if (!fb.length) { list.innerHTML='<div class="card text-center text-slate-400 py-8 text-sm">No hay feedback registrado aún.</div>'; return; }

    // Group by user_id (fb ya excluye admins)
    const byUser = {};
    fb.forEach(f => {
        const key = f.user_id || '__anon__';
        if (!byUser[key]) byUser[key] = { user_id: f.user_id, items: [] };
        byUser[key].items.push(f);
    });

    const userGroups = Object.values(byUser).sort((a,b) => b.items.length - a.items.length);

    list.innerHTML = userGroups.map((ug, idx) => {
        const info   = nameMap[ug.user_id] || { name: 'Docente anónimo', email: '' };
        const count  = ug.items.length;
        const avgRat = ug.items.reduce((a,f)=>a+(f.rating||0),0) / count;
        const avgNps = ug.items.filter(f=>f.nps!==null).reduce((a,f)=>a+(f.nps||0),0) / (ug.items.filter(f=>f.nps!==null).length||1);
        const npsColor = avgNps>=9?'tag-green':avgNps>=7?'tag-amber':'tag-red';
        const npsLabel = avgNps>=9?'Promotor':avgNps>=7?'Neutro':'Detractor';
        return `
        <div class="card" style="margin-bottom:8px">
            <div class="flex items-center justify-between gap-3 cursor-pointer select-none" onclick="toggleFeedbackUser('fbu-${idx}','fchev-${idx}')">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                        ${esc(info.name.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <p class="font-semibold text-slate-800 text-sm">${esc(info.name)}</p>
                        <p class="text-xs text-slate-400">${esc(info.email)} · <strong>${count}</strong> respuesta${count!==1?'s':''}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="badge tag-amber"><i class="fas fa-star"></i> ${avgRat.toFixed(1)}/5</span>
                    <span class="badge ${npsColor}">${npsLabel}</span>
                    <i id="fchev-${idx}" class="fas fa-chevron-down text-slate-300 text-xs transition-transform duration-200"></i>
                </div>
            </div>
            <div id="fbu-${idx}" class="hidden mt-4 space-y-3 border-t border-slate-50 pt-4">
                ${ug.items.map(f=>`
                <div class="bg-slate-50 rounded-xl p-3">
                    <div class="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span class="font-semibold text-slate-700 text-sm">${f.module_name || (f.module_id ? `Módulo ${f.module_id}` : 'General')}</span>
                        <div class="flex gap-2 flex-wrap">
                            ${f.rating ? `<span class="badge tag-amber"><i class="fas fa-star"></i> ${f.rating}/5</span>` : ''}
                            ${f.nps !== null ? `<span class="badge tag-blue">NPS: ${f.nps}</span>` : ''}
                            <span class="badge ${f.nps>=9?'tag-green':f.nps>=7?'tag-amber':'tag-red'}" style="font-size:9px">${f.nps>=9?'Promotor':f.nps>=7?'Neutro':'Detractor'}</span>
                        </div>
                    </div>
                    ${f.comment ? `<p class="text-xs text-slate-600 italic mt-1">"${esc(f.comment)}"</p>` : ''}
                    <p class="text-[10px] text-slate-400 mt-1">${fmtDateTime(f.created_at)}</p>
                </div>`).join('')}
            </div>
        </div>`;
    }).join('');
}

function toggleFeedbackUser(panelId, chevId) {
    const panel = document.getElementById(panelId);
    const chev  = document.getElementById(chevId);
    if (!panel) return;
    const isHidden = panel.classList.toggle('hidden');
    if (chev) chev.style.transform = isHidden ? '' : 'rotate(180deg)';
}

// ────────────────────────────────────────────────────────────
// CMS — GESTIÓN DE CURSOS
// ────────────────────────────────────────────────────────────
async function loadCMS() {
    const cont = document.getElementById('cmsCoursesList');
    if (!cont) return;
    cont.innerHTML = '<div class="loader"><i class="fas fa-circle-notch fa-spin"></i> Cargando cursos…</div>';

    const { data: dbCourses } = await sb.from('courses').select('*').order('created_at',{ascending:false});

    // Estáticos primero, luego los de BD
    const staticCards = STATIC_COURSES.map(c => ({...c, isStatic:true}));
    const allCourses  = [...staticCards, ...(dbCourses||[])];

    const enrolled = {};
    _allProgress.forEach(p => {
        STATIC_COURSES.forEach(c => {
            if ((p.completed_cards||[]).some(id => _cardBelongsTo(c.id, id))) {
                enrolled[c.id] = (enrolled[c.id]||0)+1;
            }
        });
    });

    cont.innerHTML = allCourses.map(c => {
        const isStatic = !!c.isStatic;
        const docentes = enrolled[c.id] || 0;
        const statusBadge = (c.status==='available'||isStatic)
            ? '<span class="badge tag-green">Disponible</span>'
            : '<span class="badge tag-slate">Próximamente</span>';
        return `<div class="card">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shrink-0"
                     style="background:${c.color||'#4f46e5'}">
                    ${isStatic
    ? '<i class="fas fa-book-open text-white text-xl"></i>'
    : '<i class="fas fa-graduation-cap text-white text-xl"></i>'}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                        <h3 class="font-bold text-slate-800">${c.title}</h3>
                        ${statusBadge}
                        ${isStatic ? '<span class="badge tag-blue">Programa base</span>' : '<span class="badge tag-violet">Personalizado</span>'}
                    </div>
                    ${c.subtitle ? `<p class="text-xs text-slate-500 mb-1">${c.subtitle}</p>` : ''}
                    ${c.description ? `<p class="text-xs text-slate-500 mb-1">${c.description}</p>` : ''}
                    <div class="flex gap-4 text-xs text-slate-400 mt-1">
                        <span><i class="fas fa-users mr-1"></i>${docentes} docentes</span>
                        ${c.durationHours ? `<span><i class="fas fa-clock mr-1"></i>${c.durationHours}h</span>` : ''}
                        ${c.totalCards || c.modules ? `<span><i class="fas fa-cards-blank mr-1"></i>${c.totalCards||'—'} tarjetas</span>` : ''}
                        ${isStatic ? '<span class="text-amber-600"><i class="fas fa-lock mr-1"></i>Contenido en data.js</span>' : ''}
                    </div>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button data-cid="${c.id}" data-static="${isStatic}" class="edit-cms-btn btn-secondary text-xs">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${!isStatic ? `<button data-cid="${c.id}" class="delete-cms-btn btn-danger text-xs">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.edit-cms-btn').forEach(btn =>
        btn.addEventListener('click', () => openCMSModal(btn.dataset.cid, btn.dataset.static==='true'))
    );
    document.querySelectorAll('.delete-cms-btn').forEach(btn =>
        btn.addEventListener('click', () => deleteCourse(btn.dataset.cid))
    );
}

async function deleteCourse(id) {
    if (!confirm('¿Eliminar este curso? Esta acción no se puede deshacer.')) return;
    const { error } = await sb.from('courses').delete().eq('id', id);
    if (error) { toast('Error al eliminar: '+error.message, false); return; }
    toast('Curso eliminado.');
    loadCMS();
}

// ── CMS Modal ────────────────────────────────────────────────
async function openCMSModal(courseId=null, isStatic=false) {
    _cmsState = { step:1, courseId, isStatic, data:{ modules:[] } };
    cmsGoStep(1);

    const modal = document.getElementById('cmsModal');
    const titleEl = document.getElementById('cmsModalTitle');
    const subEl   = document.getElementById('cmsModalSubtitle');
    const warn    = document.getElementById('csStaticWarning');

    if (courseId) {
        titleEl.textContent = 'Editar Curso';
        subEl.textContent   = isStatic ? 'Editando metadatos del curso base' : 'Editando curso personalizado';
        warn?.classList.toggle('hidden', !isStatic);

        if (isStatic) {
            // Cargar metadatos del curso estático
            const sc = STATIC_COURSES.find(c=>c.id===courseId)||{};
            document.getElementById('csTitle').value    = sc.title||'';
            document.getElementById('csId').value       = sc.id||'';
            document.getElementById('csId').disabled    = true;
            document.getElementById('csSubtitle').value = sc.subtitle||'';
            document.getElementById('csColor').value    = sc.color||'#4f46e5';
            document.getElementById('csColorPicker').value = sc.color||'#4f46e5';
            document.getElementById('csDuration').value = sc.durationHours||'';
            document.getElementById('csStatus').value   = 'available';
        } else {
            // Cargar desde BD
            const { data } = await sb.from('courses').select('*').eq('id', courseId).maybeSingle();
            if (data) {
                document.getElementById('csTitle').value    = data.title||'';
                document.getElementById('csId').value       = data.id||'';
                document.getElementById('csId').disabled    = true;
                document.getElementById('csSubtitle').value = data.subtitle||'';
                document.getElementById('csColor').value    = data.color||'#4f46e5';
                document.getElementById('csColorPicker').value = data.color||'#4f46e5';
                document.getElementById('csDuration').value = data.duration_hours||'';
                document.getElementById('csStatus').value   = data.status||'available';
                if (data.content) {
                    _cmsState.data = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
                }
            }
        }
    } else {
        titleEl.textContent = 'Nuevo Curso';
        subEl.textContent   = 'Se guardará en Supabase y estará disponible en la app';
        warn?.classList.add('hidden');
        document.getElementById('csId').disabled = false;
        document.getElementById('cmsModal').querySelector('form') && document.getElementById('cmsModal').querySelector('form').reset();
        ['csTitle','csId','csSubtitle','csDuration'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
        document.getElementById('csColor').value = '#4f46e5';
        document.getElementById('csColorPicker').value = '#4f46e5';
        document.getElementById('csStatus').value = 'available';
    }

    renderModulesEditor();
    modal.classList.remove('hidden');
}

function cmsGoStep(n) {
    _cmsState.step = n;
    document.querySelectorAll('.cms-step').forEach(el => el.classList.remove('active'));
    const stepEl = document.getElementById(`cmsStep${n}`);
    if (stepEl) stepEl.classList.add('active');

    document.querySelectorAll('.cms-tab-btn').forEach(btn => {
        const active = parseInt(btn.dataset.step) === n;
        btn.classList.toggle('border-indigo-500',active);
        btn.classList.toggle('text-indigo-600',active);
        btn.classList.toggle('border-transparent',!active);
        btn.classList.toggle('text-slate-400',!active);
    });

    const prev = document.getElementById('cmsPrevBtn');
    const next = document.getElementById('cmsNextBtn');
    const save = document.getElementById('cmsSaveBtn');
    if (prev) prev.classList.toggle('hidden', n===1);
    if (next) next.classList.toggle('hidden', n===3);
    if (save) save.classList.toggle('hidden', n!==3);

    if (n===2) renderModulesEditor();
    if (n===3) renderModuleSelector();
}

function cmsStepNav(dir) {
    const newStep = _cmsState.step + dir;
    if (newStep<1||newStep>3) return;
    if (dir>0 && _cmsState.step===1) {
        if (!document.getElementById('csTitle').value.trim() || !document.getElementById('csId').value.trim()) {
            showCmsError('El título y el ID son obligatorios.'); return;
        }
        hideCmsError();
    }
    cmsGoStep(newStep);
}

function showCmsError(msg) { const e=document.getElementById('cmsError'); if(e){e.textContent=msg;e.classList.remove('hidden');} }
function hideCmsError()    { const e=document.getElementById('cmsError'); if(e) e.classList.add('hidden'); }

// ── Módulos ──────────────────────────────────────────────────
function renderModulesEditor() {
    const cont = document.getElementById('modulesEditor');
    const msg  = document.getElementById('noModulesMsg');
    if (!cont) return;
    const modules = _cmsState.data.modules || [];
    if (msg) msg.style.display = modules.length ? 'none' : 'block';
    cont.innerHTML = modules.map((m,i) => `
        <div class="module-item">
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-slate-400 w-6">M${i+1}</span>
                <input class="input-field text-sm flex-1" value="${m.title||''}"
                    oninput="_cmsState.data.modules[${i}].title=this.value" placeholder="Título del módulo">
                <button onclick="removeModule(${i})" class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-times"></i></button>
            </div>
            <p class="text-xs text-slate-400 mt-2 ml-9">${m.cards?.length||0} tarjetas</p>
        </div>`).join('');
}

function addModule() {
    if (!_cmsState.data.modules) _cmsState.data.modules = [];
    _cmsState.data.modules.push({ id: `m${_cmsState.data.modules.length+1}`, title:'Nuevo módulo', cards:[] });
    renderModulesEditor();
}

function removeModule(idx) {
    if (!confirm('¿Eliminar este módulo y todas sus tarjetas?')) return;
    _cmsState.data.modules.splice(idx,1);
    renderModulesEditor();
}

// ── Tarjetas ─────────────────────────────────────────────────
function renderModuleSelector() {
    const sel = document.getElementById('moduleSelector');
    if (!sel) return;
    const modules = _cmsState.data.modules || [];
    sel.innerHTML = '<option value="">Selecciona un módulo</option>' +
        modules.map((m,i)=>`<option value="${i}">${m.title||`Módulo ${i+1}`}</option>`).join('');
    document.getElementById('noCardsMsg').textContent = 'Selecciona un módulo para ver sus tarjetas.';
    document.getElementById('cardsEditor').innerHTML = '';
}

function loadModuleCards(modIdx) {
    _currentModuleIdx = parseInt(modIdx);
    const cont = document.getElementById('cardsEditor');
    const msg  = document.getElementById('noCardsMsg');
    if (isNaN(_currentModuleIdx)||_currentModuleIdx<0) { cont.innerHTML=''; return; }
    const cards = _cmsState.data.modules[_currentModuleIdx]?.cards || [];
    if (msg) msg.style.display = cards.length ? 'none' : 'block';
    cont.innerHTML = cards.map((c,i)=>`
        <div class="card-item">
            <span class="card-type-badge type-${c.type||'content'}">${{content:'Contenido',quiz:'Quiz',project:'Proyecto',simulation:'Simulación'}[c.type]||c.type}</span>
            <span class="text-sm text-slate-700 flex-1 truncate">${c.title||'Sin título'}</span>
            <button onclick="editCard(${_currentModuleIdx},${i})" class="text-indigo-400 hover:text-indigo-600 p-1 text-xs"><i class="fas fa-edit"></i></button>
            <button onclick="removeCard(${_currentModuleIdx},${i})" class="text-red-400 hover:text-red-600 p-1 text-xs"><i class="fas fa-times"></i></button>
        </div>`).join('');
    if (msg && cards.length) msg.style.display='none';
}

function addCard() {
    if (_currentModuleIdx<0||isNaN(_currentModuleIdx)) { toast('Selecciona un módulo primero.',false); return; }
    const cards = _cmsState.data.modules[_currentModuleIdx].cards;
    const newCard = { id:`card-${Date.now()}`, type:'content', title:'Nueva tarjeta', content:'', extra:'' };
    cards.push(newCard);
    loadModuleCards(_currentModuleIdx);
    editCard(_currentModuleIdx, cards.length-1);
}

function removeCard(modIdx, cardIdx) {
    _cmsState.data.modules[modIdx].cards.splice(cardIdx,1);
    loadModuleCards(modIdx);
}

function editCard(modIdx, cardIdx) {
    const card = _cmsState.data.modules[modIdx]?.cards?.[cardIdx];
    if (!card) return;
    document.getElementById('ceModuleIdx').value = modIdx;
    document.getElementById('ceCardIdx').value   = cardIdx;
    document.getElementById('ceType').value      = card.type||'content';
    document.getElementById('ceTitle').value     = card.title||'';
    document.getElementById('cardEditorTitle').textContent = `Editar tarjeta — Módulo ${modIdx+1}`;
    updateCardEditorFields(card);
    document.getElementById('cardEditorModal').classList.remove('hidden');
}

function updateCardEditorFields(card=null) {
    const type  = document.getElementById('ceType')?.value || 'content';
    const cont  = document.getElementById('ceContentFields');
    if (!cont) return;

    const val = f => card?.[f] || '';
    const optVal = (card?.options||['','','','']).map(o=>o||'');

    if (type==='content') {
        cont.innerHTML = `
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Contenido principal *</label>
            <textarea id="ceContent" rows="4" class="input-field" placeholder="Explicación de la tarjeta…">${val('content')}</textarea></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Extra / Dato curioso</label>
            <textarea id="ceExtra" rows="2" class="input-field" placeholder="Información complementaria…">${val('extra')}</textarea></div>`;
    } else if (type==='quiz') {
        cont.innerHTML = `
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Pregunta *</label>
            <textarea id="ceQuestion" rows="2" class="input-field" placeholder="¿Pregunta de opción múltiple?">${val('question')}</textarea></div>
            ${[0,1,2,3].map(i=>`
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Opción ${i+1}</label>
            <input id="ceOpt${i}" class="input-field" placeholder="Opción ${i+1}" value="${optVal[i]}"></div>`).join('')}
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Opción correcta (0-3)</label>
            <select id="ceCorrect" class="input-field">
                ${[0,1,2,3].map(i=>`<option value="${i}" ${val('correct')==i?'selected':''}>${i+1}ª opción</option>`).join('')}
            </select></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Explicación</label>
            <textarea id="ceExplanation" rows="2" class="input-field" placeholder="Por qué es correcta…">${val('explanation')}</textarea></div>`;
    } else if (type==='project') {
        cont.innerHTML = `
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Descripción del proyecto *</label>
            <textarea id="ceContent" rows="4" class="input-field" placeholder="Descripción del proyecto…">${val('content')}</textarea></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Objetivo / Instrucciones</label>
            <textarea id="ceExtra" rows="2" class="input-field" placeholder="Instrucciones para el docente…">${val('extra')}</textarea></div>`;
    } else if (type==='simulation') {
        cont.innerHTML = `
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Escenario *</label>
            <textarea id="ceScenario" rows="3" class="input-field" placeholder="Describe el escenario de simulación…">${val('scenario')}</textarea></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Enunciado (afirmación)</label>
            <textarea id="ceStatement" rows="2" class="input-field" placeholder="Afirmación a evaluar…">${val('statement')}</textarea></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Respuesta correcta</label>
            <select id="ceCorrectSwipe" class="input-field">
                <option value="right" ${val('correctSwipe')==='right'?'selected':''}>Correcto / Verdadero (deslizar derecha)</option>
                <option value="left"  ${val('correctSwipe')==='left' ?'selected':''}>Incorrecto / Falso (deslizar izquierda)</option>
            </select></div>
            <div><label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Retroalimentación</label>
            <textarea id="ceLeftOutcome" rows="2" class="input-field" placeholder="Explicación si desliza izquierda…">${val('leftOutcome')}</textarea></div>`;
    }
}

function saveCardEdit() {
    const modIdx  = parseInt(document.getElementById('ceModuleIdx').value);
    const cardIdx = parseInt(document.getElementById('ceCardIdx').value);
    const type    = document.getElementById('ceType').value;
    const title   = document.getElementById('ceTitle').value.trim();
    if (!title) { toast('El título de la tarjeta es obligatorio.',false); return; }

    let card = { id: _cmsState.data.modules[modIdx]?.cards?.[cardIdx]?.id || `card-${Date.now()}`, type, title };

    if (type==='content'||type==='project') {
        card.content = document.getElementById('ceContent')?.value||'';
        card.extra   = document.getElementById('ceExtra')?.value||'';
    } else if (type==='quiz') {
        card.question    = document.getElementById('ceQuestion')?.value||'';
        card.options     = [0,1,2,3].map(i=>document.getElementById(`ceOpt${i}`)?.value||'');
        card.correct     = parseInt(document.getElementById('ceCorrect')?.value||'0');
        card.explanation = document.getElementById('ceExplanation')?.value||'';
    } else if (type==='simulation') {
        card.scenario     = document.getElementById('ceScenario')?.value||'';
        card.statement    = document.getElementById('ceStatement')?.value||'';
        card.correctSwipe = document.getElementById('ceCorrectSwipe')?.value||'right';
        card.leftOutcome  = document.getElementById('ceLeftOutcome')?.value||'';
    }

    _cmsState.data.modules[modIdx].cards[cardIdx] = card;
    closeCardEditor();
    loadModuleCards(modIdx);
    toast('Tarjeta guardada.');
}

function closeCardEditor() {
    document.getElementById('cardEditorModal').classList.add('hidden');
}

// ── Guardar curso en Supabase ────────────────────────────────
async function saveCourse() {
    hideCmsError();
    const title    = document.getElementById('csTitle').value.trim();
    const id       = document.getElementById('csId').value.trim().toLowerCase().replace(/\s+/g,'-');
    const subtitle = document.getElementById('csSubtitle').value.trim();
    const color    = document.getElementById('csColor').value.trim();
    const duration = parseInt(document.getElementById('csDuration').value)||0;
    const status   = document.getElementById('csStatus').value;

    if (!title||!id) { showCmsError('Título e ID son obligatorios.'); return; }

    const totalCards = (_cmsState.data.modules||[]).reduce((a,m)=>a+(m.cards?.length||0),0);
    const payload = { id, title, subtitle, color, status,
        duration_hours: duration, total_cards: totalCards,
        content: _cmsState.data,
        updated_at: new Date().toISOString(),
        created_by: currentUser?.id };

    const saveBtn = document.getElementById('cmsSaveBtn');
    if (saveBtn) { saveBtn.disabled=true; saveBtn.textContent='Guardando…'; }

    let error;
    if (_cmsState.courseId && !_cmsState.isStatic) {
        ({ error } = await sb.from('courses').update({...payload}).eq('id', _cmsState.courseId));
    } else if (!_cmsState.courseId) {
        ({ error } = await sb.from('courses').upsert(payload, { onConflict:'id' }));
    }

    if (saveBtn) { saveBtn.disabled=false; saveBtn.textContent='Guardar curso'; }

    if (error) { showCmsError('Error: '+error.message); return; }
    toast('Curso guardado correctamente. ✓');
    document.getElementById('cmsModal').classList.add('hidden');
    loadCMS();
}

// ────────────────────────────────────────────────────────────
// REPORTES
// ────────────────────────────────────────────────────────────
function escapeCSV(v) {
    if (v===null||v===undefined) return '';
    const s = String(v);
    if (s.includes(',')||s.includes('"')||s.includes('\n')) return `"${s.replace(/"/g,'""')}"`;
    return s;
}

function downloadCSV(filename, rows) {
    const csv = rows.map(r=>r.map(escapeCSV).join(',')).join('\n');
    const blob = new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('CSV descargado.');
}

async function exportUsersCSV() {
    const progress = _allProgress.length ? _allProgress : await fetchAllProgress();
    const headers  = ['Nombre','Correo','XP','Nivel','Tarjetas completadas','Racha (días)','Diagnóstico','Certificado','Último acceso'];
    const rows = [headers, ...progress.map(p => {
        const diag = p?.daily_missions?.diagResult;
        const diagLabel = diag ? ({inicial:'Inicial',proceso:'En Proceso',satisfactorio:'Satisfactorio',destacado:'Destacado'}[diag.level]||'—') : '—';
        return [getName(p), getEmail(p), p.xp||0, p.level||1,
            p.completed_cards?.length||0, p.streak||0,
            diagLabel, hasCertificate(p)?'Sí':'No', fmtDate(p.updated_at)];
    })];
    downloadCSV(`docentes_${new Date().toISOString().slice(0,10)}.csv`, rows);
}

async function exportProgressCSV() {
    const progress = _allProgress.length ? _allProgress : await fetchAllProgress();
    const headers  = ['Nombre','Correo','Curso','Tarjetas completadas','Progreso %','Examen %','Certificado'];
    const rows = [headers];
    progress.forEach(p => {
        STATIC_COURSES.forEach(c => {
            const pct = getProgressPct(p, c.id);
            const scores = p?.daily_missions?.examScores || {};
            const examScore = c.id==='steam' ? (scores['steam']??p?.daily_missions?.examScore??null) : (scores[c.id]??null);
            const cert = examScore !== null && examScore >= 70;
            rows.push([getName(p), getEmail(p), c.title, p.completed_cards?.length||0, pct+'%',
                examScore!==null ? examScore+'%' : '—', cert?'Sí':'No']);
        });
    });
    downloadCSV(`progreso_cursos_${new Date().toISOString().slice(0,10)}.csv`, rows);
}

async function exportFeedbackCSV() {
    const { data:fb } = await sb.from('feedback').select('*').order('created_at',{ascending:false});
    if (!fb?.length) { toast('No hay feedback para exportar.',false); return; }
    const headers = ['Módulo','Rating (1-5)','NPS (0-10)','Categoría NPS','Comentario','Fecha'];
    const rows = [headers, ...fb.map(f=>[
        f.module_name||`Módulo ${f.module_id}`||'General',
        f.rating||'—', f.nps||'—',
        f.nps>=9?'Promotor':f.nps>=7?'Neutro':'Detractor',
        f.comment||'', fmtDate(f.created_at)
    ])];
    downloadCSV(`feedback_${new Date().toISOString().slice(0,10)}.csv`, rows);
}

async function exportFullBackup() {
    const tables = ['progress','feedback','courses','resource_views'];
    const allData = { exportDate: new Date().toISOString() };
    for (const t of tables) {
        const { data } = await sb.from(t).select('*');
        allData[t] = data || [];
    }
    const blob = new Blob([JSON.stringify(allData,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    toast('Backup descargado.');
}

// ── Informe ejecutivo (print) ────────────────────────────────
async function generateExecutiveReport() {
    const progress = _allProgress.length ? _allProgress : await fetchAllProgress();
    const total     = progress.length;
    const active30  = progress.filter(isActive7d).length;
    const certified = progress.filter(hasCertificate).length;
    const totalCards= progress.reduce((a,p)=>a+(p.completed_cards?.length||0),0);
    const horasForm = Math.round(totalCards*3/60);
    // Horas reales — tiempo promedio por tarjeta medido de verdad (resource_views), no el estimado de 3min/tarjeta
    const { data: rvStatsExec } = await sb.rpc('get_resource_views_stats');
    const avgSExec   = rvStatsExec?.[0]?.avg_seconds || 0;
    const horasReales = avgSExec > 0 ? Math.round(totalCards * avgSExec / 3600) : horasForm;
    const completedFull = progress.filter(hasCompletedAnyCourse).length;
    const tasaFin   = total ? Math.round((completedFull/total)*100) : 0;
    const { data:fbRaw } = await sb.from('feedback').select('nps,user_id');
    const _nonAdminIds = new Set(progress.map(p => p.user_id));
    const fb = (fbRaw || []).filter(f => _nonAdminIds.has(f.user_id));
    let npsScore = 'N/A';
    if (fb.length) {
        const p2=fb.filter(f=>f.nps>=9).length, d=fb.filter(f=>f.nps<=6).length;
        npsScore = Math.round(((p2-d)/fb.length)*100);
    }
    const now = new Date().toLocaleDateString('es-GT',{day:'2-digit',month:'long',year:'numeric'});

    const html = `<div style="font-family:Georgia,serif;max-width:800px;margin:0 auto;color:#1e293b">
        <div style="background:#07B0E4;color:white;padding:40px;border-radius:16px;margin-bottom:32px">
            <p style="font-size:11px;opacity:.7;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Informe Ejecutivo de Impacto</p>
            <h1 style="font-size:28px;font-weight:900;margin:0 0 8px">Formación Docente en Pedagogía Innovadora</h1>
            <p style="opacity:.8;margin:0">Guatemala — ${now}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px">
            ${[
                ['Docentes alcanzados', fmt(total),       'fas fa-chalkboard-teacher', '#4f46e5'],
                ['Activos (7 días)',   fmt(active30),    'fas fa-user-check',         '#0891b2'],
                ['Horas de formación', horasReales+'h',  'fas fa-clock',              '#d97706'],
                ['Certificados emitidos', fmt(certified), 'fas fa-award',             '#16a34a'],
            ].map(([l,v,icon,color])=>`
            <div style="background:#f8fafc;padding:20px;border-radius:12px;text-align:center">
                <div style="width:44px;height:44px;border-radius:50%;background:${color}1a;display:flex;align-items:center;justify-content:center;margin:0 auto 8px">
                    <i class="${icon}" style="color:${color};font-size:18px"></i>
                </div>
                <p style="font-size:28px;font-weight:900;margin:0;color:#1e293b">${v}</p>
                <p style="font-size:11px;color:#64748b;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px">${l}</p>
            </div>`).join('')}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
            <thead><tr style="background:#f8fafc">
                <th style="text-align:left;padding:12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;border-bottom:2px solid #e2e8f0">Indicador</th>
                <th style="text-align:right;padding:12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;border-bottom:2px solid #e2e8f0">Valor</th>
                <th style="text-align:right;padding:12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;border-bottom:2px solid #e2e8f0">Meta</th>
            </tr></thead>
            <tbody>
                ${[['Docentes inscritos',fmt(total),'—'],
                   ['Tasa de finalización',tasaFin+'%','70%'],
                   ['Tasa de certificación',total?Math.round(certified/total*100)+'%':'—','50%'],
                   ['NPS de satisfacción',npsScore,'≥ 30'],
                   ['Horas de formación (tiempo real medido)',horasReales+'h','—'],
                   ['Tarjetas de contenido completadas',fmt(totalCards),'—']].map(([l,v,m])=>`
                <tr style="border-bottom:1px solid #f1f5f9">
                    <td style="padding:12px;font-size:14px">${l}</td>
                    <td style="padding:12px;font-size:16px;font-weight:700;text-align:right;color:#1A6B68">${v}</td>
                    <td style="padding:12px;font-size:13px;text-align:right;color:#94a3b8">${m}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        <div style="background:#f8fafc;padding:24px;border-radius:12px;margin-bottom:32px">
            <h3 style="font-size:15px;font-weight:700;margin:0 0 12px;color:#1e293b">Cursos del programa</h3>
            ${STATIC_COURSES.map(c=>`
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px">
                <span style="color:#1e293b">${c.title}</span>
                <span style="color:#64748b">${c.durationHours}h · ${c.totalCards} tarjetas</span>
            </div>`).join('')}
        </div>
        <p style="font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:20px">
            Generado el ${now} · Plataforma de Formación Docente
        </p>
    </div>`;
    showReportPreview(html);
}

// ── Informe MINEDUC ──────────────────────────────────────────
async function generateMineduc() {
    const progress  = _allProgress.length ? _allProgress : await fetchAllProgress();
    const total     = progress.length;
    const certified = progress.filter(hasCertificate).length;
    const active    = progress.filter(isActive7d).length;
    const totalCards= progress.reduce((a,p)=>a+(p.completed_cards?.length||0),0);
    const horasForm = Math.round(totalCards*3/60);
    // Horas reales — tiempo promedio por tarjeta medido de verdad (resource_views), no el estimado de 3min/tarjeta
    const { data: rvStatsMin } = await sb.rpc('get_resource_views_stats');
    const avgSMin   = rvStatsMin?.[0]?.avg_seconds || 0;
    const horasReales = avgSMin > 0 ? Math.round(totalCards * avgSMin / 3600) : horasForm;
    const completedFull = progress.filter(hasCompletedAnyCourse).length;
    const { data:fbRaw } = await sb.from('feedback').select('nps,rating,user_id');
    const _nonAdminIds = new Set(progress.map(p => p.user_id));
    const fb = (fbRaw || []).filter(f => _nonAdminIds.has(f.user_id));
    let npsScore='N/A', avgRating='N/A';
    if (fb.length) {
        const p2=fb.filter(f=>f.nps>=9).length, d=fb.filter(f=>f.nps<=6).length;
        npsScore = Math.round(((p2-d)/fb.length)*100);
        avgRating = (fb.reduce((a,f)=>a+(f.rating||0),0)/fb.length).toFixed(1);
    }
    const now = new Date().toLocaleDateString('es-GT',{day:'2-digit',month:'long',year:'numeric'});
    const year = new Date().getFullYear();

    // Tasa de certificación por curso (% con examen ≥70%)
    const courseCertRates = STATIC_COURSES.map(c => {
        const enrolled = progress.filter(p => (p.completed_cards||[]).some(id => _cardBelongsTo(c.id, id)));
        const passed = enrolled.filter(p => {
            const sc = p.daily_missions?.examScores || {};
            const v = c.id === 'steam' ? (sc['steam'] ?? p.daily_missions?.examScore ?? -1) : (sc[c.id] ?? -1);
            return v >= 70;
        });
        const rate = enrolled.length ? Math.round(passed.length / enrolled.length * 100) : 0;
        return { ...c, enrolledCount: enrolled.length, passedCount: passed.length, rate };
    });

    // Impacto agregado por ruta de aprendizaje (suma de inscritos/aprobados de sus cursos)
    const routeCertRates = LEARNING_PATHS.map(route => {
        const cursos = courseCertRates.filter(c => route.courses.includes(c.id));
        const enrolledCount = cursos.reduce((a,c)=>a+c.enrolledCount,0);
        const passedCount   = cursos.reduce((a,c)=>a+c.passedCount,0);
        const rate = enrolledCount ? Math.round(passedCount / enrolledCount * 100) : 0;
        return { ...route, courseCount: cursos.length, enrolledCount, passedCount, rate };
    });

    const html = `<div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#000;font-size:13px">
        <div style="text-align:center;border-bottom:3px solid #1A6B68;padding-bottom:20px;margin-bottom:24px">
            <h1 style="font-size:20px;font-weight:900;margin:8px 0">INFORME DE AVANCE — PROGRAMA DE FORMACIÓN DOCENTE</h1>
            <h2 style="font-size:16px;font-weight:600;margin:4px 0;color:#1A6B68">Pedagogía Innovadora con Metodología STEAM</h2>
            <p style="font-size:12px;color:#555;margin:8px 0 0">Guatemala · ${year}</p>
            <p style="font-size:11px;color:#888;margin:4px 0 0">Fecha de corte: ${now}</p>
        </div>

        <h3 style="background:#1A6B68;color:white;padding:10px 16px;border-radius:6px;font-size:13px">1. RESUMEN EJECUTIVO</h3>
        <p>El presente informe documenta el avance del programa de formación docente en pedagogía innovadora con énfasis en metodología STEAM, implementado a través de una plataforma digital de aprendizaje. El programa está dirigido a docentes del sistema educativo guatemalteco de todos los niveles.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
            <thead><tr style="background:#f0f4f8"><th style="text-align:left;padding:8px;border:1px solid #ddd">Indicador</th><th style="text-align:center;padding:8px;border:1px solid #ddd">Resultado</th></tr></thead>
            <tbody>
                ${[['Docentes inscritos en la plataforma',fmt(total)],
                   ['Docentes activos (últimos 7 días)',fmt(active)],
                   ['Tasa de retención activa',total?Math.round(active/total*100)+'%':'—'],
                   ['Docentes que completaron al menos un curso',completedFull+' ('+( total?Math.round(completedFull/total*100):0 )+'%)'],
                   ['Certificados emitidos',fmt(certified)],
                   ['Horas de formación (tiempo real medido)',horasReales+' horas'],
                   ['Interacciones de aprendizaje (tarjetas)',fmt(totalCards)],
                   ['Satisfacción docente (NPS)',npsScore+' / 100'],
                   ['Rating promedio de módulos',avgRating+' / 5.0']].map(([l,v])=>`
                <tr><td style="padding:8px;border:1px solid #ddd">${l}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#1A6B68">${v}</td></tr>`).join('')}
            </tbody>
        </table>

        <h3 style="background:#1A6B68;color:white;padding:10px 16px;border-radius:6px;font-size:13px">2. IMPACTO POR RUTA DE APRENDIZAJE</h3>
        <p>El programa se organiza en rutas temáticas. La <strong>tasa de certificación</strong> mide el porcentaje de docentes inscritos en los cursos de esa ruta que aprobaron el examen final (≥70%) — base del Certificado Maestro de cada ruta.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
            <thead><tr style="background:#f0f4f8">
                <th style="text-align:left;padding:8px;border:1px solid #ddd">Ruta</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Cursos</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Tasa de certificación</th>
            </tr></thead>
            <tbody>
                ${routeCertRates.map((r,i)=>`<tr ${i%2===0?'style="background:#fafafa"':''}>
                    <td style="padding:8px;border:1px solid #ddd">${r.label}</td>
                    <td style="padding:8px;border:1px solid #ddd;text-align:center">${r.courseCount}</td>
                    <td style="padding:8px;border:1px solid #ddd;text-align:center;font-weight:bold;color:${r.rate>=60?'#1A6B68':r.rate>=30?'#d97706':'#dc2626'}">${r.rate}%</td>
                </tr>`).join('')}
                <tr style="font-weight:bold;background:#e8f5e9">
                    <td style="padding:8px;border:1px solid #ddd">TOTAL DEL PROGRAMA</td>
                    <td style="padding:8px;border:1px solid #ddd;text-align:center">${STATIC_COURSES.length}</td>
                    <td style="padding:8px;border:1px solid #ddd;text-align:center">${(() => {
                        const e = routeCertRates.reduce((a,r)=>a+r.enrolledCount,0);
                        const p = routeCertRates.reduce((a,r)=>a+r.passedCount,0);
                        return e ? Math.round(p/e*100)+'%' : '—';
                    })()}</td>
                </tr>
            </tbody>
        </table>

        <h3 style="background:#1A6B68;color:white;padding:10px 16px;border-radius:6px;font-size:13px">3. DISTRIBUCIÓN GEOGRÁFICA POR DEPARTAMENTO</h3>
        <p>Participación y avance de docentes según el departamento que registraron en su perfil. Los docentes sin departamento registrado aparecen como "Individual".</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
            <thead><tr style="background:#f0f4f8">
                <th style="text-align:left;padding:8px;border:1px solid #ddd">Departamento</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Docentes</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Activos (7d)</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Certificados</th>
                <th style="text-align:center;padding:8px;border:1px solid #ddd">Tarjetas totales</th>
            </tr></thead>
            <tbody>
                ${(() => {
                    const byDept = {};
                    progress.forEach(p => {
                        const dept = getDept(p);
                        if (!byDept[dept]) byDept[dept] = { count:0, active:0, certs:0, cards:0 };
                        byDept[dept].count++;
                        if (isActive7d(p)) byDept[dept].active++;
                        if (hasCertificate(p)) byDept[dept].certs++;
                        byDept[dept].cards += (p.completed_cards?.length || 0);
                    });
                    return Object.entries(byDept)
                        .sort((a,b) => b[1].count - a[1].count)
                        .map(([dept, d], i) => `<tr ${i%2===0?'style="background:#fafafa"':''}>
                            <td style="padding:8px;border:1px solid #ddd;font-weight:${dept!=='Individual'?'bold':'normal'}">${dept}</td>
                            <td style="padding:8px;border:1px solid #ddd;text-align:center">${d.count}</td>
                            <td style="padding:8px;border:1px solid #ddd;text-align:center">${d.active} (${Math.round(d.active/d.count*100)}%)</td>
                            <td style="padding:8px;border:1px solid #ddd;text-align:center;color:#1A6B68;font-weight:bold">${d.certs}</td>
                            <td style="padding:8px;border:1px solid #ddd;text-align:center">${fmt(d.cards)}</td>
                        </tr>`).join('');
                })()}
            </tbody>
        </table>

        <h3 style="background:#1A6B68;color:white;padding:10px 16px;border-radius:6px;font-size:13px">4. SISTEMA DE EVALUACIÓN Y CERTIFICACIÓN</h3>
        <p>Cada curso cuenta con evaluación formativa continua (quizzes por módulo) y un examen final de 20 preguntas aleatorias. Para obtener el certificado, el docente debe alcanzar una calificación mínima del 70%. Los certificados se generan en formato PDF con nombre del participante, fecha, puntaje y código único.</p>

        <h3 style="background:#1A6B68;color:white;padding:10px 16px;border-radius:6px;font-size:13px">5. REFERENCIAS PEDAGÓGICAS</h3>
        <p>El programa está fundamentado en: el Currículo Nacional Base (CNB) de Guatemala, los estándares ISTE para docentes, el marco de competencias UNESCO ICT, y las prácticas de la Organización Buck Institute for Education (PBLWorks) en Aprendizaje Basado en Proyectos.</p>

        <div style="margin-top:40px;border-top:2px solid #1A6B68;padding-top:20px;display:flex;justify-content:center">
            <div style="text-align:center;min-width:220px">
                <div style="border-top:1px solid #000;padding-top:8px;margin-top:60px;font-size:11px;color:#555">
                    <p style="margin:0;font-weight:bold">Billy Abraham Gómez Sac</p>
                    <p style="margin:2px 0">Coordinador del Programa</p>
                </div>
            </div>
        </div>
        <p style="font-size:10px;color:#94a3b8;text-align:center;margin-top:24px">Documento generado automáticamente · ${now}</p>
    </div>`;
    showReportPreview(html);
}

function showReportPreview(html) {
    const card = document.getElementById('reportPreviewCard');
    const cont = document.getElementById('reportPreviewContent');
    const print = document.getElementById('printArea');
    if (cont) cont.innerHTML = html;
    if (print) print.innerHTML = html;
    if (card) { card.style.display='block'; card.scrollIntoView({behavior:'smooth'}); }
}

// ────────────────────────────────────────────────────────────
// CONFIGURACIÓN — FIRMAS DINÁMICAS
// ────────────────────────────────────────────────────────────
function saveConfig() { toast('Configuración guardada (solo en esta sesión).'); }

// ── Avisos y anuncios ─────────────────────────────────────────
// Reutiliza la tabla app_config (misma que learning_paths) con key='announcement'
let _annState = { id: 0, active: false, type: 'info', title: '', message: '', expiresAt: null };

const ANN_TYPES = {
    maintenance: { label: 'Mantenimiento', color: '#DC2626', bg: '#FEE2E2', icon: 'fa-tools' },
    info:        { label: 'Información',   color: '#2563EB', bg: '#DBEAFE', icon: 'fa-circle-info' },
    new_course:  { label: 'Curso nuevo',   color: '#16A34A', bg: '#DCFCE7', icon: 'fa-graduation-cap' },
    event:       { label: 'Evento',        color: '#7C3AED', bg: '#EDE9FE', icon: 'fa-calendar-star' },
};

async function loadAnnouncement() {
    const container = document.getElementById('announcementPanel');
    if (!container) return;
    const { data } = await sb.from('app_config').select('key,value').eq('key', 'announcement');
    _annState = data?.[0]?.value
        ? { ...{ id: 0, active: false, type: 'info', title: '', message: '', expiresAt: null }, ...data[0].value }
        : { id: 0, active: false, type: 'info', title: '', message: '', expiresAt: null };
    _renderAnnouncementPanel();
}

function _renderAnnouncementPanel() {
    const container = document.getElementById('announcementPanel');
    if (!container) return;
    const a = _annState;
    const typeOptions = Object.entries(ANN_TYPES).map(([k, v]) =>
        `<option value="${k}" ${a.type === k ? 'selected' : ''}>${v.label}</option>`
    ).join('');
    container.innerHTML = `
        <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" id="annActive" ${a.active ? 'checked' : ''} onchange="_annState.active=this.checked; _updateAnnPreview()">
                Aviso activo (visible para todos los docentes)
            </label>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-semibold text-slate-500 mb-1 block">Tipo</label>
                    <select id="annType" class="input-field text-xs" onchange="_annState.type=this.value; _updateAnnPreview()">${typeOptions}</select>
                </div>
                <div>
                    <label class="text-xs font-semibold text-slate-500 mb-1 block">Expira (opcional)</label>
                    <input type="date" id="annExpires" class="input-field text-xs" value="${a.expiresAt ? a.expiresAt.slice(0,10) : ''}" onchange="_annState.expiresAt=this.value?new Date(this.value+'T23:59:59').toISOString():null">
                </div>
            </div>
            <div>
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Título corto</label>
                <input id="annTitle" class="input-field text-sm" placeholder="Ej: Mantenimiento programado" value="${esc(a.title)}" oninput="_annState.title=this.value; _updateAnnPreview()">
            </div>
            <div>
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Mensaje</label>
                <textarea id="annMessage" class="input-field text-sm" rows="3" placeholder="Ej: Estaremos en mantenimiento el sábado de 8pm a 10pm. Tu progreso está seguro." oninput="_annState.message=this.value; _updateAnnPreview()">${esc(a.message)}</textarea>
            </div>
            <label class="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" id="annAlsoPush">
                También enviar como notificación push a quienes la activaron
            </label>
            <button onclick="saveAnnouncement()" class="btn-primary text-xs w-full"><i class="fas fa-save mr-1"></i>Guardar aviso</button>
            <div>
                <p class="text-xs font-semibold text-slate-500 mb-1.5">Vista previa (así lo ven los docentes)</p>
                <div id="annPreview"></div>
            </div>
        </div>`;
    _updateAnnPreview();
}

function _updateAnnPreview() {
    const el = document.getElementById('annPreview');
    if (!el) return;
    const a = _annState;
    if (!a.active || (!a.title.trim() && !a.message.trim())) {
        el.innerHTML = `<div class="text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl px-3 py-3 text-center">El banner no se muestra — actívalo y escribe un título o mensaje.</div>`;
        return;
    }
    const t = ANN_TYPES[a.type] || ANN_TYPES.info;
    el.innerHTML = `
        <div style="background:${t.bg};color:${t.color};padding:10px 14px;border-radius:12px;display:flex;align-items:center;gap:10px;font-size:12px;border:1px solid ${t.color}33">
            <i class="fas ${t.icon}" style="flex-shrink:0"></i>
            <span style="flex:1;min-width:0">
                ${a.title.trim() ? `<strong>${esc(a.title)}</strong>` : ''}${a.title.trim() && a.message.trim() ? ' — ' : ''}${a.message.trim() ? esc(a.message) : ''}
            </span>
            <span style="flex-shrink:0;font-size:16px;line-height:1;opacity:.6">&times;</span>
        </div>`;
}

async function saveAnnouncement() {
    if (_annState.active && !_annState.title.trim() && !_annState.message.trim()) {
        toast('Escribe al menos un título o mensaje para activar el aviso', false);
        return;
    }
    // Nuevo id solo si el contenido cambió — evita reabrir el mismo aviso para quien ya lo cerró
    _annState.id = Date.now();
    const { error } = await sb.from('app_config').upsert({ key: 'announcement', value: _annState }, { onConflict: 'key' });
    if (error) { toast('Error al guardar: ' + error.message, false); return; }
    toast('✓ Aviso guardado');
    const alsoPush = document.getElementById('annAlsoPush')?.checked;
    let pushStats = null;
    if (alsoPush && _annState.active) {
        pushStats = await sendPushBroadcast(_annState.title || 'Aviso', _annState.message || '', true);
    }
    // Solo queda registro en el historial cuando el aviso se activa con contenido real —
    // guardar un borrador desactivado o simplemente apagarlo no ensucia el historial.
    if (_annState.active && (_annState.title.trim() || _annState.message.trim())) {
        await _logBroadcast({
            title: _annState.title, message: _annState.message, annType: _annState.type,
            isAnnouncement: true, isPush: !!pushStats, pushStats,
        });
        await loadBroadcastHistory();
    }
    await loadAnnouncement();
    await loadBroadcastHistory();
}

// ── Notificaciones push ───────────────────────────────────────
async function loadPushPanel() {
    const container = document.getElementById('pushPanel');
    if (!container) return;
    const { count } = await sb.from('push_subscriptions').select('id', { count: 'exact', head: true });
    container.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center gap-2 text-xs text-slate-500">
                <i class="fas fa-mobile-screen-button"></i>
                <span><strong class="text-slate-700">${count ?? 0}</strong> docente${count === 1 ? '' : 's'} con notificaciones activas en su dispositivo</span>
            </div>
            <input id="pushTitle" class="input-field text-sm" placeholder="Título de la notificación">
            <textarea id="pushBody" class="input-field text-sm" rows="2" placeholder="Mensaje breve"></textarea>
            <button onclick="sendPushBroadcast()" class="btn-primary text-xs w-full"><i class="fas fa-paper-plane mr-1"></i>Enviar a todos</button>
            <p id="pushResult" class="text-xs text-center"></p>
        </div>`;
}

async function sendPushBroadcast(titleOverride, bodyOverride, _skipLog) {
    const title = titleOverride || document.getElementById('pushTitle')?.value?.trim();
    const body  = bodyOverride  || document.getElementById('pushBody')?.value?.trim();
    if (!title && !body) { toast('Escribe un título o mensaje', false); return null; }
    const resultEl = document.getElementById('pushResult');
    if (resultEl) resultEl.textContent = 'Enviando…';
    try {
        const { data: { session } } = await sb.auth.getSession();
        const res = await fetch(`${sb.supabaseUrl}/functions/v1/send-push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
            body: JSON.stringify({ title: title || 'Formación Docente', body: body || '' }),
        });
        const data = await res.json();
        if (!res.ok) {
            const msg = (typeof data?.error === 'string' && data.error) || data?.detail || data?.message || `HTTP ${res.status}`;
            throw new Error(msg);
        }
        if (resultEl) resultEl.textContent = `Enviado a ${data.sent} de ${data.total} suscripciones.`;
        toast(`✓ Notificación enviada (${data.sent}/${data.total})`);
        if (!_skipLog) {
            await _logBroadcast({ title, message: body, isAnnouncement: false, isPush: true, pushStats: data });
            await loadBroadcastHistory();
        }
        return data;
    } catch (e) {
        const msg = e?.message || String(e);
        if (resultEl) resultEl.textContent = 'Error: ' + msg;
        toast('Error al enviar: ' + msg, false);
        return null;
    }
}

// ── Historial de avisos y push ────────────────────────────────
async function _logBroadcast({ title, message, annType, isAnnouncement, isPush, pushStats }) {
    const { data: { user } } = await sb.auth.getUser();
    await sb.from('broadcast_log').insert({
        title: title || '', message: message || '',
        ann_type: annType || null,
        is_announcement: !!isAnnouncement,
        is_push: !!isPush,
        push_sent: pushStats?.sent ?? null,
        push_total: pushStats?.total ?? null,
        push_expired: pushStats?.expired ?? null,
        created_by: user?.email || null,
    });
}

async function loadBroadcastHistory() {
    const container = document.getElementById('broadcastHistoryPanel');
    if (!container) return;
    const { data, error } = await sb.from('broadcast_log').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) { container.innerHTML = `<p class="text-xs text-red-500 text-center py-4">Error al cargar historial: ${esc(error.message)}</p>`; return; }
    if (!data || !data.length) { container.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Todavía no se ha enviado ningún aviso ni notificación.</p>`; return; }
    container.innerHTML = data.map(row => {
        const when = new Date(row.created_at).toLocaleString('es-GT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        const tags = [];
        if (row.is_announcement) tags.push(`<span class="badge tag-amber" style="font-size:9px">Aviso${row.ann_type ? ' · ' + esc(row.ann_type) : ''}</span>`);
        if (row.is_push) {
            const stats = (row.push_sent ?? null) !== null ? ` (${row.push_sent}/${row.push_total})` : '';
            tags.push(`<span class="badge tag-blue" style="font-size:9px">Push${stats}</span>`);
        }
        return `<div style="padding:10px 0;border-bottom:1px solid #f1f5f9">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap">
                ${tags.join('')}
                <span style="font-size:10px;color:#94a3b8;margin-left:auto">${when}${row.created_by ? ' · ' + esc(row.created_by) : ''}</span>
            </div>
            <p style="font-size:12px;font-weight:700;color:#1e293b;margin:0">${esc(row.title || '(sin título)')}</p>
            ${row.message ? `<p style="font-size:11px;color:#64748b;margin:2px 0 0">${esc(row.message)}</p>` : ''}
        </div>`;
    }).join('');
}

// ── Rutas de Aprendizaje / Certificado Maestro ───────────────
let _lpState = []; // estado vivo de rutas, se modifica sin guardar hasta "Guardar todo"

const LP_COLORS = [
    { color:'#07B0E4', gradient:'#07B0E4' },
    { color:'#E83C8D', gradient:'linear-gradient(135deg,#7C3AED,#E83C8D)' },
    { color:'#F59E0B', gradient:'linear-gradient(135deg,#D97706,#F59E0B)' },
    { color:'#10B981', gradient:'linear-gradient(135deg,#065F46,#10B981)' },
    { color:'#6366F1', gradient:'linear-gradient(135deg,#3730A3,#6366F1)' },
    { color:'#EF4444', gradient:'linear-gradient(135deg,#991B1B,#EF4444)' },
];

async function loadLearningPaths() {
    const container = document.getElementById('learningPathsPanel');
    if (!container) return;
    const { data } = await sb.from('app_config').select('key,value').eq('key','learning_paths');
    _lpState = data?.[0]?.value
        ? JSON.parse(JSON.stringify(data[0].value))
        : JSON.parse(JSON.stringify(LEARNING_PATHS));
    _renderLearningPaths();
}

function _renderLearningPaths() {
    const container = document.getElementById('learningPathsPanel');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div>
                <h3 style="font-size:16px;font-weight:700;color:#1e293b;margin:0">Rutas de aprendizaje</h3>
                <p style="font-size:12px;color:#64748b;margin:4px 0 0">Cada ruta tiene su propio Certificado Maestro. El orden de los cursos aquí se refleja para los usuarios.</p>
            </div>
            <button onclick="_lp_addPath()" style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:#0f172a;color:white;border:none;border-radius:10px;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap">
                <i class="fas fa-plus"></i> Nueva ruta
            </button>
        </div>
        ${_lpState.map((path, pi) => _renderPathCard(path, pi)).join('')}
        <button onclick="saveAllLearningPaths()" style="margin-top:8px;padding:12px 20px;background:#0f172a;color:white;border:none;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;width:100%">
            <i class="fas fa-save" style="margin-right:6px"></i>Guardar todas las rutas
        </button>`;
}

function _renderPathCard(path, pi) {
    const colorSet = LP_COLORS[pi % LP_COLORS.length];
    const color = path.color || colorSet.color;
    const courses = (path.courses || []);
    const courseObjs = courses.map(id => STATIC_COURSES.find(c => c.id === id)).filter(Boolean);
    const available = STATIC_COURSES.filter(c => !courses.includes(c.id));

    return `
    <div style="margin-bottom:16px;border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden">
        <div style="background:${color};padding:14px 16px;display:flex;align-items:center;gap:10px">
            <div style="flex:1">
                <input id="lp_label_${pi}" value="${path.label}" placeholder="Nombre de la ruta"
                    style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.3);color:white;font-size:15px;font-weight:700;padding:6px 10px;border-radius:8px;width:100%;outline:none"
                    oninput="_lpState[${pi}].label=this.value">
            </div>
            <select onchange="_lp_setColor(${pi},this.value)" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.3);color:white;padding:6px 8px;border-radius:8px;font-size:12px;outline:none;cursor:pointer">
                ${LP_COLORS.map((c,ci) => `<option value="${ci}" ${(path.color===c.color)?'selected':''} style="background:#1e293b">${['Azul','Rosa','Ámbar','Verde','Índigo','Rojo'][ci]}</option>`).join('')}
            </select>
            <button onclick="_lp_deletePath(${pi})" title="Eliminar ruta" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.3);color:white;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:13px">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div style="padding:14px">
            <p style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin:0 0 10px">Cursos en orden (${courseObjs.length})</p>
            <div style="display:flex;flex-direction:column;gap:6px" id="lp_courses_${pi}">
                ${courseObjs.length === 0
                    ? `<p style="font-size:13px;color:#94a3b8;text-align:center;padding:16px 0">Sin cursos aún. Agrega uno abajo.</p>`
                    : courseObjs.map((c, ci) => `
                    <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px">
                        <div style="display:flex;flex-direction:column;gap:2px">
                            <button onclick="_lp_move(${pi},${ci},-1)" ${ci===0?'disabled':''} style="background:none;border:none;cursor:pointer;color:${ci===0?'#cbd5e1':'#64748b'};padding:0;line-height:1;font-size:11px"><i class="fas fa-chevron-up"></i></button>
                            <button onclick="_lp_move(${pi},${ci},1)" ${ci===courseObjs.length-1?'disabled':''} style="background:none;border:none;cursor:pointer;color:${ci===courseObjs.length-1?'#cbd5e1':'#64748b'};padding:0;line-height:1;font-size:11px"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        <div style="width:32px;height:32px;border-radius:8px;background:${c.color||'#07B0E4'};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${c.icon || '<svg width="20" height="20" viewBox="0 0 40 40" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15 L20 8 L36 15 L20 22 Z" stroke-width="1.8" fill="rgba(255,255,255,0.15)"/><path d="M11 18 V27 Q11 31 20 31 Q29 31 29 27 V18" stroke-width="1.8"/></svg>'}</div>
                        <div style="flex:1;min-width:0">
                            <p style="font-size:13px;font-weight:600;color:#1e293b;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</p>
                            <p style="font-size:11px;color:#64748b;margin:0">${c.durationHours||0}h · ${c.totalCards||0} tarjetas</p>
                        </div>
                        <span style="font-size:10px;font-weight:700;color:#64748b;background:#f1f5f9;padding:2px 6px;border-radius:6px">#${ci+1}</span>
                        <button onclick="_lp_removeCourse(${pi},'${c.id}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 4px"><i class="fas fa-times"></i></button>
                    </div>`).join('')}
            </div>
            ${available.length > 0 ? `
            <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
                <select id="lp_add_${pi}" style="flex:1;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;color:#1e293b;background:#fff;outline:none">
                    <option value="">— Agregar curso —</option>
                    ${available.map(c => `<option value="${c.id}">${c.title} (${c.durationHours||0}h)</option>`).join('')}
                </select>
                <button onclick="_lp_addCourse(${pi})" style="padding:8px 14px;background:#0f172a;color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer">
                    <i class="fas fa-plus"></i>
                </button>
            </div>` : `<p style="font-size:11px;color:#10b981;margin:10px 0 0;text-align:center"><i class="fas fa-check-circle"></i> Todos los cursos disponibles ya están en esta ruta</p>`}
        </div>
    </div>`;
}

function _lp_move(pi, ci, dir) {
    const courses = _lpState[pi].courses;
    const ni = ci + dir;
    if (ni < 0 || ni >= courses.length) return;
    [courses[ci], courses[ni]] = [courses[ni], courses[ci]];
    _renderLearningPaths();
}

function _lp_removeCourse(pi, courseId) {
    _lpState[pi].courses = _lpState[pi].courses.filter(id => id !== courseId);
    _renderLearningPaths();
}

function _lp_addCourse(pi) {
    const sel = document.getElementById(`lp_add_${pi}`);
    if (!sel || !sel.value) return;
    if (!_lpState[pi].courses.includes(sel.value)) {
        _lpState[pi].courses.push(sel.value);
    }
    _renderLearningPaths();
}

function _lp_setColor(pi, colorIdx) {
    const c = LP_COLORS[parseInt(colorIdx)];
    _lpState[pi].color = c.color;
    _lpState[pi].gradient = c.gradient;
    _renderLearningPaths();
}

function _lp_deletePath(pi) {
    if (!confirm(`¿Eliminar la ruta "${_lpState[pi].label}"? Esta acción no se guarda hasta presionar "Guardar todas las rutas".`)) return;
    _lpState.splice(pi, 1);
    _renderLearningPaths();
}

function _lp_addPath() {
    const ci = _lpState.length % LP_COLORS.length;
    _lpState.push({
        id: 'ruta_' + Date.now(),
        label: 'Nueva ruta',
        color: LP_COLORS[ci].color,
        gradient: LP_COLORS[ci].gradient,
        courses: []
    });
    _renderLearningPaths();
    // scroll al final
    setTimeout(() => document.getElementById('learningPathsPanel')?.lastElementChild?.previousElementSibling?.scrollIntoView({behavior:'smooth'}), 50);
}

async function saveAllLearningPaths() {
    if (_lpState.some(p => !p.label.trim())) { toast('Todas las rutas deben tener nombre', false); return; }
    if (_lpState.some(p => p.courses.length === 0)) { toast('Cada ruta debe tener al menos un curso', false); return; }
    const { error } = await sb.from('app_config')
        .upsert({ key: 'learning_paths', value: _lpState }, { onConflict: 'key' });
    if (error) { toast('Error al guardar: ' + error.message, false); return; }
    toast(`✓ ${_lpState.length} rutas guardadas correctamente`);
    await loadLearningPaths();
}

let _signatures = [];
let _schools    = [];

// ── Firmas ──────────────────────────────────────────────────
async function loadSignatures() {
    const { data } = await sb.from('cert_signatures').select('*').order('slot');
    _signatures = data || [];
    renderSignatures();
}

function renderSignatures() {
    const container = document.getElementById('signaturesContainer');
    if (!container) return;
    const slotLabels = ['', 'Coordinador del Programa (defecto)', 'Director / Coordinador del Centro', 'Delegado MINEDUC'];
    container.innerHTML = _signatures.map(sig => `
    <div class="border border-slate-200 rounded-xl p-4 space-y-3" id="sigSlot${sig.slot}">
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wide">Firma ${sig.slot} — ${slotLabels[sig.slot]}</span>
            <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-slate-500">Activa</span>
                <div class="relative">
                    <input type="checkbox" class="sr-only peer" id="sigActive${sig.slot}" ${sig.active ? 'checked' : ''} onchange="toggleSigSlot(${sig.slot})">
                    <div class="w-9 h-5 bg-slate-200 peer-checked:bg-indigo-500 rounded-full transition-colors"></div>
                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                </div>
            </label>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <input id="sigName${sig.slot}" class="input-field text-sm" placeholder="Nombre completo" value="${esc(sig.signer_name)}">
            <input id="sigRole${sig.slot}" class="input-field text-sm" placeholder="Cargo" value="${esc(sig.signer_role)}">
        </div>
        <div class="flex items-center gap-3">
            ${sig.signature_url
                ? `<img src="${sig.signature_url}" class="h-12 object-contain border border-slate-200 rounded-lg px-2">`
                : `<div class="h-12 w-28 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">Sin firma</div>`}
            <label class="btn-secondary text-xs cursor-pointer">
                <i class="fas fa-upload mr-1"></i>Subir imagen
                <input type="file" accept="image/*" class="hidden" onchange="uploadSignature(${sig.slot}, this)">
            </label>
            ${sig.signature_url ? `<button onclick="clearSignature(${sig.slot})" class="text-xs text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>` : ''}
        </div>
    </div>`).join('');
}

function toggleSigSlot(slot) {
    const sig = _signatures.find(s => s.slot === slot);
    if (sig) sig.active = document.getElementById(`sigActive${slot}`)?.checked;
}

async function uploadSignature(slot, input) {
    const file = input.files[0];
    if (!file) return;
    toast('Subiendo firma…', 'info');
    const ext  = file.name.split('.').pop();
    const path = `slot${slot}_${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage.from('signatures').upload(path, file, { upsert: true });
    if (upErr) { toast('Error al subir: ' + upErr.message, 'error'); return; }
    const { data: urlData } = sb.storage.from('signatures').getPublicUrl(path);
    const sig = _signatures.find(s => s.slot === slot);
    if (sig) { sig.signature_url = urlData.publicUrl; renderSignatures(); }
    toast('Imagen subida. Guarda para confirmar.', 'success');
}

async function clearSignature(slot) {
    if (!confirm('¿Quitar la imagen de firma del slot ' + slot + '?')) return;
    const sig = _signatures.find(s => s.slot === slot);
    if (sig) { sig.signature_url = null; renderSignatures(); }
}

async function saveSignatures() {
    for (const sig of _signatures) {
        const name = document.getElementById(`sigName${sig.slot}`)?.value?.trim() || '';
        const role = document.getElementById(`sigRole${sig.slot}`)?.value?.trim() || '';
        const active = document.getElementById(`sigActive${sig.slot}`)?.checked ?? sig.active;
        const { error } = await sb.from('cert_signatures').upsert({
            slot: sig.slot, signer_name: name, signer_role: role,
            signature_url: sig.signature_url || null, active, updated_at: new Date().toISOString()
        }, { onConflict: 'slot' });
        if (error) { toast('Error guardando firma ' + sig.slot + ': ' + error.message, 'error'); return; }
    }
    toast('Firmas guardadas correctamente.', 'success');
    await loadSignatures();
}

// ── Escuelas ─────────────────────────────────────────────────
async function loadSchools() {
    const { data } = await sb.from('schools').select('*').order('name');
    _schools = data || [];
    renderSchools();
    // Poblar select del modal de coordinadores
    const sel = document.getElementById('coordSchoolInput');
    if (sel) {
        sel.innerHTML = '<option value="">Selecciona centro educativo…</option>' +
            _schools.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    }
    // Poblar select de importación masiva de docentes
    const bulkSel = document.getElementById('bulkImportSchool');
    if (bulkSel) {
        const prev = bulkSel.value;
        bulkSel.innerHTML = '<option value="">Selecciona el centro educativo…</option>' +
            _schools.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
        if (prev) bulkSel.value = prev;
    }
}

function renderSchools() {
    const el = document.getElementById('schoolsList');
    if (!el) return;
    if (!_schools.length) { el.innerHTML = '<p class="text-xs text-slate-400 text-center py-3">Sin centros registrados.</p>'; return; }
    el.innerHTML = _schools.map(s => `
    <div class="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
        <div>
            <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-slate-700">${esc(s.name)}</p>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${s.plan === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}">${s.plan === 'paid' ? 'PAGADO' : 'GRATIS'}</span>
            </div>
            ${s.code ? `<p class="text-xs text-slate-400">Código: ${esc(s.code)}</p>` : ''}
            ${s.director_name ? `<p class="text-xs text-indigo-500 mt-0.5"><i class="fas fa-signature mr-1"></i>${esc(s.director_name)}</p>` : ''}
        </div>
        <div class="flex items-center gap-2 ml-3">
            <button onclick="toggleSchoolPlan('${s.id}','${s.plan || 'free'}')" class="text-xs font-semibold ${s.plan === 'paid' ? 'text-amber-500 hover:text-amber-600' : 'text-emerald-500 hover:text-emerald-600'}" title="${s.plan === 'paid' ? 'Pasar a plan gratuito' : 'Activar plan pagado'}">
                <i class="fas ${s.plan === 'paid' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </button>
            <button onclick="openDirectorSigModal('${s.id}')" class="text-indigo-400 hover:text-indigo-600 text-xs" title="Firma del director"><i class="fas fa-signature"></i></button>
            <button onclick="deleteSchool('${s.id}')" class="text-red-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
        </div>
    </div>`).join('');

    // Actualizar checkboxes en modal de coordinador
    const cb = document.getElementById('coordSchoolCheckboxes');
    if (cb) {
        cb.innerHTML = _schools.length
            ? _schools.map(s => `
                <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg px-1 py-0.5">
                    <input type="checkbox" class="coord-school-cb rounded" value="${s.id}">
                    <span class="text-sm text-slate-700">${esc(s.name)}</span>
                </label>`).join('')
            : '<p class="text-xs text-slate-400">No hay centros creados aún.</p>';
    }
}

function openAddSchoolModal() {
    document.getElementById('schoolNameInput').value = '';
    document.getElementById('schoolCodeInput').value = '';
    document.getElementById('schoolModal').classList.remove('hidden');
}

async function saveSchool() {
    const name = document.getElementById('schoolNameInput').value.trim();
    const code = document.getElementById('schoolCodeInput').value.trim();
    if (!name) { toast('El nombre es obligatorio.', 'error'); return; }
    const { error } = await sb.from('schools').insert({ name, code: code || null });
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    document.getElementById('schoolModal').classList.add('hidden');
    toast('Centro educativo agregado.', 'success');
    await loadSchools();
}

async function deleteSchool(id) {
    if (!confirm('¿Eliminar este centro educativo?')) return;
    await sb.from('schools').delete().eq('id', id);
    toast('Centro eliminado.', 'success');
    await loadSchools();
}

async function toggleSchoolPlan(id, currentPlan) {
    const newPlan = currentPlan === 'paid' ? 'free' : 'paid';
    if (newPlan === 'free' && !confirm('¿Pasar este centro a plan gratuito? Perderá acceso a la reportería de coordinación y a la firma del director en los diplomas.')) return;
    const { error } = await sb.from('schools').update({ plan: newPlan }).eq('id', id);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast(newPlan === 'paid' ? 'Centro activado como PAGADO — ya tiene reportería y firma de director.' : 'Centro pasado a plan gratuito.', 'success');
    await loadSchools();
}

// ── Importación masiva de docentes (CSV) ───────────────────────
let _bulkImportRows = [];

function parseTeachersCSV(text) {
    return text.split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
            const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            return { email: parts[0] || '', name: parts[1] || '' };
        })
        .filter(r => r.email && !['correo', 'email', 'correo electrónico'].includes(r.email.toLowerCase()));
}

function onBulkImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        _bulkImportRows = parseTeachersCSV(String(reader.result || ''));
        renderBulkImportPreview();
    };
    reader.readAsText(file, 'utf-8');
}

function renderBulkImportPreview() {
    const el = document.getElementById('bulkImportPreview');
    const btn = document.getElementById('bulkImportBtn');
    if (!el || !btn) return;
    if (!_bulkImportRows.length) {
        el.innerHTML = '<p class="text-xs text-slate-400">Sube un CSV para ver la vista previa.</p>';
        btn.disabled = true;
        return;
    }
    const preview = _bulkImportRows.slice(0, 50)
        .map(r => `<div>${esc(r.email)}${r.name ? ' · ' + esc(r.name) : ''}</div>`).join('');
    const more = _bulkImportRows.length > 50 ? `<div class="text-slate-400 mt-1">…y ${_bulkImportRows.length - 50} más</div>` : '';
    el.innerHTML = `<p class="text-xs text-slate-500 font-semibold mb-1">${_bulkImportRows.length} docente(s) detectados</p>
        <div class="max-h-32 overflow-y-auto text-xs text-slate-600 space-y-0.5">${preview}${more}</div>`;
    btn.disabled = false;
}

async function runBulkImport() {
    const schoolId = document.getElementById('bulkImportSchool').value;
    if (!schoolId) { toast('Selecciona un centro educativo.', 'error'); return; }
    if (!_bulkImportRows.length) { toast('Sube un CSV primero.', 'error'); return; }

    const btn = document.getElementById('bulkImportBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Importando…';

    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) { toast('No autenticado', 'error'); btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-import mr-1"></i>Importar'; return; }

    const EDGE_URL = `${sb.supabaseUrl}/functions/v1/admin-users`;
    let json;
    try {
        const res = await fetch(EDGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ action: 'bulkImportTeachers', schoolId, teachers: _bulkImportRows })
        });
        json = await res.json();
        if (!res.ok) { toast('Error: ' + (json.error || res.status), 'error'); return; }
    } catch (e) {
        toast('Error de red: ' + e.message, 'error'); return;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-import mr-1"></i>Importar';
    }

    const results = json.results || [];
    const errors = results.filter(r => r.status === 'error');
    toast(`${results.length - errors.length} docente(s) importados/asignados${errors.length ? `, ${errors.length} con error` : ''}.`, errors.length ? 'warning' : 'success');

    document.getElementById('bulkImportResults').innerHTML = results.map(r => `
        <div class="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg ${r.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}">
            <span>${esc(r.email)}</span>
            <span>${r.status === 'error' ? '❌ ' + esc(r.message || 'error') : (r.status === 'invited' ? '✅ Invitado' : '✅ Ya existía, asignado')}</span>
        </div>`).join('');

    _bulkImportRows = [];
    document.getElementById('bulkImportFile').value = '';
    renderBulkImportPreview();
    await loadUsers();
}

// ── Firma de director por escuela ─────────────────────────────
let _dirSigUrl = null; // URL temporal mientras se edita el modal

function openDirectorSigModal(schoolId) {
    const s = _schools.find(x => x.id === schoolId);
    if (!s) return;
    document.getElementById('dirSigSchoolId').value = schoolId;
    document.getElementById('dirSigName').value = s.director_name || '';
    document.getElementById('dirSigRole').value = s.director_role || '';
    _dirSigUrl = s.director_signature_url || null;
    _renderDirSigPreview();
    document.getElementById('directorSigModal').classList.remove('hidden');
}

function _renderDirSigPreview() {
    const preview = document.getElementById('dirSigImgPreview');
    const clearBtn = document.getElementById('dirSigClearBtn');
    if (_dirSigUrl) {
        preview.innerHTML = `<img src="${_dirSigUrl}" class="h-14 object-contain border border-slate-200 rounded-lg px-2 mb-1">`;
        clearBtn.classList.remove('hidden');
    } else {
        preview.innerHTML = `<div class="h-10 w-28 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 mb-1">Sin firma</div>`;
        clearBtn.classList.add('hidden');
    }
}

async function uploadDirectorSig(input) {
    const file = input.files[0];
    if (!file) return;
    const schoolId = document.getElementById('dirSigSchoolId').value;
    toast('Subiendo firma…', 'info');
    const path = `director/${schoolId}_${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await sb.storage.from('signatures').upload(path, file, { upsert: true });
    if (error) { toast('Error al subir imagen: ' + error.message, 'error'); return; }
    const { data: urlData } = sb.storage.from('signatures').getPublicUrl(path);
    _dirSigUrl = urlData.publicUrl;
    _renderDirSigPreview();
    toast('Imagen subida. Guarda para confirmar.', 'success');
}

function clearDirectorSig() {
    _dirSigUrl = null;
    _renderDirSigPreview();
}

async function saveDirectorSig() {
    const schoolId = document.getElementById('dirSigSchoolId').value;
    const name = document.getElementById('dirSigName').value.trim();
    const role = document.getElementById('dirSigRole').value.trim();
    const { error } = await sb.from('schools').update({
        director_name: name || null,
        director_role: role || null,
        director_signature_url: _dirSigUrl || null,
    }).eq('id', schoolId);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    document.getElementById('directorSigModal').classList.add('hidden');
    toast('Firma de director guardada.', 'success');
    await loadSchools();
}

// ── Coordinadores ─────────────────────────────────────────────
async function loadCoordinators() {
    const { data } = await sb.from('coordinators').select('*, schools(id, name)').order('name');
    const el = document.getElementById('coordsList');
    if (!el) return;
    const rows = data || [];
    if (!rows.length) { el.innerHTML = '<p class="text-xs text-slate-400 text-center py-3">Sin coordinadores registrados.</p>'; return; }

    // Agrupar por user_id
    const byUser = {};
    rows.forEach(c => {
        if (!byUser[c.user_id]) byUser[c.user_id] = { name: c.name, email: c.email, user_id: c.user_id, schools: [] };
        byUser[c.user_id].schools.push({ id: c.school_id, name: c.schools?.name || c.school_id });
    });

    el.innerHTML = Object.values(byUser).map(c => {
        const schoolTags = c.schools.map(s =>
            `<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full">
                ${esc(s.name)}
                <button onclick="deleteCoordinator('${c.user_id}','${s.id}')" class="text-indigo-300 hover:text-red-500 leading-none ml-0.5" title="Quitar este centro">&times;</button>
             </span>`
        ).join('');
        const schoolIds = c.schools.map(s => s.id).join(',');
        return `
        <div class="bg-slate-50 rounded-xl px-4 py-3">
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-700">${esc(c.name || c.email)}</p>
                    <p class="text-xs text-slate-400 mb-2">${esc(c.email)}</p>
                    <div class="flex flex-wrap gap-1">${schoolTags}</div>
                </div>
                <a href="coordinator.html?coord=${c.user_id}" target="_blank"
                   class="shrink-0 text-xs text-indigo-500 hover:underline whitespace-nowrap">
                    <i class="fas fa-external-link-alt"></i> Ver panel
                </a>
            </div>
        </div>`;
    }).join('');
}

function openAddCoordModal() {
    document.getElementById('coordEmailInput').value = '';
    document.getElementById('coordNameInput').value  = '';
    document.getElementById('coordUserId').value = '';
    document.getElementById('coordSearchResult').classList.add('hidden');
    // Desmarcar todos los checkboxes
    document.querySelectorAll('.coord-school-cb').forEach(cb => cb.checked = false);
    const btn = document.getElementById('coordSaveBtn');
    btn.disabled = true; btn.style.opacity = '.5'; btn.style.cursor = 'not-allowed';
    document.getElementById('coordModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('coordEmailInput').focus(), 100);
}

function clearCoordSearch() {
    document.getElementById('coordUserId').value = '';
    document.getElementById('coordSearchResult').classList.add('hidden');
    const btn = document.getElementById('coordSaveBtn');
    btn.disabled = true; btn.style.opacity = '.5'; btn.style.cursor = 'not-allowed';
}

async function searchCoordByEmail() {
    const email   = document.getElementById('coordEmailInput').value.trim().toLowerCase();
    const resultEl = document.getElementById('coordSearchResult');
    const btn      = document.getElementById('coordSaveBtn');
    if (!email) { toast('Ingresa un correo primero.', 'error'); return; }

    resultEl.className = 'rounded-xl px-4 py-3 text-sm bg-slate-50 border border-slate-200';
    resultEl.innerHTML = '<i class="fas fa-spinner fa-spin mr-2 text-slate-400"></i>Buscando…';
    resultEl.classList.remove('hidden');

    // Buscar en progress (tiene user_id + email + nombre)
    const { data: found } = await sb.from('progress')
        .select('user_id, email, daily_missions')
        .eq('email', email)
        .limit(1);

    if (found?.length) {
        const p = found[0];
        const nombre = p.daily_missions?.displayName || p.daily_missions?.fullName || email.split('@')[0];
        document.getElementById('coordUserId').value  = p.user_id;
        document.getElementById('coordNameInput').value = nombre;
        resultEl.className = 'rounded-xl px-4 py-3 text-sm bg-green-50 border border-green-200 text-green-700';
        resultEl.innerHTML = `<i class="fas fa-check-circle mr-2"></i><strong>${nombre}</strong> encontrado — listo para asignar.`;
        btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer';
    } else {
        document.getElementById('coordUserId').value = '';
        resultEl.className = 'rounded-xl px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-600';
        resultEl.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>No se encontró ningún usuario con ese correo. Debe registrarse primero en la plataforma.`;
        btn.disabled = true; btn.style.opacity = '.5'; btn.style.cursor = 'not-allowed';
    }
}

async function saveCoordinator() {
    const name   = document.getElementById('coordNameInput').value.trim();
    const email  = document.getElementById('coordEmailInput').value.trim().toLowerCase();
    const userId = document.getElementById('coordUserId').value;
    const selectedSchools = [...document.querySelectorAll('.coord-school-cb:checked')].map(cb => cb.value);

    if (!userId)              { toast('Busca el usuario por email primero.', 'error'); return; }
    if (!selectedSchools.length) { toast('Selecciona al menos un centro educativo.', 'error'); return; }
    if (!name)                { toast('Ingresa el nombre del coordinador.', 'error'); return; }

    // Insertar una fila por cada escuela seleccionada
    const rows = selectedSchools.map(sid => ({ user_id: userId, school_id: sid, name, email }));
    const { error } = await sb.from('coordinators').upsert(rows, { onConflict: 'user_id,school_id' });
    if (error) { toast('Error: ' + error.message, 'error'); return; }

    // Asignar también en user_schools para que aparezca en la vista de docentes
    const schoolRows = selectedSchools.map(sid => ({ user_id: userId, school_id: sid }));
    await sb.from('user_schools').upsert(schoolRows, { onConflict: 'user_id,school_id' });

    document.getElementById('coordModal').classList.add('hidden');
    toast(`${name} registrado en ${selectedSchools.length} centro(s).`, 'success');
    await loadCoordinators();
}

async function deleteCoordinator(userId, schoolId) {
    if (!confirm('¿Quitar acceso a este coordinador?')) return;
    await sb.from('coordinators').delete().eq('user_id', userId).eq('school_id', schoolId);
    toast('Coordinador eliminado.', 'success');
    await loadCoordinators();
}

// ────────────────────────────────────────────────────────────
// NAVEGACIÓN
// ────────────────────────────────────────────────────────────
function switchView(view) {
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    const vEl = document.getElementById(`${view}View`);
    if (vEl) vEl.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    const bEl = document.querySelector(`.nav-btn[data-view="${view}"]`);
    if (bEl) bEl.classList.add('active');

    if (view==='dashboard')       loadDashboard();
    if (view==='analytics')       { loadAnalytics(); loadResourceDownloadsPanel(); }
    if (view==='users')           loadUsers();
    if (view==='feedback')        loadFeedback();
    if (view==='comments')        loadAdminComments();
    if (view==='cms')             loadCMS();
    if (view==='rutas')           loadLearningPaths();
    if (view==='centros')         { loadSchools(); loadCoordinators(); }
    if (view==='notificaciones')  { loadAnnouncement(); loadPushPanel(); loadBroadcastHistory(); }
    if (view==='firmas')          loadSignatures();
}

function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.add('hidden');
}

// ────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => { switchView(btn.dataset.view); closeSidebar(); })
);

document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('hidden');
});

document.getElementById('logoutAdminBtn')?.addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.href = 'admin-login.html';
});

document.getElementById('newCourseBtn')?.addEventListener('click', () => openCMSModal(null, false));
document.getElementById('closeCmsModal')?.addEventListener('click', () => {
    document.getElementById('cmsModal').classList.add('hidden');
});

// Color picker sync
document.getElementById('csColorPicker')?.addEventListener('input', e => {
    const ci = document.getElementById('csColor');
    if (ci) ci.value = e.target.value;
});
document.getElementById('csColor')?.addEventListener('input', e => {
    const cp = document.getElementById('csColorPicker');
    if (cp && /^#[0-9a-f]{6}$/i.test(e.target.value)) cp.value = e.target.value;
});

// CMS step tabs
document.querySelectorAll('.cms-tab-btn').forEach(btn =>
    btn.addEventListener('click', () => cmsGoStep(parseInt(btn.dataset.step)))
);

document.getElementById('resetAnalyticsBtn')?.addEventListener('click', async () => {
    if (!confirm('¿Resetear analytics? Se eliminarán TODOS los eventos. No se puede deshacer.')) return;
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await sb.from('user_events').delete().neq('id', fakeId);
    await sb.from('resource_views').delete().neq('id', fakeId);
    toast('Analytics reseteados correctamente.');
});

// ────────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────────
async function refreshOnlineCount() {
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // últimos 5 min
    const { count } = await sb.from('progress')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', since);
    const el = document.getElementById('onlineCount');
    if (el) el.textContent = count ?? '—';
}

checkAdminAuth().then(ok => {
    if (!ok) return;
    switchView('dashboard');
    refreshOnlineCount();
    setInterval(refreshOnlineCount, 30_000);
});
