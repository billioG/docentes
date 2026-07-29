// ==================== EXAMEN DIAGNÓSTICO ====================
// Based on CNB Guatemala, UNESCO Education Framework, ISTE Standards

const DIAG_DOMAINS = {
    steam: { label: 'Educación STEAM', color: '#1A6B68', icon: '🔬' },
    abp:   { label: 'Aprendizaje Basado en Proyectos', color: '#2563EB', icon: '📋' },
    dt:    { label: 'Design Thinking', color: '#E83C8D', icon: '💡' },
    eval:  { label: 'Evaluación Auténtica', color: '#E9A037', icon: '📊' },
    tipos: { label: 'Conoce a Quien Enseñas', color: '#7C3AED', icon: '👥' },
    creatividad: { label: 'Creatividad en el Aula', color: '#E83C8D', icon: '🎨' },
    tecnologia:  { label: 'Herramientas Tecnológicas', color: '#7C3AED', icon: '💻' },
    metodologias:{ label: 'Metodologías Activas', color: '#F59E0B', icon: '⚡' }
};

const DIAG_QUESTIONS = [
    // ── STEAM ──────────────────────────────────────────────────────────────
    {
        id: 'dq1', domain: 'steam',
        text: '¿Qué significa la "A" en STEAM?',
        options: ['Arquitectura', 'Artes (creatividad y diseño)', 'Astronomía', 'Algoritmos'],
        correct: 1,
        explanation: 'La "A" representa Artes, que incluye diseño, creatividad y expresión visual. Sin ella sería solo STEM.'
    },
    {
        id: 'dq2', domain: 'steam',
        text: '¿Cuál es la principal diferencia entre un enfoque STEAM y una clase tradicional por asignaturas?',
        options: ['STEAM usa tecnología cara', 'STEAM integra disciplinas para resolver problemas reales con propósito', 'STEAM elimina los exámenes', 'STEAM solo aplica en ciencias'],
        correct: 1,
        explanation: 'STEAM integra ciencia, tecnología, ingeniería, artes y matemáticas alrededor de un problema o proyecto real.'
    },
    {
        id: 'dq3', domain: 'steam',
        text: '¿Qué tipo de evaluación se aplica ANTES de iniciar un tema para conocer los saberes previos de los estudiantes?',
        options: ['Sumativa', 'Formativa', 'Diagnóstica', 'Cuantitativa'],
        correct: 2,
        explanation: 'La evaluación diagnóstica ocurre al inicio para conocer desde dónde partir. Es la base de una enseñanza ajustada.'
    },
    {
        id: 'dq4', domain: 'steam',
        text: 'Un docente STEAM frente al error de un estudiante debería:',
        options: ['Penalizarlo con nota baja para motivar', 'Ignorarlo para no desmotivar', 'Convertirlo en oportunidad de aprendizaje', 'Corregirlo inmediatamente ante el grupo'],
        correct: 2,
        explanation: 'En STEAM el error es datos, no fracaso. "¿Qué aprendiste de lo que no funcionó?" es la pregunta correcta.'
    },
    // ── ABP ────────────────────────────────────────────────────────────────
    {
        id: 'dq5', domain: 'abp',
        text: '¿Cuál es el punto de partida de un proyecto ABP (Aprendizaje Basado en Proyectos)?',
        options: ['Un capítulo del libro de texto', 'Una Pregunta Guía auténtica conectada a un problema real', 'El examen del período anterior', 'Una lista de actividades diseñada por el docente'],
        correct: 1,
        explanation: 'El ABP comienza con una Pregunta Guía que genera curiosidad y conecta con un problema real y significativo.'
    },
    {
        id: 'dq6', domain: 'abp',
        text: '¿Cuál es el rol del docente durante la fase de creación en ABP?',
        options: ['Dar instrucciones detalladas paso a paso', 'Observar, hacer preguntas guía y apoyar sin quitar la agencia', 'Hacer el trabajo junto con los estudiantes', 'Calificar solamente el producto final'],
        correct: 1,
        explanation: 'El docente en ABP es facilitador: circula, hace preguntas estratégicas y apoya sin resolver por los estudiantes.'
    },
    {
        id: 'dq7', domain: 'abp',
        text: '¿Por qué presentar el proyecto a una audiencia real es importante en ABP?',
        options: ['Para cumplir un requisito administrativo', 'Para calificar más fácilmente', 'Porque eleva la calidad y autentica el propósito del aprendizaje', 'Para que los padres vean el trabajo'],
        correct: 2,
        explanation: 'Presentar a audiencia real transforma la motivación: los estudiantes trabajan para impactar personas reales, no solo sacar nota.'
    },
    {
        id: 'dq8', domain: 'abp',
        text: '¿Cuándo deben conocer los estudiantes los criterios de evaluación de un proyecto ABP?',
        options: ['Al recibir la nota final', 'Al inicio, antes de comenzar a trabajar', 'A la mitad del proceso', 'No es necesario que los conozcan'],
        correct: 1,
        explanation: 'Los criterios al inicio sirven de guía de calidad durante el proceso, no solo de veredicto al calificar.'
    },
    // ── DESIGN THINKING ────────────────────────────────────────────────────
    {
        id: 'dq9', domain: 'dt',
        text: '¿Cuáles son las 5 fases del Design Thinking en orden?',
        options: ['Planificar, Diseñar, Construir, Probar, Entregar', 'Empatizar, Definir, Idear, Prototipar, Evaluar', 'Observar, Analizar, Proponer, Implementar, Calificar', 'Investigar, Diseñar, Hacer, Presentar, Calificar'],
        correct: 1,
        explanation: 'Empatizar → Definir → Idear → Prototipar → Evaluar. Son iterativas: puedes regresar a cualquier fase según lo que descubres.'
    },
    {
        id: 'dq10', domain: 'dt',
        text: '¿Qué es un prototipo en Design Thinking?',
        options: ['El producto final perfecto y terminado', 'Una versión rápida y barata de una idea para aprender de ella', 'Un modelo a escala exacta del producto', 'Solo aplica a productos físicos, no a prácticas educativas'],
        correct: 1,
        explanation: 'Un prototipo es para aprender, no para impresionar. Debe ser rápido, barato y descartable si no funciona.'
    },
    {
        id: 'dq11', domain: 'dt',
        text: '¿Cuál es la regla más importante durante la fase de ideación en Design Thinking?',
        options: ['Solo proponer ideas que seguramente funcionarán', 'Aplazar el juicio: generar cantidad antes que calidad', 'El docente elige las ideas a desarrollar', 'Buscar la idea más lógica y racional'],
        correct: 1,
        explanation: 'Aplazar el juicio durante la ideación permite que emerjan ideas creativas que de otro modo serían silenciadas prematuramente.'
    },
    {
        id: 'dq12', domain: 'dt',
        text: 'Después de probar un prototipo que no funcionó, ¿qué haces en Design Thinking?',
        options: ['Abandonar la idea completamente', 'Extraer el aprendizaje específico del fracaso y mejorar la siguiente versión', 'Continuar implementándolo porque ya invertiste tiempo', 'Volver al inicio sin usar lo aprendido'],
        correct: 1,
        explanation: 'En DT, el fracaso es información valiosa. Lo que no funcionó te dice exactamente qué mejorar en la siguiente iteración.'
    },
    // ── EVALUACIÓN ─────────────────────────────────────────────────────────
    {
        id: 'dq13', domain: 'eval',
        text: '¿Cuáles son los tres tipos de evaluación y cuándo se aplica cada uno?',
        options: ['Fácil, medio, difícil — al inicio, mitad y final', 'Diagnóstica (inicio), formativa (durante) y sumativa (final)', 'Oral, escrita y práctica — en distintos períodos', 'Individual, grupal y de proyecto — según el tema'],
        correct: 1,
        explanation: 'Diagnóstica al inicio (¿qué saben?), formativa durante el proceso (¿cómo van?) y sumativa al final (¿qué lograron?).'
    },
    {
        id: 'dq14', domain: 'eval',
        text: '¿Qué es una rúbrica?',
        options: ['Una lista de temas del período', 'Una tabla que describe niveles de desempeño para distintos criterios de evaluación', 'El promedio de calificaciones del grupo', 'Un tipo de examen de opción múltiple'],
        correct: 1,
        explanation: 'La rúbrica es el mapa de calidad: describe qué se ve en distintos niveles de desempeño para cada criterio evaluado.'
    },
    {
        id: 'dq15', domain: 'eval',
        text: '¿Por qué la evaluación formativa es pedagógicamente la más poderosa?',
        options: ['Porque vale más en la nota final', 'Porque ocurre durante el proceso y permite corregir el rumbo cuando aún hay tiempo', 'Porque es la más fácil de aplicar', 'Porque los padres la prefieren'],
        correct: 1,
        explanation: 'La evaluación formativa retroalimenta cuando todavía se puede mejorar. La sumativa solo constata lo que ya ocurrió.'
    },
    {
        id: 'dq16', domain: 'eval',
        text: '¿Qué hace diferente a un portafolio de aprendizaje de simplemente guardar trabajos en una carpeta?',
        options: ['Usa fundas plásticas de colores', 'La selección deliberada y la reflexión del estudiante sobre su propio crecimiento', 'El docente elige qué incluir', 'Solo incluye los trabajos perfectos'],
        correct: 1,
        explanation: 'La selección con propósito y la reflexión del estudiante convierten una carpeta en un portafolio de aprendizaje.'
    },
    // ── TIPOS DE ESTUDIANTES ───────────────────────────────────────────────
    {
        id: 'dq17', domain: 'tipos',
        text: '¿Qué describe el Efecto Pigmalión en educación?',
        options: ['Los estudiantes imitan al docente favorito', 'Las expectativas del docente tienden a convertirse en profecías autocumplidas', 'Los estudiantes brillantes siempre destacan sin importar el contexto', 'Un método de evaluación basado en observación continua'],
        correct: 1,
        explanation: 'Las expectativas altas del docente tienden a producir más logro; las bajas, menos logro — independiente del "nivel" inicial del estudiante.'
    },
    {
        id: 'dq18', domain: 'tipos',
        text: '¿Qué es el Diseño Universal para el Aprendizaje (DUA)?',
        options: ['Diseñar aulas físicamente accesibles para sillas de ruedas', 'Un enfoque que diseña experiencias accesibles para la mayor diversidad posible desde el inicio', 'Un programa de computadora para crear materiales educativos', 'Adaptar la planificación solo para estudiantes con discapacidad certificada'],
        correct: 1,
        explanation: 'El DUA propone diseñar para la diversidad desde el principio con múltiples formas de representación, acción y compromiso.'
    },
    {
        id: 'dq19', domain: 'tipos',
        text: '¿Qué diferencia a la motivación intrínseca de la extrínseca?',
        options: ['La intrínseca dura más y viene del interés genuino; la extrínseca depende de recompensas o castigos externos', 'La extrínseca siempre es negativa y debe evitarse completamente', 'La intrínseca solo funciona con estudiantes con alto rendimiento', 'No hay diferencia práctica real en el aula'],
        correct: 0,
        explanation: 'La motivación intrínseca nace del interés o propósito personal. Construye aprendizaje más duradero que la extrínseca.'
    },
    {
        id: 'dq20', domain: 'tipos',
        text: '¿Qué es la diferenciación en la enseñanza?',
        options: ['Dar trabajo más fácil a los estudiantes con dificultades', 'Ajustar contenido, proceso o evaluación para que todos accedan al mismo aprendizaje de calidad por distintas rutas', 'Crear un plan de estudios individual para cada estudiante', 'Separar al grupo en subgrupos fijos por nivel de rendimiento'],
        correct: 1,
        explanation: 'Diferenciación no es reducir el nivel — es abrir múltiples rutas hacia el mismo aprendizaje de calidad. Mismo destino, distintos caminos.'
    },
    // ── Creatividad en el Aula ───────────────────────────────────────────────
    {
        id: 'dq21', domain: 'creatividad',
        text: '¿Qué caracteriza al pensamiento divergente, base de la creatividad?',
        options: ['Buscar la única respuesta correcta lo más rápido posible', 'Generar muchas ideas y posibilidades distintas a partir de un mismo punto', 'Memorizar procedimientos establecidos', 'Evitar el error a toda costa'],
        correct: 1,
        explanation: 'El pensamiento divergente abre posibilidades: muchas ideas, variadas y originales. El convergente luego selecciona y afina.'
    },
    {
        id: 'dq22', domain: 'creatividad',
        text: 'En un aula creativa, ¿cuál es la actitud más adecuada del docente ante una idea "rara" de un estudiante?',
        options: ['Descartarla por poco realista', 'Acogerla con curiosidad y preguntar cómo la desarrollaría', 'Corregirla de inmediato', 'Compararla con la del mejor estudiante'],
        correct: 1,
        explanation: 'Un clima seguro para el error y la curiosidad es la condición número uno para que florezca la creatividad.'
    },
    {
        id: 'dq23', domain: 'creatividad',
        text: '¿Para qué sirve la técnica SCAMPER?',
        options: ['Para calificar proyectos artísticos', 'Para disparar ideas modificando algo existente (Sustituir, Combinar, Adaptar...)', 'Para ordenar la fila del recreo', 'Para medir la inteligencia'],
        correct: 1,
        explanation: 'SCAMPER es un set de preguntas para transformar una idea u objeto existente y generar soluciones nuevas.'
    },
    // ── Herramientas Tecnológicas ────────────────────────────────────────────
    {
        id: 'dq24', domain: 'tecnologia',
        text: 'Según el modelo SAMR, ¿qué nivel representa usar tecnología para una tarea antes imposible sin ella?',
        options: ['Sustitución', 'Aumento', 'Modificación', 'Redefinición'],
        correct: 3,
        explanation: 'Redefinición es el nivel más alto: la tecnología permite tareas pedagógicas que antes eran inconcebibles.'
    },
    {
        id: 'dq25', domain: 'tecnologia',
        text: 'Antes de elegir una herramienta digital para tu clase, lo primero que debes definir es:',
        options: ['Si es la app de moda', 'El objetivo pedagógico que quieres lograr', 'Si tiene muchos colores', 'Cuántos seguidores tiene en redes'],
        correct: 1,
        explanation: 'La tecnología es un medio, no un fin. Primero el objetivo de aprendizaje; luego la herramienta que mejor lo sirve.'
    },
    {
        id: 'dq26', domain: 'tecnologia',
        text: '¿Qué es la ciudadanía digital que debemos enseñar a los estudiantes?',
        options: ['Usar internet solo para tareas', 'El uso seguro, ético y responsable de la tecnología', 'Tener muchos dispositivos', 'Programar videojuegos'],
        correct: 1,
        explanation: 'Ciudadanía digital es comportarse de forma segura, respetuosa y responsable en los entornos digitales.'
    },
    // ── Metodologías Activas ─────────────────────────────────────────────────
    {
        id: 'dq27', domain: 'metodologias',
        text: 'En el modelo de Aula Invertida (Flipped Classroom), ¿qué ocurre normalmente en casa?',
        options: ['Los exámenes', 'El primer contacto con el contenido (ej. ver un video)', 'Las actividades prácticas en grupo', 'Nada, todo es en clase'],
        correct: 1,
        explanation: 'En el aula invertida el estudiante accede al contenido en casa y el tiempo de clase se usa para practicar y resolver dudas.'
    },
    {
        id: 'dq28', domain: 'metodologias',
        text: 'El micro-learning se apoya en combatir un fenómeno descrito por Ebbinghaus. ¿Cuál?',
        options: ['La curva del olvido', 'La ley de la gravedad', 'El efecto invernadero', 'La pirámide de Maslow'],
        correct: 0,
        explanation: 'La curva del olvido muestra que olvidamos rápido lo aprendido; las cápsulas breves y la repetición espaciada ayudan a retener.'
    },
    {
        id: 'dq29', domain: 'metodologias',
        text: '¿Cuál es una ventaja del mobile learning (m-learning) en el contexto guatemalteco?',
        options: ['Exige computadoras de última generación', 'Aprovecha el celular, el dispositivo más accesible en muchos hogares', 'Solo funciona con internet de fibra óptica', 'Reemplaza por completo al docente'],
        correct: 1,
        explanation: 'En muchas comunidades el celular es el único dispositivo con conexión; el m-learning lo convierte en herramienta de aprendizaje.'
    }
];

