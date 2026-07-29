// app.js - Curso STEAM con Supabase backend y gamificación completa

// ==================== CONFIGURACIÓN DE SUPABASE ====================
// ⚠️ IMPORTANTE: Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = "https://grkjhzkgcmackbafqudu.supabase.co";

// Rutas de aprendizaje — el admin puede modificar masterCert desde el panel
// Se sobreescribe con config de Supabase al cargar (ver loadAppConfig)
let LEARNING_PATHS = [
    { id:'steam20',       label:'Docente STEAM 2.0',    color:'#07B0E4', gradient:'linear-gradient(135deg,#1A6B68,#07B0E4)',  courses:['steam','abp','design-thinking','evaluacion','tipos-estudiantes'] },
    { id:'creativo',      label:'Docente Creativo',      color:'#E83C8D', gradient:'linear-gradient(135deg,#7C3AED,#E83C8D)',  courses:['creatividad','herramientas-tec','abp','storytelling'] },
    { id:'metodologias',  label:'Metodologías Activas',  color:'#F59E0B', gradient:'linear-gradient(135deg,#b45309,#F59E0B)',  courses:['abp','m-learning','flipped-classroom','abv','micro-learning'] },
    { id:'ia',            label:'Docente y la IA',        color:'#10B981', gradient:'linear-gradient(135deg,#065F46,#10B981)',  courses:['ia-fundamentos','ia-tiempo','ia-herramientas','ia-inclusion','ia-ciudadania'] },
    { id:'convivencia',   label:'Clima y Convivencia Escolar', color:'#0891B2', gradient:'linear-gradient(135deg,#155E75,#0891B2)',  courses:['manejo-conductas','sel-docentes','comunicacion-asertiva','disciplina-positiva','bienestar-docente'] },
    { id:'inclusion',     label:'Educación Inclusiva',    color:'#8B5CF6', gradient:'linear-gradient(135deg,#5B21B6,#8B5CF6)',  courses:['educacion-inclusiva','tea-profundidad','discapacidad-down-tdah','lengua-senas-docentes'] },
];
// IDs de cursos requeridos para el certificado maestro (ruta steam20)
// Admin puede cambiarlos desde el panel → se guardan en Supabase tabla app_config
let MASTER_CERT_COURSES = ['steam','abp','design-thinking','evaluacion','tipos-estudiantes'];
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya2poemtnY21hY2tiYWZxdWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjg5MzQsImV4cCI6MjA5NjcwNDkzNH0.2nVTRlhey6HkGs_KZxtCaEp8L2QrvD0NUwY8ZFwZVHY";
// El SDK de Supabase ya registra `window.supabase`; se reasigna con el cliente configurado.
supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fecha local YYYY-MM-DD (usa zona horaria del dispositivo, no UTC)
function localDateStr() { return new Date().toLocaleDateString('en-CA'); }
// Convierte un string 'YYYY-MM-DD' (formato de localDateStr) a un Date en
// hora LOCAL — new Date('YYYY-MM-DD') a secas lo interpreta como UTC
// medianoche, lo que puede mostrar un día antes según la zona horaria.
function _parseLocalDateStr(dateStr) {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    if (!y || !m || !d) return new Date();
    return new Date(y, m - 1, d);
}

// Orden de la ruta de aprendizaje (de primero a último en desbloquearse)
const COURSE_PATH_ORDER = ['design-thinking', 'tipos-estudiantes', 'abp', 'steam', 'evaluacion', 'storytelling'];
if (typeof allCourses !== 'undefined') {
    allCourses.sort((a, b) => {
        const ai = COURSE_PATH_ORDER.indexOf(a.id);
        const bi = COURSE_PATH_ORDER.indexOf(b.id);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    // ── Normalizar IDs de tarjetas ──────────────────────────────────────────
    // 'steam' es legado (IDs numéricos 1..73) y tiene progreso de usuarios → no se toca.
    // Los cursos nuevos también usaban IDs numéricos 1..N, lo que colisionaba en
    // progress.completedCards (la tarjeta "1" de creatividad == la "1" de steam).
    // Prefijamos los IDs numéricos con el id del curso para hacerlos únicos.
    // Seguro: estos cursos son nuevos, ningún usuario tiene progreso previo en ellos.
    allCourses.forEach(course => {
        if (course.id === 'steam') return;
        (course.modules || []).forEach(mod => {
            (mod.cards || []).forEach(card => {
                if (card.id != null && /^[0-9]+$/.test(String(card.id))) {
                    card.id = `${course.id}-${card.id}`;
                }
            });
        });
    });
}

// ── Pertenencia de tarjeta a curso (IDs reales, no prefijos adivinados) ─────
// Usar SIEMPRE esto en vez de mapas de prefijo hardcodeados: varios cursos
// nuevos (creatividad, herramientas-tec, m-learning...) tenían mapas de
// prefijo que no coincidían con el prefijo real ya normalizado arriba
// (`${course.id}-`), dejando el badge "en progreso" del certificado maestro
// roto en silencio para esos cursos.
const _COURSE_CARD_ID_SETS = {};
if (typeof allCourses !== 'undefined') {
    allCourses.forEach(course => {
        _COURSE_CARD_ID_SETS[course.id] = new Set(
            (course.modules || []).flatMap(m => (m.cards || []).map(c => String(c.id)))
        );
    });
}
// Estadística de la pantalla de login (cursos/horas) calculada del contenido
// real — evita que quede desactualizada cada vez que se agrega un curso.
if (typeof allCourses !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const _available = allCourses.filter(c => c.status === 'available');
        const _totalHours = _available.reduce((a, c) => a + (c.durationHours || 0), 0);
        const _elCourses = document.getElementById('loginStatCourses');
        const _elHours = document.getElementById('loginStatHours');
        if (_elCourses) _elCourses.textContent = _available.length;
        if (_elHours) _elHours.textContent = `+${_totalHours}h`;
    });
}

function _cardBelongsToCourse(courseId, cardId) {
    const set = _COURSE_CARD_ID_SETS[courseId];
    const s = String(cardId);
    if (set && set.size) return set.has(s);
    // Fallback si data.js no cargó todavía
    if (courseId === 'steam') return /^\d+$/.test(s);
    return s.startsWith(`${courseId}-`);
}

// Devuelve el examen final de un curso. Si el curso no define `finalExam`
// (cursos nuevos), lo construye automáticamente con sus tarjetas tipo quiz.
function getCourseExam(course) {
    if (course && course.finalExam && Array.isArray(course.finalExam.questions) && course.finalExam.questions.length) {
        return course.finalExam;
    }
    const questions = [];
    (course?.modules || []).forEach(mod => {
        (mod.cards || []).forEach(card => {
            if (card.type === 'quiz' && Array.isArray(card.options) && typeof card.correct === 'number') {
                questions.push({
                    id: questions.length + 1,
                    text: card.question || card.title || `Pregunta ${questions.length + 1}`,
                    options: card.options,
                    correct: card.correct,
                    explanation: card.explanation || ''
                });
            }
        });
    });
    return { title: '📝 Examen Final', passingScore: 70, questions };
}

// ==================== VARIABLES GLOBALES ====================
let currentUser = null;
let currentModule = 1;
let currentCardIndex = 0;
let modulesData = courseData.modules;

// Devuelve el objeto completo del curso activo (no solo sus módulos) — usado para el examen final por curso
function getActiveCourseData() {
    if (typeof allCourses !== 'undefined' && typeof currentCourseId !== 'undefined') {
        const found = allCourses.find(c => c.id === currentCourseId);
        if (found) return found;
    }
    return courseData; // fallback: STEAM
}
let progress = null;
let db = null;
let currentAvatar = "👨‍🏫";
let currentCardStartTime = null;
let currentCardId = null;

// ==================== AVATARES ====================
const avatars = ["👨‍🏫", "👩‍🏫", "🧑‍🚀", "👩‍🔬", "🧙‍♂️", "🦸‍♀️", "🐧", "🤖", "🦉", "⭐"];

// ==================== PREMIOS ====================
const prizes = [
    { id: "prize1", name: "📚 Guía STEAM", desc: "Libro digital exclusivo", xpCost: 150, icon: "📚", sponsor: null },
    { id: "prize2", name: "🎓 Certificado Avanzado", desc: "Reconocimiento adicional", xpCost: 200, icon: "🎓", sponsor: null },
    { id: "prize3", name: "🧩 Kit de materiales", desc: "Para tu salón de clases", xpCost: 500, icon: "🧩", sponsor: "Próximamente" },
    { id: "prize4", name: "☕ Coffee Break", desc: "Gift card", xpCost: 100, icon: "☕", sponsor: null },
    { id: "prize5", name: "📱 Asesoría 1:1", desc: "30 min con Profe Billy", xpCost: 300, icon: "📱", sponsor: null }
];

// ==================== LOGROS ====================
const BADGE_SVG = {
    firstCard:    `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#d1fae5"/><path d="M20 10c-1.1 0-2 .9-2 2v7.17l-2.59-2.58L14 18l6 6 6-6-1.41-1.41L22 19.17V12c0-1.1-.9-2-2-2z" fill="#059669"/><rect x="13" y="27" width="14" height="2" rx="1" fill="#059669"/></svg>`,
    module1:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#dbeafe"/><rect x="12" y="11" width="16" height="20" rx="2" fill="#3b82f6"/><rect x="15" y="16" width="10" height="1.5" rx=".75" fill="white"/><rect x="15" y="19.5" width="10" height="1.5" rx=".75" fill="white"/><rect x="15" y="23" width="7" height="1.5" rx=".75" fill="white"/></svg>`,
    module2:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fef3c7"/><path d="M20 12a2 2 0 012 2v1.27a6 6 0 11-4 0V14a2 2 0 012-2z" fill="#d97706"/><circle cx="20" cy="24" r="3" fill="#fbbf24"/><rect x="16" y="29" width="8" height="2" rx="1" fill="#d97706"/></svg>`,
    module3:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#ede9fe"/><ellipse cx="20" cy="20" rx="8" ry="5" stroke="#7c3aed" stroke-width="1.5" fill="none"/><ellipse cx="20" cy="20" rx="8" ry="5" stroke="#7c3aed" stroke-width="1.5" fill="none" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="8" ry="5" stroke="#7c3aed" stroke-width="1.5" fill="none" transform="rotate(120 20 20)"/><circle cx="20" cy="20" r="2.5" fill="#7c3aed"/></svg>`,
    module4:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fce7f3"/><rect x="13" y="24" width="3" height="6" rx="1" fill="#db2777"/><rect x="18.5" y="19" width="3" height="11" rx="1" fill="#db2777"/><rect x="24" y="14" width="3" height="16" rx="1" fill="#db2777"/><polyline points="13,21 19,16 25,12" stroke="#f9a8d4" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
    module5:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#dcfce7"/><path d="M20 12l2.5 5 5.5.8-4 3.9.9 5.5L20 24.5l-4.9 2.7.9-5.5-4-3.9 5.5-.8z" fill="#16a34a"/></svg>`,
    quizMaster:   `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fef9c3"/><circle cx="20" cy="20" r="8" stroke="#ca8a04" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="2" fill="#ca8a04"/><line x1="20" y1="12" x2="20" y2="10" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="30" x2="20" y2="28" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="10" y2="20" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="20" x2="28" y2="20" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/></svg>`,
    feedbackGiver:`<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#e0f2fe"/><path d="M12 14h16a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 3v-3h-7a2 2 0 01-2-2v-8a2 2 0 012-2z" fill="#0284c7"/><circle cx="17" cy="20" r="1.2" fill="white"/><circle cx="20" cy="20" r="1.2" fill="white"/><circle cx="23" cy="20" r="1.2" fill="white"/></svg>`,
    examPass:     `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#f3e8ff"/><circle cx="20" cy="17" r="6" fill="#7c3aed"/><path d="M15 28l5 4 5-4-1.5-5H16.5z" fill="#7c3aed"/><rect x="18.5" y="14" width="3" height="6" rx="1" fill="white"/><rect x="18.5" y="21" width="3" height="2" rx="1" fill="white"/></svg>`,
    allModules:   `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fef3c7"/><path d="M20 11l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L20 25l-5.6 3 1.1-6.1-4.5-4.4 6.2-.9z" fill="#f59e0b" stroke="#d97706" stroke-width=".5"/><circle cx="20" cy="20" r="3" fill="#fff7ed"/></svg>`,
    streak7:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff7ed"/><path d="M22 11c0 4-4 5-4 9a4 4 0 008 0c0-3-2-5-2-7" fill="#f97316"/><path d="M17 22c0 2 1.5 3.5 3 3.5S23 24 23 22" fill="#fbbf24"/><circle cx="20" cy="30" r="1" fill="#f97316"/></svg>`,
    streak30:     `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fdf4ff"/><path d="M20 12l1.5 3h3.2l-2.6 1.9 1 3.1L20 18.2l-3.1 1.8 1-3.1L15.3 15h3.2z" fill="#a855f7"/><path d="M20 20l1 2h2.1l-1.7 1.2.6 2L20 24l-2 1.2.6-2L17 22h2.1z" fill="#d8b4fe"/><line x1="20" y1="26" x2="20" y2="29" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    level5:       `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fef9c3"/><text x="20" y="25" text-anchor="middle" font-size="16" font-weight="900" fill="#ca8a04" font-family="Arial">5</text><path d="M20 10l1 3h3l-2.5 1.8.9 3-2.4-1.7-2.4 1.7.9-3L16 13h3z" fill="#f59e0b"/></svg>`,
    level10:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fdf4ff"/><text x="20" y="25" text-anchor="middle" font-size="14" font-weight="900" fill="#7c3aed" font-family="Arial">10</text><path d="M20 9l1.2 3.6h3.8l-3.1 2.3 1.2 3.6L20 16.2l-3.1 2.3 1.2-3.6L15 12.6h3.8z" fill="#a855f7"/></svg>`,
    quiz25:       `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fef2f2"/><path d="M14 20l4 4 8-8" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20 11a9 9 0 100 18 9 9 0 000-18z" stroke="#ef4444" stroke-width="1.5" fill="none"/></svg>`,
    perfect10:    `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#f0fdfa"/><polygon points="20,11 22.5,17 29,17 23.5,21 25.5,28 20,24 14.5,28 16.5,21 11,17 17.5,17" fill="none" stroke="#0d9488" stroke-width="1.5"/><polygon points="20,14 21.5,18.5 26,18.5 22.5,21.5 23.8,26 20,23.5 16.2,26 17.5,21.5 14,18.5 18.5,18.5" fill="#14b8a6"/></svg>`,
    streak3:      `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff7ed"/><path d="M21 11c0 3-3 4-3 7a3 3 0 006 0c0-2.5-1.5-4-1.5-6" fill="#fb923c"/><path d="M17.5 22c0 1.5 1.1 2.5 2.5 2.5s2.5-1 2.5-2.5" fill="#fbbf24"/></svg>`,
    earlyBird:    `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fefce8"/><path d="M20 14a6 6 0 100 12 6 6 0 000-12z" fill="#facc15"/><path d="M20 11v-2M20 31v-2M11 20H9M31 20h-2M13.9 13.9l-1.4-1.4M27.5 27.5l-1.4-1.4M13.9 26.1l-1.4 1.4M27.5 12.5l-1.4 1.4" stroke="#eab308" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    noteWriter:   `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#f0f9ff"/><rect x="13" y="12" width="14" height="18" rx="2" fill="#0ea5e9"/><rect x="16" y="17" width="8" height="1.5" rx=".75" fill="white"/><rect x="16" y="20.5" width="8" height="1.5" rx=".75" fill="white"/><rect x="16" y="24" width="5" height="1.5" rx=".75" fill="white"/><path d="M24 12l3 3-2 2-3-3z" fill="#fbbf24"/><path d="M22 16l3-2" stroke="#fbbf24" stroke-width="1" fill="none"/></svg>`,
    applied5:     `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#f0fdf4"/><path d="M14 20a6 6 0 1112 0 6 6 0 01-12 0z" fill="#22c55e"/><path d="M17 20l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20 12v-2M20 30v-2M28 20h2M12 20h-2" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    weeklyChamp:  `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fffbeb"/><path d="M14 14h12v8a6 6 0 01-12 0v-8z" fill="#f59e0b"/><path d="M14 17H11a3 3 0 003 3M26 17h3a3 3 0 01-3 3" stroke="#d97706" stroke-width="1.5" fill="none"/><rect x="16" y="28" width="8" height="2" rx="1" fill="#d97706"/><rect x="14" y="30" width="12" height="2" rx="1" fill="#d97706"/></svg>`,
    masterDocente:`<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fdf4ff"/><path d="M20 12l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L20 25l-5.6 3 1.1-6.1-4.5-4.4 6.2-.9z" fill="#a855f7" stroke="#9333ea" stroke-width=".5"/><circle cx="20" cy="20" r="2.5" fill="#fff"/></svg>`,
};

const badges = {
    firstCard:     { id: "firstCard",     name: "Primer paso",          desc: "Completaste tu primera tarjeta",              icon: "🌱", xpReward: 10  },
    module1:       { id: "module1",       name: "Primer módulo",        desc: "Completaste el Módulo 1 de tu primer curso",  icon: "📘", xpReward: 50  },
    module2:       { id: "module2",       name: "En profundidad",       desc: "Completaste el Módulo 2 de algún curso",      icon: "🔧", xpReward: 50  },
    module3:       { id: "module3",       name: "Metodólogo",           desc: "Completaste el Módulo 3 de algún curso",      icon: "🧠", xpReward: 50  },
    module4:       { id: "module4",       name: "Aplicador",            desc: "Completaste el Módulo 4 de algún curso",      icon: "📊", xpReward: 50  },
    module5:       { id: "module5",       name: "Experto local",        desc: "Completaste el Módulo 5 de algún curso",      icon: "⭐", xpReward: 50  },
    quizMaster:    { id: "quizMaster",    name: "Maestro de quizzes",   desc: "10 quizzes correctos",                        icon: "🎯", xpReward: 30  },
    quiz25:        { id: "quiz25",        name: "Imparable",            desc: "25 quizzes correctos",                        icon: "🏹", xpReward: 75  },
    perfect10:     { id: "perfect10",     name: "Perfeccionista",       desc: "10 quizzes correctos seguidos sin fallar",    icon: "💎", xpReward: 150 },
    feedbackGiver: { id: "feedbackGiver", name: "Tu voz importa",       desc: "Diste feedback en 3 módulos",                 icon: "💬", xpReward: 40  },
    examPass:      { id: "examPass",      name: "Certificado STEAM",    desc: "Aprobaste el examen final",                   icon: "🎓", xpReward: 100 },
    allModules:    { id: "allModules",    name: "STEAM Master",         desc: "Completaste todos los módulos",               icon: "🏆", xpReward: 200 },
    streak7:       { id: "streak7",       name: "Racha de 7 días",      desc: "7 días seguidos aprendiendo",                 icon: "🔥", xpReward: 100 },
    streak30:      { id: "streak30",      name: "Leyenda",              desc: "30 días de racha",                            icon: "⚡", xpReward: 500 },
    streak3:       { id: "streak3",       name: "Constante",            desc: "3 días seguidos aprendiendo",                 icon: "✨", xpReward: 30  },
    earlyBird:     { id: "earlyBird",     name: "Madrugadora STEAM",    desc: "Completaste 5 tarjetas antes de las 8am",     icon: "🌅", xpReward: 80  },
    noteWriter:    { id: "noteWriter",    name: "Apuntes de oro",       desc: "Escribiste notas en 10 tarjetas",             icon: "📝", xpReward: 60  },
    applied5:      { id: "applied5",      name: "Docente en acción",    desc: "Marcaste 5 tarjetas como aplicadas en clase", icon: "🍎", xpReward: 100 },
    weeklyChamp:   { id: "weeklyChamp",   name: "Campeón semanal",      desc: "Terminaste en el top 3 del ranking semanal",  icon: "🥇", xpReward: 200 },
    level5:        { id: "level5",        name: "Nivel 5",              desc: "Alcanzaste el Nivel 5",                       icon: "🌟", xpReward: 100 },
    level10:       { id: "level10",       name: "Nivel 10",             desc: "Alcanzaste el Nivel 10",                      icon: "💫", xpReward: 300 },
};

// ==================== MISIONES DIARIAS Y SEMANALES ====================
const dailyMissionsList = [
    { id: "mission1", name: "Completa 3 tarjetas", icon: "cards", target: 3, type: "cards", reward: 30, current: 0 },
    { id: "mission2", name: "Responde 2 quizzes", icon: "checkCircle", target: 2, type: "quizzes", reward: 25, current: 0 },
    { id: "mission3", name: "Gana 50 XP hoy", icon: "bolt", target: 50, type: "xp", reward: 20, current: 0 }
];

const weeklyMissionsList = [
    { id: "wmission1", name: "Completa 2 módulos esta semana", icon: "modules", target: 2, type: "w_modules", reward: 150, current: 0 },
    { id: "wmission2", name: "Responde 15 quizzes correctos", icon: "target", target: 15, type: "w_quizzes", reward: 120, current: 0 },
    { id: "wmission3", name: "Mantén racha 5 días", icon: "flame", target: 5, type: "w_streak", reward: 100, current: 0 },
    { id: "wmission4", name: "Aplica 3 conceptos en clase", icon: "apple", target: 3, type: "w_applied", reward: 200, current: 0 },
];

// ==================== INICIALIZAR INDEXEDDB ====================
function initDB() {
    return new Promise((resolve, reject) => {
        if (db) { resolve(db); return; }
        const request = indexedDB.open("SteamCourseDB", 3);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => { db = request.result; resolve(db); };
        request.onupgradeneeded = (event) => {
            const dbEvent = event.target.result;
            if (!dbEvent.objectStoreNames.contains("progressCache")) {
                dbEvent.createObjectStore("progressCache", { keyPath: "userId" });
            }
        };
    });
}

function saveToLocalCache(userId, data) {
    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("progressCache", "readwrite");
            const store = tx.objectStore("progressCache");
            store.put({ userId, data, updatedAt: Date.now() });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    });
}

function loadFromLocalCache(userId) {
    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("progressCache", "readonly");
            const store = tx.objectStore("progressCache");
            const request = store.get(userId);
            request.onsuccess = () => resolve(request.result?.data);
            request.onerror = () => reject(request.error);
        });
    });
}

// ==================== SINCRONIZACIÓN CON SUPABASE ====================
async function syncWithSupabase() {
    if (!currentUser || !progress) return;
    // Capturar referencias locales — la sesión puede cambiar durante los awaits
    const _user = currentUser;
    const _prog = progress;
    if (!_user?.id) return;

    updateSyncStatus("syncing", "Sincronizando...");

    try {
        const { error } = await supabase
            .from('progress')
            .upsert({
                user_id: _user.id,
                email: _user.email,
                current_module: currentModule,
                current_card: currentCardIndex,
                completed_cards: _prog.completedCards || [],
                xp: _prog.xp || 0,
                level: _prog.level || 1,
                badges: _prog.badges || [],
                redeemed_prizes: _prog.redeemedPrizes || [],
                quiz_correct_count: _prog.quizCorrectCount || 0,
                streak: _prog.streak || 0,
                last_activity_date: _prog.lastActivityDate || localDateStr(),
                daily_missions: _prog.dailyMissions || {},
                raffle_tickets: _prog.raffleTickets || 0,
                module_feedback: _prog.moduleFeedback || {},
                nps_history: _prog.npsHistory || [],
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;

        await saveToLocalCache(_user.id, _prog);
        updateSyncStatus("online", "✓ Sincronizado");
        setTimeout(() => updateSyncStatus("online", "✓ Sincronizado"), 2000);

    } catch (error) {
        console.error("Error sync:", error);
        updateSyncStatus("offline", "⚠️ Sin conexión");
        if (_user?.id) await saveToLocalCache(_user.id, _prog);
    }
}

async function loadFromSupabase() {
    if (!currentUser) return null;

    try {
        const { data, error } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            return {
                current_module: data.current_module || 1,
                current_card: data.current_card || 0,
                completedCards: data.completed_cards || [],
                xp: data.xp || 0,
                level: data.level || 1,
                badges: data.badges || [],
                redeemedPrizes: data.redeemed_prizes || [],
                quizCorrectCount: data.quiz_correct_count || 0,
                streak: data.streak || 0,
                lastActivityDate: data.last_activity_date,
                dailyMissions: data.daily_missions || {},
                raffleTickets: data.raffle_tickets || 0,
                moduleFeedback: data.module_feedback || {},
                npsHistory: data.nps_history || []
            };
        }
        return null;
    } catch (error) {
        console.error("Error loading:", error);
        return await loadFromLocalCache(currentUser.id);
    }
}

// ==================== AUTENTICACIÓN ====================
function _friendlyAuthError(msg) {
    if (typeof msg !== 'string' || !msg) return 'Error desconocido. Intenta de nuevo.';
    const m = msg.toLowerCase();
    if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Email o contraseña incorrectos.';
    if (m.includes('email not confirmed'))  return 'Confirma tu email antes de ingresar.';
    if (m.includes('rate limit'))           return 'Demasiados intentos. Espera unos minutos.';
    if (m.includes('user already registered')) return 'Este email ya está registrado. Usa "Ingresar".';
    if (m.includes('password'))             return 'La contraseña debe tener al menos 6 caracteres.';
    if (m.includes('email'))               return 'Ingresa un email válido.';
    if (m.includes('network') || m.includes('fetch')) return 'Sin conexión. Verifica tu internet.';
    return msg;
}

async function loginWithEmail(email, password) {
    if (!email || !email.includes('@')) { showLoginError('Ingresa un email válido.'); return false; }
    if (!password || password.length < 6) { showLoginError('La contraseña debe tener al menos 6 caracteres.'); return false; }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        currentUser = data.user;
        await checkUserAdminRole();
        currentAvatar = currentUser.user_metadata?.avatar || "👨‍🏫";
        document.getElementById("avatarPreview").innerHTML = currentAvatar;

        const cloudProgress = await loadFromSupabase();

        if (cloudProgress) {
            progress = cloudProgress;
            currentModule = cloudProgress.current_module || 1;
            currentCardIndex = cloudProgress.current_card || 0;
        } else {
            progress = {
                completedCards: [],
                moduleFeedback: {},
                npsHistory: [],
                xp: 0,
                level: 1,
                badges: [],
                redeemedPrizes: [],
                quizCorrectCount: 0,
                streak: 0,
                lastActivityDate: localDateStr(),
                dailyMissions: {},
                raffleTickets: 0
            };
        }

        // Restaurar nombre y foto desde localStorage — tiene prioridad sobre datos de nube
        // (protege contra sync incompleto antes de cerrar pestaña)
        try {
            if (!progress.dailyMissions) progress.dailyMissions = {};
            // Prioridad: localStorage > user_metadata (Supabase) > daily_missions (ya cargado)
            const _meta = currentUser.user_metadata || {};
            if (_meta.fullName     && !progress.dailyMissions.fullName)     progress.dailyMissions.fullName     = _meta.fullName;
            if (_meta.profilePhoto && !progress.dailyMissions.profilePhoto) progress.dailyMissions.profilePhoto = _meta.profilePhoto;
            if (_meta.school       && !progress.dailyMissions.school)       progress.dailyMissions.school       = _meta.school;
            if (_meta.department   && !progress.dailyMissions.department)   progress.dailyMissions.department   = _meta.department;
            const _pk = `userProfile_${currentUser.id}`;
            const _saved = localStorage.getItem(_pk);
            if (_saved) {
                const _p = JSON.parse(_saved);
                if (_p.fullName)     progress.dailyMissions.fullName     = _p.fullName;
                if (_p.profilePhoto) progress.dailyMissions.profilePhoto = _p.profilePhoto;
                if (_p.school)       progress.dailyMissions.school       = _p.school;
                if (_p.department)   progress.dailyMissions.department   = _p.department;
            }
        } catch(e) {}

        // Restaurar diagDone desde Supabase → localStorage para que no vuelva a aparecer
        // aunque el usuario limpie caché o cambie de navegador
        if (progress.dailyMissions?.diagDone) {
            localStorage.setItem('diagDone', '1');
            if (progress.dailyMissions.diagResult && !localStorage.getItem('diagResult')) {
                localStorage.setItem('diagResult', JSON.stringify(progress.dailyMissions.diagResult));
            }
        }
        if (progress.dailyMissions?.onboardingDone) {
            localStorage.setItem('onboardingDone', '1');
        }

        initExistingModuleDates();
        checkDailyStreak();
        loadDailyMissions();
        startSessionTracking();
        await syncWithSupabase();
        loadPortfolio();
        _refreshPaidCertRefs();
        await loadAppConfig();
        _updatePushToggleUI();
        return true;
    } catch (error) {
        console.error('loginWithEmail error:', error);
        showLoginError(_friendlyAuthError(error?.message));
        return false;
    }
}

async function registerWithEmail(email, password) {
    if (!email || !email.includes('@')) { showLoginError('Ingresa un email válido.'); return false; }
    if (!password || password.length < 6) { showLoginError('La contraseña debe tener al menos 6 caracteres.'); return false; }
    try {
        const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { data: { avatar: "👨‍🏫", created_at: new Date().toISOString() } }
        });
        if (error) throw error;

        currentUser = data.user;
        await checkUserAdminRole();
        currentAvatar = "👨‍🏫";

        progress = {
            completedCards: [],
            moduleFeedback: {},
            npsHistory: [],
            xp: 0,
            level: 1,
            badges: [],
            redeemedPrizes: [],
            quizCorrectCount: 0,
            streak: 1,
            lastActivityDate: localDateStr(),
            dailyMissions: {},
            raffleTickets: 0
        };

        checkDailyStreak();
        loadDailyMissions();
        startSessionTracking();
        await syncWithSupabase();
        showToast("¡Registro exitoso! Bienvenido al curso", "success");
        return true;
    } catch (error) {
        console.error('registerWithEmail error:', error);
        showLoginError(_friendlyAuthError(error?.message));
        return false;
    }
}


async function checkUserAdminRole() {
    if (!currentUser) return;
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .maybeSingle();
        if (!error && data) {
            currentUser.role = data.role;
        } else {
            currentUser.role = 'student';
        }
    } catch (e) {
        currentUser.role = 'student';
    }
}


// ==================== SESSION TRACKING ====================
let _sessionId = null;
let _sessionStart = null;
let _sessionInterval = null;
const _SESSION_HEARTBEAT_MS = 60000; // actualiza duración cada 60s

async function startSessionTracking() {
    if (!currentUser) return;
    // Evitar heartbeats duplicados si hay varios login/logout sin recargar
    if (_sessionInterval) { clearInterval(_sessionInterval); _sessionInterval = null; }
    _sessionId = crypto.randomUUID();
    _sessionStart = Date.now();
    const deviceInfo = {
        ua: navigator.userAgent.slice(0, 200),
        mobile: /Mobi|Android/i.test(navigator.userAgent),
        lang: navigator.language
    };
    await supabase.from('user_sessions').insert({
        id: _sessionId,
        user_id: currentUser.id,
        session_id: _sessionId,
        start_time: new Date().toISOString(),
        duration_seconds: 0,
        device_info: deviceInfo
    });
    // Heartbeat: actualiza duration_seconds cada minuto
    _sessionInterval = setInterval(() => _updateSessionDuration(), _SESSION_HEARTBEAT_MS);
}

async function _updateSessionDuration() {
    if (!_sessionId || !_sessionStart) return;
    const dur = Math.round((Date.now() - _sessionStart) / 1000);
    await supabase.from('user_sessions').update({
        end_time: new Date().toISOString(),
        duration_seconds: dur
    }).eq('id', _sessionId);
}

// Guardar al cerrar/cambiar de pestaña
window.addEventListener('beforeunload', () => { if (_sessionId) _updateSessionDuration(); });
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        _updateSessionDuration();
        // Flush del sync pendiente para no perder el último avance al cerrar
        if (_syncDebounceT) { clearTimeout(_syncDebounceT); _syncDebounceT = null; syncWithSupabase(); }
    }
});

async function logout() {
    // Flush de sincronización pendiente antes de cerrar sesión
    if (_syncDebounceT) { clearTimeout(_syncDebounceT); _syncDebounceT = null; }
    if (currentUser && progress) { try { await syncWithSupabase(); } catch (_) {} }
    await _updateSessionDuration();
    if (_sessionInterval) { clearInterval(_sessionInterval); _sessionInterval = null; }
    _sessionId = null;
    _sessionStart = null;
    await supabase.auth.signOut();
    currentUser = null;
    progress = null;
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("mainApp").classList.add("hidden");
}

async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        await checkUserAdminRole();
        currentAvatar = currentUser.user_metadata?.avatar || "👨‍🏫";
        document.getElementById("avatarPreview").innerHTML = currentAvatar;

        const cloudProgress = await loadFromSupabase();
        if (cloudProgress) {
            progress = cloudProgress;
            currentModule = cloudProgress.current_module || 1;
            currentCardIndex = cloudProgress.current_card || 0;
        } else {
            progress = {
                completedCards: [], moduleFeedback: {}, npsHistory: [], xp: 0, level: 1,
                badges: [], redeemedPrizes: [], quizCorrectCount: 0, streak: 0,
                lastActivityDate: localDateStr(),
                dailyMissions: {}, raffleTickets: 0
            };
        }

        try {
            if (!progress.dailyMissions) progress.dailyMissions = {};
            const _meta = currentUser.user_metadata || {};
            if (_meta.fullName     && !progress.dailyMissions.fullName)     progress.dailyMissions.fullName     = _meta.fullName;
            if (_meta.profilePhoto && !progress.dailyMissions.profilePhoto) progress.dailyMissions.profilePhoto = _meta.profilePhoto;
            if (_meta.school       && !progress.dailyMissions.school)       progress.dailyMissions.school       = _meta.school;
            if (_meta.department   && !progress.dailyMissions.department)   progress.dailyMissions.department   = _meta.department;
            const _pk = `userProfile_${currentUser.id}`;
            const _saved = localStorage.getItem(_pk);
            if (_saved) {
                const _p = JSON.parse(_saved);
                if (_p.fullName)     progress.dailyMissions.fullName     = _p.fullName;
                if (_p.profilePhoto) progress.dailyMissions.profilePhoto = _p.profilePhoto;
                if (_p.school)       progress.dailyMissions.school       = _p.school;
                if (_p.department)   progress.dailyMissions.department   = _p.department;
            }
        } catch(e) {}

        initExistingModuleDates();
        checkDailyStreak();
        loadDailyMissions();
        startSessionTracking();

        document.getElementById("loginScreen").classList.add("hidden");
        loadSavedProgress(true);
        if (typeof loadPortfolio === 'function') loadPortfolio();
        _refreshPaidCertRefs();
        await loadAppConfig();
        _updatePushToggleUI();
        _checkOnboardingRequirements(() => _landOnAppropriateScreen());
        return true;
    }
    return false;
}

function showLoginError(msg) {
    const errorDiv = document.getElementById("loginError");
    errorDiv.textContent = msg;
    errorDiv.classList.remove("hidden");
    setTimeout(() => errorDiv.classList.add("hidden"), 3000);
}

// ==================== FUNCIONES DE GAMIFICACIÓN ====================
// Vibración táctil breve — no-op silencioso en navegadores/dispositivos sin soporte (ej. desktop)
function _haptic(pattern) {
    try { navigator.vibrate?.(pattern); } catch (_) {}
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    // textContent: ningún caller pasa HTML y evita XSS si el mensaje incluye datos de usuario
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateUI() {
    if (!progress) return;
    const module = modulesData[currentModule - 1];
    if (!module) return;

    const totalCards = module.cards.length;
    const cardCounter = document.getElementById("cardCounter");
    if (cardCounter) cardCounter.innerText = `${currentCardIndex + 1} / ${totalCards}`;

    const moduleBadge = document.getElementById("moduleBadge");
    if (moduleBadge) moduleBadge.innerHTML = `Módulo ${currentModule} / ${modulesData.length}`;

    // Nombre dinámico del curso en el encabezado
    const _activeCourse = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === (currentCourseId || 'steam')) : null;
    const _courseLabel = document.getElementById('courseNameLabel');
    if (_courseLabel && _activeCourse) _courseLabel.textContent = _activeCourse.title;

    // Color de la barra de progreso según el curso
    const _courseColor = _activeCourse?.color || 'var(--brand-blue)';
    const _cpBar = document.getElementById('courseProgressBar');
    if (_cpBar) _cpBar.style.background = _courseColor;
    const _cpPct = document.getElementById('courseProgressPercent');
    if (_cpPct) _cpPct.style.color = _courseColor;

    const totalAll = modulesData.reduce((acc, m) => acc + m.cards.length, 0);
    // Filtrar tarjetas completadas del curso activo, usando los IDs reales del curso
    // (antes usaba un mapa de prefijos que solo cubría 5 cursos — el resto marcaba
    // 0% de progreso mientras se estudiaban, porque nunca encontraba coincidencia)
    const _activeCourseId = (currentCourseId || 'steam');
    const completedTotal = (progress.completedCards || []).filter(id => _cardBelongsToCourse(_activeCourseId, id)).length;
    const coursePercent = Math.min(Math.round((completedTotal / totalAll) * 100), 100);
    const courseProgressBar = document.getElementById("courseProgressBar");
    if (courseProgressBar) courseProgressBar.style.width = `${coursePercent}%`;
    const courseProgressPercent = document.getElementById("courseProgressPercent");
    if (courseProgressPercent) courseProgressPercent.innerText = `${coursePercent}%`;

    // Dashboard de bienvenida en Inicio — saludo + resumen del curso activo,
    // para que al entrar se vea el progreso antes de la tarjeta de lección.
    const _homeName = document.getElementById('homeDashName');
    if (_homeName) _homeName.textContent = (typeof getDisplayName === 'function' ? getDisplayName().split(' ')[0] : 'Docente');
    const _homeCourseName = document.getElementById('homeDashCourseName');
    if (_homeCourseName) _homeCourseName.textContent = _activeCourse ? _activeCourse.title : 'Cargando…';
    const _homePct = document.getElementById('homeDashPercent');
    if (_homePct) _homePct.textContent = `${coursePercent}%`;
    const _homeBar = document.getElementById('homeDashBar');
    if (_homeBar) _homeBar.style.width = `${coursePercent}%`;

    // Banner "Ir a examen" cuando el curso está al 100% pero sin examen aprobado
    const _examBannerId = 'courseExamReadyBanner';
    let _examBanner = document.getElementById(_examBannerId);
    const _examScores = progress?.dailyMissions?.examScores || {};
    const _examScore = _examScores[_activeCourseId] ?? (_activeCourseId === 'steam' ? progress?.dailyMissions?.examScore : undefined);
    const _examPassed = _examScore !== undefined && _examScore >= 70;
    // getCourseExam siempre retorna objeto — validar que tenga preguntas reales
    const _hasFinalExam = _activeCourse ? (getCourseExam(_activeCourse).questions || []).length > 0 : false;
    if (coursePercent === 100 && _hasFinalExam && !_examPassed) {
        if (!_examBanner) {
            _examBanner = document.createElement('div');
            _examBanner.id = _examBannerId;
            _examBanner.style.cssText = 'margin:12px 16px 0;padding:14px 16px;background:linear-gradient(135deg,#5C35C5,#7C3AED);border-radius:16px;display:flex;align-items:center;gap:12px;cursor:pointer;box-shadow:0 4px 16px rgba(92,53,197,.35)';
            _examBanner.onclick = () => _showExamPrompt();
            _examBanner.innerHTML = '<span style="font-size:24px">🎓</span><div style="flex:1"><div style="color:white;font-weight:800;font-size:14px">¡Listo para el examen final!</div><div style="color:rgba(255,255,255,.8);font-size:12px">Completa tu certificado — toca aquí para evaluar</div></div><span style="color:white;font-size:18px">→</span>';
            const _insertAfter = document.getElementById('courseProgressPercent')?.closest('.flex') || document.getElementById('courseProgressBar')?.parentElement;
            if (_insertAfter?.parentElement) _insertAfter.parentElement.insertBefore(_examBanner, _insertAfter.nextSibling);
            else document.getElementById('courseScreen')?.prepend(_examBanner);
        }
    } else if (_examBanner) {
        _examBanner.remove();
    }

    const xpDisplay = document.getElementById("xpDisplay");
    if (xpDisplay) xpDisplay.innerText = progress.xp || 0;
    const levelDisplay = document.getElementById("levelDisplay");
    if (levelDisplay) levelDisplay.innerText = progress.level || 1;
    const levelBadge = document.getElementById("levelBadge");
    if (levelBadge) levelBadge.innerText = progress.level || 1;
    const cardsCountDisplay = document.getElementById("cardsCountDisplay");
    if (cardsCountDisplay) cardsCountDisplay.innerText = progress.completedCards?.length || 0;

    // Mostrar nombre/email y foto en perfil
    if (currentUser) {
        const emailEl = document.getElementById("userEmailDisplay");
        if (emailEl) emailEl.textContent = getDisplayName();
        const emailSubEl = document.getElementById("perfilEmailDisplay");
        if (emailSubEl) emailSubEl.textContent = currentUser.email || '';
        const photo = progress?.dailyMissions?.profilePhoto;
        if (photo) updateProfilePhotoDisplay(photo);
    }

    updateStreakDisplay();

    // Ocultar botón de diagnóstico si ya fue completado
    const _diagDone = localStorage.getItem('diagDone') || progress?.dailyMissions?.diagDone;
    const _diagBtn = document.getElementById('diagProfileBtn');
    if (_diagBtn) _diagBtn.classList.toggle('hidden', !!_diagDone);

    // Botón Estadísticas, Compendio y Modo Dev: solo visibles para el admin
    const _isAdmin = currentUser && (currentUser.role === 'admin');
    const _statsBtn = document.getElementById('statsSecretBtn');
    if (_statsBtn) _statsBtn.classList.toggle('hidden', !_isAdmin);
    const _compendio = document.getElementById('compendioLink');
    if (_compendio) _compendio.classList.toggle('hidden', !_isAdmin);
    const _devBtn = document.getElementById('devModeBtn');
    if (_devBtn) _devBtn.classList.toggle('hidden', !_isAdmin);
    _updateDevModeBtn();

    // Master certificate — visible si todos los cursos están aprobados
    _checkMasterCert();
    _updateCertButtonLabels();
    _updateExamBtn();
    renderCourseResources();
    renderBadgesGrid();
    renderPersonalRecords();
}

// ── Acordeón móvil ───────────────────────────────────────────────────
function togglePerfilSection(btn) {
    const body = btn.nextElementSibling;
    if (!body) return;
    const collapsed = body.classList.toggle('collapsed');
    btn.classList.toggle('collapsed', collapsed);
}

// ── Grid de logros + récords personales ────────────────────────────────
function renderBadgesGrid() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    const earned = new Set(progress?.badges || []);
    const list = Object.values(badges);
    const earnedCount = list.filter(b => earned.has(b.id)).length;
    const countEl = document.getElementById('badgesEarnedCount');
    if (countEl) countEl.textContent = earnedCount;
    const totalEl = document.getElementById('badgesTotalCount');
    if (totalEl) totalEl.textContent = list.length;

    const itemHTML = (b) => {
        const done = earned.has(b.id);
        const svg = BADGE_SVG[b.id]
            ? BADGE_SVG[b.id]
            : `<span style="font-size:22px;line-height:1">${b.icon}</span>`;
        return `<button class="badge-grid-item${done?' earned':''}" onclick="showBadgeDetail('${b.id}')">
            <div style="width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                background:${done?'linear-gradient(135deg,#f3e8ff,#ede9fe)':'#f1f5f9'};
                ${done?'':'filter:grayscale(1);opacity:.45'}">
                ${svg}
            </div>
            <span style="font-size:9px;font-weight:800;color:${done?'#5b21b6':'#94a3b8'};text-align:center;line-height:1.2">${b.name}</span>
            <span style="font-size:8px;font-weight:700;padding:1px 7px;border-radius:99px;
                color:${done?'#7c3aed':'#cbd5e1'};background:${done?'#f3e8ff':'#f1f5f9'}">
                ${done?`+${b.xpReward} XP`:'🔒'}</span>
        </button>`;
    };
    grid.innerHTML = list.map(itemHTML).join('');
}

// Ícono SVG de una liga (medalla para Bronce/Plata/Oro, gema para
// Platino/Diamante) — reemplaza los emoji 🥉🥈🥇🪙💎 usados antes en
// Récords personales y en el Ranking, coloreado con currentColor.
function _leagueIconSvg(leagueName, sizePx) {
    const size = sizePx || 16;
    const shape = (leagueName === 'Platino' || leagueName === 'Diamante') ? ICONS.gem : ICONS.medal;
    return `<span style="display:inline-flex;width:${size}px;height:${size}px;vertical-align:-3px">${shape}</span>`;
}

// Récords personales: solo métricas que sí podemos calcular honestamente
// con los datos que ya guardamos — no se inventan tiers ni historial que
// no existe. La liga se deriva del nivel (que nunca baja), así que la
// liga ACTUAL ya es, por definición, la más alta alcanzada.
function renderPersonalRecords() {
    const row = document.getElementById('personalRecordsRow');
    const ladder = document.getElementById('leagueLadder');
    if (!row) return;

    // Ladder de ligas al estilo Duolingo: se muestran TODAS las ligas en
    // orden, no solo la actual — la alcanzada y las anteriores en color, las
    // que faltan en gris/bloqueadas. La liga se deriva del nivel (que nunca
    // baja), así que la liga actual ya es, por definición, la más alta.
    const LEAGUES = [
        { name: 'Bronce',   min: 1,  color: '#b45309' },
        { name: 'Plata',    min: 3,  color: '#64748b' },
        { name: 'Oro',      min: 5,  color: '#f59e0b' },
        { name: 'Platino',  min: 8,  color: '#8b5cf6' },
        { name: 'Diamante', min: 11, color: '#06b6d4' },
    ];
    const level = progress?.level || 1;
    let currentIdx = 0;
    LEAGUES.forEach((l, i) => { if (level >= l.min) currentIdx = i; });
    const league = LEAGUES[currentIdx];

    if (ladder) {
        ladder.innerHTML = `
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Liga actual: ${league.name}</p>
            <div style="display:flex;justify-content:space-between;gap:4px">
            ${LEAGUES.map((l, i) => {
                const unlocked = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return `<div style="flex:1;text-align:center;min-width:0">
                    <div style="width:42px;height:42px;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;color:${isCurrent ? l.color : (unlocked ? l.color : '#94a3b8')};
                        background:${unlocked ? l.color + '1f' : '#f1f5f9'};
                        border:2px solid ${isCurrent ? l.color : (unlocked ? l.color + '55' : '#e2e8f0')};
                        ${unlocked ? '' : 'filter:grayscale(1);opacity:.5'}">${_leagueIconSvg(l.name, 22)}</div>
                    <span style="font-size:9px;font-weight:800;color:${isCurrent ? l.color : '#94a3b8'}">${l.name}</span>
                </div>`;
            }).join('')}
            </div>`;
    }

    const longestStreak = Math.max(progress?.longestStreak || 0, progress?.streak || 0);

    const xpLog = progress?.dailyMissions?.xpLog || [];
    const todayXP = progress?.dailyMissions?.dailyXP || 0;
    const bestDayXP = Math.max(todayXP, ...xpLog.map(d => d.xp || 0), 0);

    const totalCards = progress?.completedCards?.length || 0;

    const records = [
        { icon: ICONS.flame, bg: '#fef2f2', value: longestStreak, label: 'Racha más larga' },
        { icon: ICONS.bolt, bg: '#eff6ff', value: bestDayXP, label: 'Más XP en un día' },
        { icon: ICONS.library, bg: '#f0fdf4', value: totalCards, label: 'Tarjetas completadas' },
    ];
    row.innerHTML = records.map(r => `
        <div class="record-card">
            <div class="record-icon" style="background:${r.bg};color:#334155"><span style="display:inline-flex;width:18px;height:18px">${r.icon}</span></div>
            <div class="record-value">${r.value}</div>
            <div class="record-label">${r.label}</div>
        </div>`).join('');
}

function showBadgeDetail(badgeId) {
    const b = badges[badgeId];
    if (!b) return;
    const earned = new Set((progress?.badges || []));
    if (!earned.has(badgeId)) { showBadgesModal(); return; }
    _showBadgeUnlockOverlay(b, false);
}

function showBadgeUnlockAnimation(badge) {
    setTimeout(() => _showBadgeUnlockOverlay(badge, true), 600);
}

function _showBadgeUnlockOverlay(badge, isNew) {
    const svg = BADGE_SVG[badge.id] || '';
    const colors = ['#a78bfa','#f59e0b','#34d399','#f472b6','#60a5fa'];
    const particles = Array.from({length: 12}, (_,i) => {
        const angle = (i / 12) * 360;
        const dist = 80 + Math.random() * 60;
        const tx = Math.round(Math.cos(angle * Math.PI/180) * dist);
        const ty = Math.round(Math.sin(angle * Math.PI/180) * dist);
        const color = colors[i % colors.length];
        return `<div class="badge-particle" style="background:${color};left:calc(50% - 4px);top:calc(50% - 4px);--tx:${tx}px;--ty:${ty}px"></div>`;
    }).join('');

    const overlay = document.createElement('div');
    overlay.className = 'badge-unlock-overlay';
    overlay.innerHTML = `
        <div class="badge-unlock-card" onclick="this.parentElement._close()">
            <div class="badge-unlock-rays"></div>
            ${particles}
            <div class="badge-unlock-icon">${svg}</div>
            <p class="badge-unlock-new">${isNew ? '¡Nuevo logro desbloqueado!' : 'Insignia obtenida'}</p>
            <p class="badge-unlock-name">${badge.name}</p>
            <p class="badge-unlock-desc">${badge.desc}</p>
            <span class="badge-unlock-xp">⭐ +${badge.xpReward} XP</span>
            <p style="font-size:11px;color:rgba(255,255,255,.3);margin-top:14px">Toca para cerrar</p>
        </div>`;
    overlay._close = () => {
        overlay.classList.add('hiding');
        setTimeout(() => overlay.remove(), 500);
    };
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay._close(); });
    document.body.appendChild(overlay);
    if (isNew) setTimeout(() => overlay._close(), 5000);
}

function updateSyncStatus(status, message) {
    const syncSpan = document.getElementById("syncStatus");
    if (syncSpan) syncSpan.innerHTML = message;
    const syncIcon = document.querySelector("#syncIndicator i");
    if (syncIcon) {
        if (typeof ICONS !== 'undefined') {
            if (status === "syncing") { syncIcon.style.color = '#eab308'; syncIcon.innerHTML = ICONS.spinner || ''; }
            else if (status === "offline") { syncIcon.style.color = '#9ca3af'; syncIcon.innerHTML = ICONS.cloudUp || ''; }
            else { syncIcon.style.color = '#34d399'; syncIcon.innerHTML = ICONS.cloudOk || ''; }
        }
    }
}

// Banner persistente de "sin conexión" — independiente del ícono de sync,
// visible mientras dure la desconexión (no un toast que desaparece solo)
function _showOfflineBanner() {
    if (document.getElementById('offlineBanner')) return;
    const el = document.createElement('div');
    el.id = 'offlineBanner';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:300;background:#78716c;color:white;text-align:center;padding:calc(6px + env(safe-area-inset-top, 0px)) 12px 6px;font-size:12px;font-weight:600;font-family:inherit';
    el.textContent = '📴 Sin conexión — tu progreso se guarda localmente';
    document.body.appendChild(el);
}
function _hideOfflineBanner() {
    document.getElementById('offlineBanner')?.remove();
}
window.addEventListener('offline', _showOfflineBanner);
window.addEventListener('online', _hideOfflineBanner);
if (!navigator.onLine) _showOfflineBanner();

// Debounce del upsert a Supabase: una acción (tarjeta+XP+logro) dispara
// saveProgress varias veces seguidas; agrupamos en un solo upsert.
let _syncDebounceT = null;
const _SYNC_DEBOUNCE_MS = 1000;

function saveProgress() {
    if (!progress) return;
    localStorage.setItem("steamProgressBackup", JSON.stringify(progress));
    if (currentUser) saveToLocalCache(currentUser.id, progress);
    if (navigator.onLine && currentUser) {
        clearTimeout(_syncDebounceT);
        _syncDebounceT = setTimeout(() => { _syncDebounceT = null; syncWithSupabase(); }, _SYNC_DEBOUNCE_MS);
    }
    updateUI();
    checkBadges();
}

function addXP(amount, reason) {
    if (!progress) return;
    progress.xp += amount;
    // Trackear XP diario
    if (!progress.dailyMissions) progress.dailyMissions = {};
    progress.dailyMissions.dailyXP = (progress.dailyMissions.dailyXP || 0) + amount;
    progress.dailyMissions.weeklyXP = (progress.dailyMissions.weeklyXP || 0) + amount;
    _updateDailyXPBar();
    showToast(`+${amount} XP ✨ (${reason})`, "success");
    // Micro-animación en el contador de XP del top bar
    const xpEl = document.getElementById('xpDisplay');
    if (xpEl) {
        xpEl.classList.remove('xp-pop');
        void xpEl.offsetWidth;
        xpEl.classList.add('xp-pop');
        setTimeout(() => xpEl.classList.remove('xp-pop'), 450);
    }

    const newLevel = Math.floor(progress.xp / 200) + 1;
    if (newLevel > progress.level) {
        progress.level = newLevel;
        _haptic([30, 50, 30, 50, 30]);
        showToast(`🎉 ¡SUBISTE AL NIVEL ${newLevel}!`, "levelup");
        if (newLevel === 5 && !progress.badges.includes("level5")) unlockBadge("level5");
        if (newLevel === 10 && !progress.badges.includes("level10")) unlockBadge("level10");
        progress.raffleTickets = (progress.raffleTickets || 0) + 1;
    }

    updateMissionProgress("xp", amount);
    saveProgress();
    updateUI();
}

function unlockBadge(badgeId) {
    if (progress.badges.includes(badgeId)) return;
    const badge = badges[badgeId];
    if (!badge) return;
    progress.badges.push(badgeId);
    addXP(badge.xpReward, `Logro: ${badge.name}`);
    saveProgress();
    _haptic([20, 30, 20, 30, 60]);
    showBadgeUnlockAnimation(badge);
}

function checkBadges() {
    if (!progress) return;
    if (progress.completedCards.length >= 1 && !progress.badges.includes("firstCard")) unlockBadge("firstCard");

    let modulesCompleted = 0;
    for (let i = 1; i <= modulesData.length; i++) {
        const moduleCardIds = modulesData[i - 1].cards.map(c => String(c.id));
        const completedInModule = moduleCardIds.filter(id => progress.completedCards.includes(id)).length;
        if (completedInModule === moduleCardIds.length) {
            modulesCompleted++;
            const _badgeKey = `module${i}`;
            if (!progress.badges.includes(_badgeKey)) {
                const _courseName = (typeof allCourses !== 'undefined' && allCourses.find(c => c.id === (currentCourseId || 'steam')))?.title || 'el curso';
                badges[_badgeKey].desc = `Módulo ${i} de ${_courseName}`;
                unlockBadge(_badgeKey);
            }
        }
    }
    if (modulesCompleted === modulesData.length && !progress.badges.includes("allModules")) unlockBadge("allModules");

    const qc = progress.quizCorrectCount || 0;
    if (qc >= 10  && !progress.badges.includes("quizMaster"))  unlockBadge("quizMaster");
    if (qc >= 25  && !progress.badges.includes("quiz25"))       unlockBadge("quiz25");

    // Perfeccionista: 10 quizzes correctos seguidos
    if ((progress.dailyMissions?.quizStreak || 0) >= 10 && !progress.badges.includes("perfect10")) unlockBadge("perfect10");

    const feedbackCount = Object.keys(progress.moduleFeedback || {}).length;
    if (feedbackCount >= 3 && !progress.badges.includes("feedbackGiver")) unlockBadge("feedbackGiver");

    // Notas en tarjetas
    const noteCount = Object.keys(progress.dailyMissions?.cardNotes || {}).length;
    if (noteCount >= 10 && !progress.badges.includes("noteWriter")) unlockBadge("noteWriter");

    // Lo apliqué en clase
    const appliedCount = (progress.dailyMissions?.appliedCards || []).length;
    if (appliedCount >= 5 && !progress.badges.includes("applied5")) unlockBadge("applied5");

    // Madrugadora: tarjetas antes de las 8am
    if ((progress.dailyMissions?.earlyBirdCards || 0) >= 5 && !progress.badges.includes("earlyBird")) unlockBadge("earlyBird");

    // Nivel 10
    if ((progress.level || 1) >= 10 && !progress.badges.includes("level10")) unlockBadge("level10");
}

function checkDailyStreak() {
    const today = localDateStr();
    const lastActivity = progress.lastActivityDate;

    if (!lastActivity) {
        progress.streak = 1;
        progress.lastActivityDate = today;
        saveProgress();
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');

    if (lastActivity === today) return;
    else if (lastActivity === yesterdayStr) {
        progress.streak = (progress.streak || 0) + 1;
        progress.lastActivityDate = today;
        saveProgress();
        if (progress.streak === 7 && !progress.badges.includes("streak7")) unlockBadge("streak7");
        if (progress.streak === 30 && !progress.badges.includes("streak30")) unlockBadge("streak30");
        if (progress.streak % 5 === 0) addXP(20, `Racha de ${progress.streak} días`);
    } else {
        // ¿Tiene freeze disponible?
        const freezes = progress.dailyMissions?.streakFreezes || 0;
        if (progress.streak > 1 && freezes > 0) {
            progress.dailyMissions.streakFreezes = freezes - 1;
            progress.lastActivityDate = today;
            saveProgress();
            showToast(`🧊 ¡Protector de racha usado! Te quedan ${freezes - 1}`, "info");
        } else {
            if (progress.streak > 1) showToast(`😢 Se rompió tu racha de ${progress.streak} días`, "warning");
            progress.streak = 1;
            progress.lastActivityDate = today;
            saveProgress();
        }
    }
    // Insignias de racha
    if (progress.streak >= 3  && !progress.badges.includes("streak3"))  unlockBadge("streak3");
    if (progress.streak >= 7  && !progress.badges.includes("streak7"))  unlockBadge("streak7");
    if (progress.streak >= 30 && !progress.badges.includes("streak30")) unlockBadge("streak30");
    // Récord personal de racha más larga — no había historial antes de este
    // campo, así que arranca igualada a la racha actual la primera vez.
    progress.longestStreak = Math.max(progress.longestStreak || 0, progress.streak || 0);
    updateStreakDisplay();
}

// Regalar un freeze cada lunes si el docente completó al menos 3 tarjetas la semana pasada
function _checkWeeklyFreeze() {
    const today = new Date();
    if (today.getDay() !== 1) return; // solo lunes
    const dm = progress.dailyMissions || {};
    const lastFreezeWeek = dm.lastFreezeWeek || '';
    const thisWeek = `${today.getFullYear()}-W${_isoWeek(today)}`;
    if (lastFreezeWeek === thisWeek) return;
    const wCards = dm.weeklyMissions?.find(m => m.id === 'wmission1')?.current || 0;
    if (wCards >= 1) { // completó al menos 1 módulo la semana pasada
        const cur = dm.streakFreezes || 0;
        if (cur < 2) { // máximo 2 freezes acumulados
            dm.streakFreezes = cur + 1;
            dm.lastFreezeWeek = thisWeek;
            saveProgress();
            showToast('🧊 ¡Ganaste un Protector de Racha por tu actividad semanal!', 'success');
        }
    }
}

function _isoWeek(d) {
    const date = new Date(d);
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 3 - (date.getDay()+6)%7);
    const week1 = new Date(date.getFullYear(),0,4);
    return 1 + Math.round(((date-week1)/86400000 - 3 + (week1.getDay()+6)%7)/7);
}

function updateStreakDisplay() {
    const streakSpan = document.getElementById("streakDisplay");
    if (streakSpan) streakSpan.innerText = progress.streak || 0;
}

// ==================== MISIONES DIARIAS ====================
function loadDailyMissions() {
    const today = localDateStr();
    const savedMissions = progress.dailyMissions || {};

    if (savedMissions.date !== today) {
        const newMissions = dailyMissionsList.map(m => ({ ...m, current: 0, completed: false, claimed: false }));
        // Preservar campos de perfil, exámenes y desbloqueos de módulos que también viven en dailyMissions
        const { fullName, profilePhoto, examScores, examScore, examDates, masterExamScore, masterExamScores,
                masterExamDate, masterExamDates, coursePositions, diagResult, diagDone, onboardingDone, portfolioByPath,
                portfolioAiTotal, portfolioScores, portfolioFeedback, portfolioSummary,
                portfolioAttempts, portfolioLastAttempt,
                // persistentes entre días:
                cardNotes, appliedCards, streakFreezes, lastFreezeWeek,
                weeklyMissions, weeklyMissionsDate, weeklyXP, quizStreak, earlyBirdCards, xpLog } = savedMissions;
        // Snapshot del XP del día que termina, para la gráfica de Progreso (histórico acumulativo)
        const prevXpLog = Array.isArray(xpLog) ? xpLog : [];
        const newXpLog = savedMissions.date
            ? [...prevXpLog, { date: savedMissions.date, xp: savedMissions.dailyXP || 0 }].slice(-60)
            : prevXpLog;
        // Extraer todas las claves de bloqueo de módulos (moduleStart_* y moduleEarlyUnlock_*)
        const moduleKeys = {};
        Object.keys(savedMissions).forEach(k => {
            if (k.startsWith('moduleStart_') || k.startsWith('moduleEarlyUnlock_')) {
                moduleKeys[k] = savedMissions[k];
            }
        });
        progress.dailyMissions = {
            date: today, missions: newMissions,
            dailyXP: 0, // reinicia XP diario
            ...moduleKeys,
            ...(fullName        && { fullName }),
            ...(profilePhoto    && { profilePhoto }),
            ...(examScores      && { examScores }),
            ...(examScore !== undefined && { examScore }),
            ...(examDates       && { examDates }),
            ...(masterExamScore !== undefined && { masterExamScore }),
            ...(masterExamScores && { masterExamScores }),
            ...(masterExamDate  && { masterExamDate }),
            ...(masterExamDates && { masterExamDates }),
            ...(coursePositions && { coursePositions }),
            ...(diagResult      && { diagResult }),
            ...(diagDone        && { diagDone }),
            ...(onboardingDone  && { onboardingDone }),
            ...(portfolioByPath && { portfolioByPath }),
            ...(portfolioAiTotal !== undefined && { portfolioAiTotal }),
            ...(portfolioScores  && { portfolioScores }),
            ...(portfolioFeedback && { portfolioFeedback }),
            ...(portfolioSummary && { portfolioSummary }),
            ...(portfolioAttempts !== undefined && { portfolioAttempts }),
            ...(portfolioLastAttempt && { portfolioLastAttempt }),
            // persistentes:
            ...(cardNotes       && { cardNotes }),
            ...(appliedCards    && { appliedCards }),
            ...(streakFreezes !== undefined && { streakFreezes }),
            ...(lastFreezeWeek  && { lastFreezeWeek }),
            ...(weeklyMissions  && { weeklyMissions }),
            ...(weeklyMissionsDate && { weeklyMissionsDate }),
            ...(weeklyXP !== undefined && { weeklyXP }),
            ...(quizStreak !== undefined && { quizStreak }),
            ...(earlyBirdCards !== undefined && { earlyBirdCards }),
            ...(newXpLog.length && { xpLog: newXpLog }),
        };
        saveProgress();
    }

    // Inicializar misiones semanales si es necesario (reinician cada lunes)
    _initWeeklyMissions();
    _checkWeeklyFreeze();

    renderDailyMissions();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hoursLeft = Math.round((tomorrow - new Date()) / (1000 * 60 * 60));
    const resetSpan = document.getElementById("missionsReset");
    if (resetSpan) resetSpan.innerText = `Reinicia en ${hoursLeft}h`;
}

function renderProgresoTab() {
    // El widget de referidos vivía en Perfil — ahora vive en Progreso
    // (sección "Misiones y retos"), junto con las demás formas de ganar XP.
    if (typeof displayReferralLink === 'function') displayReferralLink();
    if (typeof checkReferrerReward === 'function') checkReferrerReward();

    const xpEl = document.getElementById('progresoXP');
    const levelEl = document.getElementById('progresoLevel');
    const streakEl = document.getElementById('progresoStreak');
    const cardsEl = document.getElementById('progresoCards');
    if (xpEl) xpEl.innerText = progress.xp || 0;
    if (levelEl) levelEl.innerText = progress.level || 1;
    if (streakEl) streakEl.innerText = progress.streak || 0;
    if (cardsEl) cardsEl.innerText = (progress.completedCards || []).length;

    const chartBox = document.getElementById('progresoChart');
    if (!chartBox) return;
    const log = (progress.dailyMissions?.xpLog || []).slice(-14);
    const todayXP = progress.dailyMissions?.dailyXP || 0;
    const todayStr = localDateStr();
    const points = (log.length && log[log.length - 1].date === todayStr)
        ? [...log.slice(0, -1), { date: todayStr, xp: todayXP }]
        : [...log, { date: todayStr, xp: todayXP }];

    if (points.length < 3) {
        chartBox.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Aún no hay suficiente historial para mostrar tu tendencia.<br>Sigue estudiando cada día y aquí verás tu progreso 📈</p>`;
        return;
    }

    const w = 300, h = 120, pad = 8;
    const max = Math.max(...points.map(p => p.xp), 20);
    const stepX = (w - pad * 2) / (points.length - 1);
    const coords = points.map((p, i) => {
        const x = pad + i * stepX;
        const y = h - pad - ((p.xp / max) * (h - pad * 2));
        return { x, y, ...p };
    });
    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${h - pad} L${coords[0].x.toFixed(1)},${h - pad} Z`;
    const dots = coords.map(c => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="2.5" fill="#07B0E4"><title>${c.date}: ${c.xp} XP</title></circle>`).join('');

    chartBox.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:120px">
            <path d="${areaPath}" fill="#07B0E4" fill-opacity="0.08"/>
            <path d="${linePath}" fill="none" stroke="#07B0E4" stroke-width="2"/>
            ${dots}
        </svg>
        <div class="flex justify-between text-[10px] text-slate-300 mt-1">
            <span>${coords[0].date.slice(5)}</span>
            <span>${coords[coords.length - 1].date.slice(5)}</span>
        </div>`;
}

function _updateDailyXPBar() {
    const bar = document.getElementById('dailyXPBar');
    const label = document.getElementById('dailyXPLabel');
    if (!bar && !label) return;
    const daily = progress.dailyMissions?.dailyXP || 0;
    const goal = 100;
    const pct = Math.min((daily / goal) * 100, 100);
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = `${daily}/${goal} XP hoy`;
}

function renderDailyMissions() {
    const container = document.getElementById("missionsList");
    if (!container) return;
    const missions = progress.dailyMissions?.missions || [];
    const wMissions = progress.dailyMissions?.weeklyMissions || [];
    const dailyXP = progress.dailyMissions?.dailyXP || 0;
    const dailyGoal = 100;
    const dailyPct = Math.min((dailyXP / dailyGoal) * 100, 100);
    const freezes = progress.dailyMissions?.streakFreezes || 0;

    const _missionRow = (m, weekly = false) => {
        const pct = Math.min((m.current / m.target) * 100, 100);
        const claimFn = weekly ? `claimWeeklyMissionReward` : `claimMissionReward`;
        const statusIcon = m.completed ? (m.claimed ? ICONS.checkCircle : ICONS.unlock) : ICONS.hourglass;
        const statusColor = m.completed ? (m.claimed ? '#16a34a' : '#f59e0b') : '#94a3b8';
        return `<div class="flex items-center gap-2 py-1.5">
            <span style="display:inline-flex;width:18px;height:18px;color:${statusColor};flex-shrink:0">${statusIcon}</span>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[11px] font-semibold ${m.completed ? 'text-green-600' : 'text-gray-700'} truncate">${m.name}</span>
                    <span class="text-[10px] text-yellow-600 font-bold ml-1 flex-shrink-0">+${m.reward} XP</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5"><div class="h-1.5 rounded-full transition-all" style="width:${pct}%;background:${m.completed?'#22c55e':'#f59e0b'}"></div></div>
                <div class="text-[9px] text-gray-400 mt-0.5">${m.current}/${m.target}</div>
            </div>
            ${m.completed && !m.claimed ? `<button onclick="${claimFn}('${m.id}')" class="flex-shrink-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold hover:bg-green-600 transition">¡Reclamar!</button>` : ''}
        </div>`;
    };

    container.innerHTML = `
        <!-- Barra XP diario -->
        <div class="mb-3 p-2.5 rounded-xl" style="background:#fefce8;border:1px solid #fde68a">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold text-yellow-700" style="display:inline-flex;align-items:center;gap:4px"><span style="display:inline-flex;width:13px;height:13px">${ICONS.star}</span>Meta diaria</span>
                <span id="dailyXPLabel" class="text-[11px] font-bold text-yellow-600">${dailyXP}/${dailyGoal} XP hoy</span>
            </div>
            <div class="w-full bg-yellow-100 rounded-full h-2">
                <div id="dailyXPBar" class="h-2 rounded-full transition-all" style="width:${dailyPct}%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div>
            </div>
            ${dailyPct >= 100 ? `<div class="text-[10px] text-green-600 font-bold mt-1 text-center" style="display:flex;align-items:center;justify-content:center;gap:4px"><span style="display:inline-flex;width:12px;height:12px">${ICONS.checkCircle}</span>¡Meta del día alcanzada!</div>` : ''}
        </div>
        ${freezes > 0 ? `<div class="mb-2 flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold"><span style="display:inline-flex;width:13px;height:13px">${ICONS.snowflake}</span> ${freezes} Protector${freezes>1?'es':''} de Racha disponible${freezes>1?'s':''}</div>` : ''}
        <!-- Tabs -->
        <div class="flex gap-1 mb-2" id="missionTabBtns">
            <button onclick="_switchMissionTab('daily')" id="mTabDaily" class="flex-1 text-[11px] font-bold py-1.5 rounded-lg transition" style="background:#0f172a;color:white">Diarias</button>
            <button onclick="_switchMissionTab('weekly')" id="mTabWeekly" class="flex-1 text-[11px] font-bold py-1.5 rounded-lg transition" style="background:#f1f5f9;color:#64748b">Semanales</button>
        </div>
        <div id="missionTabDaily">${missions.length ? missions.map(m => _missionRow(m, false)).join('') : '<p class="text-xs text-gray-400 text-center py-2">Sin misiones</p>'}</div>
        <div id="missionTabWeekly" style="display:none">${wMissions.length ? wMissions.map(m => _missionRow(m, true)).join('') : '<p class="text-xs text-gray-400 text-center py-2">Sin misiones semanales</p>'}</div>`;
}

function _switchMissionTab(tab) {
    document.getElementById('missionTabDaily').style.display  = tab === 'daily'  ? '' : 'none';
    document.getElementById('missionTabWeekly').style.display = tab === 'weekly' ? '' : 'none';
    document.getElementById('mTabDaily').style.cssText  = tab === 'daily'  ? 'flex:1;font-size:11px;font-weight:700;padding:6px;border-radius:8px;border:none;cursor:pointer;background:#0f172a;color:white' : 'flex:1;font-size:11px;font-weight:700;padding:6px;border-radius:8px;border:none;cursor:pointer;background:#f1f5f9;color:#64748b';
    document.getElementById('mTabWeekly').style.cssText = tab === 'weekly' ? 'flex:1;font-size:11px;font-weight:700;padding:6px;border-radius:8px;border:none;cursor:pointer;background:#0f172a;color:white' : 'flex:1;font-size:11px;font-weight:700;padding:6px;border-radius:8px;border:none;cursor:pointer;background:#f1f5f9;color:#64748b';
}

function _initWeeklyMissions() {
    const dm = progress.dailyMissions || {};
    const today = new Date();
    const thisWeek = `${today.getFullYear()}-W${_isoWeek(today)}`;
    if (dm.weeklyMissionsDate === thisWeek && Array.isArray(dm.weeklyMissions)) return;
    dm.weeklyMissions = weeklyMissionsList.map(m => ({ ...m, current: 0, completed: false, claimed: false }));
    dm.weeklyMissionsDate = thisWeek;
    dm.weeklyXP = 0;
    progress.dailyMissions = dm;
    saveProgress();
}

function updateMissionProgress(type, amount = 1) {
    const missions = progress.dailyMissions?.missions || [];
    let updated = false;
    missions.forEach(mission => {
        if (!mission.completed && mission.type === type) {
            mission.current += amount;
            if (mission.current >= mission.target) {
                mission.completed = true;
                showToast(`🎯 ¡Misión diaria: ${mission.name}! Reclama tu recompensa`, "success");
            }
            updated = true;
        }
    });
    // Misiones semanales
    const wMissions = progress.dailyMissions?.weeklyMissions || [];
    const wType = 'w_' + type.replace(/^w_/, '');
    wMissions.forEach(m => {
        if (!m.completed && m.type === wType) {
            m.current += amount;
            if (m.current >= m.target) {
                m.completed = true;
                showToast(`🏆 ¡Misión semanal: ${m.name}! Reclama tu recompensa`, "success");
            }
            updated = true;
        }
    });
    if (updated) { saveProgress(); renderDailyMissions(); }
}

function claimMissionReward(missionId) {
    const missions = progress.dailyMissions?.missions || [];
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.completed && !mission.claimed) {
        mission.claimed = true;
        addXP(mission.reward, `Misión diaria: ${mission.name}`);
        saveProgress();
        renderDailyMissions();
    }
}

function claimWeeklyMissionReward(missionId) {
    const wMissions = progress.dailyMissions?.weeklyMissions || [];
    const mission = wMissions.find(m => m.id === missionId);
    if (mission && mission.completed && !mission.claimed) {
        mission.claimed = true;
        addXP(mission.reward, `Misión semanal: ${mission.name}`);
        saveProgress();
        renderDailyMissions();
    }
}

function generateLevelCertificate(level) {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F3F4F6'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 10; ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = '#1E3A8A'; ctx.font = 'bold 24px Arial'; ctx.fillText(`CERTIFICADO DE NIVEL ${level}`, 150, 100);
    ctx.font = '18px Arial'; ctx.fillStyle = '#333';
    ctx.fillText(`Otorgado a: ${currentUser.email || currentUser.id.substring(0, 10)}`, 120, 180);
    ctx.fillText(`Por alcanzar el Nivel ${level} en el Curso STEAM`, 120, 250);
    ctx.fillText(`Fecha: ${new Date().toLocaleDateString()}`, 200, 320);
    const link = document.createElement('a');
    link.download = `certificado_nivel_${level}.png`;
    link.href = canvas.toDataURL();
    link.click();
    showToast(`📜 Certificado de Nivel ${level} generado`, "success");
}

// ==================== UTILIDADES DE TEXTO ====================
function _mdToHtml(text) {
    if (!text) return '';
    if (typeof marked !== 'undefined') {
        return marked.parse(text, { breaks: true, gfm: true });
    }
    // Fallback manual si marked no carga
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// ==================== FUNCIONES BASE DEL CURSO ====================
function renderCard() {
    const module = modulesData[currentModule - 1];
    if (!module) return;
    const card = module.cards[currentCardIndex];
    if (!card) return;
    const container = document.getElementById("cardContainer");
    if (!container) return;

    // Iniciar tracking de tiempo
    if (currentCardId) stopCardTracking();
    currentCardId = card.id || `${currentModule}-${currentCardIndex}`;
    startCardTracking();

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (card.type === "content") {
        // Habilitar navegación normal en tarjetas de contenido
        if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = "1"; }

        const cardId = card.id ? String(card.id) : `${currentModule}-${currentCardIndex}`;
        if (!progress.completedCards.includes(cardId)) {
            progress.completedCards.push(cardId);
            updateMissionProgress("cards", 1);
            // Madrugadora STEAM
            const _h = new Date().getHours();
            if (_h < 8) { if (!progress.dailyMissions) progress.dailyMissions = {}; progress.dailyMissions.earlyBirdCards = (progress.dailyMissions.earlyBirdCards || 0) + 1; }
            saveProgress();
            checkBadges();
        }

        const _courseTheme = (typeof getCourseThemeAndIllus !== 'undefined')
            ? getCourseThemeAndIllus(currentCourseId || 'steam', currentModule)
            : { theme: MODULE_THEME?.[currentModule] || { primary: '#0097A7', soft: '#E0F7FA' }, illus: MODULE_ILLUSTRATIONS?.[currentModule] || '' };
        const theme = _courseTheme.theme;
        const illus = _courseTheme.illus;
        const totalCards = module.cards.length;
        const profeName = getDisplayName();
        const cardContent = _mdToHtml((card.content || '').replace(/Profe Billy/g, profeName));
        const _rawExtra = typeof card.extra === 'object' && card.extra !== null
            ? (card.extra.tip || '')
            : (card.extra || '');
        const cardExtra = _mdToHtml(_rawExtra.replace(/Profe Billy/g, profeName));

        container.innerHTML = `
        <div class="content-card" id="activeCard">
            <div class="card-banner" style="background:${theme.primary}">
                <div class="card-banner-svg">${illus}</div>
                <p class="card-banner-sub">${module.title} &nbsp;·&nbsp; ${currentCardIndex + 1} de ${totalCards}</p>
            </div>
            <div class="card-body">
                <h2>${card.title}</h2>
                ${(() => {
                    const words = ((card.content||'') + ' ' + (card.extra||'')).split(/\s+/).length;
                    const mins = Math.max(1, Math.round(words / 200));
                    return `<div style="font-size:10px;color:#94a3b8;margin-bottom:6px">⏱ ~${mins} min de lectura</div>`;
                })()}
                <div class="card-md">${cardContent}</div>
                ${cardExtra ? `
                <div class="card-key-insight" style="background:${theme.soft};border-color:${theme.primary};color:#1e293b">
                    <span style="font-weight:800;color:#0f172a">💡 Dato clave:</span>
                    <div class="card-md card-md-extra">${cardExtra}</div>
                </div>` : ''}
            </div>
            ${card.project ? `
            <div class="card-footer">
                <button onclick="showProjectModal(${JSON.stringify(card).replace(/"/g, '&quot;')})"
                    class="w-full text-white font-bold py-2.5 rounded-2xl text-sm transition flex items-center justify-center gap-2"
                    style="background:${theme.primary}">
                    📋 Ver instrucciones para implementar en clase
                </button>
            </div>` : ''}
            <!-- Botones "Lo apliqué" + "Mis notas" -->
            <div id="cardActionsRow" class="px-4 pb-1 flex gap-2">
                ${(() => {
                    const cardKey = String(card.id ?? (currentModule+'-'+currentCardIndex));
                    const applied = (progress.dailyMissions?.appliedCards || []).includes(cardKey);
                    const hasNote = !!(progress.dailyMissions?.cardNotes?.[cardKey]);
                    return `
                    <button onclick="toggleApplied('${cardKey}')" id="appliedBtn_${cardKey}"
                        class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border text-xs font-semibold transition"
                        style="${applied ? 'background:#dcfce7;border-color:#86efac;color:#15803d' : 'background:white;border-color:#e2e8f0;color:#64748b'}">
                        🍎 ${applied ? '¡Ya lo apliqué!' : 'Lo apliqué en clase'}
                    </button>
                    <button onclick="toggleCardNote('${cardKey}')" id="noteBtn_${cardKey}"
                        class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border text-xs font-semibold transition"
                        style="${hasNote ? 'background:#eff6ff;border-color:#93c5fd;color:#1d4ed8' : 'background:white;border-color:#e2e8f0;color:#64748b'}">
                        📝 ${hasNote ? 'Ver mi nota' : 'Agregar nota'}
                    </button>`;
                })()}
            </div>
            <!-- Área de nota (oculta por defecto) -->
            ${(() => {
                const cardKey = String(card.id ?? (currentModule+'-'+currentCardIndex));
                const savedNote = progress.dailyMissions?.cardNotes?.[cardKey] || '';
                return `<div id="noteArea_${cardKey}" style="display:${savedNote?'block':'none'}" class="px-4 pb-2">
                    <textarea id="noteInput_${cardKey}" placeholder="Escribe tus apuntes aquí…"
                        oninput="saveCardNote('${cardKey}', this.value)"
                        class="w-full text-xs rounded-xl border border-blue-200 p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                        rows="3" style="background:#eff6ff;color:#1e3a5f">${savedNote}</textarea>
                </div>`;
            })()}
            <div class="card-swipe-hint" style="display:flex;align-items:center;justify-content:center;gap:6px">
                <span style="display:inline-flex;width:13px;height:13px;opacity:.5">${ICONS?.arrowLeft||'←'}</span>
                <span style="font-size:10px;opacity:.5">desliza para navegar</span>
                <span style="display:inline-flex;width:13px;height:13px;opacity:.5">${ICONS?.arrowRight||'→'}</span>
            </div>
            <div class="px-4 pb-3">
                <button id="commentCountBtn" onclick="showCardComments('${String(card.id)}')"
                    class="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition">
                    <span style="display:inline-flex;width:15px;height:15px;color:#94a3b8;flex-shrink:0">${ICONS?.comments||''}</span><span>Comentarios y dudas</span><span style="background:#f1f5f9;color:#94a3b8;font-size:10px;font-weight:600;padding:1px 8px;border-radius:20px;margin-left:5px">...</span>
                </button>
            </div>
        </div>`;

        // Cargar conteo de comentarios en background
        const _cntCardId = String(card.id);
        _fetchCommentCount(_cntCardId).then(n => _updateCommentCountBtn(_cntCardId, n));

    } else if (card.type === "quiz") {
        // Bloquear botón Siguiente hasta responder correctamente
        if (nextBtn) { nextBtn.disabled = true; nextBtn.style.opacity = "0.4"; }

        // Shuffle de opciones (seed por cardId para que sea consistente en repaso)
        const _seed = String(card.id ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const _shuffled = card.options.map((opt, i) => ({ opt, orig: i }));
        for (let i = _shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(((_seed * (i + 7)) % (i + 1) + (i + 1)) % (i + 1));
            [_shuffled[i], _shuffled[j]] = [_shuffled[j], _shuffled[i]];
        }
        const _correctShuffled = _shuffled.findIndex(s => s.orig === card.correct);

        let optionsHtml = "";
        _shuffled.forEach((item, idx) => {
            optionsHtml += `
            <button class="quiz-option w-full text-left p-3 rounded-2xl mb-2" data-opt="${idx}" data-orig="${item.orig}">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="text-gray-700 text-sm font-medium">${item.opt}</span>
            </button>`;
        });

        const quizSvg = (typeof QUIZ_SVG !== 'undefined') ? QUIZ_SVG : '';
        const quizThemePrimary = '#4f46e5';

        container.innerHTML = `
        <div class="quiz-card" id="activeCard">
            <div class="card-banner" style="background:${quizThemePrimary}">
                <div class="card-banner-svg">${quizSvg}</div>
                <p class="card-banner-sub">✅ &nbsp;Quiz · Módulo ${currentModule}</p>
            </div>
            <div class="card-body">
                <h2>${card.question}</h2>
                <div id="quizOptions">${optionsHtml}</div>
                <div id="quizFeedback" class="hidden mt-3 p-3 rounded-2xl text-sm font-medium"></div>
                <p id="quizHint" class="text-center text-xs text-gray-400 mt-3" style="display:flex;align-items:center;justify-content:center;gap:5px">
                    <span style="display:inline-flex;width:14px;height:14px">${ICONS?.pointer||'👆'}</span> Selecciona una respuesta para continuar
                </p>
            </div>
        </div>`;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                // Desactivar todos los botones tras responder
                document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

                const selected = parseInt(btn.dataset.opt);
                const isCorrect = (selected === _correctShuffled);
                _haptic(isCorrect ? 15 : [20, 40, 20]);
                const feedbackDiv = document.getElementById('quizFeedback');
                const hint = document.getElementById('quizHint');
                if (hint) hint.classList.add('hidden');

                // Marcar visualmente la opción seleccionada
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                if (!isCorrect) {
                    // Mostrar también la correcta (usar índice en el orden shuffled)
                    document.querySelectorAll('.quiz-option').forEach(b => {
                        if (parseInt(b.dataset.opt) === _correctShuffled) b.classList.add('correct');
                    });
                }

                if (feedbackDiv) {
                    feedbackDiv.classList.remove('hidden');
                    if (isCorrect) {
                        feedbackDiv.className = 'mt-3 p-3 rounded-2xl text-sm font-medium bg-green-50 text-green-700 border border-green-200';
                        feedbackDiv.innerHTML = `<span style="display:inline-flex;width:16px;height:16px;vertical-align:middle;margin-right:4px">${ICONS?.checkCircle||'✓'}</span> ¡Correcto! ${card.explanation}`;
                        const cardId = card.id ? String(card.id) : `${currentModule}-${currentCardIndex}`;
                        if (!progress.completedCards.includes(cardId)) {
                            progress.completedCards.push(cardId);
                            addXP(10, `Quiz correcto: ${card.title || (card.question ? card.question.slice(0, 40) + (card.question.length > 40 ? '…' : '') : 'tarjeta')}`);
                            progress.quizCorrectCount = (progress.quizCorrectCount || 0) + 1;
                            // Racha de quizzes correctos seguidos
                            if (!progress.dailyMissions) progress.dailyMissions = {};
                            progress.dailyMissions.quizStreak = (progress.dailyMissions.quizStreak || 0) + 1;
                            _removeFromWrong(card.id ?? (currentModule+'-'+currentCardIndex));
                            updateMissionProgress("quizzes", 1);
                            // Misión semanal de quizzes
                            const _wm = progress.dailyMissions?.weeklyMissions || [];
                            _wm.forEach(m => { if (!m.completed && m.type === 'w_quizzes') { m.current++; if (m.current >= m.target) { m.completed = true; showToast(`🏆 ¡Misión semanal: ${m.name}!`, 'success'); } } });
                            // Madrugadora
                            const _hr = new Date().getHours();
                            if (_hr < 8) progress.dailyMissions.earlyBirdCards = (progress.dailyMissions.earlyBirdCards || 0) + 1;
                            saveProgress();
                            checkBadges();
                        }
                        // Habilitar Siguiente (el usuario avanza manualmente)
                        if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = "1"; }
                    } else {
                        // Reset racha de quizzes
                        if (progress.dailyMissions) progress.dailyMissions.quizStreak = 0;
                        // Guardar para modo repaso
                        if (!progress.dailyMissions) progress.dailyMissions = {};
                        if (!progress.dailyMissions.wrongQuizzes) progress.dailyMissions.wrongQuizzes = [];
                        const _wqKey = String(card.id ?? (currentModule+'-'+currentCardIndex));
                        if (!progress.dailyMissions.wrongQuizzes.includes(_wqKey)) progress.dailyMissions.wrongQuizzes.push(_wqKey);
                        saveProgress();
                        feedbackDiv.className = 'mt-3 p-3 rounded-2xl text-sm font-medium bg-red-50 text-red-700 border border-red-200';
                        feedbackDiv.innerHTML = `<span style="display:inline-flex;width:16px;height:16px;vertical-align:middle;margin-right:4px">${ICONS?.xCircle||'✗'}</span> Incorrecto. ${card.explanation}
                            <button onclick="goToRefCard()" class="mt-2 block w-full text-center text-xs font-bold text-indigo-600 hover:underline py-1" style="display:flex;align-items:center;justify-content:center;gap:4px"><span style="display:inline-flex;width:12px;height:12px">${ICONS?.arrowLeft||''}</span> Repasar tarjeta relacionada</button>`;
                        if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = "1"; }
                    }
                }
            });
        });
    } else if (card.type === "simulation") {
        if (nextBtn) { nextBtn.disabled = true; nextBtn.style.opacity = "0.4"; }

        const _courseTheme = (typeof getCourseThemeAndIllus !== 'undefined')
            ? getCourseThemeAndIllus(currentCourseId || 'steam', currentModule)
            : { theme: { primary: '#7C3AED', soft: '#EDE9FE' }, illus: '' };
        const simTheme = _courseTheme.theme;

        container.innerHTML = `
        <div class="simulation-card" id="activeCard">
            <div class="card-banner" style="background:${simTheme.primary}">
                <div class="card-banner-svg">${_courseTheme.illus}</div>
                <p class="card-banner-sub">🎭 &nbsp;Simulación · Módulo ${currentModule} · ${currentCardIndex + 1} de ${module.cards.length}</p>
            </div>
            <div class="card-body">
                <h2>${card.title}</h2>
                <div class="sim-scenario" style="background:${simTheme.soft};border-left:4px solid ${simTheme.primary};border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:0.93rem;line-height:1.55;color:#374151">
                    ${_mdToHtml(card.scenario || '')}
                </div>
                <p class="sim-statement" style="font-weight:700;font-size:1rem;color:#1e293b;margin-bottom:20px;text-align:center">"${card.statement || ''}"</p>
                <div id="simFeedback" class="hidden mt-2 p-4 rounded-2xl text-sm font-medium"></div>
            </div>
            <div class="sim-actions" id="simActions">
                <button id="simLeftBtn" onclick="handleSimulation('left')" class="sim-btn sim-btn-left">
                    <span style="display:inline-flex;width:28px;height:28px;margin:0 auto 4px">${ICONS?.xMark||'✗'}</span><br><span>En desacuerdo</span><br><small>desliza ←</small>
                </button>
                <button id="simRightBtn" onclick="handleSimulation('right')" class="sim-btn sim-btn-right">
                    <span style="display:inline-flex;width:28px;height:28px;margin:0 auto 4px">${ICONS?.check||'✓'}</span><br><span>De acuerdo</span><br><small>→ desliza</small>
                </button>
            </div>
        </div>`;

        // Store simulation data for swipe handler
        container.dataset.simCorrect = card.correctSwipe || 'right';
        container.dataset.simRight = card.rightOutcome || '';
        container.dataset.simLeft = card.leftOutcome || '';
        container.dataset.simPrimary = simTheme.primary;
        container.dataset.simSoft = simTheme.soft;

        // Swipe gesture for simulation
        let _simTouchX = 0;
        let _simTouchY = 0;
        let _simDragging = false;
        const _simCard = document.getElementById('activeCard');
        if (_simCard) {
            _simCard.addEventListener('touchstart', e => {
                _simTouchX = e.touches[0].clientX;
                _simTouchY = e.touches[0].clientY;
                _simDragging = true;
                _simCard.style.transition = 'none';
            }, { passive: true });
            _simCard.addEventListener('touchmove', e => {
                if (!_simDragging) return;
                const diffX = e.touches[0].clientX - _simTouchX;
                const diffY = e.touches[0].clientY - _simTouchY;
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    const rotation = diffX / 12;
                    _simCard.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
                }
            }, { passive: true });
            _simCard.addEventListener('touchend', e => {
                if (!_simDragging) return;
                _simDragging = false;
                const diffX = e.changedTouches[0].clientX - _simTouchX;
                _simCard.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease';
                if (diffX > 80) {
                    _simCard.style.transform = 'translateX(120%) rotate(10deg)';
                    _simCard.style.opacity = '0';
                    setTimeout(() => {
                        handleSimulation('right');
                        _simCard.style.transition = 'none';
                        _simCard.style.transform = 'translateX(0) rotate(0deg)';
                        _simCard.style.opacity = '1';
                        void _simCard.offsetWidth; // trigger reflow
                        _simCard.style.transition = 'transform 0.25s ease, opacity 0.2s ease';
                    }, 250);
                } else if (diffX < -80) {
                    _simCard.style.transform = 'translateX(-120%) rotate(-10deg)';
                    _simCard.style.opacity = '0';
                    setTimeout(() => {
                        handleSimulation('left');
                        _simCard.style.transition = 'none';
                        _simCard.style.transform = 'translateX(0) rotate(0deg)';
                        _simCard.style.opacity = '1';
                        void _simCard.offsetWidth; // trigger reflow
                        _simCard.style.transition = 'transform 0.25s ease, opacity 0.2s ease';
                    }, 250);
                } else {
                    _simCard.style.transform = 'translateX(0) rotate(0deg)';
                }
            });
        }
    } else if (card.type === 'project') {
        // Tarjeta de proyecto (caso de estudio / actividad práctica)
        const cardId = card.id ? String(card.id) : `${currentModule}-${currentCardIndex}`;
        if (!progress.completedCards.includes(cardId)) {
            progress.completedCards.push(cardId);
            updateMissionProgress('cards', 1);
            saveProgress();
        }
        if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = '1'; }

        const _ct = (typeof getCourseThemeAndIllus !== 'undefined')
            ? getCourseThemeAndIllus(currentCourseId || 'steam', currentModule)
            : { theme: { primary: '#5C35C5', soft: '#EDE9FE' }, illus: '' };
        const pt = _ct.theme;

        const _section = (emoji, title, items) => items?.length ? `
            <div style="margin-bottom:14px">
                <p style="font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em;color:${pt.primary};margin-bottom:8px">${emoji} ${title}</p>
                <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px">
                    ${items.map(i => `<li style="font-size:.9rem;color:#374151;line-height:1.5">${i}</li>`).join('')}
                </ul>
            </div>` : '';

        container.innerHTML = `
        <div id="activeCard" style="border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
            <div style="background:${pt.primary};padding:20px 20px 16px;position:relative">
                <div style="position:absolute;inset:0;opacity:.12">${_ct.illus}</div>
                <p style="color:rgba(255,255,255,.75);font-size:.78rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">🛠️ Proyecto · Módulo ${currentModule}</p>
                <h2 style="color:white;font-size:1.15rem;font-weight:800;line-height:1.3;margin:0">${card.title || 'Proyecto práctico'}</h2>
            </div>
            <div style="background:white;padding:18px 20px 20px">
                ${card.description ? `<p style="font-size:.92rem;color:#374151;line-height:1.6;margin-bottom:16px;padding:12px 14px;background:${pt.soft};border-radius:12px;border-left:3px solid ${pt.primary}">${card.description}</p>` : ''}
                ${card.objective ? `<div style="margin-bottom:14px"><p style="font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em;color:${pt.primary};margin-bottom:6px">🎯 Objetivo</p><p style="font-size:.9rem;color:#374151;line-height:1.5">${card.objective}</p></div>` : ''}
                ${_section('📦', 'Materiales', card.materials)}
                ${card.steps?.length ? `<div style="margin-bottom:14px"><p style="font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em;color:${pt.primary};margin-bottom:8px">📋 Pasos</p><ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px">${card.steps.map(s => `<li style="font-size:.9rem;color:#374151;line-height:1.5">${s}</li>`).join('')}</ol></div>` : ''}
                ${card.think?.length || card.make?.length || card.improve?.length ? `
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:4px">
                    ${card.think?.length ? `<div style="background:#eff6ff;border-radius:12px;padding:10px"><p style="font-weight:700;font-size:.75rem;color:#1d4ed8;margin-bottom:6px">💭 Think</p><ul style="margin:0;padding-left:14px">${card.think.map(t=>`<li style="font-size:.75rem;color:#374151;line-height:1.45;margin-bottom:3px">${t}</li>`).join('')}</ul></div>` : ''}
                    ${card.make?.length  ? `<div style="background:#f0fdf4;border-radius:12px;padding:10px"><p style="font-weight:700;font-size:.75rem;color:#15803d;margin-bottom:6px">🔨 Make</p><ul style="margin:0;padding-left:14px">${card.make.map(m=>`<li style="font-size:.75rem;color:#374151;line-height:1.45;margin-bottom:3px">${m}</li>`).join('')}</ul></div>` : ''}
                    ${card.improve?.length ? `<div style="background:#fefce8;border-radius:12px;padding:10px"><p style="font-weight:700;font-size:.75rem;color:#a16207;margin-bottom:6px">🔄 Improve</p><ul style="margin:0;padding-left:14px">${card.improve.map(i=>`<li style="font-size:.75rem;color:#374151;line-height:1.45;margin-bottom:3px">${i}</li>`).join('')}</ul></div>` : ''}
                </div>` : ''}
            </div>
        </div>`;
    }
    // Registrar swipe en cada tarjeta nueva (touch + mouse)
    initSwipe();
}

function handleSimulation(direction) {
    const container = document.getElementById('cardContainer');
    const actions = document.getElementById('simActions');
    const feedback = document.getElementById('simFeedback');
    const nextBtn = document.getElementById('nextBtn');
    if (!container || !feedback) return;

    const correct = container.dataset.simCorrect;
    const isCorrect = (direction === correct);
    const outcome = direction === 'right' ? container.dataset.simRight : container.dataset.simLeft;
    const primary = container.dataset.simPrimary || '#7C3AED';

    if (actions) actions.style.display = 'none';

    const swipeLabel = direction === 'right' ? '→ De acuerdo' : '← En desacuerdo';
    feedback.classList.remove('hidden');
    const _continueBtn = `<button onclick="goToNextCard()" style="margin-top:14px;width:100%;padding:10px 0;border-radius:14px;background:${primary};color:#fff;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">Continuar <span style="display:inline-flex;width:14px;height:14px">${ICONS?.arrowRight||'→'}</span></button>`;

    if (isCorrect) {
        feedback.className = 'mt-2 p-4 rounded-2xl text-sm font-medium bg-green-50 text-green-800 border border-green-200';
        feedback.innerHTML = `<div style="font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px"><span style="display:inline-flex;width:18px;height:18px;color:#16a34a">${ICONS?.checkCircle||'✓'}</span> ¡Decisión acertada! (${swipeLabel})</div>${_mdToHtml(outcome)}${_continueBtn}`;
        const _modC = modulesData[currentModule - 1];
        const _cardC = _modC?.cards[currentCardIndex];
        const _cidC = _cardC?.id || `${currentModule}-${currentCardIndex}`;
        if (!progress.completedCards.includes(_cidC)) {
            progress.completedCards.push(_cidC);
            addXP(15, 'Simulación completada');
            updateMissionProgress("cards", 1);
            saveProgress();
        }
    } else {
        feedback.className = 'mt-2 p-4 rounded-2xl text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200';
        feedback.innerHTML = `<div style="font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px"><span style="display:inline-flex;width:18px;height:18px;color:#d97706">${ICONS?.lightbulb||'💡'}</span> Reflexiona... (${swipeLabel})</div>${_mdToHtml(outcome)}${_continueBtn}`;
        const _modW = modulesData[currentModule - 1];
        const _cardW = _modW?.cards[currentCardIndex];
        const _cidW = _cardW?.id || `${currentModule}-${currentCardIndex}`;
        if (!progress.completedCards.includes(_cidW)) {
            progress.completedCards.push(_cidW);
            updateMissionProgress("cards", 1);
            saveProgress();
        }
    }
    if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = "1"; }
}

function startCardTracking() {
    if (currentCardId) {
        currentCardStartTime = Date.now();
    }
}

function stopCardTracking() {
    if (currentCardId && currentCardStartTime && currentUser) {
        const timeSpent = Math.round((Date.now() - currentCardStartTime) / 1000);
        if (timeSpent > 0) {
            supabase.from('resource_views').insert({
                resource_type: 'card',
                resource_id: currentCardId,
                user_id: currentUser.id,
                time_spent_seconds: Math.min(timeSpent, 300)
            }).then(({ error: e }) => { if (e) console.log("Track error:", e); });
        }
        currentCardStartTime = null;
    }
}

function animateCard(direction) {
    const card = document.getElementById('activeCard');
    if (!card) return;
    card.classList.remove('slide-in-left', 'slide-in-right');
    void card.offsetWidth; // reflow
    card.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
}

function showComingSoon() {
    showToast('🎁 ¡Muy pronto! Los premios estarán disponibles próximamente.');
}

function _saveCoursePosition() {
    if (!progress || !currentCourseId) return;
    if (!progress.dailyMissions) progress.dailyMissions = {};
    if (!progress.dailyMissions.coursePositions) progress.dailyMissions.coursePositions = {};
    progress.dailyMissions.coursePositions[currentCourseId] = { module: currentModule, card: currentCardIndex };
}

function goToNextCard(animateExit = true) {
    const module = modulesData[currentModule - 1];
    if (!module) return;
    if (currentCardIndex + 1 < module.cards.length) {
        const action = () => {
            currentCardIndex++;
            _saveCoursePosition();
            saveProgress();
            renderCard();
            animateCard('next');
            updateMissionProgress("cards", 1);
        };
        if (animateExit) {
            const card = document.getElementById('activeCard');
            if (card) {
                card.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
                card.style.transform = 'translateX(-120%) rotate(-10deg)';
                card.style.opacity = '0';
            }
            setTimeout(action, 200);
        } else {
            action();
        }
    } else if (currentModule < modulesData.length) {
        stopCardTracking();
        showModuleComplete(currentModule, () => askModuleFeedback(currentModule));
    } else {
        stopCardTracking();
        showModuleComplete(currentModule, () => askModuleFeedback(currentModule));
    }
}

function goToPrevCard(animateExit = true) {
    const action = () => {
        _saveCoursePosition();
        saveProgress();
        renderCard();
        animateCard('prev');
    };
    if (currentCardIndex > 0) {
        const update = () => {
            currentCardIndex--;
            action();
        };
        if (animateExit) {
            const card = document.getElementById('activeCard');
            if (card) {
                card.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
                card.style.transform = 'translateX(120%) rotate(10deg)';
                card.style.opacity = '0';
            }
            setTimeout(update, 200);
        } else {
            update();
        }
    } else if (currentModule > 1) {
        const update = () => {
            currentModule--;
            const prevModule = modulesData[currentModule - 1];
            currentCardIndex = prevModule.cards.length - 1;
            action();
        };
        if (animateExit) {
            const card = document.getElementById('activeCard');
            if (card) {
                card.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
                card.style.transform = 'translateX(120%) rotate(10deg)';
                card.style.opacity = '0';
            }
            setTimeout(update, 200);
        } else {
            update();
        }
    }
}

function askModuleFeedback(moduleId) {
    const _feedbackKey = `${currentCourseId || 'steam'}-${moduleId}`;
    if (progress.moduleFeedback?.[_feedbackKey]) { continueToNextModule(); return; }
    const moduleName = modulesData[moduleId - 1]?.title || `Módulo ${moduleId}`;
    const feedbackHtml = `<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"><div class="bg-white rounded-2xl max-w-md w-full p-6"><h2 class="text-xl font-bold text-indigo-800 mb-2">📝 ¿Cómo te fue en ${moduleName}?</h2><div class="mb-4"><label class="block font-medium mb-2">Satisfacción (1-5)</label><div class="flex gap-2 justify-between" id="ratingStars">${[1, 2, 3, 4, 5].map(n => `<button data-rating="${n}" class="rating-star text-3xl text-gray-300 hover:text-yellow-400 transition">★</button>`).join('')}</div><input type="hidden" id="selectedRating" value="0"></div><div class="mb-4"><label class="block font-medium mb-2">NPS (0-10): ¿Recomendarías este curso a otro docente?</label><div class="grid grid-cols-6 gap-1">${[0,1,2,3,4,5,6,7,8,9,10].map(n => `<button data-nps="${n}" class="nps-btn w-9 h-9 rounded-full bg-gray-200 hover:bg-indigo-500 hover:text-white transition text-sm">${n}</button>`).join('')}</div><input type="hidden" id="selectedNPS" value="-1"></div><div id="lowScorePrompt" style="display:none;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:10px 12px;margin-bottom:10px;font-size:13px;color:#92400e">💬 <strong>¿Qué podríamos mejorar?</strong> Tu opinión nos ayuda a hacer el curso mejor.</div><div class="mb-4"><textarea id="feedbackComment" rows="3" class="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Comentario o sugerencia (opcional)"></textarea></div><div class="flex gap-2"><button id="submitFeedbackBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex-1 transition">Enviar</button><button id="skipFeedbackBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition">Omitir</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', feedbackHtml);

    document.querySelectorAll('.nps-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nps = parseInt(btn.dataset.nps);
            document.getElementById('selectedNPS').value = nps;
            document.querySelectorAll('.nps-btn').forEach(b => { b.classList.remove('bg-indigo-500', 'text-white'); b.classList.add('bg-gray-200'); });
            btn.classList.add('bg-indigo-500', 'text-white');
            // Mostrar campo obligatorio si NPS ≤ 6
            const lowMsg = document.getElementById('lowScorePrompt');
            if (lowMsg) lowMsg.style.display = nps <= 6 ? 'block' : 'none';
        });
    });
    document.querySelectorAll('.rating-star').forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            document.getElementById('selectedRating').value = rating;
            document.querySelectorAll('.rating-star').forEach((s, i) => { if (i < rating) s.classList.add('text-yellow-400'); else s.classList.remove('text-yellow-400'); });
            // Mostrar campo obligatorio si satisfacción ≤ 2
            const lowMsg = document.getElementById('lowScorePrompt');
            if (lowMsg) lowMsg.style.display = rating <= 2 ? 'block' : 'none';
        });
    });
    document.getElementById('submitFeedbackBtn').addEventListener('click', () => {
        const rating = parseInt(document.getElementById('selectedRating').value);
        const nps = parseInt(document.getElementById('selectedNPS').value);
        const comment = document.getElementById('feedbackComment').value;
        if (rating === 0) { alert("Por favor, selecciona una calificación de 1 a 5"); return; }
        if (nps === -1) { alert("Por favor, selecciona un puntaje NPS del 0 al 10"); return; }
        // Si puntaje bajo, el comentario es obligatorio
        if ((nps <= 6 || rating <= 2) && !comment.trim()) {
            alert("Por favor cuéntanos por qué calificaste así — tu opinión nos ayuda a mejorar.");
            document.getElementById('feedbackComment').focus();
            return;
        }
        progress.moduleFeedback[_feedbackKey] = { moduleName, rating, nps, comment, timestamp: new Date().toISOString(), moduleId, courseId: currentCourseId || 'steam' };
        progress.npsHistory = progress.npsHistory || [];
        progress.npsHistory.push({ moduleId, moduleName, nps, timestamp: new Date().toISOString() });
        // Guardar también en tabla feedback para que el admin lo pueda ver
        supabase.from('feedback').insert({
            user_id: currentUser.id,
            module_id: moduleId,
            module_name: moduleName,
            rating,
            nps,
            comment: comment || null,
            created_at: new Date().toISOString()
        }).then(({ error: e }) => { if (e) console.log("Feedback insert error:", e); });
        addXP(20, `Feedback módulo ${moduleId}`);
        saveProgress();
        document.querySelector('.fixed.bg-black.bg-opacity-50').remove();
        continueToNextModule();
    });
    document.getElementById('skipFeedbackBtn').addEventListener('click', () => {
        document.querySelector('.fixed.bg-black.bg-opacity-50').remove();
        continueToNextModule();
    });
}

// ==================== BLOQUEO DE MÓDULOS ====================
// Para usuarios existentes que ya avanzaron, marcamos todos los módulos anteriores
// al actual como desbloqueados desde hoy (no retroactivo = no castigo).
function initExistingModuleDates() {
    if (!progress || !currentModule) return;
    const now = new Date().toISOString();
    for (let m = 2; m <= currentModule; m++) {
        if (!getModuleStartDate(m)) {
            setModuleStartDate(m, now);
            setModuleEarlyUnlock(m); // se considera desbloqueado
        }
    }
}

const XP_UNLOCK_COST = 200;
const DAYS_PER_MODULE = 1;

function getModuleStartDate(moduleNum) {
    if (moduleNum === 1) return null; // módulo 1 siempre disponible
    const dm = progress?.dailyMissions || {};
    const cid = currentCourseId || 'steam';
    return dm[`moduleStart_${cid}_${moduleNum}`] || dm[`moduleStart_${moduleNum}`] || null;
}

function setModuleStartDate(moduleNum, dateStr) {
    if (!progress.dailyMissions) progress.dailyMissions = {};
    const cid = currentCourseId || 'steam';
    progress.dailyMissions[`moduleStart_${cid}_${moduleNum}`] = dateStr;
}

function isModuleEarlyUnlocked(moduleNum) {
    const dm = progress?.dailyMissions || {};
    const cid = currentCourseId || 'steam';
    return dm[`moduleEarlyUnlock_${cid}_${moduleNum}`] === true || dm[`moduleEarlyUnlock_${moduleNum}`] === true;
}

function setModuleEarlyUnlock(moduleNum) {
    if (!progress.dailyMissions) progress.dailyMissions = {};
    const cid = currentCourseId || 'steam';
    progress.dailyMissions[`moduleEarlyUnlock_${cid}_${moduleNum}`] = true;
}

function msUntilUnlock(moduleNum) {
    const startDate = getModuleStartDate(moduleNum);
    if (!startDate) return DAYS_PER_MODULE * 86400000;
    const start = new Date(startDate).getTime();
    const unlockAt = start + DAYS_PER_MODULE * 86400000;
    return Math.max(0, unlockAt - Date.now());
}

// Compatibilidad: días enteros restantes (se usa solo donde no aplica el countdown en vivo)
function daysUntilUnlock(moduleNum) {
    return Math.ceil(msUntilUnlock(moduleNum) / 86400000);
}

function formatCountdown(ms) {
    if (ms <= 0) return '¡Desbloqueado!';
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function isModuleLocked(moduleNum) {
    if (moduleNum <= 1) return false;
    if (isModuleEarlyUnlocked(moduleNum)) return false;
    // Si todas las tarjetas del módulo ya están completadas, nunca debe bloquearse
    const modData = modulesData[moduleNum - 1];
    if (modData) {
        const modCardIds = modData.cards.map(c => String(c.id));
        const allDone = modCardIds.length > 0 && modCardIds.every(id => (progress.completedCards || []).includes(id));
        if (allDone) {
            // Registrar como desbloqueado para que no vuelva a pasar
            setModuleEarlyUnlock(moduleNum);
            if (!getModuleStartDate(moduleNum)) setModuleStartDate(moduleNum, new Date().toISOString());
            return false;
        }
    }
    const startDate = getModuleStartDate(moduleNum);
    if (!startDate) return true;
    return msUntilUnlock(moduleNum) > 0;
}

// ── Countdown en vivo: actualiza todos los elementos [data-unlock-ms] cada segundo ──
let _countdownInterval = null;
function startLiveCountdowns() {
    if (_countdownInterval) return;
    _countdownInterval = setInterval(() => {
        const els = document.querySelectorAll('[data-unlock-ms]');
        if (!els.length) return;
        let anyUnlocked = false;
        els.forEach(el => {
            const remaining = parseInt(el.dataset.unlockMs, 10) - 1000;
            el.dataset.unlockMs = String(Math.max(0, remaining));
            el.textContent = formatCountdown(remaining);
            if (remaining <= 0) anyUnlocked = true;
        });
        if (anyUnlocked) {
            if (!document.getElementById('tabModulos')?.classList.contains('hidden')) {
                renderModulesTab();
            }
        }
    }, 1000);
}

async function unlockModuleWithXP(moduleNum) {
    const cost = XP_UNLOCK_COST;
    if ((progress.xp || 0) < cost) {
        showToast(`Necesitas ${cost} XP para desbloquear este módulo. Tienes ${progress.xp || 0} XP.`, 'error');
        return;
    }
    if (!isModuleLocked(moduleNum)) {
        showToast('Este módulo ya está disponible.', 'info');
        return;
    }
    progress.xp -= cost;
    setModuleEarlyUnlock(moduleNum);
    setModuleStartDate(moduleNum, new Date().toISOString());
    saveProgress();
    showToast(`🔓 ¡Módulo ${moduleNum} desbloqueado! (-${cost} XP)`, 'success');
    renderModulesTab();
    updateUI();
}

function renderModulesTab() {
    const container = document.getElementById('modulesIndexList');
    if (!container || !modulesData) return;

    const wrongQuizzes = progress.dailyMissions?.wrongQuizzes || [];
    const totalModules = modulesData.length;
    let html = '';

    // ── Modo repaso ──────────────────────────────────────────────────
    if (wrongQuizzes.length > 0) {
        html += `<div onclick="startRepasoMode()" style="margin-bottom:12px;background:linear-gradient(135deg,#fef3c7,#fde68a);border:1.5px solid #fbbf24;border-radius:16px;padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">🔁</div>
            <div style="flex:1">
                <p style="font-weight:800;font-size:14px;color:#92400e;margin:0">Modo Repaso</p>
                <p style="font-size:11px;color:#b45309;margin:2px 0 0">${wrongQuizzes.length} quiz${wrongQuizzes.length!==1?'zes':''} que fallaste · ¡Practica hasta dominarlos!</p>
            </div>
            <span style="font-size:20px">›</span>
        </div>`;
    }

    for (let i = 1; i <= totalModules; i++) {
        const mod = modulesData[i - 1];
        const _ct = (typeof getCourseThemeAndIllus !== 'undefined')
            ? getCourseThemeAndIllus(currentCourseId || 'steam', i)
            : { theme: MODULE_THEME?.[i] || { primary: '#0097A7', soft: '#E0F7FA' }, illus: MODULE_ILLUSTRATIONS?.[i] || '' };
        const theme = _ct.theme;
        const illus = _ct.illus;

        const locked = isModuleLocked(i);
        const isCurrentMod = (i === currentModule);
        const moduleKey = `${currentCourseId || 'steam'}-${i}`;
        const isCompleted = (i < currentModule) || !!(progress.completedModules?.[moduleKey]);
        const remainingMs = locked ? msUntilUnlock(i) : 0;
        const xpAvail = progress?.xp || 0;
        const canPayXP = xpAvail >= XP_UNLOCK_COST;

        // Cards seen in this module
        const modCards = mod.cards || [];
        const modCardIds = modCards.map(c => c.id);
        const seenInMod = modCardIds.filter(id => (progress?.completedCards || []).includes(id)).length;
        const pct = modCards.length > 0 ? Math.round((seenInMod / modCards.length) * 100) : 0;

        let statusBadge = '';
        let actionBtn = '';
        let opacity = '';

        const allCardsSeen = modCards.length > 0 && pct === 100;

        if (locked) {
            opacity = 'opacity-60';
            statusBadge = `<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">🔒 <span data-unlock-ms="${remainingMs}">${formatCountdown(remainingMs)}</span></span>`;
            actionBtn = canPayXP
                ? `<button onclick="unlockModuleWithXP(${i})" class="mt-3 w-full text-sm font-bold py-2 rounded-xl text-white" style="background:${theme.primary}">
                       🔓 Desbloquear con ${XP_UNLOCK_COST} XP
                   </button>`
                : `<p class="mt-2 text-xs text-slate-400 text-center">Disponible en <span data-unlock-ms="${remainingMs}">${formatCountdown(remainingMs)}</span> · o con ${XP_UNLOCK_COST} XP</p>`;
        } else if (isCompleted || allCardsSeen) {
            statusBadge = `<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✅ Completado</span>`;
            actionBtn = `<button onclick="goToModule(${i})" class="mt-3 w-full text-sm font-semibold py-2 rounded-xl border-2" style="color:${theme.primary};border-color:${theme.primary}">
                             Repasar módulo
                         </button>`;
        } else if (isCurrentMod) {
            statusBadge = `<span class="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style="background:${theme.primary}">▶ En curso</span>`;
            actionBtn = `<button onclick="goToModule(${i})" class="mt-3 w-full text-sm font-bold py-2 rounded-xl text-white" style="background:${theme.primary}">
                             Continuar →
                         </button>`;
        } else {
            statusBadge = `<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">○ Disponible</span>`;
            actionBtn = `<button onclick="goToModule(${i})" class="mt-3 w-full text-sm font-bold py-2 rounded-xl text-white" style="background:${theme.primary}">
                             Comenzar →
                         </button>`;
        }

        html += `
        <div class="rounded-2xl overflow-hidden shadow-sm border border-slate-100 ${opacity}">
            <div class="flex items-center gap-3 p-3" style="background:${theme.soft}">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:${theme.primary}">
                    <div class="w-9 h-9">${illus}</div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Módulo ${i}</span>
                        ${statusBadge}
                    </div>
                    <p class="text-sm font-bold text-slate-800 leading-tight mt-0.5 truncate">${mod.title}</p>
                </div>
            </div>
            <div class="bg-white px-4 py-3">
                <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>${seenInMod} / ${modCards.length} tarjetas</span>
                    <span>${pct}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full" style="width:${pct}%;background:${theme.primary};transition:width .4s"></div>
                </div>
                ${actionBtn}
            </div>
        </div>`;
    }

    container.innerHTML = html;
    startLiveCountdowns();
}

function goToModule(modNum) {
    if (isModuleLocked(modNum)) {
        showToast(`El módulo ${modNum} está bloqueado.`, 'error');
        return;
    }
    currentModule = modNum;
    // Find first unseen card index for this module, or restart at 0
    const mod = modulesData[modNum - 1];
    let startIdx = 0;
    if (mod) {
        const seen = progress?.completedCards || [];
        const firstUnseen = mod.cards.findIndex(c => !seen.includes(c.id));
        startIdx = firstUnseen >= 0 ? firstUnseen : 0;
    }
    currentCardIndex = startIdx;
    _saveCoursePosition();
    saveProgress();
    switchTab('home');
    renderCard();
    animateCard('next');
}

function _showExamPrompt() {
    const cid   = currentCourseId || 'steam';
    const score = (progress?.dailyMissions?.examScores || {})[cid] ?? (cid === 'steam' ? progress?.dailyMissions?.examScore : undefined);
    const alreadyPassed = score !== undefined && score >= 70;
    if (alreadyPassed) return; // ya tiene certificado, no molestar

    const courseTitle = (typeof allCourses !== 'undefined')
        ? (allCourses.find(c => c.id === cid)?.title || 'este curso')
        : 'este curso';

    const el = document.createElement('div');
    el.id = 'examPromptOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px';
    el.innerHTML = `
    <div style="background:white;border-radius:24px;max-width:360px;width:100%;padding:28px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.3)">
        <div style="font-size:48px;margin-bottom:12px">🎓</div>
        <h2 style="font-size:20px;font-weight:900;color:#0F172A;margin-bottom:8px">¡Curso completado!</h2>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px">
            Terminaste todas las tarjetas de <strong>${esc(courseTitle)}</strong>.<br>
            ¿Listo para la evaluación final y obtener tu certificado?
        </p>
        <button onclick="document.getElementById('examPromptOverlay').remove();startExam();"
            style="width:100%;padding:14px;border-radius:14px;border:none;background:#5C35C5;color:white;font-weight:800;font-size:15px;cursor:pointer;margin-bottom:10px">
            📝 Ir a la evaluación
        </button>
        <button onclick="document.getElementById('examPromptOverlay').remove();"
            style="width:100%;padding:10px;border-radius:14px;border:2px solid #E2E8F0;background:white;color:#64748B;font-weight:600;font-size:13px;cursor:pointer">
            Después
        </button>
    </div>`;
    document.body.appendChild(el);
}

function continueToNextModule() {
    const nextModule = currentModule + 1;
    if (nextModule > modulesData.length) {
        // Curso terminado — mostrar prompt de evaluación
        currentModule = nextModule;
        currentCardIndex = 0;
        _saveCoursePosition();
        saveProgress();
        renderCard();
        animateCard('next');
        setTimeout(_showExamPrompt, 600);
        return;
    }

    // Si el siguiente módulo no tiene marca de inicio, la asignamos ahora (inicia el countdown de 24h)
    if (!getModuleStartDate(nextModule)) {
        setModuleStartDate(nextModule, new Date().toISOString());
        saveProgress();
    }

    if (isModuleLocked(nextModule)) {
        const remainingMs = msUntilUnlock(nextModule);
        const xp = progress?.xp || 0;
        const canPay = xp >= XP_UNLOCK_COST;
        const theme = (typeof MODULE_THEME !== 'undefined') ? MODULE_THEME[nextModule] : { primary: '#0097A7' };
        const mod = modulesData[nextModule - 1];

        const html = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">🔒</div>
                    <h3 class="text-lg font-bold text-slate-800">Módulo ${nextModule} bloqueado</h3>
                    <p class="text-sm text-slate-500 mt-1">${mod?.title || ''}</p>
                </div>
                <p class="text-sm text-slate-600 text-center mb-2">Este módulo se desbloquea en:</p>
                <p class="text-center text-2xl font-black mb-3" style="color:${theme.primary}" data-unlock-ms="${remainingMs}">${formatCountdown(remainingMs)}</p>
                <p class="text-sm text-slate-600 text-center mb-4">
                    O puedes desbloquearlo ahora gastando <strong>${XP_UNLOCK_COST} XP</strong>.
                </p>
                <p class="text-center text-sm mb-5">Tu XP actual: <strong>${xp} ⚡</strong></p>
                <div class="space-y-2">
                    ${canPay ? `<button id="payXPBtn" class="w-full py-3 rounded-xl text-white font-bold text-sm" style="background:${theme.primary}">
                        🔓 Desbloquear ahora (${XP_UNLOCK_COST} XP)
                    </button>` : `<p class="text-center text-xs text-slate-400">Necesitas ${XP_UNLOCK_COST - xp} XP más para desbloqueo anticipado</p>`}
                    <button id="goModulosBtn" class="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">
                        Ver mis módulos
                    </button>
                    <button id="closeModLockBtn" class="w-full py-2 text-slate-400 text-sm">Cerrar</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        const overlay = document.body.lastElementChild;
        startLiveCountdowns();
        overlay.querySelector('#closeModLockBtn')?.addEventListener('click', () => overlay.remove());
        overlay.querySelector('#goModulosBtn')?.addEventListener('click', () => { overlay.remove(); switchTab('modulos'); });
        if (canPay) {
            overlay.querySelector('#payXPBtn')?.addEventListener('click', async () => {
                overlay.remove();
                await unlockModuleWithXP(nextModule);
                if (!isModuleLocked(nextModule)) continueToNextModule();
            });
        }
        return;
    }

    currentModule = nextModule;
    currentCardIndex = 0;
    _saveCoursePosition();
    saveProgress();
    renderCard();
    animateCard('next');
}

let _swipeStartX = 0;
let _swipeStartY = 0;
let _swipeActive = false;

function initSwipe() {
    const card = document.getElementById('activeCard');
    if (!card) return;

    // ── Helpers compartidos touch + mouse ──────────────────
    function onStart(clientX, clientY) {
        _swipeStartX = clientX;
        _swipeStartY = clientY;
        _swipeActive = true;
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
    }

    function onMove(clientX, clientY) {
        if (!_swipeActive) return;
        const diffX = clientX - _swipeStartX;
        const diffY = clientY - _swipeStartY;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            const rotation = diffX / 14;
            card.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
            // Indicador visual de dirección
            card.style.opacity = String(Math.max(0.6, 1 - Math.abs(diffX) / 400));
        }
    }

    function onEnd(clientX) {
        if (!_swipeActive) return;
        _swipeActive = false;
        card.style.cursor = '';
        const diffX = clientX - _swipeStartX;
        const THRESHOLD = 80;
        card.style.transition = 'transform 0.28s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.22s ease';

        if (diffX > THRESHOLD) {
            // Swipe derecha → tarjeta anterior
            card.style.transform = 'translateX(130%) rotate(12deg)';
            card.style.opacity = '0';
            setTimeout(() => goToPrevCard(false), 260);
        } else if (diffX < -THRESHOLD) {
            // Swipe izquierda → siguiente tarjeta
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn && nextBtn.disabled) {
                card.style.transform = 'translateX(0) rotate(0deg)';
                card.style.opacity = '1';
                showToast('Responde el quiz antes de continuar', 'error');
            } else {
                card.style.transform = 'translateX(-130%) rotate(-12deg)';
                card.style.opacity = '0';
                setTimeout(() => goToNextCard(false), 260);
            }
        } else {
            // Vuelve al centro con spring
            card.style.transform = 'translateX(0) rotate(0deg)';
            card.style.opacity = '1';
        }
    }

    // ── Touch (móvil) ───────────────────────────────────────
    card.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    card.addEventListener('touchmove',  e => onMove(e.touches[0].clientX, e.touches[0].clientY),  { passive: true });
    card.addEventListener('touchend',   e => onEnd(e.changedTouches[0].clientX));

    // ── Mouse (desktop) ─────────────────────────────────────
    card.addEventListener('mousedown', e => { if (e.button === 0) onStart(e.clientX, e.clientY); });
    // mousemove y mouseup en document para capturar cuando el cursor sale de la tarjeta
    const onMouseMove = e => onMove(e.clientX, e.clientY);
    const onMouseUp   = e => { onEnd(e.clientX); document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
    card.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);
    });

    // Evitar que el drag arrastre texto/imágenes del navegador
    card.addEventListener('dragstart', e => e.preventDefault());
    card.style.cursor = 'grab';
}

// ==================== MODALES ====================
function showBadgesModal() {
    let badgesHtml = "";
    Object.values(badges).forEach(badge => {
        const unlocked = progress.badges.includes(badge.id);
        const svg = BADGE_SVG[badge.id] || `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#e2e8f0"/></svg>`;
        badgesHtml += `<div style="background:${unlocked?'white':'#f8fafc'};border:${unlocked?'2px solid #fbbf24':'1.5px solid #e2e8f0'};border-radius:16px;padding:14px 10px;text-align:center;${unlocked?'':'opacity:.55'}">
            <div style="width:48px;height:48px;margin:0 auto 8px">${svg}</div>
            <div style="font-size:12px;font-weight:800;color:#0f172a;line-height:1.3;margin-bottom:3px">${badge.name}</div>
            <div style="font-size:10px;color:#64748b;line-height:1.4;margin-bottom:5px">${badge.desc}</div>
            ${unlocked
                ? `<span style="font-size:10px;font-weight:700;color:#16a34a;background:#dcfce7;border-radius:20px;padding:2px 8px;display:inline-flex;align-items:center;gap:3px"><span style="display:inline-flex;width:11px;height:11px">${ICONS?.check||'✓'}</span>Desbloqueado</span>
                  <button onclick="shareBadgeImage('${badge.id}')" title="Compartir como imagen"
                    style="margin-top:6px;width:100%;display:flex;align-items:center;justify-content:center;gap:4px;font-size:10px;font-weight:700;color:#4f46e5;background:#eef2ff;border:none;border-radius:20px;padding:4px 8px;cursor:pointer">
                    <span style="display:inline-flex;width:11px;height:11px">${ICONS?.share||'↗'}</span>Compartir
                  </button>`
                : `<span style="font-size:10px;font-weight:700;color:#94a3b8;background:#f1f5f9;border-radius:20px;padding:2px 8px">+${badge.xpReward} XP</span>`}
        </div>`;
    });
    document.getElementById('badgesList').innerHTML = badgesHtml;
    document.getElementById('badgesModal').classList.remove('hidden');
}

function shareBadges() {
    const badgesList = progress.badges.map(b => badges[b]?.name || b).join(", ");
    const text = `🎓 He completado ${progress.badges.length} logros en el Curso STEAM de Profe Billy! Mi nivel: ${progress.level} | XP: ${progress.xp} #STEAM #ProfeBilly`;
    const link = getReferralLink();
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`, '_blank');
    if (false) { // mantener else por compatibilidad
        navigator.clipboard.writeText(text);
        showToast("📋 Texto copiado al portapapeles", "info");
    }
}

// Genera una imagen PNG de una insignia individual (canvas) y la comparte o descarga.
async function shareBadgeImage(badgeId) {
    const badge = badges[badgeId];
    if (!badge) return;
    const svg = BADGE_SVG[badgeId] || `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#e2e8f0"/></svg>`;

    const W = 640, H = 640;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Fondo degradado de marca
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#1A6B68');
    grad.addColorStop(1, '#07B0E4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Círculo blanco de fondo para la insignia
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.beginPath();
    ctx.arc(W / 2, 250, 150, 0, Math.PI * 2);
    ctx.fill();

    // Rasterizar el SVG de la insignia sobre el círculo
    const img = new Image();
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // seguir sin la insignia antes que romper el share
        img.src = svgUrl;
    });
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, W / 2 - 110, 140, 220, 220);
    }

    // Textos
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '900 34px Arial, sans-serif';
    _wrapCanvasText(ctx, badge.name, W / 2, 460, 560, 40);
    ctx.font = '600 18px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillText(badge.desc || '', W / 2, 510, 560);
    ctx.font = '700 16px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fillText(`${getDisplayName()} · Formación Docente`, W / 2, 590);

    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    if (!blob) { showToast('No se pudo generar la imagen', 'warning'); return; }
    const file = new File([blob], `insignia-${badgeId}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: badge.name, text: `¡Desbloqueé la insignia "${badge.name}" en Formación Docente!` });
            return;
        } catch (e) { /* usuario canceló el share nativo — cae al fallback de descarga */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insignia-${badgeId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    showToast('Imagen descargada — compártela donde quieras', 'success');
}

function _wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(' ');
    let line = '';
    const lines = [];
    words.forEach(word => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
        else line = test;
    });
    if (line) lines.push(line);
    const startY = y - (lines.length - 1) * lineHeight / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

// ==================== BÚSQUEDA GLOBAL ====================
function _stripHtml(html) {
    return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

let _globalSearchIndex = null;

function _buildGlobalSearchIndex() {
    const cards = [];
    if (typeof allCourses !== 'undefined') {
        allCourses.forEach(course => {
            (course.modules || []).forEach((mod, mi) => {
                (mod.cards || []).forEach(card => {
                    if (card.type && card.type !== 'content') return; // solo tarjetas de contenido, no quizzes
                    const text = _stripHtml((card.content || '') + ' ' + (card.extra || ''));
                    cards.push({ courseId: course.id, courseTitle: course.title, moduleIndex: mi + 1, cardId: card.id, title: card.title || '', text });
                });
            });
        });
    }
    const resources = [];
    if (typeof COURSE_RESOURCES !== 'undefined') {
        Object.entries(COURSE_RESOURCES).forEach(([courseId, list]) => {
            const course = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === courseId) : null;
            list.forEach(r => resources.push({ courseId, courseTitle: course?.title || courseId, name: r.name, desc: r.desc, url: r.url }));
        });
    }
    return { cards, resources };
}

function openGlobalSearch() {
    if (!_globalSearchIndex) _globalSearchIndex = _buildGlobalSearchIndex();
    document.getElementById('globalSearchModal').classList.remove('hidden');
    const input = document.getElementById('globalSearchInput');
    input.value = '';
    document.getElementById('globalSearchResults').innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Escribe al menos 3 letras para buscar.</p>`;
    setTimeout(() => input.focus(), 150);
}

function _runGlobalSearch(query) {
    const container = document.getElementById('globalSearchResults');
    const q = query.trim().toLowerCase();
    if (q.length < 3) { container.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Escribe al menos 3 letras para buscar.</p>`; return; }
    if (!_globalSearchIndex) _globalSearchIndex = _buildGlobalSearchIndex();

    const cardMatches = _globalSearchIndex.cards
        .filter(c => c.title.toLowerCase().includes(q) || c.text.toLowerCase().includes(q))
        .slice(0, 8);
    const resourceMatches = _globalSearchIndex.resources
        .filter(r => r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))
        .slice(0, 6);

    let html = '';
    if (cardMatches.length) {
        html += `<p class="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 mt-1">Tarjetas</p>`;
        html += cardMatches.map(c => {
            const idx = c.text.toLowerCase().indexOf(q);
            const snippet = idx >= 0 ? '…' + c.text.slice(Math.max(0, idx - 30), idx + 60) + '…' : c.text.slice(0, 80);
            return `<button onclick="_openSearchResultCard('${c.courseId}',${c.moduleIndex},'${String(c.cardId).replace(/'/g,"\\'")}')"
                class="w-full text-left bg-white border border-slate-100 rounded-xl px-3 py-2.5 mb-2 hover:border-indigo-200 hover:bg-indigo-50/40 transition">
                <p class="text-xs font-bold text-slate-800">${esc(c.title)}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">${esc(c.courseTitle)} · Módulo ${c.moduleIndex}</p>
                <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">${esc(snippet)}</p>
            </button>`;
        }).join('');
    }
    if (resourceMatches.length) {
        html += `<p class="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 mt-3">Recursos descargables</p>`;
        html += resourceMatches.map(r => `
            <a href="${r.url}" target="_blank" rel="noopener"
                class="flex items-center justify-between gap-2 w-full text-left bg-white border border-slate-100 rounded-xl px-3 py-2.5 mb-2 hover:border-indigo-200 hover:bg-indigo-50/40 transition">
                <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">${esc(r.name)}</p>
                    <p class="text-[11px] text-slate-500 mt-0.5">${esc(r.courseTitle)}</p>
                </div>
                <span class="text-[10px] font-bold text-indigo-600 flex-shrink-0">Abrir →</span>
            </a>`).join('');
    }
    html += `<p class="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 mt-3">Glosario</p>
        <a href="glosario.html?q=${encodeURIComponent(query.trim())}" target="_blank"
            class="flex items-center justify-between gap-2 w-full text-left bg-white border border-slate-100 rounded-xl px-3 py-2.5 mb-2 hover:border-indigo-200 hover:bg-indigo-50/40 transition">
            <p class="text-xs font-bold text-slate-800">Buscar "${esc(query.trim())}" en el glosario</p>
            <span class="text-[10px] font-bold text-indigo-600 flex-shrink-0">Abrir →</span>
        </a>`;

    if (!cardMatches.length && !resourceMatches.length) {
        html = `<p class="text-xs text-slate-400 text-center py-4">Sin resultados en tarjetas ni recursos para "${esc(query.trim())}".</p>` + html;
    }
    container.innerHTML = html;
}

function _openSearchResultCard(courseId, moduleIndex, cardId) {
    const course = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === courseId) : null;
    if (!course) return;
    currentCourseId = courseId;
    modulesData = course.modules;
    currentModule = moduleIndex;
    const mod = modulesData[moduleIndex - 1];
    const idx = mod ? mod.cards.findIndex(c => String(c.id) === String(cardId)) : -1;
    currentCardIndex = idx >= 0 ? idx : 0;
    document.getElementById('globalSearchModal').classList.add('hidden');
    if (typeof switchTab === 'function') switchTab('home');
    renderCard();
}

function showRedeemModal() {
    let prizesHtml = "";
    prizes.forEach(prize => {
        const alreadyRedeemed = progress.redeemedPrizes?.includes(prize.id);
        prizesHtml += `<div class="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div><div class="text-2xl">${prize.icon}</div><div class="font-bold">${prize.name}</div><div class="text-xs text-gray-500">${prize.desc}</div><div class="text-xs text-yellow-600" style="display:inline-flex;align-items:center;gap:3px"><span style="display:inline-flex;width:12px;height:12px">${ICONS?.star||'⭐'}</span> ${prize.xpCost} XP</div>${prize.sponsor ? `<div class="text-xs text-green-600">Patrocinado por: ${prize.sponsor}</div>` : ''}</div>
            ${!alreadyRedeemed && progress.xp >= prize.xpCost ? `<button data-prize="${prize.id}" data-cost="${prize.xpCost}" class="redeem-prize-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition">Canjear</button>` : (alreadyRedeemed ? `<span class="text-gray-400 text-sm" style="display:inline-flex;align-items:center;gap:3px"><span style="display:inline-flex;width:12px;height:12px">${ICONS?.check||'✓'}</span> Canjeado</span>` : '<span class="text-gray-400 text-sm">Sin XP</span>')}
        </div>`;
    });
    document.getElementById('prizesList').innerHTML = prizesHtml;
    document.getElementById('xpForRedeem').innerText = progress.xp;
    document.getElementById('redeemModal').classList.remove('hidden');
    document.querySelectorAll('.redeem-prize-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prizeId = btn.dataset.prize;
            const cost = parseInt(btn.dataset.cost);
            if (progress.xp >= cost && !progress.redeemedPrizes?.includes(prizeId)) {
                progress.xp -= cost;
                progress.redeemedPrizes = progress.redeemedPrizes || [];
                progress.redeemedPrizes.push(prizeId);
                saveProgress();
                showToast(`🎁 ¡Canjeaste ${prizes.find(p => p.id === prizeId).name}!`, "success");
                showRedeemModal();
            }
        });
    });
    const tickets = progress.raffleTickets || 0;
    const raffleInfo = document.getElementById("raffleInfo");
    if (raffleInfo) raffleInfo.innerHTML = `🎫 ${tickets} boletos de sorteo acumulados (cada 500 XP = 1 boleto)`;
}

const showRankingModal = () => showRanking();

async function showRanking() {
    _rankingMode = 'total';
    const listEl = document.getElementById("rankingList");
    listEl.innerHTML = `<div class="text-center py-6 text-gray-400" style="display:flex;justify-content:center"><span style="display:inline-flex;width:32px;height:32px;color:#94a3b8">${ICONS?.spinner||'...'}</span></div>`;
    document.getElementById("rankingModal").classList.remove("hidden");
    // Resetear tabs
    switchRankingTab('total');

    let { data, error } = await supabase
        .from('ranking_view')
        .select('user_id, nombre_usuario, full_name, profile_photo, xp, level')
        .order('level', { ascending: false })
        .order('xp',   { ascending: false })
        .limit(100);

    // Fallback: si la vista aún no tiene full_name/profile_photo, reintenta con columnas básicas
    if (error) {
        console.warn('ranking_view fallback (faltan columnas full_name/profile_photo):', error.message);
        const fallback = await supabase
            .from('ranking_view')
            .select('user_id, nombre_usuario, xp, level')
            .order('level', { ascending: false })
            .order('xp',   { ascending: false })
            .limit(100);
        data = fallback.data;
        error = fallback.error;
    }

    if (error) {
        console.error('Error cargando ranking:', error.message);
        listEl.innerHTML = `<div class="text-center text-gray-400 py-6">No se pudo cargar el ranking.<br><span class="text-xs">${error.message}</span></div>`;
        return;
    }
    if (!data?.length) {
        listEl.innerHTML = `<div class="text-center text-gray-400 py-6">Aún no hay participantes en el ranking.<br><span class="text-xs">¡Completa cursos y acumula XP para aparecer aquí!</span></div>`;
        return;
    }

    _rankingDataTotal = data;
    _renderTotalRanking(data);
}

let _rankingMode = 'total'; // 'total' | 'weekly'
let _rankingDataTotal = null;
let _rankingDataWeekly = null;

function switchRankingTab(tab) {
    _rankingMode = tab;
    const btnTotal  = document.getElementById('rankTabTotal');
    const btnWeekly = document.getElementById('rankTabWeekly');
    if (btnTotal)  { btnTotal.style.background  = tab==='total'  ? 'white' : 'rgba(255,255,255,.15)'; btnTotal.style.color  = tab==='total'  ? '#4c1d95' : 'white'; }
    if (btnWeekly) { btnWeekly.style.background = tab==='weekly' ? 'white' : 'rgba(255,255,255,.15)'; btnWeekly.style.color = tab==='weekly' ? '#4c1d95' : 'white'; }
    if (tab === 'weekly') _renderWeeklyRanking();
    else _renderTotalRanking(_rankingDataTotal || []);
}

function _renderTotalRanking(data) {
    const listEl = document.getElementById('rankingList');
    const podiumEl = document.getElementById('rankingPodium');
    if (!data?.length) { listEl.innerHTML = '<p style="text-align:center;color:#94a3b8;font-size:12px;padding:16px">Sin datos aún</p>'; return; }
    const LEAGUES = [
        { name:'Liga Diamante',min:11,color:'#06b6d4',bg:'#ecfeff' },
        { name:'Liga Platino', min:8, color:'#8b5cf6',bg:'#f5f3ff' },
        { name:'Liga Oro',     min:5, color:'#f59e0b',bg:'#fffbeb' },
        { name:'Liga Plata',   min:3, color:'#64748b',bg:'#f8fafc' },
        { name:'Liga Bronce',  min:1, color:'#b45309',bg:'#fef3c7' },
    ];
    const getLeague = lvl => LEAGUES.find(l => lvl >= l.min) || LEAGUES[LEAGUES.length-1];
    const flat = [...data].sort((a,b)=>(b.level||1)-(a.level||1)||(b.xp||0)-(a.xp||0));
    const _avatar = (u,size=44) => u.profile_photo
        ? `<img src="${u.profile_photo}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover">`
        : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#6d28d9,#a78bfa);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0"><span style="display:inline-flex;width:${size*.5}px;height:${size*.5}px">${ICONS.profile}</span></div>`;

    const top3=flat.slice(0,3); const podiumOrder=[top3[1],top3[0],top3[2]].filter(Boolean);
    const podiumPos=top3[1]?[2,1,3]:[1]; const podiumH=['64px','88px','52px']; const podiumColors=['#5b21b6','#4c1d95','#6d28d9'];
    if (podiumEl) podiumEl.innerHTML=`<div style="display:flex;align-items:flex-end;justify-content:center;gap:6px;padding:0 8px">${podiumOrder.map((u,vi)=>{
        const rank=podiumPos[vi];const isMe=u.user_id===currentUser?.id;const name=(u.full_name||u.nombre_usuario||'Docente').split(' ')[0];const isCrown=rank===1;
        return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;max-width:120px">${isCrown?`<div style="width:20px;height:20px;margin-bottom:2px;color:#fbbf24">${ICONS.crown}</div>`:'<div style="height:28px"></div>'}<div style="position:relative"><div style="border:3px solid ${isCrown?'#fbbf24':'rgba(255,255,255,.4)'};border-radius:50%;padding:2px">${_avatar(u,isCrown?52:44)}</div>${isMe?'<div style="position:absolute;bottom:-4px;right:-4px;background:#fbbf24;color:#1e1b4b;font-size:9px;font-weight:900;padding:1px 5px;border-radius:99px">TÚ</div>':''}</div><p style="color:white;font-weight:800;font-size:11px;margin:6px 0 4px;text-align:center;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</p><div style="background:rgba(255,255,255,.18);border-radius:99px;padding:2px 10px;margin-bottom:6px;display:inline-flex;align-items:center;gap:3px"><span style="display:inline-flex;width:11px;height:11px;color:white">${ICONS.bolt}</span><span style="color:white;font-size:10px;font-weight:700">${(u.xp||0).toLocaleString()}</span></div><div style="background:${podiumColors[vi]};border-radius:12px 12px 0 0;height:${podiumH[vi]};width:100%;display:flex;align-items:center;justify-content:center"><span style="color:white;font-size:${isCrown?'28px':'22px'};font-weight:900;opacity:.8">${rank}</span></div></div>`;
    }).join('')}</div>`;

    let listHtml='';
    if(flat.length<=3) listHtml=`<p style="text-align:center;color:#94a3b8;font-size:12px;padding:16px 0">¡Solo los docentes del podio!</p>`;
    else flat.slice(3).forEach((user,i)=>{
        const rank=i+4;const isMe=user.user_id===currentUser?.id;const name=user.full_name||user.nombre_usuario||`Docente ${rank}`;
        const lvl=user.level||1;const league=getLeague(lvl);
        listHtml+=`<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;margin-bottom:8px;background:${isMe?'linear-gradient(135deg,#ede9fe,#ddd6fe)':'#f8fafc'};border:${isMe?'2px solid #a78bfa':'1.5px solid #e2e8f0'}"><span style="font-size:12px;font-weight:900;color:${isMe?'#6d28d9':'#94a3b8'};width:20px;text-align:center;flex-shrink:0">${rank}</span>${_avatar(user,38)}<div style="flex:1;min-width:0"><p style="font-weight:700;font-size:13px;color:${isMe?'#4c1d95':'#1e293b'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}${isMe?' <span style="color:#7c3aed">(Tú)</span>':''}</p><span style="font-size:10px;font-weight:600;color:${league.color};display:inline-flex;align-items:center;gap:3px">${_leagueIconSvg(league.name.replace('Liga ',''),11)}${league.name}</span></div><div style="text-align:right;flex-shrink:0"><p style="font-weight:800;font-size:13px;color:#6d28d9;display:flex;align-items:center;gap:3px;justify-content:flex-end"><span style="display:inline-flex;width:12px;height:12px">${ICONS.bolt}</span>${(user.xp||0).toLocaleString()}</p><p style="font-size:10px;color:#94a3b8">Nv. ${lvl}</p></div></div>`;
    });
    listEl.innerHTML = listHtml;
}

async function _renderWeeklyRanking() {
    const listEl = document.getElementById('rankingList');
    const podiumEl = document.getElementById('rankingPodium');
    listEl.innerHTML = `<div class="text-center py-6 text-gray-400" style="display:flex;justify-content:center"><span style="display:inline-flex;width:28px;height:28px;color:#94a3b8">${ICONS?.spinner||'...'}</span></div>`;
    if (podiumEl) podiumEl.innerHTML = '';

    // Calcular inicio de semana (lunes)
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    const monday = new Date(now); monday.setDate(now.getDate() + diff); monday.setHours(0,0,0,0);
    const mondayStr = monday.toISOString();

    const { data, error } = await supabase
        .from('user_sessions')
        .select('user_id, duration_seconds, started_at')
        .gte('started_at', mondayStr);

    // Construcción del ranking semanal basado en XP guardado en daily_missions.weeklyXP
    const { data: progData } = await supabase
        .from('progress')
        .select('user_id, email, xp, level, daily_missions');

    if (error && !progData) { listEl.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:16px">No hay datos semanales aún</p>'; return; }

    const weekly = (progData || []).map(p => ({
        user_id: p.user_id,
        full_name: p.daily_missions?.fullName || p.email?.split('@')[0] || 'Docente',
        profile_photo: p.daily_missions?.profilePhoto || null,
        weeklyXP: p.daily_missions?.weeklyXP || 0,
        xp: p.xp || 0, level: p.level || 1,
    })).filter(p => p.weeklyXP > 0).sort((a,b) => b.weeklyXP - a.weeklyXP).slice(0,50);

    if (!weekly.length) { listEl.innerHTML = '<p style="text-align:center;color:#94a3b8;font-size:12px;padding:24px">¡Sé el primero en acumular XP esta semana!</p>'; return; }

    const _avatar = (u,size=44) => u.profile_photo
        ? `<img src="${u.profile_photo}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover">`
        : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#d97706,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:${size*.4}px;flex-shrink:0">👨‍🏫</div>`;

    const top3=weekly.slice(0,3); const podiumOrder=[top3[1],top3[0],top3[2]].filter(Boolean);
    const podiumPos=top3[1]?[2,1,3]:[1]; const podiumH=['64px','88px','52px']; const podiumColors=['#b45309','#92400e','#d97706'];
    if (podiumEl) podiumEl.innerHTML=`<div style="display:flex;align-items:flex-end;justify-content:center;gap:6px;padding:0 8px">${podiumOrder.map((u,vi)=>{
        const rank=podiumPos[vi];const isMe=u.user_id===currentUser?.id;const name=(u.full_name||'Docente').split(' ')[0];const isCrown=rank===1;
        return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;max-width:120px">${isCrown?'<div style="font-size:20px;margin-bottom:2px">👑</div>':'<div style="height:28px"></div>'}<div style="position:relative"><div style="border:3px solid ${isCrown?'#fbbf24':'rgba(255,255,255,.4)'};border-radius:50%;padding:2px">${_avatar(u,isCrown?52:44)}</div>${isMe?'<div style="position:absolute;bottom:-4px;right:-4px;background:#fbbf24;color:#1e1b4b;font-size:9px;font-weight:900;padding:1px 5px;border-radius:99px">TÚ</div>':''}</div><p style="color:white;font-weight:800;font-size:11px;margin:6px 0 4px;text-align:center;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</p><div style="background:rgba(255,255,255,.18);border-radius:99px;padding:2px 10px;margin-bottom:6px"><span style="color:white;font-size:10px;font-weight:700">🗓 ${u.weeklyXP.toLocaleString()} XP</span></div><div style="background:${podiumColors[vi]};border-radius:12px 12px 0 0;height:${podiumH[vi]};width:100%;display:flex;align-items:center;justify-content:center"><span style="color:white;font-size:${isCrown?'28px':'22px'};font-weight:900;opacity:.8">${rank}</span></div></div>`;
    }).join('')}</div>`;

    let listHtml='';
    if(weekly.length<=3) listHtml=`<p style="text-align:center;color:#94a3b8;font-size:12px;padding:16px 0">¡Solo los del podio esta semana!</p>`;
    else weekly.slice(3).forEach((user,i)=>{
        const rank=i+4;const isMe=user.user_id===currentUser?.id;const name=user.full_name||`Docente ${rank}`;
        listHtml+=`<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;margin-bottom:8px;background:${isMe?'linear-gradient(135deg,#fef3c7,#fde68a)':'#f8fafc'};border:${isMe?'2px solid #fbbf24':'1.5px solid #e2e8f0'}"><span style="font-size:12px;font-weight:900;color:${isMe?'#d97706':'#94a3b8'};width:20px;text-align:center;flex-shrink:0">${rank}</span>${_avatar(user,38)}<div style="flex:1;min-width:0"><p style="font-weight:700;font-size:13px;color:${isMe?'#92400e':'#1e293b'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}${isMe?' <span style="color:#d97706">(Tú)</span>':''}</p></div><div style="text-align:right;flex-shrink:0"><p style="font-weight:800;font-size:13px;color:#d97706">🗓 ${user.weeklyXP.toLocaleString()}</p><p style="font-size:10px;color:#94a3b8">XP esta semana</p></div></div>`;
    });
    listEl.innerHTML = listHtml;

    // Verificar insignia campeón semanal (top 3)
    const myRank = weekly.findIndex(u => u.user_id === currentUser?.id) + 1;
    if (myRank >= 1 && myRank <= 3 && !progress.badges.includes('weeklyChamp')) {
        unlockBadge('weeklyChamp');
    }
}

// ==================== SOLICITUD Y VOTACIÓN DE CURSOS ====================
async function showCourseRequests() {
    document.getElementById('courseRequestsModal')?.classList.remove('hidden');
    await loadCourseRequests();
}

document.getElementById('closeCourseRequestsBtn')?.addEventListener('click', () => {
    document.getElementById('courseRequestsModal')?.classList.add('hidden');
});

async function loadCourseRequests() {
    const listEl = document.getElementById('courseRequestsList');
    if (!listEl) return;
    listEl.innerHTML = `<div class="text-center py-6 text-gray-400" style="display:flex;justify-content:center"><span style="display:inline-flex;width:28px;height:28px;color:#94a3b8">${ICONS?.spinner||'...'}</span></div>`;

    const { data, error } = await supabase
        .from('course_requests')
        .select('id, title, description, votes, voters, created_by')
        .eq('status', 'pending')
        .order('votes', { ascending: false });

    if (error) {
        console.error('Error cargando sugerencias:', error.message);
        listEl.innerHTML = `<div class="text-center text-gray-400 py-6 text-sm">No se pudieron cargar las sugerencias en este momento.<br><span class="text-xs">Intenta de nuevo en unos minutos.</span></div>`;
        return;
    }
    if (!data?.length) {
        listEl.innerHTML = `<div class="text-center text-gray-400 py-6 text-sm">Sé el primero en sugerir un curso 🚀</div>`;
        return;
    }

    const myId = currentUser?.id;
    listEl.innerHTML = data.map(req => {
        const voters = req.voters || [];
        const iVoted = voters.includes(myId);
        return `
        <div class="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50">
            <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-800 text-sm">${esc(req.title)}</p>
                ${req.description ? `<p class="text-xs text-slate-500 mt-0.5">${esc(req.description)}</p>` : ''}
            </div>
            <button onclick="voteCourseRequest(${req.id})"
                class="flex flex-col items-center justify-center w-12 h-12 rounded-xl font-bold text-xs flex-shrink-0 transition ${iVoted ? 'bg-pink-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-pink-300'}">
                <span>${iVoted ? '❤️' : '🤍'}</span>
                <span>${req.votes || 0}</span>
            </button>
        </div>`;
    }).join('');
}

function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('submitCourseRequestBtn')?.addEventListener('click', async () => {
    const titleInput = document.getElementById('newCourseTitleInput');
    const descInput  = document.getElementById('newCourseDescInput');
    const title = titleInput.value.trim();
    if (!title) { showToast('Escribe el nombre del curso que sugieres', 'error'); return; }

    const { error } = await supabase.from('course_requests').insert({
        title,
        description: descInput.value.trim() || null,
        created_by: currentUser?.email || 'anónimo',
        voters: []
    });

    if (error) {
        console.error('Error enviando sugerencia:', error.message);
        showToast('No se pudo enviar la sugerencia. Intenta de nuevo.', 'error');
        return;
    }
    titleInput.value = '';
    descInput.value = '';
    showToast('💡 ¡Sugerencia enviada! Gracias por tu idea', 'success');
    await loadCourseRequests();
});

async function voteCourseRequest(id) {
    const myId = currentUser?.id;
    if (!myId) return;

    const { data: current, error: fetchErr } = await supabase
        .from('course_requests').select('voters').eq('id', id).single();
    if (fetchErr) { showToast('No se pudo registrar tu voto.', 'error'); return; }

    let voters = current.voters || [];
    const alreadyVoted = voters.includes(myId);
    voters = alreadyVoted ? voters.filter(v => v !== myId) : [...voters, myId];

    const { error } = await supabase.from('course_requests').update({ voters }).eq('id', id);
    if (error) { showToast('No se pudo registrar tu voto.', 'error'); return; }

    await loadCourseRequests();
}

// ==================== COMPARTIR · REFERIDOS · EVIDENCIA ====================

// ── Compartir en redes (50 XP/día) ──────────────────────────────────────
async function shareApp() {
    const today = localDateStr();
    const lastShare = progress?.dailyMissions?.lastShareDate;
    const alreadyToday = lastShare === today;

    // Dar XP antes de abrir el share (la promesa de navigator.share no siempre resuelve)
    if (!alreadyToday) {
        if (!progress.dailyMissions) progress.dailyMissions = {};
        progress.dailyMissions.lastShareDate = today;
        addXP(50, 'Compartir el curso');
        saveProgress();
        showToast('🎉 +50 XP por compartir el curso', 'success');
    } else {
        showToast('Ya compartiste hoy. Vuelve mañana por más XP 😊', 'success');
    }

    const link = getReferralLink();
    const text = '🚀 Estoy aprendiendo metodología STEAM con el Curso STEAM 2.0. ¡Únete gratis y transforma tu aula!';

    if (navigator.share) {
        try {
            await navigator.share({ title: 'Curso STEAM 2.0', text, url: link });
        } catch (e) {
            // El usuario canceló el diálogo — no es error
            if (e?.name !== 'AbortError') {
                window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`, '_blank');
            }
        }
    } else {
        // Fallback: WhatsApp en escritorio o navegadores sin Web Share API
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`, '_blank');
    }
}

// ── Referidos ────────────────────────────────────────────────────────────
function getReferralLink() {
    const code = currentUser?.id || '';
    return `${window.location.origin}${window.location.pathname}?ref=${code}`;
}

function displayReferralLink() {
    const el = document.getElementById('referralLinkDisplay');
    if (el && currentUser) el.value = getReferralLink();
}

function copyReferralLink() {
    const link = getReferralLink();
    navigator.clipboard.writeText(link).catch(() => {
        const el = document.getElementById('referralLinkDisplay');
        if (el) { el.select(); document.execCommand('copy'); }
    });
    showToast('🔗 ¡Link copiado! Compártelo con tus colegas', 'success');
}

// Llamar al registrarse: si la URL tiene ?ref=ID, el nuevo usuario gana 50 XP
async function checkReferralBonus() {
    const params = new URLSearchParams(window.location.search);
    const referrerId = params.get('ref');
    if (!referrerId || referrerId === currentUser?.id) return;
    if (progress?.dailyMissions?.referralBonusClaimed) return;

    const { data } = await supabase.from('progress').select('user_id').eq('user_id', referrerId).maybeSingle();
    if (!data) return; // código inválido

    if (!progress.dailyMissions) progress.dailyMissions = {};
    progress.dailyMissions.referralBonusClaimed = true;
    progress.dailyMissions.referredBy = referrerId;
    addXP(50, 'Inscripción por referido');
    saveProgress();
    showToast('🎉 +50 XP por unirte con el enlace de un colega', 'success');
    window.history.replaceState({}, '', window.location.pathname); // limpiar URL
}

// Llamar al iniciar sesión: cobra XP pendiente por referidos
async function checkReferrerReward() {
    if (!currentUser || !progress) return;
    try {
        const { data, error } = await supabase
            .from('progress')
            .select('user_id')
            .filter('daily_missions->>referredBy', 'eq', currentUser.id);
        if (error || !data) return;

        const total = data.length;
        const claimed = progress.dailyMissions?.claimedReferrals || 0;
        const pending = total - claimed;

        const countEl = document.getElementById('referralCountDisplay');
        if (countEl) countEl.textContent = total > 0
            ? `${total} docente${total !== 1 ? 's' : ''} se inscribió${total !== 1 ? 'eron' : ''} con tu enlace`
            : 'Aún nadie ha usado tu enlace';

        if (pending > 0) {
            if (!progress.dailyMissions) progress.dailyMissions = {};
            progress.dailyMissions.claimedReferrals = total;
            addXP(pending * 100, `${pending} referido${pending !== 1 ? 's' : ''} nuevo${pending !== 1 ? 's' : ''}`);
            saveProgress();
            showToast(`🎉 +${pending * 100} XP por ${pending} docente${pending !== 1 ? 's' : ''} que se inscribió${pending !== 1 ? 'eron' : ''} con tu enlace`, 'success');
        }
    } catch (_) { }
}

// ── Evidencia de práctica (80 XP por módulo, máx. 1 por módulo) ─────────
function showEvidenceModal() {
    const evidences = progress?.dailyMissions?.evidencias || [];
    const listEl = document.getElementById('evidencesList');
    const prevEl = document.getElementById('previousEvidences');

    // Marcar módulos ya subidos en el select
    const select = document.getElementById('evidenceModuleSelect');
    if (select) {
        [...select.options].forEach(opt => {
            if (!opt.value) return;
            const done = evidences.find(e => String(e.moduleId) === opt.value);
            opt.textContent = opt.textContent.replace(' ✓', '');
            if (done) opt.textContent += ' ✓';
        });
    }

    if (evidences.length > 0) {
        prevEl?.classList.remove('hidden');
        if (listEl) listEl.innerHTML = evidences.map(e => `
            <div class="relative rounded-xl overflow-hidden aspect-square bg-slate-100">
                <img src="${e.url}" class="w-full h-full object-cover">
                <span class="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">M${e.moduleId}</span>
            </div>`).join('');
    } else {
        prevEl?.classList.add('hidden');
    }

    // Limpiar estado del form
    document.getElementById('evidenceFileInput').value = '';
    document.getElementById('evidencePreviewImg').classList.add('hidden');
    document.getElementById('evidenceModuleSelect').value = '';

    document.getElementById('evidenceModal').classList.remove('hidden');
}

async function submitEvidence() {
    const moduleId = document.getElementById('evidenceModuleSelect').value;
    const file = document.getElementById('evidenceFileInput').files[0];

    if (!moduleId) { showToast('Selecciona un módulo', 'success'); return; }
    if (!file) { showToast('Selecciona una imagen', 'success'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('La imagen debe ser menor a 5 MB', 'success'); return; }

    const existing = (progress.dailyMissions?.evidencias || []).find(e => String(e.moduleId) === moduleId);
    if (existing) { showToast(`Ya subiste evidencia del módulo ${moduleId}`, 'success'); return; }

    const btn = document.getElementById('submitEvidenceBtn');
    btn.textContent = 'Subiendo…';
    btn.disabled = true;

    const saveEvidence = (url) => {
        if (!progress.dailyMissions) progress.dailyMissions = {};
        if (!progress.dailyMissions.evidencias) progress.dailyMissions.evidencias = [];
        progress.dailyMissions.evidencias.push({ url, moduleId: parseInt(moduleId), date: new Date().toISOString() });
        addXP(80, `Evidencia módulo ${moduleId}`);
        saveProgress();
        document.getElementById('evidenceModal').classList.add('hidden');
        showToast(`🎉 +80 XP por tu evidencia del módulo ${moduleId}`, 'success');
    };

    try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${currentUser.id}/mod${moduleId}_${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('evidencias').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('evidencias').getPublicUrl(path);
        saveEvidence(urlData.publicUrl);
    } catch (_) {
        // Fallback: guardar en base64 local si Storage no está disponible
        const reader = new FileReader();
        reader.onload = ev => saveEvidence(ev.target.result);
        reader.readAsDataURL(file);
    } finally {
        btn.textContent = 'Subir evidencia y ganar XP';
        btn.disabled = false;
    }
}

// ==================== EDICIÓN DE PERFIL ====================
function updateProfilePhotoDisplay(src) {
    const img = document.getElementById('profilePhotoPreview');
    const emoji = document.getElementById('avatarPreview');
    if (src) {
        img.src = src;
        img.classList.remove('hidden');
        emoji.style.display = 'none';
    } else {
        img.classList.add('hidden');
        emoji.style.display = '';
    }
}

function showEditProfile() {
    const modal = document.getElementById('editProfileModal');
    const nameInput = document.getElementById('fullNameInput');
    const editImg = document.getElementById('editPhotoImg');
    const editEmoji = document.getElementById('editPhotoEmoji');

    nameInput.value = progress?.dailyMissions?.fullName || '';
    const schoolEl = document.getElementById('schoolInput');
    const deptEl   = document.getElementById('departmentInput');
    if (schoolEl) schoolEl.value = progress?.dailyMissions?.school || '';
    if (deptEl)   deptEl.value   = progress?.dailyMissions?.department || '';

    const photo = progress?.dailyMissions?.profilePhoto;
    if (photo) {
        editImg.src = photo;
        editImg.classList.remove('hidden');
        editEmoji.style.display = 'none';
    } else {
        editImg.classList.add('hidden');
        editEmoji.style.display = '';
        editEmoji.textContent = currentAvatar || '👨‍🏫';
    }

    modal.classList.remove('hidden');
}

document.getElementById('editProfileBtn')?.addEventListener('click', showEditProfile);
document.getElementById('closeEditProfileBtn')?.addEventListener('click', () => {
    document.getElementById('editProfileModal').classList.add('hidden');
});

document.getElementById('photoFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const src = ev.target.result;
        const editImg = document.getElementById('editPhotoImg');
        const editEmoji = document.getElementById('editPhotoEmoji');
        editImg.src = src;
        editImg.classList.remove('hidden');
        editEmoji.style.display = 'none';
    };
    reader.readAsDataURL(file);
});

document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
    const name = document.getElementById('fullNameInput').value.trim();
    const photoSrc = document.getElementById('editPhotoImg').src;
    const hasPhoto = !document.getElementById('editPhotoImg').classList.contains('hidden');

    const school = document.getElementById('schoolInput')?.value.trim() || '';
    const department = document.getElementById('departmentInput')?.value || '';

    if (!progress.dailyMissions) progress.dailyMissions = {};
    if (name) progress.dailyMissions.fullName = name;
    if (hasPhoto && photoSrc) progress.dailyMissions.profilePhoto = photoSrc;
    progress.dailyMissions.school     = school || '';
    progress.dailyMissions.department = department || '';

    // Guardar perfil en localStorage Y en Supabase user_metadata para sincronizar entre dispositivos
    const _profileKey = currentUser ? `userProfile_${currentUser.id}` : 'userProfile_local';
    const _savedProfile = {
        fullName: progress.dailyMissions.fullName,
        profilePhoto: progress.dailyMissions.profilePhoto,
        school: progress.dailyMissions.school,
        department: progress.dailyMissions.department
    };
    localStorage.setItem(_profileKey, JSON.stringify(_savedProfile));
    if (currentUser) {
        supabase.auth.updateUser({ data: {
            fullName:   progress.dailyMissions.fullName || currentUser.user_metadata?.fullName,
            school:     progress.dailyMissions.school,
            department: progress.dailyMissions.department
        }}).catch(() => {});
    }

    // Actualizar display en perfil
    const nameDisplay = document.getElementById('userEmailDisplay');
    if (nameDisplay && name) nameDisplay.textContent = name;
    if (hasPhoto && photoSrc) updateProfilePhotoDisplay(photoSrc);

    // Recompensar perfil completo (nombre + foto) una sola vez
    if (name && hasPhoto && !progress.dailyMissions.profileCompleteRewarded) {
        progress.dailyMissions.profileCompleteRewarded = true;
        addXP(30, 'Perfil completo');
        showToast('✅ Perfil actualizado · +30 XP por completar tu perfil 🎉', 'success');
    } else {
        showToast('✅ Perfil actualizado', 'success');
    }

    saveProgress();
    document.getElementById('editProfileModal').classList.add('hidden');
});

function showAvatarSelector() {
    let html = "";
    avatars.forEach(avatar => {
        const selected = currentAvatar === avatar ? "border-4 border-indigo-500" : "border-2 border-gray-200";
        html += `<button data-avatar="${avatar}" class="text-3xl p-2 rounded-full ${selected} hover:bg-gray-100 transition">${avatar}</button>`;
    });
    document.getElementById("avatarGrid").innerHTML = html;
    document.getElementById("avatarModal").classList.remove("hidden");
    document.querySelectorAll("[data-avatar]").forEach(btn => {
        btn.addEventListener("click", () => {
            currentAvatar = btn.dataset.avatar;
            progress.avatar = currentAvatar;
            document.getElementById("avatarPreview").innerHTML = currentAvatar;
            saveProgress();
            document.getElementById("avatarModal").classList.add("hidden");
            showToast("Avatar actualizado", "success");
            supabase.auth.updateUser({ data: { avatar: currentAvatar } });
        });
    });
}

// ==================== MODAL DE PROYECTO (Think·Make·Improve) ====================
function showProjectModal(card) {
    const p = card.project;
    if (!p) return;
    const existing = document.getElementById('projectModal');
    if (existing) existing.remove();

    const materialsHtml = p.materials.map(m =>
        `<span class="inline-block bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full mb-1 mr-1">${m}</span>`).join('');

    const disciplinesHtml = p.disciplines.map(d =>
        `<span class="inline-block bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full mb-1 mr-1">${d}</span>`).join('');

    const tmiSection = (p.think && p.make && p.improve) ? `
        <div class="mt-5 border-t border-gray-100 pt-4">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Ciclo Think · Make · Improve</p>
            <div class="rounded-2xl overflow-hidden border border-slate-100 mb-1">
                <div class="bg-blue-50 px-4 py-2 flex items-center gap-2">
                    <span class="text-lg">🧠</span>
                    <span class="font-bold text-blue-700 text-sm">THINK — Investiga y planifica</span>
                </div>
                ${p.think.map((s, i) => `<div class="flex gap-3 px-4 py-2.5 border-t border-blue-50">
                    <div class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</div>
                    <p class="text-sm text-slate-700 leading-relaxed">${s}</p>
                </div>`).join('')}
            </div>
            <div class="rounded-2xl overflow-hidden border border-slate-100 mb-1">
                <div class="bg-amber-50 px-4 py-2 flex items-center gap-2">
                    <span class="text-lg">🔨</span>
                    <span class="font-bold text-amber-700 text-sm">MAKE — Construye y experimenta</span>
                </div>
                ${p.make.map((s, i) => `<div class="flex gap-3 px-4 py-2.5 border-t border-amber-50">
                    <div class="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</div>
                    <p class="text-sm text-slate-700 leading-relaxed">${s}</p>
                </div>`).join('')}
            </div>
            <div class="rounded-2xl overflow-hidden border border-slate-100">
                <div class="bg-green-50 px-4 py-2 flex items-center gap-2">
                    <span class="text-lg">✨</span>
                    <span class="font-bold text-green-700 text-sm">IMPROVE — Reflexiona y mejora</span>
                </div>
                ${p.improve.map((s, i) => `<div class="flex gap-3 px-4 py-2.5 border-t border-green-50">
                    <div class="w-5 h-5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</div>
                    <p class="text-sm text-slate-700 leading-relaxed">${s}</p>
                </div>`).join('')}
            </div>
        </div>` : '';

    const cardIdKey = `${currentModule}-${currentCardIndex}`;
    const modalHtml = `
    <div id="projectModal" class="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div class="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between z-10">
                <div>
                    <h2 class="text-lg font-bold text-indigo-900">📋 ${p.title}</h2>
                    <div class="flex gap-2 mt-1">
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">⏱ ${p.duration}</span>
                        <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">📊 ${p.difficulty}</span>
                    </div>
                </div>
                <button onclick="document.getElementById('projectModal').remove()" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition text-lg leading-none">&times;</button>
            </div>
            <div class="p-5">
                <div class="mb-4">
                    <h3 class="font-bold text-gray-800 mb-2">🧰 Materiales</h3>
                    <div>${materialsHtml}</div>
                </div>
                <div class="mb-4">
                    <h3 class="font-bold text-gray-800 mb-2">🔬 Disciplinas STEAM que integra</h3>
                    <div>${disciplinesHtml}</div>
                </div>
                ${tmiSection}
                <div class="mt-5 border-t border-gray-100 pt-4">
                    <h3 class="font-bold text-gray-800 mb-1">📸 Subir evidencias <span class="text-xs text-gray-400 font-normal">(opcional)</span></h3>
                    <p class="text-xs text-gray-500 mb-3">Describe cómo lo aplicaste en tu clase o agrega un enlace a fotos/video.</p>
                    <textarea id="evidenceText" rows="3" placeholder="Describe cómo fue la actividad en tu clase..." class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"></textarea>
                    <input id="evidenceUrl" type="url" placeholder="Enlace a fotos o video (opcional)" class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3">
                    <button onclick="submitProjectEvidence('${cardIdKey}', '${p.title.replace(/'/g, '')}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-2xl text-sm transition">
                        📤 Enviar evidencia
                    </button>
                    <div id="evidenceStatus" class="mt-2 text-xs text-center text-gray-400"></div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function submitProjectEvidence(cardId, projectTitle) {
    if (!currentUser) { showToast('Debes iniciar sesión', 'success'); return; }
    const text = document.getElementById('evidenceText')?.value.trim();
    const url = document.getElementById('evidenceUrl')?.value.trim();
    if (!text && !url) { showToast('Por favor escribe una descripción o agrega un enlace', 'success'); return; }

    const statusEl = document.getElementById('evidenceStatus');
    if (statusEl) statusEl.textContent = 'Enviando…';

    const { error } = await supabase.from('project_evidence').insert({
        user_id: currentUser.id,
        card_id: cardId,
        project_title: projectTitle,
        evidence_text: text || null,
        evidence_url: url || null
    });

    if (error) {
        if (statusEl) statusEl.textContent = `Error: ${error.message}`;
    } else {
        if (statusEl) { statusEl.textContent = '✅ ¡Evidencia enviada! Gracias por compartir.'; statusEl.className = 'mt-2 text-xs text-center text-green-600'; }
        if (document.getElementById('evidenceText')) document.getElementById('evidenceText').value = '';
        if (document.getElementById('evidenceUrl')) document.getElementById('evidenceUrl').value = '';
        showToast('📸 ¡Evidencia enviada correctamente!', 'success');
        addXP(15, 'Evidencia de proyecto enviada');
    }
}

// ── Helper: nombre del docente logueado ──────────────────
function getDisplayName() {
    if (progress?.dailyMissions?.fullName) return progress.dailyMissions.fullName;
    if (!currentUser?.email) return 'Profe';
    const raw = currentUser.email.split('@')[0].replace(/[._-]/g, ' ');
    return raw.replace(/\b\w/g, c => c.toUpperCase());
}

// ── Modo Repaso ──
function startRepasoMode() {
    const wrongIds = progress.dailyMissions?.wrongQuizzes || [];
    if (!wrongIds.length) { showToast('¡Sin quizzes pendientes de repasar! 🎉', 'success'); return; }

    const _label = `🔁 Repaso: ${wrongIds.length} quiz${wrongIds.length!==1?'zes':''} pendiente${wrongIds.length!==1?'s':''}`;

    // 1. Buscar primero en el curso actual
    for (let m = 0; m < modulesData.length; m++) {
        const cards = modulesData[m]?.cards || [];
        for (let ci = 0; ci < cards.length; ci++) {
            const c = cards[ci];
            if (c.type === 'quiz' && wrongIds.includes(String(c.id))) {
                currentModule = m + 1;
                currentCardIndex = ci;
                switchTab('home');
                renderCard();
                showToast(_label, 'info');
                return;
            }
        }
    }

    // 2. Si no está en el curso actual, buscar en todos los cursos
    const _allC = (typeof allCourses !== 'undefined' && allCourses) || [];
    for (const course of _allC) {
        if (course.id === currentCourseId) continue;
        const mods = course.modules || [];
        for (let m = 0; m < mods.length; m++) {
            const cards = mods[m]?.cards || [];
            for (let ci = 0; ci < cards.length; ci++) {
                const c = cards[ci];
                if (c.type === 'quiz' && wrongIds.includes(String(c.id))) {
                    // Cambiar al curso que contiene el quiz
                    currentCourseId = course.id;
                    modulesData = course.modules;
                    if (progress) { progress.currentCourseId = course.id; saveProgress(); }
                    currentModule = m + 1;
                    currentCardIndex = ci;
                    document.getElementById('courseSelector')?.classList.add('hidden');
                    document.getElementById('mainApp')?.classList.remove('hidden');
                    switchTab('home');
                    renderCard();
                    showToast(_label, 'info');
                    return;
                }
            }
        }
    }

    // 3. No se encontró en ningún curso — limpiar entradas huérfanas
    progress.dailyMissions.wrongQuizzes = [];
    saveProgress();
    showToast('¡Sin quizzes pendientes de repasar! 🎉', 'success');
}

// Al responder correctamente un quiz en repaso, quitarlo de wrongQuizzes
function _removeFromWrong(cardId) {
    const dm = progress.dailyMissions;
    if (!dm?.wrongQuizzes) return;
    dm.wrongQuizzes = dm.wrongQuizzes.filter(id => id !== String(cardId));
    saveProgress();
}

// ── Notas por tarjeta ──
function toggleCardNote(cardKey) {
    const area = document.getElementById(`noteArea_${cardKey}`);
    const btn  = document.getElementById(`noteBtn_${cardKey}`);
    if (!area) return;
    const visible = area.style.display !== 'none';
    area.style.display = visible ? 'none' : 'block';
    if (!visible) document.getElementById(`noteInput_${cardKey}`)?.focus();
}

function saveCardNote(cardKey, text) {
    if (!progress.dailyMissions) progress.dailyMissions = {};
    if (!progress.dailyMissions.cardNotes) progress.dailyMissions.cardNotes = {};
    if (text.trim()) {
        progress.dailyMissions.cardNotes[cardKey] = text;
    } else {
        delete progress.dailyMissions.cardNotes[cardKey];
    }
    const btn = document.getElementById(`noteBtn_${cardKey}`);
    if (btn) btn.style.cssText = text.trim()
        ? 'flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:16px;border:1px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:600;cursor:pointer'
        : 'flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:16px;border:1px solid #e2e8f0;background:white;color:#64748b;font-size:12px;font-weight:600;cursor:pointer';
    clearTimeout(saveCardNote._t);
    saveCardNote._t = setTimeout(() => { saveProgress(); checkBadges(); }, 1200);
}

// ── Lo apliqué en clase ──
function toggleApplied(cardKey) {
    if (!progress.dailyMissions) progress.dailyMissions = {};
    if (!progress.dailyMissions.appliedCards) progress.dailyMissions.appliedCards = [];
    const arr = progress.dailyMissions.appliedCards;
    const idx = arr.indexOf(cardKey);
    const btn = document.getElementById(`appliedBtn_${cardKey}`);
    if (idx === -1) {
        arr.push(cardKey);
        if (btn) { btn.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:16px;border:1px solid #86efac;background:#dcfce7;color:#15803d;font-size:12px;font-weight:600;cursor:pointer'; btn.innerHTML = '🍎 ¡Ya lo apliqué!'; }
        addXP(15, 'Concepto aplicado en clase');
        updateMissionProgress('applied', 1);
        showToast('🍎 +15 XP ¡Genial! Aplicar es el mejor aprendizaje', 'success');
        // Misión semanal w_applied
        const wm = progress.dailyMissions?.weeklyMissions || [];
        wm.forEach(m => { if (!m.completed && m.type === 'w_applied') { m.current++; if (m.current >= m.target) { m.completed = true; showToast(`🏆 ¡Misión semanal: ${m.name}!`, 'success'); } } });
    } else {
        arr.splice(idx, 1);
        if (btn) { btn.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:16px;border:1px solid #e2e8f0;background:white;color:#64748b;font-size:12px;font-weight:600;cursor:pointer'; btn.innerHTML = '🍎 Lo apliqué en clase'; }
    }
    saveProgress();
    checkBadges();
}

// ── Helper: ir a la tarjeta de referencia del quiz ──
function goToRefCard() {
    const currentCard = modulesData[currentModule - 1]?.cards?.[currentCardIndex];
    const targetId = currentCard?.reviewCard;

    if (targetId) {
        // Buscar la tarjeta por ID en todos los módulos
        for (let m = 0; m < modulesData.length; m++) {
            const cards = modulesData[m]?.cards || [];
            const idx = cards.findIndex(c => c.id === targetId);
            if (idx !== -1) {
                currentModule = m + 1;
                currentCardIndex = idx;
                renderCard();
                return;
            }
        }
    }

    // Fallback: tarjeta de contenido anterior en el mismo módulo
    let idx = currentCardIndex - 1;
    const mod = modulesData[currentModule - 1];
    while (idx >= 0 && mod?.cards[idx]?.type !== 'content') idx--;
    if (idx >= 0) { currentCardIndex = idx; renderCard(); }
}

// ==================== EXAMEN FINAL (formato tarjeta) ====================
let examActive = false;
let examCurrentQ = 0;
let examAnswers = [];
let examQuestions = []; // subconjunto aleatorio para este intento

function _shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startExam() {
    // Verificar progreso usando los IDs reales de las tarjetas del curso activo
    const totalCards = modulesData.reduce((acc, m) => acc + m.cards.length, 0);
    const allCardIds = modulesData.flatMap(m => m.cards.map(c => String(c.id)));
    const completedInCourse = allCardIds.filter(id => (progress.completedCards || []).includes(id)).length;
    const minRequired = Math.ceil(totalCards * 0.8); // 80% mínimo para rendir el examen

    if (completedInCourse < minRequired) {
        const unseen = [];
        modulesData.forEach(mod => {
            const missing = mod.cards
                .filter(card => !(progress.completedCards || []).includes(String(card.id)))
                .map(card => `• "${card.title || card.question || `Tarjeta ${card.id}`}"`);
            if (missing.length) unseen.push(`\n📚 ${mod.title}:\n${missing.join('\n')}`);
        });
        const faltante = minRequired - completedInCourse;
        const detail = document.createElement('div');
        detail.className = 'modal-sheet';
        detail.style.zIndex = '9999';
        detail.innerHTML = `<div class="modal-inner" style="max-height:80vh">
            <div class="modal-drag"></div>
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold text-slate-800">⚠️ Tarjetas pendientes</h3>
                <button onclick="this.closest('.modal-sheet').remove()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xl flex items-center justify-center">&times;</button>
            </div>
            <p class="text-sm text-slate-500 mb-4">Necesitas completar al menos el 80% del curso para rendir el examen (faltan ${faltante} tarjetas):</p>
            <div class="space-y-3 text-sm">
                ${unseen.map(block => `<div class="bg-red-50 border border-red-100 rounded-2xl p-3 text-red-700 whitespace-pre-line">${block.trim()}</div>`).join('')}
            </div>
        </div>`;
        document.getElementById('mainApp').appendChild(detail);
        return;
    }
    // Mezclar y tomar 20 preguntas del banco del curso ACTIVO (no siempre STEAM)
    const allQ = _shuffleArray(getCourseExam(getActiveCourseData()).questions);
    if (!allQ.length) {
        showToast('Este curso aún no tiene examen final disponible', 'warning');
        return;
    }
    stopCardTracking();
    examActive = true;
    examCurrentQ = 0;
    examQuestions = allQ.slice(0, 20);
    examAnswers = new Array(examQuestions.length).fill(null);
    switchTab('home');
    _hideNavBtns(true);
    _setTopBarExam(true);
    renderExamCard();
    animateCard('next');
}

function _hideNavBtns(hide) {
    const nb = document.getElementById('cardNavBar');
    if (nb) nb.style.display = hide ? 'none' : '';
}

function _setTopBarExam(active) {
    const badge = document.getElementById('moduleBadge');
    const label = badge?.previousElementSibling; // "CURSO STEAM" label
    const progressArea = document.querySelector('.top-bar .flex.items-center.gap-2');
    if (active) {
        // Mostrar de qué curso es el examen (con su color) — antes decía
        // siempre "Evaluación Final" genérico, sin identificar el curso.
        const _cid = (typeof currentCourseId !== 'undefined' && currentCourseId) || 'steam';
        const course = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === _cid) : null;
        if (badge) {
            badge.dataset.orig = badge.textContent;
            badge.dataset.origColor = badge.style.color || '';
            badge.textContent = course ? `Examen: ${course.title}` : 'Evaluación Final';
            if (course?.color) badge.style.color = course.color;
        }
        if (label) { label.dataset.orig = label.textContent; label.textContent = 'EXAMEN FINAL'; }
        if (progressArea) progressArea.style.display = 'none';
    } else {
        if (badge?.dataset.orig) { badge.textContent = badge.dataset.orig; badge.style.color = badge.dataset.origColor || ''; }
        if (label?.dataset.orig) label.textContent = label.dataset.orig;
        if (progressArea) progressArea.style.display = '';
    }
}

function renderExamCard() {
    const q = examQuestions[examCurrentQ];
    const total = examQuestions.length;
    const qNum = examCurrentQ + 1;
    const pct = Math.round((qNum / total) * 100);
    const saved = examAnswers[examCurrentQ];

    const examIllus = `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8 L44 22 H58 L47 31 L51 45 L40 36 L29 45 L33 31 L22 22 H36 Z" fill="rgba(255,255,255,0.92)"/>
        <circle cx="63" cy="60" r="11" stroke="rgba(255,255,255,0.75)" stroke-width="2"/>
        <text x="63" y="65" text-anchor="middle" font-size="13" fill="white" font-weight="bold">?</text>
        <circle cx="19" cy="57" r="7" fill="rgba(255,255,255,0.35)"/>
        <circle cx="19" cy="57" r="3.5" fill="rgba(255,255,255,0.65)"/>
    </svg>`;

    const optLetters = ['A', 'B', 'C', 'D'];
    const optsHtml = q.options.map((opt, i) => {
        const sel = saved === i;
        return `<button onclick="selectExamAnswer(${i})" data-opt="${i}"
            class="exam-opt w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium flex items-start gap-3 transition-all"
            style="${sel ? 'border-color:#7C3AED;background:#EDE9FE;color:#4C1D95' : 'border-color:#E2E8F0;background:white;color:#374151'}">
            <span class="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                style="${sel ? 'background:#7C3AED;border-color:#7C3AED;color:white' : 'border-color:#CBD5E1;color:#64748B'}">${optLetters[i]}</span>
            <span class="leading-snug pt-0.5">${opt}</span>
        </button>`;
    }).join('');

    const isLast = examCurrentQ >= total - 1;
    const cardHtml = `<div id="activeCard" class="content-card">
        <div class="card-banner" style="background:#5C35C5">
            <div class="card-banner-svg">${examIllus}</div>
            <p class="card-banner-sub">⭐ Examen Final &nbsp;·&nbsp; Pregunta ${qNum} de ${total}</p>
        </div>
        <div class="card-body">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Progreso del examen</span><span>${pct}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                <div class="h-1.5 rounded-full transition-all" style="width:${pct}%;background:#7C3AED"></div>
            </div>
            <p style="font-size:1rem;font-weight:700;color:#1a202c;margin-bottom:1rem;line-height:1.45">${q.text}</p>
            <div class="space-y-2" id="examOptions">${optsHtml}</div>
        </div>
        <div class="card-footer">
            <button id="examNextBtn" onclick="goToNextExamCard()"
                class="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                style="background:${saved !== null ? '#5C35C5' : '#C4B5FD'}"
                ${saved === null ? 'disabled' : ''}>
                ${isLast ? '✅ Ver mis resultados' : 'Siguiente pregunta →'}
            </button>
            <button onclick="exitExam()" class="w-full py-1.5 mt-1 text-slate-400 text-xs">Salir del examen</button>
        </div>
    </div>`;

    document.getElementById('cardContainer').innerHTML = cardHtml;
    // Swipe to advance (not back — exam is forward-only)
    let _tx = 0;
    const card = document.getElementById('activeCard');
    if (card) {
        card.addEventListener('touchstart', e => { _tx = e.changedTouches[0].screenX; }, { passive: true });
        card.addEventListener('touchend', e => {
            if (e.changedTouches[0].screenX - _tx < -50) goToNextExamCard();
        }, { passive: true });
    }
}

function selectExamAnswer(optIdx) {
    const q = examQuestions[examCurrentQ];
    const isCorrect = optIdx === q.correct;
    examAnswers[examCurrentQ] = optIdx;

    document.querySelectorAll('.exam-opt').forEach((btn, i) => {
        const circle = btn.querySelector('span');
        btn.disabled = true; // lock options after selecting
        if (i === q.correct) {
            // siempre resalta la correcta en verde
            btn.style.cssText = 'border-color:#16A34A;background:#F0FDF4;color:#14532D';
            circle.style.cssText = 'background:#16A34A;border-color:#16A34A;color:white';
        } else if (i === optIdx && !isCorrect) {
            // la elegida incorrecta en rojo
            btn.style.cssText = 'border-color:#DC2626;background:#FEF2F2;color:#7F1D1D';
            circle.style.cssText = 'background:#DC2626;border-color:#DC2626;color:white';
        } else {
            btn.style.cssText = 'border-color:#E2E8F0;background:white;color:#94A3B8';
            circle.style.cssText = 'border-color:#CBD5E1;color:#94A3B8';
        }
    });

    // Mostrar retroalimentación inline debajo de las opciones
    const opts = document.getElementById('examOptions');
    if (opts) {
        const fb = document.createElement('div');
        const optLetters = ['A', 'B', 'C', 'D'];
        fb.style.cssText = `margin-top:12px;padding:10px 14px;border-radius:14px;font-size:.82rem;line-height:1.5;
            background:${isCorrect ? '#F0FDF4' : '#FEF2F2'};
            border:1.5px solid ${isCorrect ? '#86EFAC' : '#FECACA'};
            color:${isCorrect ? '#14532D' : '#7F1D1D'}`;
        fb.innerHTML = `<strong>${isCorrect ? '✅ ¡Correcto!' : `❌ Incorrecto · La correcta era ${optLetters[q.correct]}`}</strong>` +
            (q.explanation ? `<br><span style="opacity:.85">${q.explanation}</span>` : '');
        opts.appendChild(fb);
    }

    const nb = document.getElementById('examNextBtn');
    if (nb) { nb.disabled = false; nb.style.background = '#5C35C5'; }
}

function goToNextExamCard() {
    if (examAnswers[examCurrentQ] === null) { showToast('Selecciona una respuesta para continuar'); return; }
    examCurrentQ++;
    if (examCurrentQ >= examQuestions.length) {
        showExamResults();
    } else {
        renderExamCard();
        animateCard('next');
    }
}

function showExamResults() {
    const exam = getCourseExam(getActiveCourseData());
    let correct = 0;
    examQuestions.forEach((q, i) => { if (examAnswers[i] === q.correct) correct++; });
    const pct = Math.round((correct / examQuestions.length) * 100);
    const passed = pct >= exam.passingScore;

    if (passed && !progress.badges.includes("examPass")) unlockBadge("examPass");
    if (passed) addXP(100, "Examen aprobado");
    if (passed) {
        if (!progress.dailyMissions) progress.dailyMissions = {};
        // Guardar puntaje por courseId para soportar múltiples cursos
        const _cid = (typeof currentCourseId !== 'undefined' && currentCourseId) || 'steam';
        if (!progress.dailyMissions.examScores) progress.dailyMissions.examScores = {};
        progress.dailyMissions.examScores[_cid] = pct;
        if (_cid === 'steam') progress.dailyMissions.examScore = pct; // backward compat solo para STEAM
        // Fecha por courseId (no solo la global examDate) — el certificado
        // debe mostrar cuándo se aprobó ESE curso, no la última vez que se
        // aprobó CUALQUIER examen (que es lo que examDate por sí sola dice).
        if (!progress.dailyMissions.examDates) progress.dailyMissions.examDates = {};
        progress.dailyMissions.examDates[_cid] = localDateStr();
        progress.dailyMissions.examDate = localDateStr(); // legado, se mantiene por compatibilidad
        window._lastExamScore = pct;
        window._lastExamCourseId = _cid;
        // Refrescar de inmediato la lista de certificados (aparece el botón
        // de diploma de este curso sin esperar a la próxima vez que se
        // abra Progreso).
        if (typeof _checkMasterCert === 'function') _checkMasterCert();
        if (typeof _updateExamBtn === 'function') _updateExamBtn();
    }
    saveProgress();

    const resultIllus = passed
        ? `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 10 L44 24 H58 L47 33 L51 47 L40 38 L29 47 L33 33 L22 24 H36 Z" fill="rgba(255,255,255,0.95)"/><circle cx="62" cy="62" r="9" fill="rgba(255,255,255,0.3)"/><path d="M57 62 L61 66 L68 58" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="10" width="48" height="60" rx="8" stroke="rgba(255,255,255,0.9)" stroke-width="2.5"/><line x1="26" y1="30" x2="54" y2="30" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="40" x2="54" y2="40" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="50" x2="42" y2="50" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/></svg>`;

    const cardHtml = `<div id="activeCard" class="content-card">
        <div class="card-banner" style="background:${passed ? '#059669' : '#DC2626'}">
            <div class="card-banner-svg">${resultIllus}</div>
            <p class="card-banner-sub" style="color:white;font-size:1rem;font-weight:800;opacity:1">
                ${passed ? '¡Aprobaste el examen!' : 'Sigue practicando'}
            </p>
            <p class="card-banner-sub" style="margin-top:2px">${correct} de ${examQuestions.length} correctas</p>
        </div>
        <div class="card-body" style="text-align:center">
            <div class="rounded-2xl p-4 mb-4" style="background:${passed ? '#F0FDF4' : '#FEF2F2'}">
                <p style="font-size:2.5rem;font-weight:900;color:${passed ? '#16A34A' : '#DC2626'};line-height:1">${pct}%</p>
                <p style="font-size:.8rem;font-weight:600;color:${passed ? '#15803D' : '#B91C1C'};margin-top:4px">
                    ${passed ? '¡Superaste el mínimo del ' + exam.passingScore + '%!' : 'Necesitas ' + exam.passingScore + '% para aprobar'}
                </p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
                <div style="background:#F0FDF4;border-radius:12px;padding:12px">
                    <p style="font-size:1.5rem;font-weight:700;color:#16A34A">${correct}</p>
                    <p style="font-size:.75rem;color:#64748B;margin-top:2px">Correctas ✅</p>
                </div>
                <div style="background:#FEF2F2;border-radius:12px;padding:12px">
                    <p style="font-size:1.5rem;font-weight:700;color:#DC2626">${examQuestions.length - correct}</p>
                    <p style="font-size:.75rem;color:#64748B;margin-top:2px">Incorrectas ❌</p>
                </div>
            </div>
            ${passed ? `<button onclick="requestCertificate('diploma', null, ${pct})" class="w-full py-3 rounded-xl font-bold text-white text-sm" style="background:#5C35C5;margin-bottom:8px">📜 Obtener mi diploma de participación · Q10</button>` : ''}
            <button onclick="retryExam()" class="w-full py-3 rounded-xl font-bold text-sm" style="border:2px solid #E2E8F0;color:#475569;background:white;margin-bottom:4px">
                🔄 Reintentar examen
            </button>
            <button onclick="exitExam()" style="color:#94A3B8;font-size:.75rem;padding:6px;background:none;border:none;cursor:pointer;width:100%">Volver al curso</button>
        </div>
    </div>`;

    document.getElementById('cardContainer').innerHTML = cardHtml;
}

function retryExam() {
    examCurrentQ = 0;
    // Reintento: nuevo subconjunto aleatorio de 20 preguntas del curso ACTIVO
    const allQ = _shuffleArray(getCourseExam(getActiveCourseData()).questions);
    examQuestions = allQ.slice(0, 20);
    examAnswers = new Array(examQuestions.length).fill(null);
    renderExamCard();
    animateCard('next');
}

function exitExam() {
    examActive = false;
    examCurrentQ = 0;
    examAnswers = [];
    _hideNavBtns(false);
    _setTopBarExam(false);
    renderCard();
}

async function _imgToBase64(path) {
    try {
        const r = await fetch(path);
        if (!r.ok) return null;
        const blob = await r.blob();
        return new Promise(res => {
            const rd = new FileReader();
            rd.onloadend = () => res(rd.result);
            rd.readAsDataURL(blob);
        });
    } catch { return null; }
}

// Obtiene el código de verificación existente para este docente+certificado, o crea uno nuevo persistente
async function getOrCreateCertCode(courseId, certType, fullName, score) {
    if (!currentUser) return null;
    try {
        const { data: existing } = await supabase
            .from('certificates')
            .select('code')
            .eq('user_id', currentUser.id)
            .eq('cert_type', certType)
            .eq('course_id', courseId || '')
            .maybeSingle();
        if (existing?.code) return existing.code;

        const code = `DOC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { error } = await supabase.from('certificates').insert({
            code, user_id: currentUser.id, course_id: courseId || null,
            cert_type: certType, full_name: fullName, score: Math.round(score || 0)
        });
        if (error) { console.error('No se pudo registrar el certificado:', error.message); return code; }
        return code;
    } catch (e) {
        console.error('Error generando código de certificado:', e);
        return `DOC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
}

function buildVerifyQRHtml(certCode) {
    const verifyUrl = `${location.origin}${location.pathname.replace(/index\.html$/, '')}verificar.html?code=${encodeURIComponent(certCode)}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=0&data=${encodeURIComponent(verifyUrl)}`;
    return { verifyUrl, qrImg };
}

// Carga las firmas activas desde Supabase (con caché de sesión)
let _cachedSignatures = null;
async function _loadCertSignatures() {
    if (_cachedSignatures) return _cachedSignatures;
    try {
        const { data } = await supabase.from('cert_signatures').select('*').eq('active', true).order('slot');
        _cachedSignatures = data?.length ? data : [{ slot:1, signer_name:'Billy Abraham Gómez Sac', signer_role:'Coordinación del Programa', signature_url: null }];
    } catch(_) {
        _cachedSignatures = [{ slot:1, signer_name:'Billy Abraham Gómez Sac', signer_role:'Coordinación del Programa', signature_url: null }];
    }
    return _cachedSignatures;
}

// Carga las firmas para el certificado del usuario actual:
//   slot 1 (por defecto) + director del centro si existe + slot 3 MINEDUC si existe
let _cachedUserSchoolSig = undefined; // undefined = no cargado aún, null = sin firma de director
async function _loadCertSignaturesForUser() {
    const globalSigs = await _loadCertSignatures();
    const slot1 = globalSigs.find(s => s.slot === 1);
    const slot3 = globalSigs.find(s => s.slot === 3 && s.active !== false);

    // Cargar firma de director del centro educativo del usuario
    if (_cachedUserSchoolSig === undefined) {
        try {
            const schoolName = progress?.dailyMissions?.school;
            if (schoolName) {
                const { data: schoolRows } = await supabase
                    .from('schools')
                    .select('plan, director_name, director_role, director_signature_url')
                    .eq('name', schoolName)
                    .limit(1);
                const s = schoolRows?.[0];
                // Firma de director es beneficio de plan pagado — free se queda con la firma genérica del programa
                _cachedUserSchoolSig = (s?.plan === 'paid' && (s?.director_name || s?.director_signature_url))
                    ? { signer_name: s.director_name || '', signer_role: s.director_role || 'Directora / Director', signature_url: s.director_signature_url || null }
                    : null;
            } else {
                _cachedUserSchoolSig = null;
            }
        } catch(_) { _cachedUserSchoolSig = null; }
    }

    const result = [];
    if (slot1) result.push(slot1);
    if (_cachedUserSchoolSig) result.push(_cachedUserSchoolSig);
    if (slot3) result.push(slot3);
    if (!result.length) result.push({ signer_name: 'Billy Abraham Gómez Sac', signer_role: 'Coordinación del Programa', signature_url: null });
    return result;
}

// Genera el bloque HTML de firmas para los certificados
function _buildSignaturesHtml(signatures, firmaSrcFallback) {
    return signatures.map((sig, i) => {
        const imgSrc = sig.signature_url || (i === 0 ? firmaSrcFallback : null);
        return `<div class="sign-block">
            ${imgSrc ? `<img class="sign-img" src="${imgSrc}" alt="Firma">` : '<div style="height:70px"></div>'}
            <div class="sign-line"></div>
            <p class="sign-name">${sig.signer_name || ''}</p>
            <p class="sign-role">${sig.signer_role || ''}</p>
        </div>`;
    }).join('');
}

// Set con "cert_type:ref_id" de todo lo que el usuario YA pagó — se usa
// para que los botones de diploma/certificado maestro digan "Descargar"
// (habilitados, sin ir a la pasarela) en vez de "Obtenerlo · QX" (que sí
// redirige a pagar) cuando corresponde. Antes el botón mostraba siempre el
// precio, incluso ya pagado — solo funcionaba bien al hacer clic porque
// requestCertificate() revisaba el pago en ese momento, pero la etiqueta
// nunca reflejaba que ya estaba comprado.
let _paidCertRefs = new Set();

async function _refreshPaidCertRefs() {
    if (!currentUser) return;
    try {
        const { data } = await supabase
            .from('certificate_payments')
            .select('cert_type, ref_id')
            .eq('user_id', currentUser.id)
            .eq('status', 'paid');
        _paidCertRefs = new Set((data || []).map(r => `${r.cert_type}:${r.ref_id}`));
    } catch (e) {
        console.error('_refreshPaidCertRefs:', e);
    }
    _updateCertButtonLabels();
}

function _isCertPaid(certType, refId) {
    return _paidCertRefs.has(`${certType}:${refId}`);
}

function _updateCertButtonLabels() {
    const masterLabel = document.getElementById('masterCertBtnLabel');
    if (masterLabel) {
        const _pid = _selectedMasterPath?.id || _activeMasterPath?.id;
        masterLabel.textContent = (_pid && _isCertPaid('master', _pid))
            ? '⬇ Descargar Certificado Maestro'
            : 'Obtener Certificado Maestro · Q50';
    }
}

// Tarjeta "Examen Final" en Progreso: antes solo decía "Examen Final" sin
// indicar de qué curso se trata ni si ya se aprobó — y el clic "adivinaba"
// a qué curso te mandaba. Ahora muestra el curso ACTIVO (currentCourseId,
// el mismo que ves en Inicio) y, si ya lo aprobaste, un indicador con el
// puntaje — pero el botón sigue habilitado para volver a intentarlo.
function _updateExamBtn() {
    const nameEl = document.getElementById('examBtnCourseName');
    if (!nameEl || typeof allCourses === 'undefined') return;
    const _cid = (typeof currentCourseId !== 'undefined' && currentCourseId) || 'steam';
    const course = allCourses.find(c => c.id === _cid);
    const dm = progress?.dailyMissions || {};
    const scores = dm.examScores || {};
    const score = (scores[_cid] !== undefined) ? scores[_cid]
                : (_cid === 'steam' && dm.examScore !== undefined) ? dm.examScore
                : undefined;
    const passed = score !== undefined && score >= 70;

    nameEl.textContent = course ? course.title : 'Examen Final';
    const badgeEl = document.getElementById('examBtnPassedBadge');
    if (badgeEl) {
        badgeEl.classList.toggle('hidden', !passed);
        if (passed) badgeEl.textContent = `✅ ${score}%`;
    }
    const subEl = document.getElementById('examBtnSubtitle');
    if (subEl) subEl.textContent = passed ? 'Ya aprobado — toca para volver a intentarlo' : 'Pon a prueba lo aprendido';
}

// Los navegadores (sobre todo móviles) bloquean casi siempre window.open()
// cuando no hay un clic directo del usuario en el mismo turno de JS — pasa
// SIEMPRE al volver del pago (el certificado se genera de forma asíncrona
// tras confirmar el pago vía polling, sin gesto de usuario reciente). Antes
// de este fix, ese bloqueo caía en una descarga silenciosa + un toast fácil
// de perder, y el usuario terminaba sin saber que su diploma sí se había
// generado. Ahora se muestra un banner persistente con un botón que el
// usuario sí puede tocar — ese toque es un gesto real, así que abrir la
// pestaña en ese momento nunca se bloquea.
function _offerCertificateDownload(blobUrl, filename, label) {
    const id = 'certReadyBanner';
    document.getElementById(id)?.remove();
    const banner = document.createElement('div');
    banner.id = id;
    banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:90px;z-index:9999;background:#16a34a;color:white;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);cursor:pointer';
    banner.innerHTML = `
        <span style="font-size:24px;flex-shrink:0">🎓</span>
        <div style="flex:1;min-width:0">
            <p style="font-weight:800;font-size:13px;margin:0">¡Tu ${esc(label)} está listo!</p>
            <p style="font-size:11px;opacity:.85;margin:2px 0 0">Toca aquí para abrirlo o descargarlo</p>
        </div>
        <button data-close-cert-banner style="background:rgba(255,255,255,.2);border:none;color:white;width:26px;height:26px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0">&times;</button>`;
    banner.addEventListener('click', (e) => {
        if (e.target.closest('[data-close-cert-banner]')) { banner.remove(); return; }
        const win = window.open(blobUrl, '_blank');
        if (!win) {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        banner.remove();
    });
    document.body.appendChild(banner);
}

// ── Pago de diplomas/certificados (Recurrente) ──────────────────────────
// Q10 el diploma de participación de cada curso, Q50 el Certificado
// Maestro de una ruta. Antes de generar el certificado, verifica si el
// usuario ya pagó (lee certificate_payments, solo puede LEER su propia
// fila por RLS); si no, crea un checkout y redirige de página completa —
// Recurrente confirma el pago vía webhook server-side, nunca el cliente.
async function requestCertificate(certType, courseId, score) {
    if (!currentUser) { showToast('Inicia sesión para continuar.', 'error'); return; }

    // Si ya hay una versión nueva de la app esperando, NO dejar que el pago
    // corra con código potencialmente desactualizado — recargar primero es
    // más seguro que confiar en que el usuario minimice la pestaña a tiempo.
    if (window._updateReady) {
        showToast('Actualizando la app antes de continuar con el pago…', 'info');
        setTimeout(() => window.location.reload(), 1200);
        return;
    }

    const cid = certType === 'diploma'
        ? (courseId || window._lastExamCourseId || (typeof currentCourseId !== 'undefined' && currentCourseId) || 'steam')
        : null;
    const refId = certType === 'master' ? (_activeMasterPath?.id || null) : cid;

    if (certType === 'master' && !refId) {
        showToast('No se pudo determinar la ruta del Certificado Maestro.', 'error');
        return;
    }

    try {
        // .limit(1) antes de .maybeSingle(): si el usuario reintentó el pago
        // más de una vez, puede haber varias filas 'paid' para el mismo
        // certificado — sin el límite, maybeSingle() lanza error ("multiple
        // rows returned") en vez de devolver una.
        const { data: paidRows } = await supabase
            .from('certificate_payments')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('cert_type', certType)
            .eq('ref_id', refId)
            .eq('status', 'paid')
            .order('created_at', { ascending: false })
            .limit(1);
        if (paidRows && paidRows.length > 0) {
            if (certType === 'master') return generateMasterCertificate();
            return generateCertificateFromExam(score, cid);
        }
    } catch (e) {
        console.error('Error verificando pago de certificado:', e);
    }

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) { showToast('Inicia sesión para continuar.', 'error'); return; }

        const res = await fetch(`${SUPABASE_URL}/functions/v1/create-certificate-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ cert_type: certType, ref_id: refId, course_id: certType === 'diploma' ? cid : null, score: score || null }),
        });
        const data = await res.json();
        if (!res.ok || !data.checkout_url) {
            if (data.already_paid) {
                if (certType === 'master') return generateMasterCertificate();
                return generateCertificateFromExam(score, cid);
            }
            showToast(data.error || 'No se pudo iniciar el pago. Intenta de nuevo.', 'error');
            return;
        }
        location.href = data.checkout_url;
    } catch (e) {
        console.error('Error creando checkout de certificado:', e);
        showToast('No se pudo conectar con el sistema de pago.', 'error');
    }
}

// Al volver del checkout de Recurrente (?paid_cert=...), espera a que el
// webhook confirme el pago (puede tardar unos segundos) y genera el
// certificado automáticamente — el usuario no tiene que volver a hacer clic.
(function () {
    const params = new URLSearchParams(location.search);
    const paidCertType = params.get('paid_cert');
    if (!paidCertType) return;

    const refId = params.get('ref') || null;
    const courseIdParam = params.get('course') || null;
    const scoreParam = Number(params.get('score'));

    // Limpiar los query params de inmediato — un refresh no debe re-disparar esto.
    history.replaceState(null, '', location.pathname + location.hash);

    async function waitForUser(maxMs) {
        const start = Date.now();
        while (!currentUser && Date.now() - start < maxMs) {
            await new Promise((r) => setTimeout(r, 200));
        }
        return currentUser;
    }

    async function checkPaidAndUnlock() {
        const user = await waitForUser(8000);
        if (!user || !refId) return;

        // El webhook puede tardar unos segundos en confirmar — reintenta.
        // Filtra directo por status='paid' (no por "más reciente"): puede
        // haber varias filas 'pending' de intentos previos para el mismo
        // certificado, y la que se pagó no siempre es la última creada.
        for (let attempt = 0; attempt < 8; attempt++) {
            const { data: rows } = await supabase
                .from('certificate_payments')
                .select('status')
                .eq('user_id', user.id)
                .eq('cert_type', paidCertType)
                .eq('ref_id', refId)
                .eq('status', 'paid')
                .limit(1);
            const data = rows?.[0];
            if (data?.status === 'paid') {
                showToast('¡Pago confirmado! Generando tu ' + (paidCertType === 'master' ? 'Certificado Maestro' : 'diploma') + '…', 'success');
                _paidCertRefs.add(`${paidCertType}:${refId}`);
                _updateCertButtonLabels();
                if (paidCertType === 'master') {
                    if (typeof _checkMasterCert === 'function') _checkMasterCert();
                    if (typeof generateMasterCertificate === 'function') generateMasterCertificate();
                } else if (typeof generateCertificateFromExam === 'function') {
                    generateCertificateFromExam(Number.isFinite(scoreParam) ? scoreParam : 70, courseIdParam || refId);
                }
                return;
            }
            await new Promise((r) => setTimeout(r, 1500));
        }
        showToast('Tu pago se está confirmando. Si no aparece en un momento, vuelve a intentar desde tu perfil.', 'info');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPaidAndUnlock);
    } else {
        checkPaidAndUnlock();
    }
})();

async function generateCertificateFromExam(percentage, overrideCourseId) {
    const nombre = getDisplayName();

    // Datos del curso: prioridad → override explícito → último examen → activo → steam
    const _cid2 = overrideCourseId
        || window._lastExamCourseId
        || (typeof currentCourseId !== 'undefined' && currentCourseId)
        || 'steam';

    // Fecha de EMISIÓN = cuándo se APROBÓ el examen de este curso, no
    // cuándo se genera/descarga el certificado (puede ser mucho después,
    // incluso tras pagar el diploma). Si no hay fecha guardada (exámenes
    // aprobados antes de este fix), usa hoy como último recurso.
    const _storedExamDate = progress?.dailyMissions?.examDates?.[_cid2];
    const _issueDate = _storedExamDate ? _parseLocalDateStr(_storedExamDate) : new Date();
    const fecha = _issueDate.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
    const _issueYear = _issueDate.getFullYear();
    const _issueMonth = _issueDate.getMonth() + 1;
    const _course = (typeof allCourses !== 'undefined' && allCourses.find(c => c.id === _cid2)) || allCourses[0];
    const courseTitle = _course.title || 'Metodología STEAM 2.0';
    const courseDuration = _course.durationHours ? `${_course.durationHours} horas` : '10 horas';
    const courseColor = _course.color || '#0097A7';
    const courseGradient = _course.color || '#1A6B68';
    const courseIcon = _course.icon || '<svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15 L20 8 L36 15 L20 22 Z" stroke-width="1.8" fill="rgba(255,255,255,0.15)"/><path d="M11 18 V27 Q11 31 20 31 Q29 31 29 27 V18" stroke-width="1.8"/><line x1="36" y1="15" x2="36" y2="25" stroke-width="1.8"/></svg>';

    // Descripción específica por curso
    const courseDescs = {
        'steam': `Por haber completado satisfactoriamente el <strong>Curso STEAM 2.0 para Docentes</strong>, demostrando competencias en la integración de Ciencia, Tecnología, Ingeniería, Emprendimiento, Arte y Matemáticas en entornos educativos`,
        'abp': `Por haber completado satisfactoriamente el curso <strong>Aprendizaje Basado en Proyectos para Docentes</strong>, demostrando dominio del ciclo ABP, diseño de proyectos auténticos y estrategias de evaluación formativa`,
        'design-thinking': `Por haber completado satisfactoriamente el curso <strong>Design Thinking para Docentes</strong>, demostrando competencias en empatía, ideación, prototipado y evaluación iterativa para resolver problemas educativos`,
        'evaluacion': `Por haber completado satisfactoriamente el curso <strong>Herramientas de Evaluación Auténtica</strong>, demostrando dominio en rúbricas, portafolios, autoevaluación, coevaluación y evaluación formativa`,
        'tipos-estudiantes': `Por haber completado satisfactoriamente el curso <strong>Conoce a Quien Enseñas</strong>, demostrando competencias en identificación de perfiles de aprendizaje, estrategias diferenciadas y atención a la diversidad del aula`,
        'storytelling': `Por haber completado satisfactoriamente el curso <strong>Storytelling para Docentes</strong>, demostrando dominio del arte de narrar para enseñar, estructura narrativa pedagógica y el uso de historias como herramienta de impacto en el aula`
    };
    const courseDesc = courseDescs[_course.id] || courseDescs['steam'];

    // Intentar cargar imágenes reales; si no existen, usar fallback SVG
    const [firmaSrc, certSigs] = await Promise.all([
        _imgToBase64('firma.png'),
        _loadCertSignaturesForUser()
    ]);

    const logoHtml = `<span style="font-family:Arial Black,sans-serif;font-size:16px;font-weight:900;color:${courseColor}">Formación Docente</span>`;

    const certCode = await getOrCreateCertCode(_cid2, 'course', nombre, percentage);
    const { qrImg, verifyUrl } = buildVerifyQRHtml(certCode);

    const certHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Certificado ${esc(courseTitle)} - ${esc(nombre)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#F1F5F9; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:2rem; }
  .cert { background:white; width:800px; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,.15); }
  .cert-top { background:${courseGradient}; padding:36px 48px 28px; position:relative; overflow:hidden; }
  .cert-top::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,.08); }
  .cert-top::after  { content:''; position:absolute; bottom:-60px; left:20%; width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,.05); }
  .cert-icon  { font-size:32px; margin-bottom:8px; display:block; }
  .cert-title    { color:white; font-size:26px; font-weight:900; line-height:1.2; }
  .cert-subtitle { color:rgba(255,255,255,.82); font-size:12.5px; margin-top:5px; }
  .cert-body  { padding:32px 48px; }
  .cert-otorga{ font-size:12px; color:#94A3B8; font-weight:600; text-transform:uppercase; letter-spacing:.12em; margin-bottom:6px; }
  .cert-nombre{ font-size:32px; font-weight:900; color:#0F172A; line-height:1.1; margin-bottom:18px; }
  .cert-desc  { font-size:14.5px; color:#475569; line-height:1.7; margin-bottom:22px; }
  .cert-desc strong { color:#0F172A; }
  .cert-meta  { display:flex; gap:20px; margin-bottom:28px; }
  .meta-pill  { background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:12px; padding:9px 16px; }
  .meta-pill .label { font-size:10.5px; color:#94A3B8; font-weight:600; text-transform:uppercase; letter-spacing:.08em; margin-bottom:2px; }
  .meta-pill .value { font-size:14px; color:#0F172A; font-weight:700; }
  .cert-footer{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1.5px solid #F1F5F9; padding-top:20px; flex-wrap:wrap; gap:16px; }
  .sign-block { text-align:center; }
  .sign-img   { height:64px; object-fit:contain; display:block; margin:0 auto 4px; }
  .sign-line  { width:160px; border-top:1.5px solid #CBD5E1; margin:0 auto 6px; }
  .sign-name  { font-size:12px; font-weight:700; color:#0F172A; }
  .sign-role  { font-size:10.5px; color:#64748B; }
  .brand-area { display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
  .print-btn  { background:${courseColor}; color:white; border:none; padding:10px 22px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; }
  .print-btn:hover { opacity:.88; }
  .linkedin-btn { display:flex; align-items:center; gap:6px; background:#0A66C2; color:white; border:none; padding:9px 18px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; text-decoration:none; }
  .linkedin-btn:hover { opacity:.88; }
  .verify-block { display:flex; align-items:center; gap:10px; }
  .verify-qr { width:64px; height:64px; border-radius:8px; }
  .verify-text { font-size:9.5px; color:#94A3B8; line-height:1.5; max-width:140px; }
  .verify-text strong { color:#475569; font-family:monospace; }
  @media print { body{background:none;padding:0} .cert{box-shadow:none;border-radius:0;width:100%} .print-btn{display:none} .linkedin-btn{display:none} }
</style>
</head>
<body>
<div class="cert">
  <div class="cert-top">
    <span class="cert-icon">${courseIcon}</span>
    <h1 class="cert-title">Diploma de Participación</h1>
    <p class="cert-subtitle">${courseTitle} · Formación Profesional Docente</p>
  </div>
  <div class="cert-body">
    <p class="cert-otorga">Se otorga a</p>
    <p class="cert-nombre">${esc(nombre)}</p>
    <p class="cert-desc">
      ${courseDesc}, con un puntaje de
      <strong>${Math.round(percentage)}% en el examen final</strong>.
    </p>
    <div class="cert-meta">
      <div class="meta-pill"><div class="label">Puntaje</div><div class="value">${Math.round(percentage)}%</div></div>
      <div class="meta-pill"><div class="label">Duración</div><div class="value">${courseDuration}</div></div>
      <div class="meta-pill"><div class="label">Emisión</div><div class="value">${fecha}</div></div>
    </div>
    <div class="cert-footer">
      <div class="verify-block">
        ${certCode ? `<img class="verify-qr" src="${qrImg}" alt="QR de verificación">
        <div class="verify-text">Código único: <strong>${certCode}</strong><br>Escanea para verificar autenticidad</div>` : ''}
      </div>
      ${_buildSignaturesHtml(certSigs, firmaSrc)}
      <div class="brand-area">
        ${logoHtml}
        <button class="print-btn" onclick="window.print()">⬇ Guardar PDF</button>
        ${certCode ? `<a class="linkedin-btn" target="_blank" href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseTitle + ' · Formación Docente')}&organizationName=${encodeURIComponent('Formación Docente')}&issueYear=${_issueYear}&issueMonth=${_issueMonth}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certCode)}"><svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>Agregar a LinkedIn</a>` : ''}
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

    try {
        const blob = new Blob([certHTML], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, '_blank');
        if (!win) {
            _offerCertificateDownload(blobUrl, `Certificado_${nombre.replace(/\s+/g,'_')}.html`, 'diploma');
        } else {
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        }
    } catch(e) {
        showToast('Error al generar el certificado.', 'error');
    }
}

// ==================== RECURSOS DESCARGABLES POR CURSO ====================
// URLs: reemplaza con los enlaces reales (Google Drive, Dropbox, etc.)
const COURSE_RESOURCES = {
    'steam': [
        { name: 'Guía de Proyectos STEAM',        desc: 'Plantillas y ejemplos de proyectos interdisciplinarios', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/steam-guia-proyectos.html' },
        { name: 'Rúbricas de Evaluación STEAM',    desc: 'Instrumentos de evaluación por competencias',           icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/steam-rubricas.html' },
        { name: 'Banco de 30 Actividades STEAM',   desc: 'Actividades listas para aplicar en el aula',            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/steam-banco-actividades.html' },
        { name: 'Infografía Think-Make-Improve',   desc: 'Resumen visual del ciclo de diseño',                    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/steam-infografia-tmi.html' },
    ],
    'abp': [
        { name: 'Guía ABP Paso a Paso',            desc: 'Metodología completa con ejemplos guatemaltecos',       icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/abp-guia.html' },
        { name: 'Formatos de Planificación ABP',   desc: 'Templates editables para planificar proyectos',         icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/abp-formatos.html' },
        { name: 'Ejemplos de Proyectos ABP',       desc: '10 proyectos reales aplicados en Guatemala',            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/abp-ejemplos.html' },
    ],
    'design-thinking': [
        { name: 'Kit de Design Thinking',          desc: 'Tarjetas de actividades y dinámicas de empatía',        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/dt-kit.html' },
        { name: 'Plantillas de Prototipado',       desc: 'Formatos para documentar prototipos con estudiantes',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/dt-plantillas-prototipado.html' },
        { name: 'Guía de Entrevistas de Empatía',  desc: 'Cómo entrevistar usuarios en el contexto educativo',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/dt-entrevistas-empatia.html' },
    ],
    'evaluacion': [
        { name: 'Banco de Rúbricas',               desc: 'Rúbricas analíticas para diferentes competencias',      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/ev-banco-rubricas.html' },
        { name: 'Guía de Evaluación Formativa',    desc: 'Estrategias de retroalimentación efectiva',             icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/ev-guia-formativa.html' },
        { name: 'Instrumentos de Autoevaluación',  desc: 'Formatos para coevaluación y autoevaluación',           icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/ev-instrumentos-autoevaluacion.html' },
    ],
    'tipos-estudiantes': [
        { name: 'Guía de Estilos de Aprendizaje',  desc: 'Cómo identificar y atender distintos perfiles',         icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/te-guia-estilos.html' },
        { name: 'Estrategias de Diferenciación',   desc: 'Actividades adaptadas a diferentes tipos de alumnos',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/te-estrategias-diferenciacion.html' },
        { name: 'Fichas de Observación Docente',   desc: 'Instrumentos para conocer mejor a tus estudiantes',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/te-fichas-observacion.html' },
    ],
    'storytelling': [
        { name: 'Guía de Storytelling Docente',    desc: 'Estructura narrativa y técnicas para enseñar con historias', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/st-guia-storytelling.html' },
        { name: 'Plantillas de Historia',          desc: 'Story spine, viaje del héroe y otros formatos listos para usar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/st-plantillas-historia.html' },
        { name: 'Banco de Historias Guatemaltecas', desc: '20 historias y personajes locales para usar en clase',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/st-banco-historias.html' },
    ],
    'creatividad': [
        { name: 'Guía para Despertar la Creatividad en el Aula', desc: 'Fundamentos y estrategias paso a paso para una cultura creativa en el aula', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/cr-guia.html' },
        { name: 'Banco de 20 Retos Creativos de Aula', desc: 'Retos cortos y largos, con materiales de bajo costo, listos para usar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/cr-retos.html' },
        { name: '10 Casos de Creatividad Aplicada en Aulas de Guatemala', desc: '10 experiencias reales adaptadas al contexto de escuelas guatemaltecas', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/cr-casos.html' },
    ],
    'herramientas-tec': [
        { name: 'Guía de Herramientas Digitales Gratuitas para el Aula', desc: 'Catálogo de herramientas gratuitas organizadas por función pedagógica', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/ht-guia.html' },
        { name: 'Plantilla: Ficha de Evaluación de una Herramienta Nueva', desc: 'Checklist imprimible para decidir si vale la pena adoptar una herramienta', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/ht-plantilla.html' },
        { name: 'Banco de 12 Actividades con Tecnología de Bajo Costo', desc: '12 actividades que solo requieren un dispositivo por equipo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/ht-actividades.html' },
    ],
    'm-learning': [
        { name: 'Guía de Mobile Learning: el Celular como Aliado, no Enemigo', desc: 'Estrategia completa para convertir el celular en herramienta pedagógica', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/ml-guia.html' },
        { name: 'Plantilla: Contrato de Uso del Celular en el Aula', desc: 'Contrato imprimible para establecer reglas claras desde el día 1', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/ml-contrato.html' },
        { name: 'Banco de 10 Micro-actividades con Celular (5-10 minutos)', desc: '10 actividades cortas listas para aplicar entre temas o al inicio de clase', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/ml-microactividades.html' },
    ],
    'flipped-classroom': [
        { name: 'Guía de Aula Invertida (Flipped Classroom)', desc: 'Fundamentos y pasos para invertir tu clase tradicional', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/fc-guia.html' },
        { name: 'Plantilla: Planificador de Clase Invertida', desc: 'Formato editable para planificar una sesión de aula invertida', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/fc-planificador.html' },
        { name: '8 Casos de Aula Invertida en Contextos con Poca Conectividad', desc: 'Adaptaciones reales para escuelas con acceso limitado a internet', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/fc-casos.html' },
    ],
    'abv': [
        { name: 'Guía de Aprendizaje Basado en Videos', desc: 'Principios y pasos para usar el video como herramienta de aprendizaje real', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/abv-guia.html' },
        { name: 'Plantilla: Guía de Visualización Activa', desc: 'Formato imprimible para convertir cualquier video en aprendizaje activo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/abv-plantilla.html' },
        { name: 'Banco de Canales de YouTube Educativo en Español', desc: 'Selección curada de canales confiables por área curricular', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/abv-canales.html' },
    ],
    'micro-learning': [
        { name: 'Guía de Micro-learning: Aprender en Pequeñas Dosis', desc: 'Fundamentos del aprendizaje en dosis pequeñas y cómo aplicarlo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/mcl-guia.html' },
        { name: 'Plantilla: Calendario de Repaso Espaciado', desc: 'Formato para planificar repasos espaciados de un concepto durante 2 semanas', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/mcl-calendario.html' },
        { name: 'Banco de 15 Micro-lecciones Listas para Usar', desc: '15 micro-lecciones modelo de distintas materias, listas para adaptar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/mcl-banco.html' },
    ],
    'ia-fundamentos': [
        { name: 'Guía de Fundamentos de IA para Docentes', desc: 'Conceptos base de IA explicados para uso pedagógico real', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/iaf-guia.html' },
        { name: 'Plantilla: Mis Primeras 10 Instrucciones (Prompts) Útiles', desc: '10 instrucciones de IA probadas, listas para copiar y personalizar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/iaf-prompts.html' },
        { name: '8 Casos de Uso de IA en Aulas Guatemaltecas', desc: 'Casos concretos de uso responsable de IA en el contexto educativo local', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/iaf-casos.html' },
    ],
    'ia-tiempo': [
        { name: 'Guía: Recupera Horas de tu Semana con IA', desc: 'Estrategias concretas para reducir carga de trabajo administrativo docente', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/iat-guia.html' },
        { name: 'Plantilla: Mi Rutina Semanal con Apoyo de IA', desc: 'Planificador semanal para distribuir tareas administrativas con apoyo de IA', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/iat-rutina.html' },
        { name: 'Banco de 12 Prompts para Tareas Administrativas Docentes', desc: '12 instrucciones probadas para planificación, evaluación y comunicación', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/iat-prompts.html' },
    ],
    'ia-herramientas': [
        { name: 'Guía de Herramientas de IA Gratuitas para Docentes', desc: 'Selección de herramientas de IA gratuitas organizadas por uso pedagógico', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/iah-guia.html' },
        { name: 'Plantilla: Ficha de Prueba de Herramienta de IA', desc: 'Checklist de seguridad y utilidad antes de usar una herramienta de IA con estudiantes', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/iah-ficha.html' },
        { name: 'Banco de 10 Actividades con Herramientas de IA Gratuitas', desc: '10 actividades de aula que aprovechan herramientas de IA sin costo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/iah-actividades.html' },
    ],
    'ia-inclusion': [
        { name: 'Guía: IA como Puente para la Inclusión Educativa', desc: 'Estrategias de uso de IA para diferenciar y apoyar la diversidad en el aula', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/iai-guia.html' },
        { name: 'Plantilla: Diferenciación de una Actividad en 3 Niveles', desc: 'Planificador de diferenciación de actividades en 3 niveles de apoyo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/iai-plantilla.html' },
        { name: '6 Casos de IA Apoyando la Inclusión en el Aula', desc: 'Casos reales de adaptación de material con apoyo de herramientas de IA', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/iai-casos.html' },
    ],
    'ia-ciudadania': [
        { name: 'Guía de Ciudadanía Digital en la Era de la IA', desc: 'Marco pedagógico para formar estudiantes críticos frente a la IA', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/iac-guia.html' },
        { name: 'Plantilla: Acuerdo de Uso Ético de IA para el Aula', desc: 'Contrato de aula sobre uso responsable de inteligencia artificial', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/iac-acuerdo.html' },
        { name: 'Banco de 8 Actividades de Alfabetización en IA para Estudiantes', desc: '8 actividades listas para formar ciudadanía digital crítica', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/iac-actividades.html' },
    ],
    'manejo-conductas': [
        { name: 'Guía de Manejo de Conductas Desafiantes', desc: 'Estrategias prácticas para responder a conductas desafiantes con calma y firmeza', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/mc-guia.html' },
        { name: 'Plantilla: Plan de Respuesta ante Conductas Recurrentes', desc: 'Planificador individual para anticipar y responder a conductas específicas', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/mc-plan.html' },
        { name: '8 Casos de Manejo de Conductas en Aulas Guatemaltecas', desc: 'Casos concretos de manejo efectivo de conductas desafiantes', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/mc-casos.html' },
    ],
    'sel-docentes': [
        { name: 'Guía de Aprendizaje Socioemocional (SEL) para Docentes', desc: 'Marco de competencias SEL aplicado a la práctica docente diaria', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/sel-guia.html' },
        { name: 'Plantilla: Mi Termómetro Emocional Diario', desc: 'Herramienta de auto-registro para practicar SEL como docente', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/sel-termometro.html' },
        { name: 'Banco de 10 Actividades SEL para el Aula (5-15 minutos)', desc: '10 actividades breves de aprendizaje socioemocional listas para aplicar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/sel-actividades.html' },
    ],
    'comunicacion-asertiva': [
        { name: 'Guía de Comunicación Asertiva para Docentes', desc: 'Fundamentos de comunicación asertiva aplicados al aula y a colegas/padres', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/ca-guia.html' },
        { name: 'Plantilla: Preparación de una Conversación Difícil', desc: 'Guía para preparar conversaciones difíciles con la fórmula DEEC', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/ca-preparacion.html' },
        { name: '6 Casos de Comunicación Asertiva en el Contexto Escolar', desc: 'Ejemplos reales de resolución de conflictos escolares con comunicación asertiva', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/ca-casos.html' },
    ],
    'disciplina-positiva': [
        { name: 'Guía de Disciplina Positiva', desc: 'Principios de disciplina positiva aplicados al manejo diario del aula', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/dp-guia.html' },
        { name: 'Plantilla: Consecuencias Lógicas (no Castigos Arbitrarios)', desc: 'Guía práctica para diseñar consecuencias relacionadas y proporcionales', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/dp-consecuencias.html' },
        { name: '6 Casos de Disciplina Positiva Aplicada', desc: 'Ejemplos concretos de disciplina positiva en distintos niveles educativos', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/dp-casos.html' },
    ],
    'bienestar-docente': [
        { name: 'Guía de Bienestar Docente y Prevención del Desgaste (Burnout)', desc: 'Guía para identificar y prevenir el desgaste profesional docente', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', url: 'recursos/bd-guia.html' },
        { name: 'Plantilla: Mi Chequeo Semanal de Bienestar', desc: 'Herramienta de auto-monitoreo semanal de bienestar docente', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>', url: 'recursos/bd-chequeo.html' },
        { name: 'Banco de 8 Micro-prácticas de Autocuidado para el Día Escolar', desc: '8 micro-prácticas realistas de bienestar para docentes con poco tiempo', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', url: 'recursos/bd-micropracticas.html' },
    ],
};

function _trackResourceDownload(courseId, resourceUrl) {
    if (!currentUser) return;
    supabase.from('user_events').insert({
        user_id: currentUser.id,
        event_type: 'resource_download',
        metadata: { courseId, resourceUrl },
    }).then(({ error }) => { if (error) console.log('Track download error:', error); });
}

function renderCourseResources() {
    const el = document.getElementById('courseResourcesSection');
    if (!el) return;

    const scores     = progress?.dailyMissions?.examScores || {};
    const steamScore = scores['steam'] ?? progress?.dailyMissions?.examScore;
    const courseColors = {
        steam: '#07B0E4', abp: '#2563EB', 'design-thinking': '#E83C8D',
        evaluacion: '#E9A037', 'tipos-estudiantes': '#7C3AED', 'storytelling': '#F59E0B'
    };

    if (typeof allCourses === 'undefined') return;
    const available = allCourses.filter(c => COURSE_RESOURCES[c.id]);
    if (!available.length) return;

    const anyPassed = available.some(c => {
        const s = c.id === 'steam' ? steamScore : scores[c.id];
        return s !== undefined && s >= 70;
    });

    el.innerHTML = available.map(c => {
        const s      = c.id === 'steam' ? steamScore : scores[c.id];
        const passed = s !== undefined && s >= 70;
        const col    = courseColors[c.id] || '#4f46e5';
        const res    = COURSE_RESOURCES[c.id] || [];

        if (passed) {
            const items = res.map(r => {
                const hasUrl = r.url && r.url.trim() !== '';
                return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9">
                    <span style="font-size:20px;flex-shrink:0">${r.icon}</span>
                    <div style="flex:1;min-width:0">
                        <p style="font-size:12px;font-weight:700;color:#1e293b;margin:0">${r.name}</p>
                        <p style="font-size:10px;color:#64748b;margin:2px 0 0">${r.desc}</p>
                    </div>
                    ${hasUrl
                        ? `<a href="${r.url}" target="_blank" rel="noopener"
                            onclick="_trackResourceDownload('${c.id}', '${esc(r.url)}')"
                            style="flex-shrink:0;background:#4f46e5;color:white;font-size:10px;font-weight:700;
                            padding:5px 10px;border-radius:8px;text-decoration:none;white-space:nowrap">
                            ⬇ Descargar</a>`
                        : `<span style="flex-shrink:0;font-size:10px;color:#94a3b8;padding:5px 10px;
                            background:#f8fafc;border-radius:8px;white-space:nowrap">Próximamente</span>`
                    }
                </div>`;
            }).join('');

            return `<div style="background:white;border:1.5px solid #bbf7d0;border-radius:16px;overflow:hidden;margin-bottom:10px">
                <div style="background:${col}12;padding:12px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${col}20">
                    <div style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0"></div>
                    <p style="font-size:12px;font-weight:800;color:#1e293b;flex:1;margin:0">${c.title}</p>
                    <span style="font-size:10px;background:#dcfce7;color:#16a34a;font-weight:700;padding:2px 8px;border-radius:100px">✓ Desbloqueado</span>
                </div>
                <div style="padding:4px 14px 4px">${items}</div>
            </div>`;
        } else {
            return `<div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:16px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px;opacity:.7">
                <span style="display:inline-flex;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="12" height="8" rx="2" stroke-width="1.8"/><path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke-width="1.8"/></svg></span>
                <div>
                    <p style="font-size:12px;font-weight:700;color:#475569;margin:0">${c.title}</p>
                    <p style="font-size:10px;color:#94a3b8;margin:2px 0 0">${res.length} recursos · Aprueba el examen para desbloquear</p>
                </div>
            </div>`;
        }
    }).join('');

    document.getElementById('resourcesSection')?.classList.toggle('hidden', !anyPassed);
}

// ==================== CERTIFICADO MAESTRO (por ruta) ====================
let _activeMasterPath   = null; // ruta activa para cert maestro
let _selectedMasterPath = null; // elegida por el usuario con los chips

// Helpers per-ruta ──────────────────────────────────────────────────────────
function _getMasterExamScore(pathId) {
    const dm = progress?.dailyMissions || {};
    if (dm.masterExamScores?.[pathId] !== undefined) return dm.masterExamScores[pathId];
    if (pathId === 'steam20' && dm.masterExamScore !== undefined) return dm.masterExamScore; // legado
    return undefined;
}
function _getPortfolio(pathId) {
    const dm = progress?.dailyMissions || {};
    if (dm.portfolioByPath?.[pathId]) return dm.portfolioByPath[pathId];
    if (pathId === 'steam20' && dm.portfolioAiTotal !== undefined && dm.portfolioAiTotal !== null) {
        return { aiTotal: dm.portfolioAiTotal };
    }
    return null;
}
function _setPortfolio(pathId, data) {
    if (!progress.dailyMissions.portfolioByPath) progress.dailyMissions.portfolioByPath = {};
    progress.dailyMissions.portfolioByPath[pathId] = {
        ...(progress.dailyMissions.portfolioByPath[pathId] || {}), ...data
    };
}
function _selectMasterPath(pathId) {
    const p = LEARNING_PATHS.find(x => x.id === pathId);
    if (!p) return;
    // No dejar elegir una ruta que aún no está 100% aprobada — el
    // Certificado Maestro solo aplica a rutas terminadas; el chip de esa
    // ruta ya se muestra como bloqueado con la razón, así que este clic
    // solo puede llegar de un chip deshabilitado.
    if (typeof _lastMasterPathAllPassed !== 'undefined' && _lastMasterPathAllPassed[pathId] === false) {
        showToast('Primero debes aprobar todos los cursos de esta ruta.', 'info');
        return;
    }
    _selectedMasterPath = p;
    _checkMasterCert();
}
let _lastMasterPathAllPassed = {};

function _checkMasterCert() {
    if (typeof allCourses === 'undefined') return;
    const scores     = progress?.dailyMissions?.examScores || {};
    const steamScore = scores['steam'] ?? progress?.dailyMissions?.examScore;
    const available  = allCourses.filter(c => c.status === 'available');

    const pathResults = LEARNING_PATHS.map(path => {
        const requiredCourses = available.filter(c => (path.courses || []).includes(c.id));
        const allPassed = requiredCourses.length > 0 && requiredCourses.every(c => {
            const s = c.id === 'steam' ? steamScore : scores[c.id];
            return s !== undefined && s >= 70;
        });
        return { path, allPassed };
    });

    const passedPaths = pathResults.filter(r => r.allPassed);
    const anyPassed   = passedPaths.length > 0;
    _lastMasterPathAllPassed = {};
    pathResults.forEach(r => { _lastMasterPathAllPassed[r.path.id] = r.allPassed; });

    // Ruta seleccionada: mantener la elegida si sigue aprobada, si no usar la primera completada
    if (!_selectedMasterPath || !passedPaths.some(r => r.path.id === _selectedMasterPath.id)) {
        _selectedMasterPath = passedPaths[0]?.path || null;
    }
    _activeMasterPath = _selectedMasterPath;
    const sel = _selectedMasterPath;

    // Chips de selección de ruta: se muestran TODAS las rutas (no solo la(s)
    // ya completada(s)) — antes, si solo una ruta estaba terminada, parecía
    // que la app "solo te manda a esa ruta" sin explicar por qué las demás
    // no aparecían. Ahora las no completadas se ven bloqueadas con el
    // motivo, y solo las 100% aprobadas son seleccionables.
    const selEl = document.getElementById('masterPathSelector');
    if (selEl) {
        selEl.innerHTML = `
            <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px">Certificado maestro · elige la ruta</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${pathResults.map(r => {
                const isSel = sel && r.path.id === sel.id;
                if (r.allPassed) {
                    return `<button onclick="_selectMasterPath('${r.path.id}')"
                        style="font-size:12px;font-weight:700;padding:6px 12px;border-radius:20px;cursor:pointer;
                               border:1.5px solid ${isSel ? r.path.color : '#e2e8f0'};
                               background:${isSel ? r.path.color : '#fff'};
                               color:${isSel ? '#fff' : '#475569'}">${esc(r.path.label)}</button>`;
                }
                return `<button onclick="showToast('Primero aprueba todos los cursos de ${esc(r.path.label)}.','info')"
                    style="font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;cursor:pointer;
                           border:1.5px dashed #e2e8f0;background:#f8fafc;color:#94a3b8;display:inline-flex;align-items:center;gap:4px">
                    <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="12" height="8" rx="2" stroke-width="1.8"/><path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke-width="1.8"/></svg>
                    ${esc(r.path.label)}</button>`;
            }).join('')}
            </div>`;
        selEl.classList.remove('hidden');
    }

    // Puntajes de la ruta SELECCIONADA
    const masterExamScore = sel ? _getMasterExamScore(sel.id) : undefined;
    const pf              = sel ? _getPortfolio(sel.id) : null;
    const portfolioScore  = (pf && pf.aiTotal !== undefined && pf.aiTotal !== null) ? pf.aiTotal : null;
    const examScore50     = masterExamScore !== undefined ? Math.round(masterExamScore * 0.5) : null;
    const combinedScore   = (examScore50 !== null && portfolioScore !== null) ? examScore50 + portfolioScore : null;
    const masterPassed    = combinedScore !== null && combinedScore >= 85;
    const examTaken       = masterExamScore !== undefined;
    const portfolioDone   = portfolioScore !== null;
    const allIndividualPassed = anyPassed;

    // Botones de acción (devMode desbloquea todo)
    const _dev = isDevMode();
    const examBtn = document.getElementById('masterExamBtn');
    if (examBtn) examBtn.classList.toggle('hidden', !_dev && (!allIndividualPassed || examTaken));
    const portBtn = document.getElementById('masterPortfolioBtn');
    if (portBtn) portBtn.classList.toggle('hidden', !_dev && (!allIndividualPassed || !examTaken || portfolioDone || masterPassed));
    const portResultsBtn = document.getElementById('masterPortfolioResultsBtn');
    if (portResultsBtn) portResultsBtn.classList.toggle('hidden', !portfolioDone || masterPassed);

    // Resumen de puntaje
    const scoreEl = document.getElementById('masterScoreSummary');
    if (scoreEl) {
        if (anyPassed && examTaken) {
            const portLabel     = portfolioDone ? `${portfolioScore}/50` : '<span style="color:#94a3b8">Pendiente</span>';
            const combinedLabel = combinedScore !== null ? `<strong style="color:${combinedScore>=85?'#16a34a':'#dc2626'}">${combinedScore}/100</strong>` : '—';
            scoreEl.innerHTML = `
                ${sel ? `<p style="font-size:11px;font-weight:700;color:${sel.color};margin:0 0 6px">Ruta: ${esc(sel.label)}</p>` : ''}
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">
                    <div style="background:#f0f9ff;border-radius:12px;padding:10px;text-align:center;border:1px solid #bae6fd">
                        <p style="font-size:18px;font-weight:800;color:#0369a1">${examScore50}/50</p>
                        <p style="font-size:10px;color:#64748b;margin-top:2px">Examen</p>
                    </div>
                    <div style="background:#f0fdf4;border-radius:12px;padding:10px;text-align:center;border:1px solid #bbf7d0">
                        <p style="font-size:18px;font-weight:800;color:#15803d">${portLabel}</p>
                        <p style="font-size:10px;color:#64748b;margin-top:2px">Portafolio</p>
                    </div>
                    <div style="background:${combinedScore===null?'#f8fafc':combinedScore>=85?'#f0fdf4':'#fef2f2'};border-radius:12px;padding:10px;text-align:center;border:1px solid ${combinedScore===null?'#e2e8f0':combinedScore>=85?'#86efac':'#fca5a5'}">
                        <p style="font-size:18px;font-weight:800">${combinedLabel}</p>
                        <p style="font-size:10px;color:#64748b;margin-top:2px">Total</p>
                    </div>
                </div>
                <p style="font-size:11px;color:#94a3b8;text-align:center">Aprobación: 85/100 puntos</p>`;
            scoreEl.classList.remove('hidden');
        } else {
            scoreEl.classList.add('hidden');
        }
    }

    const certBtn = document.getElementById('masterCertBtn');
    if (certBtn) certBtn.classList.toggle('hidden', !masterPassed && !isDevMode());

    // Placeholder: oculto si ya aprobaste al menos un curso (ya hay botón de
    // diploma por curso en la lista de arriba) o si el maestro está listo
    const _ph = document.getElementById('certPlaceholder');
    if (_ph) _ph.classList.toggle('hidden', allIndividualPassed || masterPassed);

    // Estado por curso — mostrar rutas como secciones con sus cursos dentro
    const statusEl = document.getElementById('certCourseStatus');
    if (statusEl) {
        const courseColors = { steam:'#07B0E4', abp:'#2563EB', 'design-thinking':'#E83C8D', evaluacion:'#E9A037', 'tipos-estudiantes':'#7C3AED', storytelling:'#F59E0B', creatividad:'#E83C8D', 'herramientas-tec':'#7C3AED', 'm-learning':'#F59E0B', 'flipped-classroom':'#10B981', abv:'#6366F1', 'micro-learning':'#F97316', 'ia-fundamentos':'#10B981', 'ia-tiempo':'#F97316', 'ia-herramientas':'#8B5CF6', 'ia-inclusion':'#06B6D4', 'ia-ciudadania':'#EC4899', 'manejo-conductas':'#0891B2', 'sel-docentes':'#DB2777', 'comunicacion-asertiva':'#7C3AED', 'disciplina-positiva':'#EA580C', 'bienestar-docente':'#16A34A' };

        statusEl.innerHTML = LEARNING_PATHS.map(path => {
            const pathCourses = (path.courses || [])
                .map(id => available.find(c => c.id === id))
                .filter(Boolean);
            if (pathCourses.length === 0) return '';

            const pathAllPassed = pathCourses.every(c => {
                const s = c.id === 'steam' ? steamScore : scores[c.id];
                return s !== undefined && s >= 70;
            });

            const coursesHTML = pathCourses.map(c => {
                const s      = c.id === 'steam' ? steamScore : scores[c.id];
                const passed = s !== undefined && s >= 70;
                const started = (progress?.completedCards || []).some(id => _cardBelongsToCourse(c.id, id));
                const col = courseColors[c.id] || '#4f46e5';
                if (passed) {
                    // Botón de diploma POR CURSO (no depende de cuál sea el curso
                    // "activo" en ese momento) — antes solo existía un botón
                    // global tied a currentCourseId, así que un curso ya
                    // aprobado no mostraba forma de conseguir su diploma a
                    // menos que ese curso siguiera siendo el activo.
                    const isPaid = _isCertPaid('diploma', c.id);
                    const certBtnHtml = isPaid
                        ? `<button onclick="requestCertificate('diploma','${c.id}',${s})" style="flex-shrink:0;background:#16A34A;color:white;font-size:10px;font-weight:800;padding:6px 10px;border-radius:10px;border:none;cursor:pointer;white-space:nowrap">⬇ Descargar</button>`
                        : `<button onclick="requestCertificate('diploma','${c.id}',${s})" style="flex-shrink:0;background:#5C35C5;color:white;font-size:10px;font-weight:800;padding:6px 10px;border-radius:10px;border:none;cursor:pointer;white-space:nowrap">Obtener · Q10</button>`;
                    // Fecha real de aprobación (ya la guardamos por curso) en
                    // vez de solo el puntaje — igual que "Aprobado el [fecha]"
                    // en otras plataformas.
                    const _examDateStr = progress?.dailyMissions?.examDates?.[c.id];
                    const _examDateLabel = _examDateStr
                        ? _parseLocalDateStr(_examDateStr).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })
                        : null;
                    return `<div style="display:flex;align-items:center;gap:10px;background:#F0FDF4;border:1.5px solid #86EFAC;border-radius:12px;padding:8px 12px">
                        <div style="width:28px;height:28px;border-radius:50%;background:#22C55E;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div style="flex:1;min-width:0">
                            <p style="font-size:12px;font-weight:700;color:#15803D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</p>
                            <p style="font-size:10px;color:#16A34A">${_examDateLabel ? `Aprobado el ${_examDateLabel} · ${s}%` : `Certificado · ${s}%`}</p>
                        </div>
                        ${certBtnHtml}
                    </div>`;
                } else if (started) {
                    return `<div style="display:flex;align-items:center;gap:10px;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;padding:8px 12px">
                        <div style="width:28px;height:28px;border-radius:50%;background:${col}20;border:2px solid ${col};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <div style="width:8px;height:8px;border-radius:50%;background:${col}"></div>
                        </div>
                        <div style="flex:1;min-width:0">
                            <p style="font-size:12px;font-weight:700;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</p>
                            <p style="font-size:10px;color:#94A3B8">En progreso${s !== undefined ? ` · Examen: ${s}%` : ''}</p>
                        </div>
                    </div>`;
                } else {
                    return `<div style="display:flex;align-items:center;gap:10px;background:#F8FAFC;border:1.5px solid #F1F5F9;border-radius:12px;padding:8px 12px;opacity:.6">
                        <div style="width:28px;height:28px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <div style="width:8px;height:8px;border-radius:50%;background:#CBD5E1"></div>
                        </div>
                        <div style="flex:1;min-width:0">
                            <p style="font-size:12px;font-weight:700;color:#94A3B8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</p>
                            <p style="font-size:10px;color:#CBD5E1">No iniciado</p>
                        </div>
                    </div>`;
                }
            }).join('');

            const pathIsActive = pathCourses.some(c => c.id === currentCourseId);
            const startCollapsed = !pathIsActive;
            return `<div style="margin-bottom:12px">
                <button class="perfil-section-toggle${startCollapsed ? ' collapsed' : ''}" onclick="togglePerfilSection(this)" style="width:100%">
                    <span style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <span style="width:10px;height:10px;border-radius:50%;background:${path.color};flex-shrink:0"></span>
                        <span style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${path.label}</span>
                        ${pathAllPassed ? '<span style="font-size:10px;font-weight:700;color:#16a34a;background:#dcfce7;padding:2px 8px;border-radius:20px;flex-shrink:0">COMPLETADA</span>' : ''}
                    </span>
                    <svg class="perfil-section-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div class="perfil-section-body${startCollapsed ? ' collapsed' : ''}">
                    <div style="display:flex;flex-direction:column;gap:6px;padding-top:8px">${coursesHTML}</div>
                </div>
            </div>`;
        }).join('');
    }
}

// ==================== EXAMEN MAESTRO ====================
let _masterExamActive   = false;
let _masterExamQuestions = [];
let _masterExamAnswers  = [];
let _masterExamCurrentQ = 0;

function startMasterExam() {
    if (typeof MASTER_EXAM === 'undefined') {
        showToast('Error: banco de preguntas no disponible.', 'error'); return;
    }
    _masterExamActive    = true;
    _masterExamCurrentQ  = 0;
    const shuffled       = _shuffleArray([...MASTER_EXAM.questions]);
    _masterExamQuestions = shuffled.slice(0, 30);
    _masterExamAnswers   = new Array(_masterExamQuestions.length).fill(null);

    switchTab('home');
    _hideNavBtns(true);
    _setTopBarExam(true);
    _renderMasterExamCard();
}

function _renderMasterExamCard() {
    const q     = _masterExamQuestions[_masterExamCurrentQ];
    const total = _masterExamQuestions.length;
    const qNum  = _masterExamCurrentQ + 1;
    const pct   = Math.round((qNum / total) * 100);

    const courseLabels = { steam:'STEAM', abp:'ABP', 'design-thinking':'Design Thinking', evaluacion:'Evaluación', 'tipos-estudiantes':'Tipos de Estudiantes', maestro:'Síntesis' };
    const courseColors = { steam:'#07B0E4', abp:'#2563EB', 'design-thinking':'#E83C8D', evaluacion:'#E9A037', 'tipos-estudiantes':'#7C3AED', maestro:'#1A6B68' };
    const courseTag    = courseLabels[q.course] || 'General';
    const courseColor  = courseColors[q.course] || '#1A6B68';
    const selected     = _masterExamAnswers[_masterExamCurrentQ];

    const optionsHtml = q.options.map((opt, i) => {
        const isSelected = selected === i;
        return `<button onclick="_selectMasterAnswer(${i})"
            style="width:100%;text-align:left;padding:12px 16px;border-radius:14px;border:2px solid ${isSelected ? courseColor : '#E2E8F0'};
                   background:${isSelected ? courseColor + '15' : 'white'};
                   color:${isSelected ? courseColor : '#374151'};font-weight:${isSelected ? '700' : '500'};
                   font-size:14px;cursor:pointer;transition:all .15s;margin-bottom:8px;display:block">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;
                         background:${isSelected ? courseColor : '#F1F5F9'};color:${isSelected ? 'white' : '#94A3B8'};
                         font-size:11px;font-weight:700;margin-right:10px;flex-shrink:0">
                ${String.fromCharCode(65 + i)}
            </span>${opt}
        </button>`;
    }).join('');

    document.getElementById('cardContainer').innerHTML = `
    <div id="activeCard" class="content-card">
        <div style="padding:20px 20px 0">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="background:${courseColor}20;color:${courseColor};font-size:10px;font-weight:700;
                                 padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em">${courseTag}</span>
                    <span style="font-size:11px;color:#94A3B8;font-weight:600">Pregunta ${qNum} / ${total}</span>
                </div>
                <span style="font-size:11px;font-weight:700;color:#1e293b">🎓 Docente STEAM</span>
            </div>
            <div style="background:#F1F5F9;border-radius:8px;height:6px;margin-bottom:16px;overflow:hidden">
                <div style="height:100%;border-radius:8px;background:${courseColor};
                            width:${pct}%;transition:width .4s ease"></div>
            </div>
        </div>
        <div class="card-body" style="padding-top:8px">
            <p style="font-size:16px;font-weight:700;color:#0F172A;line-height:1.5;margin-bottom:20px">${q.text}</p>
            <div>${optionsHtml}</div>
        </div>
        <div style="padding:12px 20px 20px;display:flex;gap:10px">
            ${_masterExamCurrentQ > 0 ? `<button onclick="_masterExamPrev()" style="flex:0 0 auto;padding:12px 16px;border-radius:14px;border:2px solid #E2E8F0;background:white;color:#64748B;font-weight:600;cursor:pointer;font-size:13px">← Anterior</button>` : ''}
            <button onclick="_masterExamNext()" style="flex:1;padding:12px;border-radius:14px;border:none;
                background:${_masterExamAnswers[_masterExamCurrentQ] !== null ? courseColor : '#E2E8F0'};
                color:${_masterExamAnswers[_masterExamCurrentQ] !== null ? 'white' : '#94A3B8'};
                font-weight:700;font-size:14px;cursor:pointer;transition:all .2s">
                ${qNum === total ? '✅ Ver resultados' : 'Siguiente →'}
            </button>
        </div>
    </div>`;
}

function _selectMasterAnswer(idx) {
    _masterExamAnswers[_masterExamCurrentQ] = idx;
    _renderMasterExamCard();
}

function _masterExamPrev() {
    if (_masterExamCurrentQ > 0) { _masterExamCurrentQ--; _renderMasterExamCard(); }
}

function _masterExamNext() {
    if (_masterExamAnswers[_masterExamCurrentQ] === null) {
        showToast('Selecciona una respuesta para continuar', 'warning'); return;
    }
    _masterExamCurrentQ++;
    if (_masterExamCurrentQ >= _masterExamQuestions.length) {
        _showMasterExamResults();
    } else {
        _renderMasterExamCard();
    }
}

function _showMasterExamResults() {
    let correct = 0;
    _masterExamQuestions.forEach((q, i) => { if (_masterExamAnswers[i] === q.correct) correct++; });
    const total  = _masterExamQuestions.length;
    const pct    = Math.round((correct / total) * 100);
    const passed = pct >= MASTER_EXAM.passingScore;

    // Siempre guardar el puntaje del examen — por ruta (y legado global para compatibilidad)
    if (!progress.dailyMissions) progress.dailyMissions = {};
    progress.dailyMissions.masterExamScore = pct; // legado
    progress.dailyMissions.masterExamDate  = localDateStr();
    if (!progress.dailyMissions.masterExamScores) progress.dailyMissions.masterExamScores = {};
    const _pid = _selectedMasterPath?.id || _activeMasterPath?.id;
    if (_pid) progress.dailyMissions.masterExamScores[_pid] = pct;
    // Fecha por ruta — igual que masterExamScores, masterExamDate por sí
    // sola es global y se pisa si se aprueba más de una ruta.
    if (!progress.dailyMissions.masterExamDates) progress.dailyMissions.masterExamDates = {};
    if (_pid) progress.dailyMissions.masterExamDates[_pid] = localDateStr();
    window._lastMasterExamScore = pct;
    if (passed) {
        addXP(100, 'Parte 1 del Examen Maestro completada');
    }
    saveProgress();
    _masterExamActive = false;
    _hideNavBtns(false);
    _setTopBarExam(false);

    const totalHours = (typeof allCourses !== 'undefined')
        ? allCourses.filter(c => c.status === 'available').reduce((a, c) => a + (c.durationHours || 0), 0)
        : 20;

    const examScore50 = Math.round(pct * 0.5);
    document.getElementById('cardContainer').innerHTML = `
    <div id="activeCard" class="content-card">
        <div class="card-banner" style="background:#1e3a8a">
            <div class="card-banner-svg">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="32" r="18" stroke="rgba(255,255,255,0.9)" stroke-width="2.5"/>
                    <path d="M28 54 L40 70 L52 54" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M33 32 L38 37 L48 27" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p class="card-banner-sub" style="color:white;font-size:1rem;font-weight:800;opacity:1">Parte 1 completada · Examen de conocimiento</p>
            <p class="card-banner-sub" style="margin-top:2px">${correct} de ${total} correctas</p>
        </div>
        <div class="card-body" style="text-align:center">

            <!-- Puntaje examen como /50 -->
            <div style="background:#f0f9ff;border-radius:14px;padding:16px;margin-bottom:16px;border:1px solid #bae6fd">
                <p style="font-size:11px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Parte 1 · Examen de conocimiento</p>
                <p style="font-size:2.8rem;font-weight:900;color:#0369a1;line-height:1">${examScore50}<span style="font-size:1.2rem;font-weight:600;color:#93c5fd">/50</span></p>
                <p style="font-size:11px;color:#64748b;margin-top:4px">${pct}% de respuestas correctas</p>
            </div>

            <!-- Siguiente paso: portafolio -->
            <div style="background:#f0fdf4;border-radius:14px;padding:14px;margin-bottom:16px;border:1px solid #86efac">
                <p style="font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Siguiente paso</p>
                <p style="font-size:13px;color:#166534;font-weight:600;margin-bottom:2px">Parte 2 · Portafolio de práctica</p>
                <p style="font-size:11px;color:#64748b">Comparte 5 evidencias de lo que aplicaste en tu aula. La IA evaluará tu portafolio y dará retroalimentación personalizada. Vale 50 puntos.</p>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
                <div style="background:#F0FDF4;border-radius:12px;padding:10px">
                    <p style="font-size:1.4rem;font-weight:700;color:#16A34A">${correct}</p>
                    <p style="font-size:.7rem;color:#64748B;margin-top:2px">Correctas</p>
                </div>
                <div style="background:#FEF2F2;border-radius:12px;padding:10px">
                    <p style="font-size:1.4rem;font-weight:700;color:#DC2626">${total - correct}</p>
                    <p style="font-size:.7rem;color:#64748B;margin-top:2px">Incorrectas</p>
                </div>
            </div>

            <button onclick="updateUI();switchTab('profile')" style="width:100%;padding:14px;border-radius:14px;border:none;background:#16a34a;color:white;font-weight:800;font-size:14px;cursor:pointer;margin-bottom:8px">
                Ir a Portafolio →
            </button>
            <button onclick="startMasterExam()" style="width:100%;padding:10px;border-radius:14px;border:2px solid #E2E8F0;background:white;color:#475569;font-weight:600;font-size:12px;cursor:pointer;margin-bottom:6px">Repetir examen</button>
            <button onclick="updateUI();switchTab('profile')" style="color:#94A3B8;font-size:.75rem;padding:6px;background:none;border:none;cursor:pointer;width:100%">Volver al perfil</button>
        </div>
    </div>`;

    if (passed) { _checkMasterCert(); renderCourseResources(); }
}

async function generateMasterCertificate() {
    // Abrir ventana ANTES de los await para no perder el contexto del clic
    const certWin = window.open('', '_blank');
    if (certWin) certWin.document.write('<html><body style="background:#1e1b4b;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0"><p style="color:white;font-family:sans-serif;font-size:18px">Generando certificado…</p></body></html>');

    const nombre      = getDisplayName();
    const scores      = progress?.dailyMissions?.examScores || {};
    const steamScore  = scores['steam'] ?? progress?.dailyMissions?.examScore ?? 0;
    const masterScore = progress?.dailyMissions?.masterExamScore ?? window._lastMasterExamScore ?? 0;

    // Solo los cursos de la RUTA activa (no todo el catálogo)
    const _path = _activeMasterPath || LEARNING_PATHS[0];
    const _pathLabel = _path?.label || 'Programa de Formación Docente';

    // Fecha de EMISIÓN = cuándo se aprobó el examen maestro de ESTA ruta,
    // no cuándo se genera/descarga el certificado.
    const _storedMasterDate = _path?.id ? progress?.dailyMissions?.masterExamDates?.[_path.id] : null;
    const _issueDate  = _storedMasterDate ? _parseLocalDateStr(_storedMasterDate) : new Date();
    const fecha       = _issueDate.toLocaleDateString('es-GT', { day:'numeric', month:'long', year:'numeric' });
    const _issueYear  = _issueDate.getFullYear();
    const _issueMonth = _issueDate.getMonth() + 1;

    const [firmaSrc, masterSigs] = await Promise.all([
        _imgToBase64('firma.png'),
        _loadCertSignaturesForUser()
    ]);
    const logoHtml = `<span style="font-family:Arial Black,sans-serif;font-size:16px;font-weight:900;color:#7C3AED">Formación Docente</span>`;

    const _pathCourseIds = _path?.courses || [];
    const availableCourses = allCourses.filter(c => c.status === 'available' && _pathCourseIds.includes(c.id));
    const totalHours = availableCourses.reduce((a, c) => a + (c.durationHours || 0), 0);
    const avgIndividual = availableCourses.length ? Math.round(availableCourses.reduce((a, c) => {
        const s = c.id === 'steam' ? steamScore : (scores[c.id] || 0);
        return a + s;
    }, 0) / availableCourses.length) : 0;

    const colors = { 'steam':'#07B0E4','abp':'#2563EB','design-thinking':'#E83C8D','evaluacion':'#E9A037','tipos-estudiantes':'#7C3AED','creatividad':'#E83C8D','herramientas-tec':'#7C3AED','m-learning':'#F59E0B','flipped-classroom':'#10B981','abv':'#6366F1','micro-learning':'#F97316','ia-fundamentos':'#10B981','ia-tiempo':'#F97316','ia-herramientas':'#8B5CF6','ia-inclusion':'#06B6D4','ia-ciudadania':'#EC4899','manejo-conductas':'#0891B2','sel-docentes':'#DB2777','comunicacion-asertiva':'#7C3AED','disciplina-positiva':'#EA580C','bienestar-docente':'#16A34A' };
    const courseBadges = availableCourses.map(c => {
        const s   = c.id === 'steam' ? steamScore : (scores[c.id] || 0);
        const col = colors[c.id] || '#1A6B68';
        return `<div style="background:${col}18;border:1.5px solid ${col}44;border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px">
            <div style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0"></div>
            <div>
                <div style="font-size:12px;font-weight:700;color:#0F172A">${c.title}</div>
                <div style="font-size:10px;color:#64748B">${s}% aprobado · ${c.durationHours}h</div>
            </div>
        </div>`;
    }).join('');

    // Código único de verificación — persistente, no cambia entre descargas
    const certCode = await getOrCreateCertCode(null, 'master', nombre, masterScore);
    const { qrImg, verifyUrl } = buildVerifyQRHtml(certCode);

    const masterHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(_pathLabel)} — ${esc(nombre)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#F1F5F9; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:2rem; }
  .cert { background:white; width:800px; max-width:100%; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,.15); }
  .cert-top { background:#1e1b4b; padding:36px 48px 28px; position:relative; overflow:hidden; }
  .cert-top::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,.06); }
  .cert-top::after  { content:''; position:absolute; bottom:-60px; left:20%; width:280px; height:280px; border-radius:50%; background:rgba(124,58,237,.15); }
  .cert-badge { display:inline-block; font-size:11px; font-weight:700; color:rgba(255,255,255,.85); text-transform:uppercase; letter-spacing:.12em; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); border-radius:100px; padding:5px 14px; margin-bottom:12px; position:relative; z-index:1; }
  .cert-title    { color:white; font-size:28px; font-weight:900; line-height:1.2; position:relative; z-index:1; }
  .cert-subtitle { color:rgba(255,255,255,.7); font-size:12.5px; margin-top:5px; position:relative; z-index:1; }
  .cert-body  { padding:32px 48px; }
  .cert-otorga{ font-size:12px; color:#94A3B8; font-weight:600; text-transform:uppercase; letter-spacing:.12em; margin-bottom:6px; }
  .cert-nombre{ font-size:34px; font-weight:900; color:#4C1D95; line-height:1.1; margin-bottom:18px; }
  .cert-desc  { font-size:14px; color:#475569; line-height:1.75; margin-bottom:22px; }
  .cert-desc strong { color:#0F172A; }
  .cert-meta  { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:22px; }
  .meta-pill  { background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:12px; padding:9px 16px; }
  .meta-pill.hi { background:#F3E8FF; border-color:#C4B5FD; }
  .meta-pill .label { font-size:10px; color:#94A3B8; font-weight:700; text-transform:uppercase; letter-spacing:.1em; margin-bottom:3px; }
  .meta-pill .value { font-size:15px; color:#0F172A; font-weight:800; }
  .meta-pill.hi .value { color:#4C1D95; }
  .courses-label { font-size:11px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:.1em; margin-bottom:10px; }
  .courses-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:24px; }
  .course-row { display:flex; align-items:center; gap:10px; background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:12px; padding:8px 14px; }
  .course-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .course-name { font-size:12px; font-weight:700; color:#0F172A; }
  .course-meta { font-size:10px; color:#64748B; }
  .cert-footer{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1.5px solid #F1F5F9; padding-top:20px; flex-wrap:wrap; gap:16px; }
  .sign-block { text-align:center; }
  .sign-img   { height:70px; object-fit:contain; display:block; margin:0 auto 4px; }
  .sign-line  { width:180px; border-top:1.5px solid #CBD5E1; margin:0 auto 6px; }
  .sign-name  { font-size:12.5px; font-weight:700; color:#0F172A; }
  .sign-role  { font-size:11px; color:#64748B; }
  .brand-area { display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
  .verify-block { display:flex; align-items:center; gap:10px; }
  .verify-text { font-size:9.5px; color:#94A3B8; line-height:1.5; max-width:140px; }
  .verify-text strong { color:#475569; font-family:monospace; }
  .print-btn  { background:#5C35C5; color:white; border:none; padding:10px 22px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; }
  .linkedin-btn { display:flex; align-items:center; gap:6px; background:#0A66C2; color:white; border:none; padding:9px 18px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; text-decoration:none; }
  .linkedin-btn:hover { opacity:.88; }
  @media print { body{background:none;padding:0} .cert{box-shadow:none;border-radius:0;width:100%} .print-btn{display:none} .linkedin-btn{display:none} }
  @media (max-width:600px) { .cert-body{padding:24px 20px} .cert-top{padding:28px 20px} .courses-grid{grid-template-columns:1fr} .cert-footer{flex-direction:column;align-items:flex-start} }
</style>
</head>
<body>
<div class="cert">
  <div class="cert-top">
    <div class="cert-badge">★ Certificación de Excelencia — ${esc(_pathLabel)} ★</div>
    <h1 class="cert-title">${esc(_pathLabel)}</h1>
    <p class="cert-subtitle">Ruta de Formación Docente en Pedagogía Innovadora · Guatemala</p>
  </div>
  <div class="cert-body">
    <p class="cert-otorga">Se otorga con distinción máxima a</p>
    <p class="cert-nombre">${esc(nombre)}</p>
    <p class="cert-desc">Por haber completado satisfactoriamente la ruta <strong>${esc(_pathLabel)}</strong>, acreditando los <strong>${availableCourses.length} cursos</strong> que la integran y aprobando el <strong>Examen Final Integrador</strong> con <strong>${masterScore}%</strong>, demostrando dominio integral de metodologías activas para el aula del siglo XXI.</p>
    <div class="cert-meta">
      <div class="meta-pill hi"><div class="label">Examen Final</div><div class="value">${masterScore}%</div></div>
      <div class="meta-pill"><div class="label">Promedio cursos</div><div class="value">${avgIndividual}%</div></div>
      <div class="meta-pill"><div class="label">Horas acreditadas</div><div class="value">${totalHours} horas</div></div>
      <div class="meta-pill"><div class="label">Cursos aprobados</div><div class="value">${availableCourses.length} / ${availableCourses.length}</div></div>
      <div class="meta-pill"><div class="label">Fecha de emisión</div><div class="value">${fecha}</div></div>
    </div>
    <p class="courses-label">Cursos acreditados en el programa</p>
    <div class="courses-grid">${courseBadges}</div>
    <div class="cert-footer">
      <div class="verify-block">
        ${certCode ? `<img src="${qrImg}" alt="QR" style="width:64px;height:64px;border-radius:8px">
        <div class="verify-text">Código único: <strong>${certCode}</strong><br>Escanea para verificar autenticidad</div>` : ''}
      </div>
      ${_buildSignaturesHtml(masterSigs, firmaSrc)}
      <div class="brand-area">
        ${logoHtml}
        <button class="print-btn" onclick="window.print()">⬇ Guardar PDF</button>
        ${certCode ? `<a class="linkedin-btn" target="_blank" href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(_pathLabel + ' · Certificación Maestra de Formación Docente')}&organizationName=${encodeURIComponent('Formación Docente')}&issueYear=${_issueYear}&issueMonth=${_issueMonth}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certCode)}"><svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>Agregar a LinkedIn</a>` : ''}
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

    try {
        if (certWin && !certWin.closed) {
            certWin.document.open();
            certWin.document.write(masterHTML);
            certWin.document.close();
        } else {
            // Ventana bloqueada (o cerrada por el usuario) — mostrar banner
            const blob = new Blob([masterHTML], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            _offerCertificateDownload(blobUrl, `Certificado_Maestro_${nombre.replace(/\s+/g,'_')}.html`, 'Certificado Maestro');
        }
    } catch(e) {
        console.error('generateMasterCertificate:', e);
        showToast('Error al generar el certificado. Intenta de nuevo.', 'error');
    }
}

// ==================== ESTADÍSTICAS (Profe Billy) ====================
function showStatsPanel() {
    const statsContent = document.getElementById('statsContent');
    const npsValues = progress.npsHistory?.map(h => h.nps) || [];
    const promoters = npsValues.filter(n => n >= 9).length;
    const detractors = npsValues.filter(n => n <= 6).length;
    const npsScore = npsValues.length ? Math.round(((promoters - detractors) / npsValues.length) * 100) : 0;
    const ratings = Object.values(progress.moduleFeedback || {}).map(f => f.rating);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
    statsContent.innerHTML = `<div class="space-y-4"><div class="grid grid-cols-2 gap-3"><div class="bg-indigo-50 p-3 rounded-xl text-center"><div class="text-2xl font-bold text-indigo-700">${avgRating}</div><div class="text-xs text-gray-600">⭐ Rating promedio</div></div><div class="bg-green-50 p-3 rounded-xl text-center"><div class="text-2xl font-bold text-green-700">${npsScore}</div><div class="text-xs text-gray-600">📊 NPS Score</div></div><div class="bg-blue-50 p-3 rounded-xl text-center"><div class="text-2xl font-bold text-blue-700">${progress.completedCards?.length || 0}</div><div class="text-xs text-gray-600">✅ Tarjetas completadas</div></div><div class="bg-purple-50 p-3 rounded-xl text-center"><div class="text-2xl font-bold text-purple-700">${progress.xp || 0}</div><div class="text-xs text-gray-600">⭐ XP totales</div></div></div><div class="bg-gray-100 p-3 rounded-xl"><h3 class="font-bold mb-2">🎯 Resumen ejecutivo</h3><p class="text-sm">📌 NPS: ${npsScore} ${npsScore >= 50 ? '✅ Excelente' : (npsScore >= 30 ? '📈 Bueno' : '⚠️ Por mejorar')}<br>📌 Promotores: ${promoters} de ${npsValues.length}<br>📌 Rating promedio: ${avgRating}/5 estrellas<br>📌 Racha actual: ${progress.streak || 0} días<br>📌 Logros desbloqueados: ${progress.badges?.length || 0}/${Object.keys(badges).length}</p></div></div>`;
    document.getElementById('statsPanel').classList.remove('hidden');
}

function exportStatsToCSV() {
    let csv = [["Modulo", "Rating", "NPS", "Comentario", "Fecha"]];
    Object.values(progress.moduleFeedback || {}).forEach(f => csv.push([`"${f.moduleName}"`, f.rating, f.nps, `"${(f.comment || "").replace(/"/g, '""')}"`, f.timestamp]));
    const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a"); link.download = `estadisticas_steam_${new Date().toISOString().slice(0, 19)}.csv`; link.href = URL.createObjectURL(blob); link.click();
    alert("✅ Datos exportados a CSV");
}

function clearStats() { if (confirm("⚠️ ¿Eliminar TODOS los datos de feedback?")) { progress.moduleFeedback = {}; progress.npsHistory = []; saveProgress(); showStatsPanel(); } }

// ==================== MODO PROFE ====================

function toggleDevMode() {
    const active = localStorage.getItem('devMode') === '1';
    if (active) {
        localStorage.removeItem('devMode');
        showToast('Modo Dev desactivado', 'info');
    } else {
        localStorage.setItem('devMode', '1');
        showToast('Modo Dev activado — todas las opciones desbloqueadas', 'success');
    }
    _updateDevModeBtn();
    _checkMasterCert();
    // renderProfileTab() nunca existió — updateUI() refresca perfil, certificados y botón dev
    updateUI();
}

function _updateDevModeBtn() {
    const on = localStorage.getItem('devMode') === '1';
    const btn = document.getElementById('devModeBtn');
    const lbl = document.getElementById('devModeBtnLabel');
    const sub = document.getElementById('devModeBtnSub');
    if (!btn) return;
    btn.style.borderColor   = on ? '#f97316' : '';
    btn.style.background    = on ? '#fff7ed' : '';
    if (lbl) lbl.style.color = on ? '#ea580c' : '';
    if (sub) sub.textContent  = on ? 'Activado' : 'Desactivado';
}

function isDevMode() {
    return localStorage.getItem('devMode') === '1';
}

function enableProfeMode() {
    if (!currentUser || (currentUser.role !== 'admin')) {
        alert("⛔ Solo el administrador puede activar este modo.");
        return;
    }
    if (progress.profeMode) return;
    progress.profeMode = true;
    saveProgress();
    document.getElementById("profeVideoBtn").classList.remove("hidden");
    alert("✅ Modo Profe activado. Ya puedes exportar guiones de video.");
    document.getElementById("profeVideoBtn").querySelector("button").addEventListener("click", () => exportModuleToVideo(currentModule));
}

function exportModuleToVideo(moduleId) {
    const module = modulesData[moduleId - 1];
    if (!module) return;
    let script = `# GUION PARA VIDEO - MÓDULO ${module.id}: ${module.title}\n\n## 🎬 INTRO (30 segundos)\n"Hola, soy el Profe Billy. En este video vamos a aprender sobre ${module.title}. Al final tendrás un reto práctico."\n\n## 📚 CONTENIDO PRINCIPAL (5-7 minutos)\n`;
    const contentCards = module.cards.filter(c => c.type === "content");
    contentCards.forEach((card, idx) => { script += `### ${idx + 1}. ${card.title}\n${card.content}\n${card.extra ? `💡 Dato extra: ${card.extra}\n` : ''}\n---\n\n`; });
    script += `## 🎯 RETO PARA EL DOCENTE QUE MIRA EL VIDEO\n"Identifica un problema de tu salón y escribe cómo lo resolverías con STEAM."\n\n## 📹 RECOMENDACIONES TÉCNICAS\n- Graba en horizontal (apaisado).\n- Usa buena luz natural frente a ti.\n- Duración ideal: 5-8 minutos.`;
    const blob = new Blob([script], { type: "text/plain" });
    const link = document.createElement("a"); link.download = `guion_video_modulo_${module.id}.txt`; link.href = URL.createObjectURL(blob); link.click();
    alert("✅ Guion descargado");
}

function loadSavedProgress(skipRender = false) {
    if (progress?.current_module) currentModule = progress.current_module;
    if (progress?.current_card) currentCardIndex = progress.current_card;
    if (skipRender) return;
    renderCard();
    updateUI();
    checkBadges();
}

// ==================== EVENT LISTENERS ====================
document.getElementById("showRegisterBtn")?.addEventListener("click", () => {
    document.getElementById("emailLoginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
});
document.getElementById("showLoginBtn")?.addEventListener("click", () => {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("emailLoginForm").classList.remove("hidden");
});
document.getElementById("doEmailLogin")?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const success = await loginWithEmail(email, password);
    if (success) {
        document.getElementById("loginScreen").classList.add("hidden");
        loadSavedProgress(true);
        _checkOnboardingRequirements(() => _landOnAppropriateScreen());
    }
});
document.getElementById("doRegister")?.addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    if (password.length < 6) { showLoginError("La contraseña debe tener al menos 6 caracteres"); return; }
    const success = await registerWithEmail(email, password);
    if (success) {
        document.getElementById("loginScreen").classList.add("hidden");
        loadSavedProgress(true);
        await checkReferralBonus();
        _checkOnboardingRequirements(() => _landOnAppropriateScreen());
    }
});
document.getElementById("logoutBtn")?.addEventListener("click", logout);
document.getElementById("sidebarLogoutBtn")?.addEventListener("click", logout);

// ── Recuperar contraseña ──────────────────────────────────────
document.getElementById("showForgotBtn")?.addEventListener("click", () => {
    document.getElementById("emailLoginForm").classList.add("hidden");
    document.getElementById("forgotForm").classList.remove("hidden");
    document.getElementById("loginError")?.classList.add("hidden");
});
document.getElementById("backToLoginBtn")?.addEventListener("click", () => {
    document.getElementById("forgotForm").classList.add("hidden");
    document.getElementById("emailLoginForm").classList.remove("hidden");
    document.getElementById("forgotMsg")?.classList.add("hidden");
});

// ── Manejo de recuperación de contraseña ──────────────────────────
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        const allForms = ['emailLoginForm','forgotForm','registerForm'];
        allForms.forEach(id => document.getElementById(id)?.classList.add('hidden'));
        document.getElementById('resetPasswordForm')?.classList.remove('hidden');
    }
});

document.getElementById("doResetPassword")?.addEventListener("click", async () => {
    const pwd = document.getElementById("newPasswordInput")?.value || '';
    const confirm = document.getElementById("confirmPasswordInput")?.value || '';
    const msgEl = document.getElementById("resetPasswordMsg");
    const show = (text, ok) => {
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = ok
            ? 'mt-3 text-sm text-center p-3 rounded-2xl border bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'mt-3 text-sm text-center p-3 rounded-2xl border bg-red-50 text-red-600 border-red-100';
        msgEl.classList.remove('hidden');
    };
    if (pwd.length < 6) { show('Mínimo 6 caracteres.', false); return; }
    if (pwd !== confirm) { show('Las contraseñas no coinciden.', false); return; }
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) { show('Error: ' + error.message, false); return; }
    show('✓ Contraseña actualizada. Puedes iniciar sesión.', true);
    setTimeout(() => {
        document.getElementById('resetPasswordForm')?.classList.add('hidden');
        document.getElementById('emailLoginForm')?.classList.remove('hidden');
        document.getElementById('newPasswordInput').value = '';
        document.getElementById('confirmPasswordInput').value = '';
    }, 2500);
});
document.getElementById("doForgotPassword")?.addEventListener("click", async () => {
    const email = document.getElementById("forgotEmail").value.trim();
    const msgEl = document.getElementById("forgotMsg");
    if (!email) { if (msgEl) { msgEl.textContent = "Ingresa tu correo."; msgEl.classList.remove("hidden","bg-emerald-50","text-emerald-700","border-emerald-100"); msgEl.classList.add("bg-red-50","text-red-600","border-red-100"); } return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
    });
    if (msgEl) {
        msgEl.classList.remove("hidden");
        if (error) {
            msgEl.textContent = "Error: " + error.message;
            msgEl.className = "mt-3 bg-red-50 text-red-600 text-sm text-center p-3 rounded-2xl border border-red-100";
        } else {
            msgEl.textContent = "✓ Revisa tu correo — te enviamos el enlace para restablecer tu contraseña.";
            msgEl.className = "mt-3 bg-emerald-50 text-emerald-700 text-sm text-center p-3 rounded-2xl border border-emerald-100";
        }
    }
});

document.getElementById("nextBtn")?.addEventListener("click", goToNextCard);
document.getElementById("prevBtn")?.addEventListener("click", goToPrevCard);
document.getElementById("examBtn")?.addEventListener("click", () => {
    // El botón ya muestra el curso activo (currentCourseId) y si lo aprobaste
    // o no — antes esto adivinaba a qué curso "mandarte" por cantidad de
    // tarjetas completadas entre TODOS tus cursos, lo que a veces te
    // examinaba de un curso distinto al que la tarjeta decía. Ahora examina
    // siempre el curso que ves en pantalla; para examinar otro, cambia de
    // curso primero (Biblioteca o el ícono junto al buscador).
    startExam();
});
document.getElementById("badgesBtn")?.addEventListener("click", showBadgesModal);
document.getElementById("closeBadgesBtn")?.addEventListener("click", () => document.getElementById("badgesModal")?.classList.add("hidden"));
document.getElementById("shareBadgesBtn")?.addEventListener("click", shareBadges);
document.getElementById("redeemFloatBtn")?.addEventListener("click", showComingSoon);
document.getElementById("closeRedeemBtn")?.addEventListener("click", () => document.getElementById("redeemModal")?.classList.add("hidden"));
document.getElementById("closeRankingBtn")?.addEventListener("click", () => document.getElementById("rankingModal")?.classList.add("hidden"));
document.getElementById("avatarFloatBtn")?.addEventListener("click", showAvatarSelector);
document.getElementById("closeAvatarBtn")?.addEventListener("click", () => document.getElementById("avatarModal")?.classList.add("hidden"));
document.getElementById("moduleBadge")?.addEventListener("dblclick", enableProfeMode);

// ── Nuevas actividades XP ────────────────────────────────────────────────
document.getElementById("shareAppBtn")?.addEventListener("click", shareApp);
document.getElementById("copyReferralBtn")?.addEventListener("click", copyReferralLink);
document.getElementById("uploadEvidenceBtn")?.addEventListener("click", showEvidenceModal);
document.getElementById("closeEvidenceBtn")?.addEventListener("click", () => document.getElementById("evidenceModal")?.classList.add("hidden"));
document.getElementById("submitEvidenceBtn")?.addEventListener("click", submitEvidence);
document.getElementById("evidenceFileInput")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const img = document.getElementById("evidencePreviewImg");
        img.src = ev.target.result;
        img.classList.remove("hidden");
        const dropText = document.getElementById("evidenceDropText");
        if (dropText) dropText.textContent = file.name;
    };
    reader.readAsDataURL(file);
});

// Toggle misiones diarias
document.getElementById("missionsToggle")?.addEventListener("click", () => {
    const panel = document.getElementById("dailyMissions");
    const chevron = document.getElementById("missionsChevron");
    const open = !panel.classList.contains("hidden");
    panel.classList.toggle("hidden", open);
    if (chevron) chevron.style.transform = open ? "" : "rotate(180deg)";
});
if (progress?.profeMode) { document.getElementById("profeVideoBtn").classList.remove("hidden"); }

document.getElementById("statsSecretBtn")?.addEventListener("click", () => {
    if (!currentUser || (currentUser.role !== 'admin')) {
        alert("⛔ Solo el administrador puede ver las estadísticas.");
        return;
    }
    showStatsPanel();
});
document.getElementById("closeStatsBtn")?.addEventListener("click", () => document.getElementById("statsPanel")?.classList.add("hidden"));
document.getElementById("exportStatsBtn")?.addEventListener("click", exportStatsToCSV);
document.getElementById("clearStatsBtn")?.addEventListener("click", clearStats);
document.getElementById("syncNowBtn")?.addEventListener("click", () => { if (currentUser) syncWithSupabase(); else alert("No hay sesión activa"); });

window.addEventListener("online", () => { updateSyncStatus("online", "Conectado"); if (currentUser) syncWithSupabase(); });
window.addEventListener("offline", () => updateSyncStatus("offline", "Sin conexión"));

initDB().then(() => console.log("Base de datos local lista"));
checkExistingSession();


// ==================== AUTO-ACTUALIZACIÓN (sin borrar caché manualmente) ====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        // Revisa de inmediato al cargar — antes esto NO pasaba: una sesión
        // que nunca se pone en segundo plano ni pasan 30 min podía quedarse
        // corriendo código viejo toda la sesión sin ningún chequeo.
        reg.update().catch(() => {});
        // Revisa cada 5 min mientras la app está abierta (antes 30 min —
        // muy lento para deploys urgentes, ej. correcciones de pago).
        setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
        // También revisa al volver a la pestaña/app tras estar en segundo plano
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') reg.update().catch(() => {});
        });
    });

    // Aviso del admin: mismo ritmo que el chequeo de versión — cada 30 min y al volver a la pestaña
    setInterval(() => { if (currentUser) loadAppConfig().catch(() => {}); }, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && currentUser) loadAppConfig().catch(() => {});
    });

    // Cuando el nuevo Service Worker toma control, NO recargamos de inmediato —
    // una recarga forzada a mitad de un login o de cualquier acción se siente como un error.
    // En vez de eso, esperamos un momento seguro: que la pestaña quede en segundo plano,
    // o que el usuario decida actualizar tocando el aviso.
    let _swRefreshed = false;
    let _updateReady = false;
    window._updateReady = false; // expuesto para que flujos críticos (pago) lo consulten
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (_swRefreshed) return;
        _updateReady = true;
        window._updateReady = true;
        if (typeof showUpdateBanner === 'function') showUpdateBanner();
        // Momento seguro #2: si el usuario nunca minimiza la pestaña ni toca
        // "Actualizar", no dejar el aviso ahí indefinidamente corriendo
        // código viejo — sobre todo grave en flujos de pago/certificados.
        // Tras un período de gracia, forzar la recarga de todos modos.
        setTimeout(() => doSafeReload(), 3 * 60 * 1000);
    });

    function doSafeReload() {
        if (_swRefreshed) return;
        _swRefreshed = true;
        window.location.reload();
    }

    // Momento seguro #1: la pestaña pasa a segundo plano (el usuario ya no está mirando)
    document.addEventListener('visibilitychange', () => {
        if (_updateReady && document.visibilityState === 'hidden') doSafeReload();
    });

    window.showUpdateBanner = function () {
        if (document.getElementById('updateReadyToast')) return;
        const el = document.createElement('div');
        el.id = 'updateReadyToast';
        el.style.cssText = 'position:fixed;bottom:90px;left:16px;right:16px;z-index:200;background:#1A6B68;color:white;padding:12px 16px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;font-size:13px;font-family:inherit';
        el.innerHTML = `<span style="flex:1">🔄 Hay una nueva versión disponible.</span>
            <button style="background:white;color:#1A6B68;border:none;padding:6px 12px;border-radius:10px;font-weight:700;font-size:12px;cursor:pointer">Actualizar</button>`;
        el.querySelector('button').onclick = () => { window.location.reload(); };
        document.body.appendChild(el);
    };
}

// ==================== ANIMACIÓN COMPLETAR MÓDULO ====================
let _moduleCompleteCallback = null;
let _confettiFrame = null;
const _confettiColors = ['#FCC30A', '#2BA848', '#07B0E4', '#E9A037', '#E83C8D', '#E52642', '#FFFFFF', '#5C35C5'];

function showModuleComplete(moduleId, callback) {
    _moduleCompleteCallback = callback;
    const module = modulesData[moduleId - 1];
    const _ct = (typeof getCourseThemeAndIllus !== 'undefined')
        ? getCourseThemeAndIllus(currentCourseId || 'steam', moduleId)
        : { theme: MODULE_THEME?.[moduleId] || { primary: '#07B0E4' }, illus: MODULE_ILLUSTRATIONS?.[moduleId] || '' };
    const theme = _ct.theme;
    const illus = _ct.illus;

    const overlay = document.getElementById('moduleCompleteOverlay');
    overlay.style.background = theme.primary;

    const iconEl = document.getElementById('mcModuleIcon');
    iconEl.style.background = theme.primary;
    iconEl.innerHTML = illus;

    document.getElementById('mcModuleName').textContent = module?.title || `Módulo ${moduleId}`;

    // Bonus XP por completar el módulo — solo se otorga una vez por módulo por curso
    const xpBonus = [100, 120, 130, 140, 150][moduleId - 1] || 100;
    if (!progress.completedModules) progress.completedModules = {};
    const moduleKey = `${currentCourseId || 'steam'}-${moduleId}`;
    if (!progress.completedModules[moduleKey]) {
        progress.completedModules[moduleKey] = true;
        addXP(xpBonus, `Módulo ${moduleId} completado`);
        saveProgress();
    }
    document.getElementById('mcXP').textContent = `+${xpBonus} XP`;

    overlay.classList.remove('hidden');
    startConfetti();
    // Auto-dismiss a los 4 segundos
    setTimeout(closeModuleComplete, 4000);
}

function closeModuleComplete() {
    const overlay = document.getElementById('moduleCompleteOverlay');
    if (overlay.classList.contains('hidden')) return; // ya cerrado
    overlay.classList.add('hidden');
    stopConfetti();
    if (_moduleCompleteCallback) {
        const cb = _moduleCompleteCallback;
        _moduleCompleteCallback = null;
        setTimeout(cb, 200); // pequeña pausa antes del siguiente modal
    }
}

function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1,
        w: Math.random() * 14 + 5,
        h: Math.random() * 7 + 3,
        color: _confettiColors[Math.floor(Math.random() * _confettiColors.length)],
        speed: Math.random() * 3.5 + 1.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        drift: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.4 + 0.6
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 2);
            ctx.fill();
            ctx.restore();
            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;
            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        _confettiFrame = requestAnimationFrame(draw);
    }
    draw();
}

function stopConfetti() {
    if (_confettiFrame) { cancelAnimationFrame(_confettiFrame); _confettiFrame = null; }
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// ==================== TOUR GUIADO (driver.js) ====================
// Reemplaza el modal-slideshow anterior por un tour con spotlight sobre
// los elementos reales de la UI. Cada paso indica a qué pestaña saltar
// (y qué sección de Perfil abrir, si aplica) antes de resaltar.
const APP_TOUR_STEPS = [
    {
        tab: 'home',
        element: '#cardContainer',
        title: '👋 ¡Bienvenido al programa!',
        description: 'Aprenderás con <strong>tarjetas</strong> como esta. Lee cada una y avanza tocando <strong>Siguiente →</strong> o deslizando hacia la izquierda.',
        side: 'bottom',
    },
    {
        tab: 'home',
        element: '#topBarProgressInfo',
        title: 'Buscar y volver',
        description: 'La lupa busca cualquier tema en todos tus cursos. La flecha junto a ella te lleva a la lista de cursos de tu ruta actual — si ya estás viendo esa lista, te regresa a la lista de rutas.',
        side: 'bottom',
    },
    {
        tab: 'home',
        element: '.card-body',
        title: 'El contenido de cada tarjeta',
        description: 'Lee el texto principal con calma. Algunas tarjetas incluyen un recuadro <strong>💡 Dato clave</strong> con la idea más importante para recordar.',
        side: 'bottom',
    },
    {
        tab: 'home',
        element: '#cardActionsRow',
        title: 'Marca tu práctica',
        description: '<strong>🍎 Lo apliqué en clase</strong> confirma que llevaste esto a tu aula. <strong>📝 Agregar nota</strong> guarda apuntes propios sobre la tarjeta, visibles solo para ti.',
        side: 'top',
    },
    {
        tab: 'home',
        element: '#commentCountBtn',
        title: 'Resuelve tus dudas',
        description: '¿Algo no quedó claro? Escribe en <strong>Comentarios y dudas</strong> — el administrador o tus compañeros pueden responderte directo en esa tarjeta.',
        side: 'top',
    },
    {
        tab: 'home',
        element: '#cardNavBar',
        title: 'Avanza a tu ritmo',
        description: 'Tu progreso se guarda en la nube automáticamente. Al final de cada módulo hay un <strong>quiz corto</strong> — no afecta tu nota, pero sí te da XP.',
        side: 'top',
    },
    {
        tab: 'biblioteca',
        element: '#coursesList',
        title: 'Rutas y cursos',
        description: '__BIBLIOTECA_DESC__',
        side: 'top',
    },
    {
        tab: 'modulos',
        element: '#modulesIndexList',
        title: 'Módulos con desbloqueo progresivo',
        description: 'Cada módulo se desbloquea <strong>24 horas</strong> después de completar el anterior, para darte tiempo de practicar en tu aula. También puedes desbloquear de inmediato gastando <strong>200 XP</strong>.',
        side: 'top',
    },
    {
        tab: 'progreso',
        element: '#progresoChart',
        title: 'Tu progreso en números',
        description: 'XP, nivel, racha de días activos y tarjetas completadas, más una gráfica de tu XP diario — todo sincronizado en la nube, accesible desde cualquier dispositivo con tu cuenta.',
        side: 'top',
    },
    {
        tab: 'progreso',
        openSection: 'Misiones y retos',
        element: '#misionesSection',
        title: 'Misiones y formas de ganar XP',
        description: 'Retos diarios, retroalimentación por módulo, evidencia de tu práctica y referidos — hasta <strong>400 XP extra</strong> documentando lo aprendido.',
        side: 'top',
    },
    {
        tab: 'progreso',
        element: '#reconocimientosSection',
        title: 'Ranking, ligas e insignias',
        description: 'Compite de forma sana en el <strong>Ranking</strong> por ligas según tu nivel, y desbloquea insignias por tu desempeño.',
        side: 'top',
    },
    {
        tab: 'progreso',
        openSection: 'Certificación',
        element: '#examBtn',
        title: 'Examen final y certificado',
        description: 'Al completar el <strong>80%</strong> de las tarjetas de un curso se activa el examen. Con <strong>70% o más</strong>, descargas tu diploma en PDF justo abajo.',
        side: 'top',
    },
    {
        tab: 'perfil',
        element: '#editProfileBtn',
        title: 'Completa tu perfil',
        description: '⚠️ Antes de descargar tu certificado, agrega tu <strong>nombre completo, escuela y departamento</strong> — el nombre aparece tal cual en tu diploma.',
        side: 'bottom',
    },
    {
        tab: 'perfil',
        element: 'nav.bottom-nav',
        title: '¡Todo listo! 🚀',
        description: 'Navega entre Inicio, Biblioteca, Progreso, Módulos y Perfil desde aquí. Puedes repetir este tour cuando quieras con el botón "Tutorial".',
        side: 'top',
    },
];

// La cantidad de rutas/cursos cambia con el tiempo (hoy son varias rutas
// con decenas de cursos) — en vez de dejar un número fijo en el texto que
// vuelva a quedar desactualizado, se calcula justo antes de mostrar el tour.
function _tourBibliotecaDescription() {
    const pathCount = (typeof LEARNING_PATHS !== 'undefined') ? LEARNING_PATHS.length : 0;
    const courseCount = (typeof allCourses !== 'undefined') ? allCourses.filter(c => c.status === 'available').length : 0;
    return `El programa tiene <strong>${pathCount} rutas</strong> con <strong>${courseCount} cursos</strong> en total, cada ruta en secuencia lógica — algunos cursos requieren aprobar el examen del anterior. Cambia de curso o ruta cuando quieras desde aquí, o con el botón junto al buscador.`;
}

function _ensurePerfilSectionOpen(labelTitle) {
    document.querySelectorAll('.perfil-section-toggle').forEach(btn => {
        const t = btn.querySelector('.perfil-section-label-title');
        if (t && t.textContent.trim() === labelTitle) {
            btn.classList.remove('collapsed');
            const body = btn.nextElementSibling;
            if (body) body.classList.remove('collapsed');
        }
    });
}

function _tourGoToStep(index) {
    const step = APP_TOUR_STEPS[index];
    if (!step) return;
    if (typeof switchTab === 'function') switchTab(step.tab);
    if (step.openSection) _ensurePerfilSectionOpen(step.openSection);
}

let _tourDriver = null;

function startAppTour() {
    const driverFactory = window.driver && window.driver.js && window.driver.js.driver;
    if (!driverFactory) {
        showToast('No se pudo cargar el tutorial, revisa tu conexión', 'warning');
        return;
    }
    _tourGoToStep(0);
    _tourDriver = driverFactory({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        allowClose: true,
        overlayColor: '#0f172a',
        popoverClass: 'steam-tour-popover',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        doneBtnText: '¡Empezar! 🚀',
        onCloseClick: () => { _tourDriver.destroy(); },
        onDestroyed: () => { _finishAppTour(); },
        steps: APP_TOUR_STEPS.map((step, i) => ({
            element: step.element,
            popover: {
                title: step.title,
                description: step.description === '__BIBLIOTECA_DESC__' ? _tourBibliotecaDescription() : step.description,
                side: step.side || 'bottom',
                align: 'center',
                onNextClick: () => {
                    if (i < APP_TOUR_STEPS.length - 1) {
                        _tourGoToStep(i + 1);
                        setTimeout(() => _tourDriver.moveNext(), 60);
                    } else {
                        _tourDriver.destroy();
                    }
                },
                onPrevClick: () => {
                    if (i > 0) {
                        _tourGoToStep(i - 1);
                        setTimeout(() => _tourDriver.movePrevious(), 60);
                    }
                },
            },
        })),
    });
    _tourDriver.drive();
}

function _finishAppTour() {
    localStorage.setItem('onboardingDone', '1');
    if (typeof progress !== 'undefined' && progress) {
        if (!progress.dailyMissions) progress.dailyMissions = {};
        progress.dailyMissions.onboardingDone = '1';
        if (typeof saveProgress === 'function') saveProgress();
    }
    const diagDone = localStorage.getItem('diagDone') || progress?.dailyMissions?.diagDone;
    if (!diagDone && typeof startDiagnostic === 'function') {
        setTimeout(startDiagnostic, 350);
    }
}

// ==================== INSTALACIÓN PWA ====================
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _deferredInstallPrompt = e;
    // Mostrar banner solo si el usuario no lo descartó antes
    if (!localStorage.getItem('installDismissed')) {
        setTimeout(() => {
            document.getElementById('installBanner')?.classList.remove('hidden');
        }, 3000); // esperar 3s para no interrumpir la carga
    }
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (!_deferredInstallPrompt) return;
    document.getElementById('installBanner').classList.add('hidden');
    _deferredInstallPrompt.prompt();
    const { outcome } = await _deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') showToast('✅ ¡App instalada! Búscala en tu pantalla de inicio', 'success');
    _deferredInstallPrompt = null;
});

document.getElementById('dismissInstallBtn')?.addEventListener('click', () => {
    document.getElementById('installBanner').classList.add('hidden');
    localStorage.setItem('installDismissed', '1');
});

// Si ya está instalada como PWA, ocultar banner permanentemente
window.addEventListener('appinstalled', () => {
    document.getElementById('installBanner')?.classList.add('hidden');
    _deferredInstallPrompt = null;
    showToast('✅ ¡App instalada correctamente!', 'success');
});

// iOS: no dispara beforeinstallprompt — detectar y mostrar instrucciones manuales
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = window.navigator.standalone === true;
if (isIOS && !isInStandaloneMode && !localStorage.getItem('installDismissed')) {
    setTimeout(() => {
        const banner = document.getElementById('installBanner');
        if (banner) {
            banner.querySelector('p.text-white\\/70').textContent =
                'Toca Compartir → "Añadir a pantalla de inicio"';
            banner.querySelector('#installBtn').textContent = 'Ver cómo';
            banner.querySelector('#installBtn').onclick = () => {
                alert('📱 Para instalar en iPhone/iPad:\n1. Toca el botón Compartir (⬆️) en Safari\n2. Desplázate y elige "Añadir a pantalla de inicio"\n3. Toca "Añadir"');
            };
            banner.classList.remove('hidden');
        }
    }, 3000);
}

// ==================== ONBOARDING OBLIGATORIO ====================
const GT_DEPARTMENTS = ['Alta Verapaz','Baja Verapaz','Chimaltenango','Chiquimula','El Progreso','Escuintla','Guatemala','Huehuetenango','Izabal','Jalapa','Jutiapa','Petén','Quetzaltenango','Quiché','Retalhuleu','Sacatepéquez','San Marcos','Santa Rosa','Sololá','Suchitepéquez','Totonicapán','Zacapa'];

function _checkOnboardingRequirements(onComplete) {
    // Admins no necesitan onboarding
    if (currentUser?.role === 'admin') { onComplete(); return; }

    const dm = progress?.dailyMissions || {};
    const _blank = v => !v || v.trim().toLowerCase() === 'individual';
    const profileMissing = _blank(dm.department) || _blank(dm.school);
    const diagMissing    = !dm.diagDone && !localStorage.getItem('diagDone');

    if (!profileMissing && !diagMissing) { onComplete(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'onboardingOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';

    // Carga lazy de la base de datos de centros educativos
    function _loadSchoolsDB(cb) {
        if (typeof SCHOOLS_GT !== 'undefined') { cb(); return; }
        const s = document.createElement('script');
        s.src = './schools_gt.js';
        s.onload = cb;
        s.onerror = cb;
        document.head.appendChild(s);
    }

    function showProfileStep() {
        overlay.innerHTML = `
        <div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:420px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.25);max-height:90vh;overflow-y:auto">
            <div style="text-align:center;margin-bottom:20px">
                <div style="font-size:36px;margin-bottom:8px">🏫</div>
                <h2 style="font-size:18px;font-weight:800;color:#1e293b;margin:0 0 6px">Completa tu perfil</h2>
                <p style="font-size:13px;color:#64748b;margin:0">Para personalizar tu experiencia necesitamos saber dónde enseñas. <strong>Requerido para continuar.</strong></p>
            </div>
            <div style="margin-bottom:14px">
                <label style="display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Departamento *</label>
                <select id="_ob_dept" style="width:100%;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 14px;font-size:14px;background:#f8fafc;outline:none">
                    <option value="">— Selecciona tu departamento —</option>
                    ${GT_DEPARTMENTS.map(d => `<option value="${d}"${dm.department===d?' selected':''}>${d}</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:20px;position:relative">
                <label style="display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Nombre del establecimiento *</label>
                <input id="_ob_school" type="text" autocomplete="off"
                    placeholder="Escribe para buscar tu centro educativo…"
                    value="${esc(dm.school||'')}"
                    style="width:100%;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 14px;font-size:14px;background:#f8fafc;outline:none;box-sizing:border-box">
                <div id="_ob_schoolDrop" style="display:none;position:fixed;background:#fff;border:1.5px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;max-height:200px;overflow-y:auto;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.18)"></div>
            </div>
            <button id="_ob_profileSave" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-weight:800;font-size:14px;border:none;border-radius:14px;cursor:pointer">
                Guardar y continuar →
            </button>
            <p id="_ob_profileErr" style="color:#ef4444;font-size:12px;text-align:center;margin:8px 0 0;display:none">Por favor completa ambos campos.</p>
        </div>`;

        // Autocompletado de centros educativos
        let _obSchoolTimer = null;
        function _obUpdateSuggestions() {
            const drop = document.getElementById('_ob_schoolDrop');
            const inp  = document.getElementById('_ob_school');
            const dept = document.getElementById('_ob_dept')?.value;
            if (!drop || !inp) return;
            const query = inp.value.trim().toLowerCase();
            if (!query || query.length < 2 || typeof SCHOOLS_GT === 'undefined') {
                drop.style.display = 'none';
                return;
            }
            // Si no hay departamento seleccionado, buscar en todos los departamentos
            const pool = dept ? (SCHOOLS_GT[dept] || []) : Object.values(SCHOOLS_GT).flat();
            const matches = pool.filter(s => s.toLowerCase().includes(query)).slice(0, 10);
            if (!matches.length) { drop.style.display = 'none'; return; }
            drop.innerHTML = matches.map(s => {
                const parts = s.split(' · ');
                const name  = parts[0] || s;
                const mun   = parts[1] || '';
                let hi = esc(name);
                try {
                    hi = name.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'), '<strong>$1</strong>');
                } catch(e) {}
                return `<div onclick="_obSelectSchool(this)" data-name="${name.replace(/"/g,'&quot;')}"
                    style="padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid #f1f5f9;transition:background .15s"
                    onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background=''">${hi}<span style="font-size:11px;color:#94a3b8;margin-left:6px">· ${esc(mun)}</span></div>`;
            }).join('');
            // Posicionar usando fixed + getBoundingClientRect para evitar el clip del overflow:auto
            const r = inp.getBoundingClientRect();
            drop.style.left   = r.left + 'px';
            drop.style.top    = (r.bottom - 1) + 'px';
            drop.style.width  = r.width + 'px';
            drop.style.display = 'block';
        }

        window._obSelectSchool = function(el) {
            const name = el.dataset.name;
            const inp  = document.getElementById('_ob_school');
            const drop = document.getElementById('_ob_schoolDrop');
            if (inp) inp.value = name;
            if (drop) drop.style.display = 'none';
        };

        // Cargar BD y conectar eventos
        _loadSchoolsDB(() => {
            const inp  = document.getElementById('_ob_school');
            const dept = document.getElementById('_ob_dept');
            if (!inp) return;
            inp.addEventListener('input', () => {
                clearTimeout(_obSchoolTimer);
                _obSchoolTimer = setTimeout(_obUpdateSuggestions, 180);
            });
            inp.addEventListener('focus', _obUpdateSuggestions);
            inp.addEventListener('blur', () => setTimeout(() => {
                const d = document.getElementById('_ob_schoolDrop');
                if (d) d.style.display = 'none';
            }, 200));
            if (dept) dept.addEventListener('change', () => {
                const d = document.getElementById('_ob_schoolDrop');
                if (d) d.style.display = 'none';
                _obUpdateSuggestions();
            });
        });

        document.getElementById('_ob_profileSave').onclick = () => {
            const dept   = document.getElementById('_ob_dept').value.trim();
            const school = document.getElementById('_ob_school').value.trim();
            if (!dept || !school) {
                document.getElementById('_ob_profileErr').style.display = 'block';
                return;
            }
            if (!progress.dailyMissions) progress.dailyMissions = {};
            progress.dailyMissions.department = dept;
            progress.dailyMissions.school     = school;
            const _pk = `userProfile_${currentUser?.id}`;
            try {
                const _saved = JSON.parse(localStorage.getItem(_pk) || '{}');
                _saved.department = dept; _saved.school = school;
                localStorage.setItem(_pk, JSON.stringify(_saved));
            } catch(_) {}
            saveProgress();
            if (diagMissing) showDiagStep();
            else { document.body.removeChild(overlay); onComplete(); }
        };
    }

    function showDiagStep() {
        overlay.innerHTML = `
        <div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:420px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.25)">
            <div style="text-align:center;margin-bottom:20px">
                <div style="font-size:36px;margin-bottom:8px">🧭</div>
                <h2 style="font-size:18px;font-weight:800;color:#1e293b;margin:0 0 6px">Prueba diagnóstica disponible</h2>
                <p style="font-size:13px;color:#64748b;margin:0">Puedes hacer la prueba diagnóstica cuando quieras desde tu perfil. Toma <strong>5 minutos</strong> y nos ayuda a personalizar tu recorrido.</p>
            </div>
            <div style="background:#f0f9ff;border-radius:14px;padding:14px;margin-bottom:20px">
                <p style="font-size:12px;color:#0369a1;margin:0;line-height:1.6">
                    ✅ No tiene nota aprobatoria — es solo para conocerte mejor.<br>
                    ✅ Sus resultados guían las recomendaciones del curso.<br>
                    ✅ Solo se hace una vez.
                </p>
            </div>
            <button id="_ob_diagSkip" style="width:100%;padding:14px;background:#5C35C5;color:#fff;font-weight:700;font-size:14px;border:none;border-radius:14px;cursor:pointer">
                Entendido, continuar →
            </button>
        </div>`;

        document.getElementById('_ob_diagSkip').onclick = () => {
            document.body.removeChild(overlay);
            onComplete();
        };
    }

    document.body.appendChild(overlay);
    if (profileMissing) showProfileStep();
    else showDiagStep();
}

// ==================== SELECTOR DE CURSOS (Multi-curso) ====================
let currentCourseId = 'steam';
let _selectedPathId  = null; // ruta activa en el selector

// Antes mostraba un overlay de pantalla completa forzado en cada sesión —
// ahora "el selector" es la tab Biblioteca dentro de #mainApp, así que esta
// función solo asegura que mainApp esté visible y cambia a esa tab. Se deja
// con el mismo nombre porque hay varios callers existentes (botón "Cambiar
// curso" del sidebar, etc.) que no necesitan tocarse.
function showCourseSelector(pathId) {
    _selectedPathId = pathId || null;
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('mainApp')?.classList.remove('hidden');
    if (typeof switchTab === 'function') switchTab('biblioteca');
}

function _findPathForCourse(courseId) {
    if (typeof LEARNING_PATHS === 'undefined') return null;
    return LEARNING_PATHS.find(p => (p.courses || []).includes(courseId)) || null;
}

// Botón "Cambiar curso" de la barra superior: antes siempre saltaba hasta
// arriba del todo (lista de rutas), incluso si ya estabas viendo la lista
// de cursos de una ruta o si solo querías ver los otros cursos de TU ruta
// actual. Ahora funciona como "un paso atrás": si ya estás en la lista de
// cursos de una ruta (Biblioteca), regresa a la lista de rutas; si estás en
// cualquier otro lado (estudiando un curso, etc.), te lleva directo a la
// lista de cursos de la ruta de tu curso activo, no hasta arriba del todo.
function _topBarChangeCourseClick() {
    const _tabBiblioteca = document.getElementById('tabBiblioteca');
    const _onBiblioteca = _tabBiblioteca && !_tabBiblioteca.classList.contains('hidden');
    if (_onBiblioteca && _selectedPathId) {
        _selectedPathId = null;
        if (typeof _renderCourseSelector === 'function') _renderCourseSelector();
        return;
    }
    const path = _findPathForCourse(typeof currentCourseId !== 'undefined' ? currentCourseId : null);
    showCourseSelector(path?.id);
}

// Decide a dónde aterriza el usuario al iniciar sesión: si ya tiene un curso
// activo válido, lo lleva directo a su última lección (en vez de forzar
// pasar primero por la Biblioteca) — antes SIEMPRE se mostraba el selector,
// sin importar que el usuario ya llevara semanas en un curso.
function _landOnAppropriateScreen() {
    const savedCourseId = progress?.currentCourseId;
    const courseExists = savedCourseId && typeof allCourses !== 'undefined'
        && allCourses.some(c => c.id === savedCourseId && c.status === 'available');
    if (courseExists) {
        selectCourse(savedCourseId); // ya deja todo listo: posición restaurada, tab Inicio activa
    } else {
        showCourseSelector(); // primera vez, o el curso guardado ya no existe/está disponible
    }
}

function _renderCourseSelector() {
    const list = document.getElementById('coursesList');
    if (!list || typeof allCourses === 'undefined') return;

    if (!_selectedPathId) {
        // ── Vista 1: Rutas ──────────────────────────────────────────
        const scores = progress?.dailyMissions?.examScores || {};
        const _legacySteam = progress?.dailyMissions?.examScore; // legacy single-score for steam
        const _getScore = id => id === 'steam' ? (scores['steam'] ?? _legacySteam) : scores[id];
        list.innerHTML = `
            <p style="font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#94a3b8;margin:0 0 14px">Elige tu ruta de formación</p>
            <div class="lp-grid">
            ${LEARNING_PATHS.map(path => {
                const pathCourses = (path.courses || []).map(id => allCourses.find(c => c.id === id)).filter(Boolean);
                const available   = pathCourses.filter(c => c.status === 'available');
                const passed      = available.filter(c => (_getScore(c.id) ?? 0) >= 70).length;
                const pct         = available.length ? Math.round(passed / available.length * 100) : 0;
                const totalHours  = pathCourses.reduce((a, c) => a + (c.durationHours || 0), 0);
                const allDone     = available.length > 0 && passed === available.length;
                return `
                <div onclick="_selectPath('${path.id}')"
                     class="cursor-pointer active:scale-95 transition-all border rounded-2xl p-4 mb-3"
                     style="background:${path.color}14;border-color:${path.color}40">
                    <div class="flex items-center gap-3">
                        <div style="width:44px;height:44px;border-radius:14px;background:${path.color};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            ${(typeof PATH_SVG !== 'undefined' && PATH_SVG[path.id]) ? PATH_SVG[path.id] : '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12 H32 V32 H12 Z" stroke-width="2"/><path d="M12 12 L22 20 L32 12" stroke-width="2"/></svg>'}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin:0">${path.label}</h3>
                                ${allDone ? `<span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px;background:#dcfce7;color:#16a34a;flex-shrink:0">✓ Completada</span>` : ''}
                            </div>
                            <p style="font-size:11px;color:#64748b;margin:2px 0 6px">${pathCourses.length} cursos · ${totalHours}h de formación</p>
                            <div style="display:flex;align-items:center;gap:8px">
                                <div style="flex:1;height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden">
                                    <div style="width:${pct}%;height:100%;background:${path.color};border-radius:99px;transition:width .4s"></div>
                                </div>
                                <span style="font-size:10px;font-weight:700;color:${path.color};flex-shrink:0">${passed}/${available.length} aprobados</span>
                            </div>
                        </div>
                        <span style="color:#cbd5e1;font-size:18px">›</span>
                    </div>
                </div>`;
            }).join('')}
            </div>`;
    } else {
        // ── Vista 2: Cursos de la ruta seleccionada ─────────────────
        const path = LEARNING_PATHS.find(p => p.id === _selectedPathId);
        if (!path) { _selectedPathId = null; _renderCourseSelector(); return; }

        const pathCourses = (path.courses || []).map(id => allCourses.find(c => c.id === id)).filter(Boolean);
        const scores = progress?.dailyMissions?.examScores || {};
        const _legacySteam2 = progress?.dailyMissions?.examScore; // legacy single-score para steam
        const _getScore2 = id => id === 'steam' ? (scores[id] ?? _legacySteam2) : scores[id];

        list.innerHTML = `
            <button onclick="_selectedPathId=null;_renderCourseSelector()"
                    style="display:flex;align-items:center;gap:6px;background:#f1f5f9;border:none;color:#475569;font-size:13px;font-weight:600;padding:8px 14px;border-radius:10px;cursor:pointer;margin-bottom:14px">
                ‹ Todas las rutas
            </button>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
                <div style="width:36px;height:36px;border-radius:10px;background:${path.color};flex-shrink:0;display:flex;align-items:center;justify-content:center">
                    ${(typeof PATH_SVG !== 'undefined' && PATH_SVG[path.id]) ? `<div style="width:28px;height:28px">${PATH_SVG[path.id]}</div>` : ''}
                </div>
                <div>
                    <h2 style="font-size:15px;font-weight:800;color:#1e293b;margin:0">${path.label}</h2>
                    <p style="font-size:11px;color:#94a3b8;margin:0">${pathCourses.length} cursos en esta ruta</p>
                </div>
            </div>
            <div class="lp-grid">
            ${pathCourses.map((c, idx) => {
                const isOpen    = c.status === 'available';
                const prereqMet = isCoursePrereqMet(c);
                const clickable = isOpen && prereqMet;
                const passed    = (_getScore2(c.id) || 0) >= 70;
                // % de tarjetas completadas del curso (no solo aprobado/no
                // aprobado) — se muestra igual que "% clases vistas" en
                // otras plataformas, solo para cursos ya empezados.
                const _totalC = c.totalCards || 0;
                const _completedC = _totalC ? (progress?.completedCards || []).filter(id => _cardBelongsToCourse(c.id, id)).length : 0;
                const coursePct = _totalC ? Math.round((_completedC / _totalC) * 100) : 0;
                const prereqNames = (c.prerequisite || []).map(id => allCourses.find(x => x.id === id)?.title || id).join(' o ');
                let statusBadge;
                const _lockSvg = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="12" height="8" rx="2" stroke-width="1.8"/><path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke-width="1.8"/></svg>';
                if (!isOpen)       statusBadge = '○ Próximamente';
                else if (!prereqMet) statusBadge = `${_lockSvg.replace('width="20" height="20"','width="11" height="11" style="vertical-align:-1.5px;margin-right:2px"')} Requiere: ${prereqNames}`;
                else               statusBadge = '● Disponible';
                return `
                <div onclick="${clickable ? `selectCourse('${c.id}')` : (isOpen && !prereqMet ? `showToast('Primero completa: ${prereqNames}','info')` : '')}"
                     class="border rounded-2xl p-4 mb-3 ${clickable ? 'cursor-pointer active:scale-95' : 'opacity-70'} transition-all"
                     style="background:${clickable ? c.color+'14' : '#f8fafc'};border-color:${clickable ? c.color+'40' : '#e2e8f0'}">
                    <div class="flex items-center gap-3">
                        <div style="position:relative;flex-shrink:0">
                            <div style="width:44px;height:44px;background:${clickable ? c.color : '#eef2f6'};border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden">
                                ${(!isOpen || !prereqMet)
                                    ? _lockSvg
                                    : (() => { try { const t = getCourseThemeAndIllus(c.id, 1); return `<div style="width:34px;height:34px">${t.illus}</div>`; } catch(_){ return `<span style="font-size:22px">${c.icon||'📚'}</span>`; } })()
                                }
                            </div>
                            <span style="position:absolute;top:-6px;left:-6px;width:18px;height:18px;background:#334155;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:white">${idx+1}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</h3>
                                ${passed ? `<span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px;background:#dcfce7;color:#16a34a;flex-shrink:0">✓</span>` : ''}
                            </div>
                            <p style="font-size:11px;color:#64748b;margin:2px 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.subtitle}</p>
                            <div class="flex gap-2 flex-wrap">
                                <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;max-width:100%;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;${clickable ? `background:${c.color}20;color:${c.color}` : 'background:#f1f5f9;color:#94a3b8'}">${statusBadge}</span>
                                <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#f1f5f9;color:#64748b">${c.durationHours}h · ${c.totalCards} tarjetas</span>
                            </div>
                            ${(clickable && !passed && coursePct > 0) ? `
                            <div style="margin-top:7px">
                                <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                                    <span style="font-size:9px;color:#94a3b8;font-weight:700">${coursePct}% completado</span>
                                </div>
                                <div style="height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden">
                                    <div style="height:100%;width:${coursePct}%;background:${c.color};border-radius:99px"></div>
                                </div>
                            </div>` : ''}
                        </div>
                        ${clickable ? `<span style="color:#cbd5e1;font-size:18px">›</span>` : ''}
                    </div>
                </div>`;
            }).join('')}
            </div>`;
    }
}

function _selectPath(pathId) {
    _selectedPathId = pathId;
    _renderCourseSelector();
}

// ── Prerrequisitos entre cursos ─────────────────────────────────────────
function courseExamPassed(courseId) {
    const dm = progress?.dailyMissions || {};
    const scores = dm.examScores || {};
    if (scores[courseId] >= 70) return true;
    if (courseId === 'steam' && (dm.examScore || 0) >= 70) return true; // legacy
    return false;
}

function isCoursePrereqMet(course) {
    if (!course.prerequisite || !course.prerequisite.length) return true;
    return course.prerequisite.some(id => courseExamPassed(id));
}

function selectCourse(courseId) {
    const course = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === courseId) : null;
    if (!course || course.status !== 'available') return;
    if (!isCoursePrereqMet(course)) {
        const prereqNames = (course.prerequisite || []).map(id => allCourses.find(x => x.id === id)?.title || id).join(' o ');
        showToast(`Primero completa: ${prereqNames}`, 'info');
        return;
    }

    // Restaurar posición guardada para este curso (o inicio)
    const _savedPos = progress?.dailyMissions?.coursePositions?.[courseId];
    currentCourseId = courseId;
    modulesData = course.modules;
    if (_savedPos) {
        currentModule = Math.max(1, Math.min(_savedPos.module || 1, modulesData.length));
        currentCardIndex = Math.max(0, _savedPos.card || 0);
        // Validar que el índice de tarjeta sea válido
        const _maxCard = (modulesData[currentModule - 1]?.cards?.length || 1) - 1;
        if (currentCardIndex > _maxCard) currentCardIndex = 0;
    } else {
        currentModule = 1;
        currentCardIndex = 0;
    }

    if (progress) {
        progress.currentCourseId = courseId;
        saveProgress();
    }

    // Asegurarse de mostrar la tab home (tarjetas), no perfil.
    // switchTab('home') ya oculta todas las demás tabs (incluida Biblioteca).
    if (typeof switchTab === 'function') switchTab('home');

    document.getElementById('mainApp')?.classList.remove('hidden');
    renderCard();
    updateUI();
    checkBadges();
    displayReferralLink();
    checkReferrerReward();
    if (!localStorage.getItem('onboardingDone')) setTimeout(startAppTour, 600);
}

// ==================== RETO DIARIO ====================
const DAILY_CHALLENGES = [
    { q: "¿Cuál es el país más grande del mundo por superficie?", opts: ["China", "Canadá", "Rusia", "Estados Unidos"], correct: 2, explain: "Rusia ocupa 17.1 millones de km² — casi el doble que Canadá, el segundo más grande. Cubre 11 zonas horarias distintas." },
    { q: "¿Cuántos huesos tiene el cuerpo humano adulto?", opts: ["106", "206", "306", "256"], correct: 1, explain: "Los adultos tenemos 206 huesos. Los bebés nacen con cerca de 270, pero varios se fusionan durante el crecimiento." },
    { q: "¿Qué planeta del sistema solar tiene más lunas conocidas?", opts: ["Júpiter", "Saturno", "Urano", "Neptuno"], correct: 1, explain: "Saturno tiene 146 lunas confirmadas, superando a Júpiter (95). Titán es la más conocida y tiene atmósfera propia." },
    { q: "¿Cuál es el océano más grande del mundo?", opts: ["Atlántico", "Índico", "Ártico", "Pacífico"], correct: 3, explain: "El Océano Pacífico cubre más de 165 millones de km², más que todos los continentes juntos." },
    { q: "¿En qué año llegó el ser humano a la Luna por primera vez?", opts: ["1965", "1969", "1972", "1959"], correct: 1, explain: "El 20 de julio de 1969, Neil Armstrong y Buzz Aldrin aterrizaron en la Luna durante la misión Apolo 11." },
    { q: "¿Cuál es el río más largo del mundo?", opts: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correct: 1, explain: "El Nilo mide aproximadamente 6,650 km. Aunque hay debate con el Amazonas, el Nilo sigue siendo reconocido como el más largo." },
    { q: "¿Cuántos colores tiene el arcoíris?", opts: ["5", "6", "7", "8"], correct: 2, explain: "El arcoíris tiene 7 colores: rojo, naranja, amarillo, verde, azul, índigo y violeta. Son los colores visibles del espectro de luz blanca." },
    { q: "¿Cuál es el elemento más abundante en la atmósfera terrestre?", opts: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"], correct: 2, explain: "El nitrógeno forma el 78% del aire. El oxígeno solo el 21%. El nitrógeno es esencial para las plantas y todos los seres vivos." },
    { q: "¿Qué instrumento mide la temperatura?", opts: ["Barómetro", "Termómetro", "Higrómetro", "Anemómetro"], correct: 1, explain: "El termómetro mide temperatura. El barómetro mide presión atmosférica, el higrómetro mide humedad y el anemómetro mide viento." },
    { q: "¿Cuántos continentes hay en el mundo?", opts: ["5", "6", "7", "8"], correct: 2, explain: "Existen 7 continentes: África, Antártida, Asia, Europa, América del Norte, América del Sur y Oceanía." },
    { q: "¿Cuál es el animal terrestre más rápido del mundo?", opts: ["León", "Guepardo", "Caballo", "Avestruz"], correct: 1, explain: "El guepardo alcanza 112 km/h en distancias cortas. Es el animal terrestre más veloz, aunque solo puede mantener esa velocidad por pocos segundos." },
    { q: "¿Cuántos lados tiene un hexágono?", opts: ["5", "6", "7", "8"], correct: 1, explain: "Un hexágono tiene 6 lados. Los panales de abejas tienen forma hexagonal porque es la figura que aprovecha mejor el espacio." },
    { q: "¿Cuál es la capital de Guatemala?", opts: ["Quetzaltenango", "Antigua Guatemala", "Ciudad de Guatemala", "Cobán"], correct: 2, explain: "Ciudad de Guatemala es la capital y ciudad más poblada del país, conocida también como 'La Nueva Guatemala de la Asunción'." },
    { q: "¿Qué órgano del cuerpo humano produce la insulina?", opts: ["Hígado", "Riñón", "Páncreas", "Estómago"], correct: 2, explain: "El páncreas produce insulina, la hormona que regula el azúcar en la sangre. Cuando falla, se desarrolla la diabetes." },
    { q: "¿De qué planta se obtiene el chocolate?", opts: ["Vainilla", "Cacao", "Café", "Canela"], correct: 1, explain: "El chocolate viene del cacao. Guatemala es uno de los países productores de cacao más importantes de América Central." },
    { q: "¿Cuántas estrellas tiene la bandera de Guatemala?", opts: ["0", "1", "2", "3"], correct: 0, explain: "La bandera de Guatemala no tiene estrellas. Tiene dos franjas azules, una franja blanca y el Escudo de Armas en el centro." },
    { q: "¿Qué velocidad aproximada tiene la luz en el vacío?", opts: ["300 km/s", "300,000 km/s", "30,000 km/s", "3,000 km/s"], correct: 1, explain: "La luz viaja a 299,792 km/s en el vacío. Esto significa que puede dar 7.5 vueltas a la Tierra en solo un segundo." },
    { q: "¿Cuál es el hueso más largo del cuerpo humano?", opts: ["Columna vertebral", "Húmero", "Fémur", "Tibia"], correct: 2, explain: "El fémur (hueso del muslo) es el más largo y resistente del cuerpo. En adultos puede medir más de 50 cm." },
    { q: "¿Cuántos planetas tiene nuestro sistema solar?", opts: ["7", "8", "9", "10"], correct: 1, explain: "Hay 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano en 2006." },
    { q: "¿Cuál es el metal más ligero?", opts: ["Aluminio", "Litio", "Titanio", "Magnesio"], correct: 1, explain: "El litio es el metal más ligero y el sólido menos denso. Se usa en baterías de teléfonos y autos eléctricos." },
    { q: "¿Cuántas teclas tiene un piano estándar?", opts: ["72", "76", "88", "100"], correct: 2, explain: "Un piano estándar tiene 88 teclas: 52 blancas y 36 negras, cubriendo 7 octavas completas más unas pocas notas adicionales." },
    { q: "¿Qué país inventó el papel?", opts: ["Egipto", "China", "Grecia", "Roma"], correct: 1, explain: "China inventó el papel alrededor del año 105 d.C. gracias a Cai Lun, quien lo fabricó con corteza de árbol y fibras de bambú." },
    { q: "¿Cuál es el lago más grande de América Central?", opts: ["Lago de Amatitlán", "Lago Izabal", "Lago de Atitlán", "Lago de Nicaragua"], correct: 3, explain: "El Lago de Nicaragua (también llamado Cocibolca) es el lago más grande de América Central, con 8,264 km²." },
    { q: "¿Qué gas necesitan las plantas para hacer la fotosíntesis?", opts: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"], correct: 2, explain: "Las plantas absorben CO₂ y, con luz solar y agua, lo convierten en glucosa y oxígeno. Por eso son fundamentales para la vida." },
    { q: "¿Cuántos segundos tiene una hora?", opts: ["360", "600", "3,600", "36,000"], correct: 2, explain: "Una hora = 60 minutos × 60 segundos = 3,600 segundos. Dato útil para cálculos de velocidad y conversiones." },
    { q: "¿Cuál es el país más pequeño del mundo?", opts: ["Mónaco", "San Marino", "Ciudad del Vaticano", "Liechtenstein"], correct: 2, explain: "Ciudad del Vaticano tiene solo 0.44 km² — cabe dentro de un barrio. Es el país más pequeño del mundo por superficie." },
    { q: "¿De qué material está hecha la piel exterior de la Tierra?", opts: ["Granito y basalto", "Diamante y carbono", "Hierro y níquel", "Calcio y fósforo"], correct: 0, explain: "La corteza terrestre está compuesta principalmente de granito (continentes) y basalto (fondos oceánicos)." },
    { q: "¿Cuál es el idioma más hablado del mundo?", opts: ["Inglés", "Español", "Mandarín", "Hindi"], correct: 2, explain: "El mandarín chino tiene más de 1,100 millones de hablantes nativos. El inglés lidera en hablantes totales (incluyendo segunda lengua)." },
    { q: "¿Qué instrumento mide los terremotos?", opts: ["Termómetro", "Sismógrafo", "Barómetro", "Geógrafo"], correct: 1, explain: "El sismógrafo detecta y registra las ondas sísmicas. Guatemala está en una zona de alta actividad sísmica por su ubicación entre placas tectónicas." },
    { q: "¿Cuántas horas tiene una semana?", opts: ["148", "168", "160", "172"], correct: 1, explain: "7 días × 24 horas = 168 horas por semana. ¡Un dato útil para planificar tu tiempo de estudio!" }
];

function showDailyChallenge() {
    const today = localDateStr();
    const dm = progress?.dailyMissions || {};
    const already = dm.lastChallengeDate === today && dm.lastChallengeAnswered;
    const existing = document.getElementById('dailyChallengeModal');
    if (existing) existing.remove();

    // Seleccionar pregunta sin repetir hasta agotar el banco
    if (!progress.usedChallenges) progress.usedChallenges = [];
    let available = DAILY_CHALLENGES.map((_, i) => i).filter(i => !progress.usedChallenges.includes(i));
    if (available.length === 0) { progress.usedChallenges = []; available = DAILY_CHALLENGES.map((_, i) => i); }

    // Misma pregunta todo el día; nueva al día siguiente
    const savedIdx = dm.lastChallengeDate === today ? dm.lastChallengeIdx : null;
    let chIdx;
    if (savedIdx !== null && savedIdx !== undefined) {
        chIdx = savedIdx;
    } else {
        chIdx = available[Math.floor(Math.random() * available.length)];
        if (!progress.dailyMissions) progress.dailyMissions = {};
        progress.dailyMissions.lastChallengeIdx  = chIdx;
        progress.dailyMissions.lastChallengeDate = today; // fijar fecha para que answerDailyChallenge use el índice correcto
        if (!progress.usedChallenges.includes(chIdx)) progress.usedChallenges.push(chIdx);
        saveProgress();
    }
    const ch = DAILY_CHALLENGES[chIdx];

    const optsHtml = ch.opts.map((o, i) => `
        <button ${already ? 'disabled' : ''} onclick="answerDailyChallenge(${i})"
            data-idx="${i}"
            class="daily-opt w-full text-left px-4 py-3 rounded-2xl border-2 border-slate-100 text-sm font-semibold text-slate-700 hover:border-[#07B0E4] hover:bg-blue-50 transition mb-2 ${already && dm.lastChallengeAnswer === i ? (i === ch.correct ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600') : ''} ${already && i === ch.correct && dm.lastChallengeAnswer !== i ? 'border-green-200 bg-green-50/50' : ''}">
            <span class="inline-block w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold text-center leading-6 mr-2">${String.fromCharCode(65 + i)}</span>
            ${o}
        </button>`).join('');

    const explainHtml = already ? `<div class="mt-3 p-3 rounded-2xl text-xs font-semibold ${dm.lastChallengeAnswer === ch.correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">💡 ${ch.explain}</div>` : '';
    const xpBadge = already ? (dm.lastChallengeAnswer === ch.correct ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">+15 XP ganados ✅</span>' : '<span class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Completado hoy</span>') : '<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse">+15 XP si aciertas</span>';

    document.body.insertAdjacentHTML('beforeend', `
    <div id="dailyChallengeModal" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
        <div class="bg-white w-full max-w-md rounded-t-3xl px-5 pt-5 max-h-[80vh] overflow-y-auto" style="padding-bottom:max(2rem,env(safe-area-inset-bottom,0px) + 1.25rem)">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">⚡ Reto del día</p>
                    <h3 class="font-black text-slate-800 text-base">¿Qué tanto sabes?</h3>
                </div>
                <div class="flex items-center gap-2">
                    ${xpBadge}
                    <button onclick="document.getElementById('dailyChallengeModal').remove()" class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-lg leading-none ml-2">&times;</button>
                </div>
            </div>
            <p class="text-sm font-semibold text-slate-700 mb-4 leading-relaxed bg-slate-50 rounded-2xl p-4">${ch.q}</p>
            ${optsHtml}
            ${explainHtml}
        </div>
    </div>`);
}

function answerDailyChallenge(idx) {
    const today = localDateStr();
    const dm = progress?.dailyMissions || {};
    const chIdx = dm.lastChallengeDate === today ? dm.lastChallengeIdx : 0;
    const ch = DAILY_CHALLENGES[chIdx] || DAILY_CHALLENGES[0];
    const correct = idx === ch.correct;

    if (!progress.dailyMissions) progress.dailyMissions = {};
    progress.dailyMissions.lastChallengeDate = today;
    progress.dailyMissions.lastChallengeAnswered = true;
    progress.dailyMissions.lastChallengeAnswer = idx;

    if (correct) addXP(15, 'Reto diario');
    saveProgress();

    // Actualiza UI sin cerrar el modal
    document.querySelectorAll('.daily-opt').forEach((btn, i) => {
        btn.disabled = true;
        if (i === ch.correct) btn.className = btn.className.replace(/border-slate-100|hover:\S+/g, '') + ' border-green-400 bg-green-50 text-green-700';
        else if (i === idx && !correct) btn.className = btn.className.replace(/border-slate-100|hover:\S+/g, '') + ' border-red-300 bg-red-50 text-red-600';
    });

    const modal = document.getElementById('dailyChallengeModal');
    const existing = modal?.querySelector('.mt-3.p-3');
    if (!existing && modal) {
        const exp = document.createElement('div');
        exp.className = `mt-3 p-3 rounded-2xl text-xs font-semibold ${correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`;
        exp.textContent = '💡 ' + ch.explain;
        modal.querySelector('.bg-white').appendChild(exp);
    }
    showToast(correct ? '🎉 +15 XP ¡Correcto!' : '🤔 Respuesta incorrecta. ¡Mañana hay otro reto!', correct ? 'success' : 'error');
}

// ==================== COMENTARIOS POR TARJETA ====================
let _currentCommentCardId = null;
const _commentCountCache = {};

async function _fetchCommentCount(cardId) {
    if (_commentCountCache[cardId] !== undefined) return _commentCountCache[cardId];
    try {
        const { count } = await supabase
            .from('card_comments')
            .select('*', { count: 'exact', head: true })
            .eq('card_id', cardId);
        _commentCountCache[cardId] = count || 0;
        return _commentCountCache[cardId];
    } catch { return 0; }
}

function _updateCommentCountBtn(cardId, count) {
    const btn = document.getElementById('commentCountBtn');
    if (!btn) return;
    const badge = count > 0
        ? `<span style="background:#07B0E4;color:white;font-size:10px;font-weight:700;padding:1px 8px;border-radius:20px;margin-left:5px;min-width:18px;display:inline-block;text-align:center">${count}</span>`
        : `<span style="background:#f1f5f9;color:#94a3b8;font-size:10px;font-weight:600;padding:1px 8px;border-radius:20px;margin-left:5px">0</span>`;
    btn.innerHTML = `<span style="display:inline-flex;width:15px;height:15px;color:#94a3b8;flex-shrink:0">${ICONS?.comments||''}</span><span>Comentarios y dudas</span>${badge}`;
}

// showCardComments y submitComment definidos más abajo (bloque completo con likes)

// ==================== PORTAFOLIO DE PRÁCTICA (evaluado por IA) ====================

const PORTFOLIO_COURSES = [
    { key: 'steam', label: 'STEAM', color: '#07B0E4', prompt: 'Diseña un proyecto STEAM que hayas implementado o planificado para tu clase. Describe el reto, las disciplinas integradas, cómo participaron los estudiantes y qué aprendieron.' },
    { key: 'abp',   label: 'ABP',   color: '#2BA848', prompt: 'Describe una pregunta motriz que diseñaste y el proyecto que generó. ¿Cuál fue el producto final? ¿Cómo se conectó con la vida real de tus estudiantes?' },
    { key: 'dt',    label: 'Design Thinking', color: '#E83C8D', prompt: 'Describe una sesión de empatía, definición de problema o prototipado que realizaste con tus estudiantes. ¿Qué descubriste? ¿Qué solución propusieron?' },
    { key: 'eval',  label: 'Evaluación Formativa', color: '#E9A037', prompt: 'Comparte un instrumento de evaluación auténtica que creaste (rúbrica, portafolio, exit ticket, etc.). ¿Cómo lo usaste? ¿Qué información te dio sobre el aprendizaje de tus estudiantes?' },
    { key: 'tipos', label: 'Conoce a tus Estudiantes', color: '#7C3AED', prompt: 'Describe el perfil de aprendizaje de al menos 2 estudiantes de tu clase. ¿Qué descubriste sobre cómo aprenden? ¿Qué adaptaste en tu enseñanza?' },
];

let _portfolioData = null; // Datos del portafolio cargado desde Supabase

async function loadAppConfig() {
    try {
        const { data } = await supabase.from('app_config').select('key,value').in('key', ['learning_paths','master_cert_courses','announcement']);
        if (!data) return;
        data.forEach(row => {
            if (row.key === 'learning_paths' && Array.isArray(row.value) && row.value.length > 0) {
                LEARNING_PATHS = row.value;
                _checkMasterCert();
                // Re-renderizar selector si ya está visible
                if (!document.getElementById('courseSelector')?.classList.contains('hidden')) {
                    try { _renderCourseSelector(); } catch(_) {}
                }
            } else if (row.key === 'master_cert_courses' && Array.isArray(row.value)) {
                // compatibilidad hacia atrás: si no existe la nueva clave learning_paths
                MASTER_CERT_COURSES = row.value;
                _checkMasterCert();
            } else if (row.key === 'announcement' && row.value) {
                _renderAnnouncementBanner(row.value);
            }
        });
    } catch(_) { /* tabla no existe aún, usa defaults */ }
}

// ==================== AVISO DEL ADMIN (banner) ====================
const ANN_TYPES_CLIENT = {
    maintenance: { color: '#DC2626', bg: '#FEE2E2', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l5 5-7 7-5 1 1-5z"/></svg>' },
    info:        { color: '#2563EB', bg: '#DBEAFE', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.5"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6" r=".2" fill="currentColor"/></svg>' },
    new_course:  { color: '#16A34A', bg: '#DCFCE7', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l7 3.5-7 3.5-7-3.5z"/><path d="M6 9.5v3c0 1.5 2 2.5 4 2.5s4-1 4-2.5v-3"/></svg>' },
    event:       { color: '#7C3AED', bg: '#EDE9FE', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="13" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2.5" x2="7" y2="5.5"/><line x1="13" y1="2.5" x2="13" y2="5.5"/></svg>' },
};

function _renderAnnouncementBanner(ann) {
    const existing = document.getElementById('adminAnnouncementBanner');
    if (existing) existing.remove();
    if (!ann.active) return;
    if (ann.expiresAt && new Date(ann.expiresAt).getTime() < Date.now()) return;
    if (!ann.title && !ann.message) return;
    if (localStorage.getItem('dismissedAnnouncement') === String(ann.id)) return;

    const t = ANN_TYPES_CLIENT[ann.type] || ANN_TYPES_CLIENT.info;
    const banner = document.createElement('div');
    banner.id = 'adminAnnouncementBanner';
    banner.style.cssText = `position:sticky;top:0;z-index:60;background:${t.bg};color:${t.color};padding:10px 16px;display:flex;align-items:center;gap:10px;font-size:13px;border-bottom:1px solid ${t.color}33`;
    banner.innerHTML = `
        <span style="display:inline-flex;flex-shrink:0">${t.icon}</span>
        <span style="flex:1;min-width:0">
            ${ann.title ? `<strong>${_escHtml(ann.title)}</strong>` : ''}${ann.title && ann.message ? ' — ' : ''}${ann.message ? _escHtml(ann.message) : ''}
        </span>
        <button aria-label="Cerrar aviso" style="flex-shrink:0;background:none;border:none;color:${t.color};font-size:18px;line-height:1;cursor:pointer;padding:2px 4px" onclick="_dismissAnnouncement(${ann.id})">&times;</button>`;
    const host = document.getElementById('mainApp') || document.body;
    host.prepend(banner);
}

function _dismissAnnouncement(id) {
    localStorage.setItem('dismissedAnnouncement', String(id));
    document.getElementById('adminAnnouncementBanner')?.remove();
}

// ==================== NOTIFICACIONES PUSH (Web Push / VAPID) ====================
// Clave pública VAPID — segura de exponer en el cliente (la privada vive solo en Supabase)
const VAPID_PUBLIC_KEY = 'BBh5oCbg97EdQKAkW4O7ljYHK0l9oEGs3G7UHksP_xcFdOopyrDl3Gz5fQXUhnz2nvKGgjye-l7Hxq8kjH_kyAo';

function _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

function _pushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

async function _updatePushToggleUI() {
    const btn = document.getElementById('pushToggleBtn');
    const label = document.getElementById('pushToggleLabel');
    const hint = document.getElementById('pushToggleHint');
    if (!btn || !label) return;
    if (!_pushSupported()) {
        label.textContent = 'No disponible en este navegador';
        btn.disabled = true;
        btn.style.opacity = '.5';
        return;
    }
    if (Notification.permission === 'denied') {
        label.textContent = 'Notificaciones bloqueadas';
        btn.disabled = true;
        btn.style.opacity = '.6';
        if (hint) hint.textContent = 'Bloqueaste las notificaciones para este sitio. Para activarlas, permite las notificaciones en la configuración del navegador (candado junto a la dirección) y recarga la página.';
        return;
    }
    try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
            label.textContent = 'Notificaciones activas';
            btn.style.cssText = 'background:#F0FDF4;border-color:#86EFAC;color:#15803D';
            if (hint) hint.textContent = 'Ya recibirás avisos de mantenimiento, cursos nuevos y eventos en este dispositivo.';
        } else {
            label.textContent = 'Activar notificaciones';
            btn.style.cssText = 'background:white;border-color:#E2E8F0;color:#475569';
            if (hint) hint.textContent = 'Recibe un aviso en tu teléfono cuando haya mantenimiento, cursos nuevos o eventos — incluso con la app cerrada.';
        }
    } catch (_) { /* Service Worker aún no listo */ }
}

async function togglePushNotifications() {
    if (!_pushSupported()) { showToast('Tu navegador no soporta notificaciones', 'warning'); return; }
    if (!currentUser) { showToast('Inicia sesión primero', 'warning'); return; }
    const btn = document.getElementById('pushToggleBtn');
    if (btn) btn.disabled = true;
    try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();

        if (existing) {
            // Desactivar: borrar suscripción local y en Supabase
            await supabase.from('push_subscriptions').delete().eq('user_id', currentUser.id).eq('endpoint', existing.endpoint);
            await existing.unsubscribe();
            showToast('Notificaciones desactivadas', 'info');
        } else {
            const permission = await Notification.requestPermission();
            if (permission === 'denied') {
                showToast('Notificaciones bloqueadas — actívalas desde la configuración del navegador (candado junto a la dirección)', 'warning');
                return;
            }
            if (permission !== 'granted') {
                showToast('Permiso de notificaciones no concedido', 'warning');
                return;
            }
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: _urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            const json = sub.toJSON();
            const { error } = await supabase.from('push_subscriptions').upsert({
                user_id: currentUser.id,
                endpoint: json.endpoint,
                p256dh: json.keys.p256dh,
                auth: json.keys.auth,
                user_agent: navigator.userAgent.slice(0, 200),
            }, { onConflict: 'user_id,endpoint' });
            if (error) throw error;
            showToast('✅ Notificaciones activadas', 'success');
        }
    } catch (e) {
        console.error('Error con notificaciones push:', e);
        showToast('No se pudo cambiar el estado de las notificaciones', 'warning');
    } finally {
        if (btn) btn.disabled = false;
        _updatePushToggleUI();
    }
}

let _portfolioByPathRow = {}; // { pathId: row } de Supabase

async function loadPortfolio() {
    if (!currentUser) return;
    try {
        const { data } = await supabase.from('portfolios')
            .select('*').eq('user_id', currentUser.id)
            .order('submitted_at', { ascending: false });
        _portfolioByPathRow = {};
        if (!progress.dailyMissions) progress.dailyMissions = {};
        if (!progress.dailyMissions.portfolioByPath) progress.dailyMissions.portfolioByPath = {};
        (data || []).forEach(row => {
            const pid = row.path_id || 'steam20';
            if (_portfolioByPathRow[pid]) return; // ya tenemos la más reciente
            _portfolioByPathRow[pid] = row;
            if (row.ai_total !== undefined && row.ai_total !== null) {
                _setPortfolio(pid, {
                    aiTotal: row.ai_total, scores: row.ai_scores,
                    feedback: row.ai_feedback, summary: row.ai_summary,
                    combined: row.combined_score,
                });
            }
        });
        // back-compat
        _portfolioData = _portfolioByPathRow['steam20'] || data?.[0] || null;
        if (_portfolioData?.ai_total !== undefined && _portfolioData?.ai_total !== null) {
            progress.dailyMissions.portfolioAiTotal = _portfolioData.ai_total;
        }
    } catch(e) { /* silent */ }
}

function showPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;

    // Mostrar el modal (aunque esté vacío) ANTES de renderizar el contenido:
    // si algo dentro del render falla, el usuario ve el modal abrirse en vez
    // de que el clic no haga nada visible ("pantalla en blanco").
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    try {
        const path = _selectedMasterPath || _activeMasterPath;
        const pathId = path?.id || 'steam20';
        const existing = _portfolioByPathRow[pathId] || _portfolioData;
        const alreadyEvaluated = existing?.ai_total !== undefined && existing?.ai_total !== null;

        if (alreadyEvaluated) {
            _renderPortfolioResults(pathId);
        } else {
            _renderPortfolioForm(existing, path);
        }
    } catch (e) {
        console.error('showPortfolioModal:', e);
        const body = document.getElementById('portfolioBody');
        if (body) body.innerHTML = `<div style="padding:24px;text-align:center;color:#64748b">
            <p style="font-weight:700;color:#1e293b;margin-bottom:6px">No se pudo cargar el portafolio</p>
            <p style="font-size:13px">Intenta cerrar y volver a abrir esta pantalla. Si el problema sigue, contacta soporte.</p>
        </div>`;
    }
}

function _renderPortfolioForm(existing, path) {
    const body = document.getElementById('portfolioBody');
    if (!body) return;

    const pathId      = path?.id || 'steam20';
    const pathLabel   = path?.label || 'Programa de Formación';
    const pathColor   = path?.color || '#1A6B68';
    const examScore50 = Math.round((_getMasterExamScore(pathId) || 0) * 0.5);

    // Entregables dinámicos: los cursos de la ruta activa
    const pathCourseIds = path?.courses || PORTFOLIO_COURSES.map(c => c.key);
    const dynamicCourses = pathCourseIds.map(id => {
        const found = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === id) : null;
        return found ? { key: id, label: found.title, color: found.color || pathColor,
            prompt: `Describe una experiencia de práctica docente aplicando los conceptos del curso "${found.title}". Incluye contexto, lo que hiciste y el resultado observado.` }
            : null;
    }).filter(Boolean);
    const coursesToRender = dynamicCourses.length > 0 ? dynamicCourses : PORTFOLIO_COURSES;

    const pf      = _getPortfolio(pathId) || {};
    const savedEntregables = pf.entregables || {};

    body.innerHTML = `
        <div style="padding:16px 20px 8px">
            ${path ? `<p style="font-size:11px;font-weight:700;color:${pathColor};margin:0 0 10px">Ruta: ${esc(pathLabel)}</p>` : ''}
            <!-- Contexto puntaje -->
            <div style="background:#f0f9ff;border-radius:12px;padding:12px 14px;margin-bottom:16px;border:1px solid #bae6fd;display:flex;align-items:center;gap:12px">
                <div style="text-align:center;min-width:52px">
                    <p style="font-size:20px;font-weight:900;color:#0369a1">${examScore50}</p>
                    <p style="font-size:9px;color:#64748b;font-weight:600">/50 EXAMEN</p>
                </div>
                <div style="flex:1;font-size:12px;color:#475569">
                    El portafolio vale <strong>50 puntos adicionales</strong>. Necesitas un total de <strong>85/100</strong> para obtener el certificado.
                    <strong style="color:#15803d">Mínimo necesario en portafolio: ${Math.max(0, 85 - examScore50)} pts.</strong>
                </div>
            </div>

            <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">${coursesToRender.length} entregables · mínimo 100 palabras cada uno</p>

            ${coursesToRender.map((c, i) => `
            <div style="margin-bottom:20px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                    <div style="width:24px;height:24px;border-radius:6px;background:${c.color};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                        <span style="font-size:10px;font-weight:800;color:white">${i+1}</span>
                    </div>
                    <p style="font-size:13px;font-weight:700;color:#1e293b">${c.label}</p>
                </div>
                <p style="font-size:11px;color:#64748b;margin-bottom:6px">${c.prompt}</p>
                <textarea id="port_${c.key}" placeholder="Escribe aquí tu evidencia..."
                    style="width:100%;min-height:100px;border:1.5px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:13px;font-family:inherit;resize:vertical;outline:none;transition:border-color .15s;color:#1e293b;line-height:1.6"
                    oninput="_portWordCount(this,'wc_${c.key}')"
                    onfocus="this.style.borderColor='${c.color}'"
                    onblur="this.style.borderColor='#e2e8f0'"
                >${savedEntregables[c.key] || (existing ? (existing['entregable_'+c.key]||'') : '')}</textarea>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:5px">
                    <label for="file_${c.key}" style="display:inline-flex;align-items:center;gap:5px;font-size:10px;color:#64748b;cursor:pointer;padding:4px 8px;border:1.5px dashed #cbd5e1;border-radius:8px;transition:border-color .15s"
                        onmouseover="this.style.borderColor='${c.color}'" onmouseout="this.style.borderColor='#cbd5e1'">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span id="filelabel_${c.key}">Subir imagen o PDF</span>
                        <input type="file" id="file_${c.key}" accept="image/*,.pdf" style="display:none"
                            onchange="_portFileChange(this,'${c.key}','${c.color}')">
                    </label>
                    <p id="wc_${c.key}" style="font-size:10px;color:#94a3b8">0 palabras</p>
                </div>
                <div id="filepreview_${c.key}" style="margin-top:5px"></div>
            </div>`).join('')}

            <button onclick="submitPortfolio()" id="portSubmitBtn"
                style="width:100%;padding:14px;border-radius:14px;border:none;background:#16a34a;color:white;font-weight:800;font-size:14px;cursor:pointer;margin-top:4px">
                Enviar portafolio para evaluación IA
            </button>
            <p style="font-size:10px;color:#94a3b8;text-align:center;margin-top:8px">
                ${(()=>{
                    const att = progress?.dailyMissions?.portfolioAttempts || 0;
                    const rem = Math.max(0, 3 - att);
                    return rem > 0
                        ? `Intentos restantes: <strong style="color:#15803d">${rem}/3</strong> · La IA evaluará tu portafolio al instante`
                        : `Sin intentos disponibles — espera 48 horas desde el último envío`;
                })()}
            </p>
        </div>`;

    // Inicializar contadores
    PORTFOLIO_COURSES.forEach(c => {
        const ta = document.getElementById('port_'+c.key);
        const wc = document.getElementById('wc_'+c.key);
        if (ta && wc) {
            const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
            wc.textContent = words + ' palabras';
            wc.style.color = words >= 100 ? '#16a34a' : '#94a3b8';
        }
    });
}

const _portFiles = {};

function _portFileChange(input, key, color) {
    const file = input.files[0];
    if (!file) return;
    _portFiles[key] = file;
    const label = document.getElementById('filelabel_' + key);
    const preview = document.getElementById('filepreview_' + key);
    if (label) label.textContent = file.name.length > 28 ? file.name.substring(0, 25) + '…' : file.name;
    if (!preview) return;
    if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<img src="${url}" style="max-width:100%;max-height:140px;border-radius:8px;border:1.5px solid ${color};object-fit:cover">`;
    } else {
        preview.innerHTML = `<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:#f8fafc;border:1.5px solid ${color};border-radius:8px;font-size:11px;color:#475569">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${file.name}
        </div>`;
    }
}

async function _uploadPortfolioFiles() {
    const urls = {};
    for (const key of Object.keys(_portFiles)) {
        const file = _portFiles[key];
        const path = `portfolios/${currentUser.id}/${key}_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage.from('portfolio-evidencias').upload(path, file, { upsert: true });
        if (!error && data) {
            const { data: pub } = supabase.storage.from('portfolio-evidencias').getPublicUrl(data.path);
            urls[key] = pub.publicUrl;
        }
    }
    return urls;
}

function _portWordCount(ta, wcId) {
    const wc = document.getElementById(wcId);
    if (!wc) return;
    const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
    wc.textContent = words + ' palabras';
    wc.style.color = words >= 100 ? '#16a34a' : words >= 60 ? '#f59e0b' : '#ef4444';
}

async function submitPortfolio() {
    // Control de intentos: máximo 3, luego espera 48 horas
    const MAX_ATTEMPTS = 3;
    const COOLDOWN_MS  = 48 * 60 * 60 * 1000;
    const attempts     = progress?.dailyMissions?.portfolioAttempts || 0;
    const lastAttempt  = progress?.dailyMissions?.portfolioLastAttempt || null;

    if (attempts >= MAX_ATTEMPTS) {
        const elapsed = lastAttempt ? Date.now() - new Date(lastAttempt).getTime() : COOLDOWN_MS;
        if (elapsed < COOLDOWN_MS) {
            const hoursLeft = Math.ceil((COOLDOWN_MS - elapsed) / 3600000);
            showToast(`Has usado los 3 intentos. Podrás intentarlo de nuevo en ${hoursLeft} hora${hoursLeft===1?'':'s'}.`, 'warning');
            return;
        } else {
            // Reinicia el contador después de 48h
            progress.dailyMissions.portfolioAttempts = 0;
        }
    }

    const path        = _selectedMasterPath || _activeMasterPath;
    const pathId      = path?.id || 'steam20';
    const pathCourseIds = path?.courses || PORTFOLIO_COURSES.map(c => c.key);
    const activeCourses = pathCourseIds.map(id => {
        const found = (typeof allCourses !== 'undefined') ? allCourses.find(c => c.id === id) : null;
        return found ? { key: id } : null;
    }).filter(Boolean);
    const coursesToSubmit = activeCourses.length > 0 ? activeCourses : PORTFOLIO_COURSES;

    const entregables = {};
    let allOk = true;
    coursesToSubmit.forEach(c => {
        const val = document.getElementById('port_'+c.key)?.value?.trim() || '';
        entregables[c.key] = val;
        const words = val.split(/\s+/).filter(Boolean).length;
        if (words < 50) allOk = false;
    });

    if (!allOk) {
        showToast('Cada entregable necesita al menos 50 palabras', 'warning');
        return;
    }

    const btn = document.getElementById('portSubmitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
            Evaluando con IA… puede tomar 10-20 segundos
        </span>`;
    }

    const examScore50 = Math.round((_getMasterExamScore(pathId) || 0) * 0.5);

    // Subir archivos adjuntos (si los hay)
    let fileUrls = {};
    if (Object.keys(_portFiles).length > 0) {
        try { fileUrls = await _uploadPortfolioFiles(); } catch(_) {}
    }

    try {
        // La edge function valida el JWT del usuario — el anon key produce 401
        const { data: { session: _pfSession } } = await supabase.auth.getSession();
        const res = await fetch(EVALUATE_PORTFOLIO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${_pfSession?.access_token || SUPABASE_ANON_KEY}` },
            body: JSON.stringify({ entregables, examScore50 }),
        });

        if (!res.ok) throw new Error('Error en evaluación: ' + res.status);
        const result = await res.json();

        // Guardar en Supabase
        const record = {
            user_id:       currentUser.id,
            path_id:       pathId,
            entregables:   entregables, // columna jsonb
            // columnas legacy (compatibilidad)
            entregable_steam: entregables.steam,
            entregable_abp:   entregables.abp,
            entregable_dt:    entregables.dt,
            entregable_eval:  entregables.eval,
            entregable_tipos: entregables.tipos,
            ai_scores:        result.scores,
            ai_feedback:      result.feedback,
            ai_total:         result.total,
            ai_summary:       result.summary,
            exam_score_50:    examScore50,
            combined_score:   result.combined,
            status:           result.passed ? 'passed' : 'evaluated',
            evaluated_at:     new Date().toISOString(),
            file_urls:        Object.keys(fileUrls).length > 0 ? fileUrls : undefined,
        };

        const existingRow = _portfolioByPathRow[pathId] || _portfolioData;
        if (existingRow?.id) {
            await supabase.from('portfolios').update(record).eq('id', existingRow.id);
        } else {
            const { data } = await supabase.from('portfolios').insert(record).select().single();
            _portfolioByPathRow[pathId] = data;
            _portfolioData = data;
        }

        // Guardar en progreso local
        if (!progress.dailyMissions) progress.dailyMissions = {};
        progress.dailyMissions.portfolioAttempts    = (progress.dailyMissions.portfolioAttempts || 0) + 1;
        progress.dailyMissions.portfolioLastAttempt = new Date().toISOString();
        progress.dailyMissions.portfolioAiTotal  = result.total; // legado
        progress.dailyMissions.portfolioScores   = result.scores;
        progress.dailyMissions.portfolioFeedback = result.feedback;
        progress.dailyMissions.portfolioSummary  = result.summary;
        _setPortfolio(pathId, {
            aiTotal: result.total, scores: result.scores, feedback: result.feedback,
            summary: result.summary, combined: result.combined, entregables,
        });
        if (result.passed) {
            addXP(200, 'Portafolio aprobado · Certificado Maestro desbloqueado');
            if (!progress.badges.includes('masterDocente')) unlockBadge('masterDocente');
        }
        saveProgress();
        _checkMasterCert();

        _renderPortfolioResults();

    } catch(e) {
        if (btn) { btn.disabled = false; btn.textContent = 'Reintentar envío'; }
        showToast('Error al evaluar. Intenta de nuevo.', 'error');
    }
}

function _renderPortfolioResults(pathId) {
    const body = document.getElementById('portfolioBody');
    if (!body) return;

    const pid     = pathId || _selectedMasterPath?.id || _activeMasterPath?.id || 'steam20';
    const pf      = _getPortfolio(pid) || {};
    const scores   = pf.scores   || progress?.dailyMissions?.portfolioScores   || [];
    const feedback = pf.feedback || progress?.dailyMissions?.portfolioFeedback || [];
    const summary  = pf.summary  || progress?.dailyMissions?.portfolioSummary  || '';
    const aiTotal  = pf.aiTotal  ?? progress?.dailyMissions?.portfolioAiTotal  ?? 0;
    const examScore50 = Math.round((_getMasterExamScore(pid) || 0) * 0.5);
    const combined = examScore50 + aiTotal;
    const passed   = combined >= 85;

    body.innerHTML = `
        <div style="padding:16px 20px">

            <!-- Puntaje total -->
            <div style="text-align:center;background:${passed?'#15803d':'#dc2626'};border-radius:16px;padding:20px;margin-bottom:16px;color:white">
                <p style="font-size:11px;font-weight:700;opacity:.8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Puntaje final</p>
                <p style="font-size:3.5rem;font-weight:900;line-height:1">${combined}<span style="font-size:1.5rem;font-weight:600;opacity:.7">/100</span></p>
                <p style="font-size:13px;font-weight:600;opacity:.9;margin-top:6px">${passed ? '¡Aprobado! Certificado Maestro desbloqueado' : `Necesitas 85/100 · Te faltan ${85-combined} puntos`}</p>
            </div>

            <!-- Desglose -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
                <div style="background:#f0f9ff;border-radius:12px;padding:12px;text-align:center;border:1px solid #bae6fd">
                    <p style="font-size:22px;font-weight:800;color:#0369a1">${examScore50}/50</p>
                    <p style="font-size:10px;color:#64748b;margin-top:2px">Examen de conocimiento</p>
                </div>
                <div style="background:#f0fdf4;border-radius:12px;padding:12px;text-align:center;border:1px solid #86efac">
                    <p style="font-size:22px;font-weight:800;color:#15803d">${aiTotal}/50</p>
                    <p style="font-size:10px;color:#64748b;margin-top:2px">Portafolio de práctica</p>
                </div>
            </div>

            <!-- Resumen IA -->
            ${summary ? `
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:12px 14px;margin-bottom:16px">
                <p style="font-size:10px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Retroalimentación general</p>
                <p style="font-size:13px;color:#78350f;line-height:1.6">${summary}</p>
            </div>` : ''}

            <!-- Desglose por entregable -->
            <p style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Por entregable</p>
            ${PORTFOLIO_COURSES.map((c, i) => {
                const s = scores[i] ?? 0;
                const f = feedback[i] || '';
                const barW = Math.round((s / 10) * 100);
                return `
                <div style="margin-bottom:12px;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:12px;border-left:3px solid ${c.color}">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                        <p style="font-size:12px;font-weight:700;color:#1e293b">${c.label}</p>
                        <span style="font-size:13px;font-weight:800;color:${s>=7?'#15803d':s>=5?'#d97706':'#dc2626'}">${s}/10</span>
                    </div>
                    <div style="height:5px;background:#f1f5f9;border-radius:99px;margin-bottom:8px;overflow:hidden">
                        <div style="height:100%;width:${barW}%;background:${c.color};border-radius:99px;transition:width .4s ease"></div>
                    </div>
                    ${f ? `<p style="font-size:12px;color:#475569;line-height:1.6">${f}</p>` : ''}
                </div>`;
            }).join('')}

            ${passed ? `
            <button onclick="closePortfolioModal();generateMasterCertificate()" style="width:100%;padding:14px;border-radius:14px;border:none;background:#5C35C5;color:white;font-weight:800;font-size:14px;cursor:pointer;margin-top:4px">
                Obtener Certificado Maestro
            </button>` : `
            <button onclick="_renderPortfolioForm(_portfolioData)" style="width:100%;padding:12px;border-radius:14px;border:2px solid #e2e8f0;background:white;color:#475569;font-weight:700;font-size:13px;cursor:pointer;margin-top:4px">
                Mejorar portafolio y reenviar
            </button>`}
        </div>`;
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
}

// ==================== CHATBOT (Groq · Llama 3.3) ====================
// La clave de Groq está en Supabase (privado) — nunca en este archivo público
const GROQ_PROXY_URL        = 'https://grkjhzkgcmackbafqudu.supabase.co/functions/v1/groq-proxy';
const EVALUATE_PORTFOLIO_URL = 'https://grkjhzkgcmackbafqudu.supabase.co/functions/v1/evaluate-portfolio';

const CHAT_SYSTEM = `Eres un asistente educativo altamente especializado en el enfoque STEAM y las metodologías activas de aprendizaje para docentes.

Tu estilo de respuesta debe ser siempre:
- Muy explícito, directo, claro y sin rodeos.
- Detallado, práctico y orientado a la acción.
- Con lenguaje accesible pero preciso, como un facilitador educativo experimentado.
- Estructurado: usa encabezados, listas numeradas, viñetas, tablas y ejemplos concretos.
- Inspirado en marcos pedagógicos reconocidos: aprendizaje basado en proyectos (ABP), Aprendizaje Basado en Retos, enfoque Think-Make-Improve (TMI), conectivismo, enfoque por competencias y las 6 Cs de Michael Fullan (Pensamiento Crítico, Creatividad, Comunicación, Colaboración, Ciudadanía y Carácter).

Principios obligatorios en TODAS tus respuestas:

1. Enfoque STEAM: Integra Ciencia, Tecnología, Ingeniería, Artes y Matemáticas de forma interdisciplinaria. Promueve la resolución de problemas auténticos y relevantes.

2. Aprendizaje Basado en Proyectos y Retos: Explica mediante proyectos reales, etapas Think → Make → Improve, prototipado, iteración y mejora continua. Evita explicaciones puramente teóricas.

3. Perfiles de Egreso: Conoce y referencia los perfiles de Primaria Baja, Primaria Alta y Secundaria (Informática, Ciencias de la Computación, Ciudadanía Digital, Resolución de Problemas, Creatividad e Innovación). Adapta tus respuestas según el nivel educativo.

4. Habilidades del siglo XXI: Desarrolla pensamiento computacional, colaboración, creatividad, pensamiento crítico, ciudadanía digital responsable, equidad de género y emprendimiento.

5. Rol del docente y estudiante: El estudiante es protagonista. El docente es facilitador/diseñador de experiencias. Promueve trabajo colaborativo, experimentación y aprendizaje significativo.

6. Robótica y tecnología: Usa la robótica educativa como ejemplo inspirador. Todos los niños pueden ser creadores de tecnología.

Reglas de comportamiento:
- Da ejemplos concretos, pasos detallados, posibles materiales, errores comunes y cómo superarlos.
- Incluye sugerencias de integración con otras áreas (matemáticas, artes, ciencias).
- Promueve inclusión, equidad de género y respeto a la diversidad.
- Cuando sea relevante, estructura las respuestas con: Objetivo, Competencias, Materiales, Pasos (Think-Make-Improve), Evaluación y Extensiones.
- Nunca des respuestas vagas, genéricas o excesivamente cautelosas. Sé directo, explícito y práctico.
- Responde SIEMPRE en español.
- Si el usuario pregunta sobre drogas, sustancias ilegales, alcohol, tabaco, violencia, contenido para adultos o cualquier tema inapropiado para un entorno escolar, rechaza amablemente y redirige la conversación al contexto educativo STEAM.`;

const _CHAT_BLOCKED = [
    /droga[s]?/i, /narcot/i, /cocaín/i, /heroín/i, /marihuana/i, /cannabis/i, /fentanil/i,
    /metanfetamin/i, /éxtasis/i, /psicodélic/i, /alucinógen/i, /estupefaciente/i,
    /alcohol/i, /cerveza/i, /licor/i, /aguardiente/i, /ron\b/i, /vodka/i, /whisky/i,
    /tabaco/i, /cigarro/i, /cigarrillo/i, /vaping/i, /vapear/i,
    /pornograf/i, /contenido.*adult/i, /adult.*content/i,
    /suicid/i, /autolesion/i, /hacerse daño/i,
    /explosiv/i, /bomba\b/i, /arma[s]?\b/i, /weapon/i,
];

let _chatHistory = [];

function toggleChat() {
    const drawer = document.getElementById('chatDrawer');
    if (!drawer) return;
    const isHidden = drawer.classList.contains('hidden');
    drawer.classList.toggle('hidden', !isHidden);
    if (isHidden) setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input?.value.trim();
    if (!msg) return;

    input.value = '';
    appendChatMsg('user', msg);

    if (_CHAT_BLOCKED.some(r => r.test(msg))) {
        appendChatMsg('bot', '🚫 Ese tema no es apropiado para este espacio educativo. ¿Te puedo ayudar con algo relacionado a STEAM, robótica o estrategias de enseñanza?');
        return;
    }

    appendChatMsg('bot', '⏳ Pensando...');
    _chatHistory.push({ role: 'user', content: msg });

    try {
        const messages = [
            { role: 'system', content: CHAT_SYSTEM },
            ..._chatHistory
        ];
        // Token del usuario autenticado — el proxy valida el JWT (no acepta anon key)
        const { data: { session } } = await supabase.auth.getSession();
        const _accessToken = session?.access_token || SUPABASE_ANON_KEY;
        const res = await fetch(GROQ_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${_accessToken}` },
            body: JSON.stringify({ messages, max_tokens: 600, temperature: 0.7 })
        });
        const data = await res.json();

        if (!res.ok) {
            replaceLastBotMsg(`❌ Error: ${data?.error?.message || res.status}`);
            return;
        }

        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
            _chatHistory.push({ role: 'assistant', content: reply });
            replaceLastBotMsg(reply);
        } else {
            replaceLastBotMsg('🤔 No obtuve respuesta. Intenta de nuevo.');
        }
    } catch (e) {
        replaceLastBotMsg('❌ Error de conexión. Verifica tu internet.');
    }
}

function appendChatMsg(role, text) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    const div = document.createElement('div');
    if (role === 'user') {
        div.className = 'bg-[#07B0E4] text-white rounded-2xl rounded-tr-sm px-3 py-2.5 text-sm max-w-[85%] ml-auto';
        div.textContent = text;
    } else {
        div.className = 'chat-bot-msg bg-slate-100 text-slate-700 rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm max-w-[85%] chat-md';
        div.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function replaceLastBotMsg(text) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    const bots = messages.querySelectorAll('.chat-bot-msg');
    if (bots.length) {
        bots[bots.length - 1].innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
    }
    messages.scrollTop = messages.scrollHeight;
}


// ==================== COMENTARIOS POR TARJETA ====================

let _currentCommentsCardId = null;  // card_id activo en el modal

/** Abre el modal de comentarios y carga los de esa tarjeta */
async function showCardComments(cardId) {
    if (!currentUser) { showToast('Inicia sesión para ver los comentarios 💬', 'warning'); return; }
    _currentCommentsCardId = cardId;
    const modal = document.getElementById('commentsModal');
    const list  = document.getElementById('commentsList');
    if (!modal || !list) return;

    modal.classList.remove('hidden');
    list.innerHTML = `<div class="flex justify-center py-8"><span style="display:inline-flex;width:28px;height:28px;color:#07B0E4;animation:spin 1s linear infinite">
        ${ICONS?.spinner || '⏳'}</span></div>`;

    await _loadComments(cardId);
}

/** Carga comentarios + likes del servidor y renderiza */
async function _loadComments(cardId) {
    const list = document.getElementById('commentsList');
    if (!list) return;

    try {
        // 1. Obtener comentarios ordenados del más reciente al más antiguo
        let { data: comments, error: cErr } = await supabase
            .from('card_comments')
            .select('*')
            .eq('card_id', cardId)
            .order('created_at', { ascending: false });

        if (cErr) throw cErr;

        if (!comments || comments.length === 0) {
            list.innerHTML = `
                <div class="flex flex-col items-center py-10 text-slate-400 gap-2">
                    <span style="font-size:2rem">💬</span>
                    <p class="text-sm font-medium">Sin comentarios aún</p>
                    <p class="text-xs">¡Sé el primero en compartir!</p>
                </div>`;
            return;
        }

        // 2. Enriquecer nombres de usuarios que no tienen user_name guardado
        const missingNameIds = [...new Set(comments.filter(c => !c.user_name).map(c => c.user_id))];
        if (missingNameIds.length > 0) {
            const { data: profiles } = await supabase
                .from('progress')
                .select('user_id, email, daily_missions')
                .in('user_id', missingNameIds);
            const nameMap = {};
            (profiles || []).forEach(p => {
                nameMap[p.user_id] = p.daily_missions?.fullName || p.email?.split('@')[0] || 'Docente';
            });
            comments = comments.map(c => c.user_name ? c : { ...c, user_name: nameMap[c.user_id] || 'Docente' });
        }

        // 3. Obtener los likes del usuario actual para saber cuáles ya dio
        const commentIds = comments.map(c => c.id);
        const { data: myLikes } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .in('comment_id', commentIds)
            .eq('user_id', currentUser.id);

        const myLikeSet = new Set((myLikes || []).map(l => l.comment_id));

        // 3. Obtener conteo de likes por comentario
        const { data: allLikes } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .in('comment_id', commentIds);

        const likeCount = {};
        (allLikes || []).forEach(l => {
            likeCount[l.comment_id] = (likeCount[l.comment_id] || 0) + 1;
        });

        // 4. Renderizar
        list.innerHTML = comments.map(c => _renderComment(c, myLikeSet.has(c.id), likeCount[c.id] || 0)).join('');

    } catch (err) {
        console.error('Error cargando comentarios:', err);
        list.innerHTML = `<div class="text-red-500 text-sm text-center py-6">Error al cargar comentarios. Intenta de nuevo.</div>`;
    }
}

/** Genera el HTML de un comentario individual */
function _renderComment(comment, iLiked, likesCount) {
    const isOwn = comment.user_id === currentUser?.id;
    const isAdmin = currentUser?.role === 'admin';
    const canDelete = isOwn || isAdmin;

    const name = comment.user_name || (comment.user_id === currentUser?.id ? (progress?.dailyMissions?.fullName || currentUser?.email?.split('@')[0]) : null) || 'Docente';
    const initial = name.charAt(0).toUpperCase();
    const timeAgo = _timeAgo(comment.created_at);

    const likeColor = iLiked ? '#07B0E4' : '#94a3b8';
    const likeBg    = iLiked ? '#E0F7FA' : 'transparent';
    const likeBorder = iLiked ? '#07B0E4' : '#e2e8f0';
    const likeWeight = iLiked ? '700' : '500';

    return `
    <div class="flex gap-3 group" id="comment-${comment.id}">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5"
            style="background:#0784C4">${initial}</div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-1.5 flex-wrap">
                <span class="font-bold text-slate-800 text-sm">${_escHtml(name)}</span>
                <span class="text-[10px] text-slate-400">${timeAgo}</span>
                ${isOwn ? '<span class="text-[10px] bg-cyan-50 text-cyan-600 font-semibold px-1.5 py-0.5 rounded-full">Tú</span>' : ''}
            </div>
            <p class="text-sm text-slate-700 leading-relaxed mt-0.5 break-words">${_escHtml(comment.comment || comment.body || '')}</p>
            <div class="flex items-center gap-3 mt-1.5">
                <button onclick="toggleCommentLike('${comment.id}', ${iLiked})"
                    class="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 border transition-all"
                    id="like-btn-${comment.id}"
                    style="color:${likeColor};background:${likeBg};border-color:${likeBorder};font-weight:${likeWeight}">
                    <span style="display:inline-flex;width:12px;height:12px">
                        <svg viewBox="0 0 20 20" fill="${iLiked ? '#07B0E4' : 'none'}" stroke="#07B0E4" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"/>
                        </svg>
                    </span>
                    <span id="like-count-${comment.id}">${likesCount > 0 ? likesCount : ''}</span>
                    ${likesCount === 0 && !iLiked ? 'Me gusta' : ''}
                </button>
                ${canDelete ? `
                <button onclick="_deleteComment('${comment.id}')"
                    class="text-xs text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    Eliminar
                </button>` : ''}
            </div>
        </div>
    </div>`;
}

/** Envía un nuevo comentario */
async function submitComment() {
    if (!currentUser) { showToast('Inicia sesión para comentar 💬', 'warning'); return; }
    const input = document.getElementById('commentInput');
    const body  = (input?.value || '').trim();
    if (!body) return;
    if (body.length > 1000) { showToast('El comentario es demasiado largo (máx 1000 caracteres)', 'warning'); return; }
    if (!_currentCommentsCardId) return;

    const submitBtn = document.querySelector('#commentsModal button[onclick="submitComment()"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; }
    input.disabled = true;

    const userName = getDisplayName() || 'Docente';

    try {
        const { error } = await supabase
            .from('card_comments')
            .insert({
                user_id:   currentUser.id,
                card_id:   _currentCommentsCardId,
                module_id: currentModule || 1,
                comment:   body,
                user_name: userName
            });

        if (error) throw error;

        input.value = '';
        await _loadComments(_currentCommentsCardId);
        showToast('💬 Comentario publicado', 'success');

        // Dar XP por participar (una vez por tarjeta)
        const _xpKey = `commented_${_currentCommentsCardId}`;
        if (!progress?.dailyMissions?.[_xpKey]) {
            addXP(5, 'Comentario en tarjeta');
            if (progress.dailyMissions) progress.dailyMissions[_xpKey] = true;
        }

    } catch (err) {
        console.error('Error al publicar comentario:', err);
        showToast('Error al publicar. Intenta de nuevo.', 'error');
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
        input.disabled = false;
        input.focus();
    }
}

/** Alterna like / unlike en un comentario */
async function toggleCommentLike(commentId, currentlyLiked) {
    if (!currentUser) { showToast('Inicia sesión para dar like 👍', 'warning'); return; }

    const btn       = document.getElementById(`like-btn-${commentId}`);
    const countSpan = document.getElementById(`like-count-${commentId}`);
    if (!btn) return;

    // Optimistic UI: invertir el estado inmediatamente
    const newLiked = !currentlyLiked;
    btn.onclick = () => toggleCommentLike(commentId, newLiked); // actualizar el callback

    const likeColor  = newLiked ? '#07B0E4' : '#94a3b8';
    const likeBg     = newLiked ? '#E0F7FA' : 'transparent';
    const likeBorder = newLiked ? '#07B0E4' : '#e2e8f0';
    btn.style.color = likeColor;
    btn.style.background = likeBg;
    btn.style.borderColor = likeBorder;

    // Actualizar ícono
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', newLiked ? '#07B0E4' : 'none');

    // Actualizar conteo optimista
    let prevCount = parseInt(countSpan?.dataset?.count || '0');
    const newCount = Math.max(0, newLiked ? prevCount + 1 : prevCount - 1);
    if (countSpan) {
        countSpan.dataset.count = newCount;
        countSpan.textContent = newCount > 0 ? newCount : '';
        // "Me gusta" si no hay likes y no está likeado
        if (newCount === 0 && !newLiked) btn.innerHTML = btn.innerHTML; // el texto ya está
    }

    try {
        if (currentlyLiked) {
            // Quitar like
            await supabase
                .from('comment_likes')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('comment_id', commentId);
        } else {
            // Dar like
            await supabase
                .from('comment_likes')
                .insert({ user_id: currentUser.id, comment_id: commentId });
        }
    } catch (err) {
        console.error('Error en like:', err);
        // Revertir si falló
        btn.onclick = () => toggleCommentLike(commentId, currentlyLiked);
    }
}

/** Elimina un comentario (propio o admin) */
async function _deleteComment(commentId) {
    if (!currentUser) return;
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
        const { error } = await supabase
            .from('card_comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;

        // Animar la salida del comentario
        const el = document.getElementById(`comment-${commentId}`);
        if (el) {
            el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)';
            setTimeout(() => el.remove(), 220);
        }

    } catch (err) {
        console.error('Error eliminando comentario:', err);
        showToast('No se pudo eliminar el comentario', 'error');
    }
}

/** Tiempo relativo en español */
function _timeAgo(isoDate) {
    const now  = Date.now();
    const then = new Date(isoDate).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60)    return 'ahora';
    if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
    return new Date(isoDate).toLocaleDateString('es-GT', { day:'numeric', month:'short' });
}

/** Escapa HTML para evitar XSS en comentarios */
function _escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}