// Semaphore levels — CNB Guatemala + UNESCO + ISTE reference framework
const DIAG_LEVELS = [
    {
        min: 0,  max: 49,
        key: 'inicial', label: 'Nivel Inicial', emoji: '🔴',
        color: '#DC2626', bg: '#FEF2F2',
        desc: 'Los cursos te brindarán las bases conceptuales y prácticas para transformar tu aula. Es el momento ideal para comenzar con fundamentos sólidos.',
        ref: 'Equivale a "Insatisfactorio" en el CNB / "Novice" en el marco ISTE.'
    },
    {
        min: 50, max: 69,
        key: 'proceso', label: 'Nivel En Proceso', emoji: '🟡',
        color: '#D97706', bg: '#FFFBEB',
        desc: 'Tienes conocimientos iniciales que puedes profundizar. Los cursos conectarán y ampliarán lo que ya sabes para llevarlo al aula.',
        ref: 'Equivale a "Satisfactorio" en el CNB / "Developing" en el marco ISTE.'
    },
    {
        min: 70, max: 84,
        key: 'satisfactorio', label: 'Nivel Satisfactorio', emoji: '🟢',
        color: '#16A34A', bg: '#F0FDF4',
        desc: 'Comprensión sólida de los conceptos clave. Los cursos te ayudarán a aplicar y sistematizar lo que ya sabes en tu práctica.',
        ref: 'Equivale a "Muy Satisfactorio" en el CNB / "Proficient" en el marco ISTE.'
    },
    {
        min: 85, max: 100,
        key: 'destacado', label: 'Nivel Destacado', emoji: '💜',
        color: '#7C3AED', bg: '#F5F3FF',
        desc: 'Dominio avanzado de los fundamentos pedagógicos. Estás listo para profundizar en estrategias de alto impacto y ser referente en tu comunidad.',
        ref: 'Equivale a "Excelente" en el CNB / "Expert" en el marco ISTE.'
    }
];

function getDiagLevel(pct) {
    return DIAG_LEVELS.find(l => pct >= l.min && pct <= l.max) || DIAG_LEVELS[0];
}

// ── State ──────────────────────────────────────────────────────────────────
let _diagStep = 0;
let _diagAnswers = [];
let _diagShuffled = [];
let _diagAnsweredThis = false;

function _shuffleDiagArr(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Public API ─────────────────────────────────────────────────────────────

function startDiagnostic() {
    _diagStep = 0;
    _diagAnswers = [];
    _diagAnsweredThis = false;

    // Group by domain, shuffle within each, then shuffle domain order
    const byDomain = {};
    DIAG_QUESTIONS.forEach(q => {
        if (!byDomain[q.domain]) byDomain[q.domain] = [];
        byDomain[q.domain].push(q);
    });
    const domainOrder = _shuffleDiagArr(Object.keys(byDomain));
    _diagShuffled = [];
    domainOrder.forEach(d => _diagShuffled.push(..._shuffleDiagArr(byDomain[d])));

    const overlay = document.getElementById('diagOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
    }
    _renderDiagQuestion();
}

function skipDiagnostic() {
    const overlay = document.getElementById('diagOverlay');
    if (overlay) { overlay.classList.add('hidden'); overlay.style.display = 'none'; }
    localStorage.setItem('diagSkipped', '1');
}

function closeDiagnostic() {
    const overlay = document.getElementById('diagOverlay');
    if (overlay) { overlay.classList.add('hidden'); overlay.style.display = 'none'; }
    // Si viene del flujo de onboarding, usar su callback
    if (typeof window._diagOnComplete === 'function') {
        const cb = window._diagOnComplete;
        window._diagOnComplete = null;
        cb();
        return;
    }
    // Si la app principal no está visible aún (flujo post-onboarding), mostrar selector de cursos
    const mainApp = document.getElementById('mainApp');
    const courseSelector = document.getElementById('courseSelector');
    if (mainApp && mainApp.classList.contains('hidden') && courseSelector && typeof showCourseSelector === 'function') {
        showCourseSelector();
    }
}

function retakeDiagnostic() {
    localStorage.removeItem('diagDone');
    localStorage.removeItem('diagSkipped');
    startDiagnostic();
}

// ── Rendering ──────────────────────────────────────────────────────────────

function _renderDiagQuestion() {
    const q = _diagShuffled[_diagStep];
    const total = _diagShuffled.length;
    const pct = Math.round((_diagStep / total) * 100);
    const domain = DIAG_DOMAINS[q.domain];

    const progEl = document.getElementById('diagProgress');
    const counterEl = document.getElementById('diagCounter');
    const badgeEl = document.getElementById('diagDomainBadge');
    const qEl = document.getElementById('diagQuestion');
    const optsEl = document.getElementById('diagOptions');
    const fbEl = document.getElementById('diagFeedback');
    const nextBtn = document.getElementById('diagNextBtn');

    if (progEl) progEl.style.width = pct + '%';
    if (counterEl) counterEl.textContent = `${_diagStep + 1} de ${total}`;
    if (badgeEl) {
        badgeEl.textContent = `${domain.icon} ${domain.label}`;
        badgeEl.style.background = domain.color + '22';
        badgeEl.style.color = domain.color;
        badgeEl.style.borderColor = domain.color + '44';
    }
    if (qEl) qEl.textContent = q.text;

    if (optsEl) {
        optsEl.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'diag-option';
            btn.innerHTML = `<span class="diag-opt-letter">${String.fromCharCode(65 + i)}</span><span class="diag-opt-text">${opt}</span>`;
            btn.addEventListener('click', () => _answerDiagnostic(i));
            optsEl.appendChild(btn);
        });
    }

    if (fbEl) { fbEl.classList.add('hidden'); fbEl.className = 'diag-feedback hidden'; }
    if (nextBtn) nextBtn.classList.add('hidden');
    _diagAnsweredThis = false;
}

function _answerDiagnostic(chosen) {
    if (_diagAnsweredThis) return;
    _diagAnsweredThis = true;

    const q = _diagShuffled[_diagStep];
    const isCorrect = chosen === q.correct;
    _diagAnswers.push({ domain: q.domain, correct: isCorrect });

    document.querySelectorAll('.diag-option').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('diag-opt-correct');
        else if (i === chosen && !isCorrect) btn.classList.add('diag-opt-wrong');
    });

    const fbEl = document.getElementById('diagFeedback');
    if (fbEl) {
        fbEl.classList.remove('hidden');
        fbEl.className = `diag-feedback ${isCorrect ? 'diag-fb-correct' : 'diag-fb-wrong'}`;
        fbEl.innerHTML = `<strong>${isCorrect ? '✓ Correcto' : '✗ Incorrecto'}</strong> — ${q.explanation}`;
    }

    const nextBtn = document.getElementById('diagNextBtn');
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.textContent = _diagStep < _diagShuffled.length - 1 ? 'Siguiente →' : 'Ver mis resultados →';
    }
}

// Exposed for onclick
function answerDiagnostic(chosen) { _answerDiagnostic(chosen); }

function nextDiagQuestion() {
    _diagStep++;
    if (_diagStep >= _diagShuffled.length) {
        _showDiagnosticResults();
    } else {
        _renderDiagQuestion();
    }
}

function _showDiagnosticResults() {
    const total = _diagAnswers.length;
    const correct = _diagAnswers.filter(a => a.correct).length;
    const pct = Math.round((correct / total) * 100);
    const level = getDiagLevel(pct);

    // Per-domain scores
    const domainScores = {};
    Object.keys(DIAG_DOMAINS).forEach(d => { domainScores[d] = { correct: 0, total: 0 }; });
    _diagAnswers.forEach((a, i) => {
        const d = _diagShuffled[i].domain;
        if (domainScores[d]) {
            domainScores[d].total++;
            if (a.correct) domainScores[d].correct++;
        }
    });

    // Persist result — localStorage + Supabase (vía dailyMissions para que sobreviva limpiezas de caché)
    const resultData = { pct, level: level.key, domainScores, date: new Date().toISOString() };
    localStorage.setItem('diagResult', JSON.stringify(resultData));
    localStorage.setItem('diagDone', '1');
    if (typeof progress !== 'undefined' && progress) {
        if (!progress.dailyMissions) progress.dailyMissions = {};
        progress.dailyMissions.diagDone = '1';
        progress.dailyMissions.diagResult = resultData;
        if (typeof saveProgress === 'function') saveProgress();
        if (typeof syncWithSupabase === 'function') syncWithSupabase();
    }

    // Build domain rows
    let domainHtml = '';
    Object.entries(DIAG_DOMAINS).forEach(([key, dom]) => {
        const sc = domainScores[key];
        if (!sc || sc.total === 0) return;
        const dp = Math.round((sc.correct / sc.total) * 100);
        const dl = getDiagLevel(dp);
        domainHtml += `
        <div class="diag-domain-row">
            <div class="diag-domain-label">${dom.icon} ${dom.label}</div>
            <div class="diag-domain-bar-wrap">
                <div class="diag-domain-bar" style="width:${Math.max(dp, 4)}%;background:${dl.color}"></div>
            </div>
            <div class="diag-domain-right">
                <span class="diag-domain-pct" style="color:${dl.color}">${dp}%</span>
                <span class="diag-domain-tag" style="background:${dl.bg};color:${dl.color};border-color:${dl.color}33">${dl.emoji} ${dl.label}</span>
            </div>
        </div>`;
    });

    const contentEl = document.getElementById('diagContent');
    if (!contentEl) return;

    contentEl.innerHTML = `
    <div class="diag-results">
        <div class="diag-result-banner" style="background:linear-gradient(135deg,${level.color},${level.color}cc)">
            <div class="diag-result-emoji-big">${level.emoji}</div>
            <h2 class="diag-result-title">${level.label}</h2>
            <div class="diag-result-score">${pct}% · ${correct} de ${total} correctas</div>
        </div>
        <div class="diag-result-body">
            <p class="diag-result-desc">${level.desc}</p>
            <p class="diag-result-ref">${level.ref}</p>
            <h3 class="diag-domains-title">Resultados por área pedagógica</h3>
            <div class="diag-domains-list">${domainHtml}</div>
            <div class="diag-legend">
                <strong>Semaforización de niveles</strong> (CNB Guatemala · UNESCO · ISTE)<br>
                🔴 Inicial (0–49%) · 🟡 En Proceso (50–69%) · 🟢 Satisfactorio (70–84%) · 💜 Destacado (85–100%)
            </div>
            <button class="diag-primary-btn" onclick="closeDiagnostic()" style="background:${level.color}">
                Explorar los cursos →
            </button>
            <button class="diag-secondary-btn" onclick="retakeDiagnostic()">
                Repetir diagnóstico
            </button>
        </div>
    </div>`;
}

// Show saved result from profile
function showDiagnosticResultFromProfile() {
    const rawSaved = localStorage.getItem('diagResult')
        || (typeof progress !== 'undefined' && progress?.dailyMissions?.diagResult
            ? JSON.stringify(progress.dailyMissions.diagResult) : null);
    if (!rawSaved) { startDiagnostic(); return; }
    const data = JSON.parse(rawSaved);
    const dateStr = new Date(data.date).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });

    const overlay = document.getElementById('diagOverlay');
    if (overlay) { overlay.classList.remove('hidden'); overlay.style.display = 'flex'; }

    // Hide progress bar and counter when showing result from profile
    const prog = document.getElementById('diagProgressWrap');
    const counter = document.getElementById('diagCounter');
    const header = document.getElementById('diagHeaderSub');
    if (prog) prog.style.display = 'none';
    if (counter) counter.style.display = 'none';
    if (header) header.textContent = `Realizado el ${dateStr}`;

    // Re-build answers and shuffled from saved data to render results
    _diagAnswers = [];
    _diagShuffled = [];
    Object.entries(data.domainScores).forEach(([domain, sc]) => {
        for (let i = 0; i < sc.total; i++) {
            _diagShuffled.push({ domain });
            _diagAnswers.push({ domain, correct: i < sc.correct });
        }
    });

    _showDiagnosticResults();

    // Re-add retake button properly
    const contentEl = document.getElementById('diagContent');
    if (contentEl) {
        const retakeBtn = contentEl.querySelector('.diag-secondary-btn');
        if (retakeBtn) retakeBtn.onclick = () => {
            if (prog) prog.style.display = '';
            if (counter) counter.style.display = '';
            if (header) header.textContent = '¿Cuánto conoces sobre pedagogía?';
            retakeDiagnostic();
        };
    }
}
