// ============================================================
// ILUSTRACIONES Y TEMAS POR MÓDULO — Multi-curso
// ============================================================

// Ilustraciones y temas por curso. Se seleccionan en renderCard según currentCourseId.

// ── ABP: colores verdes / construcción ──
const ABP_THEME = {
    1: { primary: '#2BA848', soft: '#E6F1E6' },
    2: { primary: '#1a8f7a', soft: '#E0F5F1' },
    3: { primary: '#0D7A5E', soft: '#DCF5EE' },
    4: { primary: '#4CAF50', soft: '#F1F8E9' },
    5: { primary: '#388E3C', soft: '#E8F5E9' },
};
const ABP_ILLUSTRATIONS = {
    // Módulo 1 — ¿Qué es ABP?: Planta creciendo
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <line x1="40" y1="72" x2="40" y2="30" stroke-width="2.5"/>
        <path d="M40 50 C40 50 20 45 16 28 C28 26 40 36 40 50Z" stroke-width="2.5" fill="rgba(255,255,255,0.2)"/>
        <path d="M40 40 C40 40 60 35 64 18 C52 16 40 26 40 40Z" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/>
        <path d="M28 72 Q40 68 52 72" stroke-width="2.5"/>
        <circle cx="40" cy="18" r="5" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/>
    </svg>`,
    // Módulo 2 — Fases: Ciclo de flechas
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="40" r="22" stroke-width="2.2" stroke-dasharray="6 4"/>
        <path d="M40 18 L44 26 L36 26 Z" fill="white" stroke="none"/>
        <path d="M62 40 L54 44 L54 36 Z" fill="white" stroke="none"/>
        <path d="M40 62 L36 54 L44 54 Z" fill="white" stroke="none"/>
        <path d="M18 40 L26 36 L26 44 Z" fill="white" stroke="none"/>
        <circle cx="40" cy="40" r="8" stroke-width="2.5"/>
    </svg>`,
    // Módulo 3 — Diseño: Lápiz y regla
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 62 L22 46 L46 22 L58 34 L34 58 Z" stroke-width="2.5"/>
        <path d="M22 46 L34 58" stroke-width="2"/>
        <path d="M46 22 L58 34" stroke-width="2"/>
        <line x1="18" y1="62" x2="28" y2="62" stroke-width="2.5"/>
        <circle cx="52" cy="16" r="4" stroke-width="2.2" fill="rgba(255,255,255,0.25)"/>
        <line x1="56" y1="20" x2="62" y2="26" stroke-width="2.5"/>
    </svg>`,
    // Módulo 4 — Evaluación: Rúbrica con check
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="10" width="52" height="60" rx="7" stroke-width="2.5"/>
        <line x1="24" y1="28" x2="56" y2="28" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <line x1="24" y1="40" x2="56" y2="40" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <line x1="24" y1="52" x2="56" y2="52" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <path d="M25 28 L29 32 L36 24" stroke-width="2.5" fill="none"/>
        <path d="M25 40 L29 44 L36 36" stroke-width="2.5" fill="none"/>
        <circle cx="28" cy="52" r="2.5" fill="rgba(255,255,255,0.6)" stroke="none"/>
    </svg>`,
    // Módulo 5 — Guatemala: Quetzal
    5: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="40" cy="30" rx="13" ry="16" stroke-width="2.5"/>
        <path d="M32 44 C32 44 20 58 24 70 C32 64 40 58 40 58" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/>
        <path d="M48 44 C48 44 60 58 56 70 C48 64 40 58 40 58" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <circle cx="35" cy="26" r="2.5" fill="rgba(255,255,255,0.8)" stroke="none"/>
        <path d="M38 34 Q40 38 42 34" stroke-width="2" fill="none"/>
        <line x1="40" y1="14" x2="40" y2="8" stroke-width="2.5"/>
        <path d="M37 8 Q40 4 43 8" stroke-width="2" fill="none"/>
    </svg>`,
};

// ── Design Thinking: rosa/magenta ──
const DT_THEME = {
    1: { primary: '#E83C8D', soft: '#FDE1F0' },
    2: { primary: '#C2185B', soft: '#FCE4EC' },
    3: { primary: '#AD1457', soft: '#FCE4EC' },
    4: { primary: '#D81B60', soft: '#FDE1F0' },
};
const DT_ILLUSTRATIONS = {
    // Módulo 1 — ¿Qué es DT?: Ojo / perspectiva
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 40 C8 40 22 14 40 14 C58 14 72 40 72 40 C72 40 58 66 40 66 C22 66 8 40 8 40 Z" stroke-width="2.5"/>
        <circle cx="40" cy="40" r="12" stroke-width="2.5"/>
        <circle cx="40" cy="40" r="5" fill="rgba(255,255,255,0.7)" stroke="none"/>
        <line x1="40" y1="14" x2="40" y2="20" stroke-width="2"/>
        <line x1="40" y1="60" x2="40" y2="66" stroke-width="2"/>
    </svg>`,
    // Módulo 2 — Empatizar/Definir: Corazón + lupa
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 64 C40 64 12 46 12 28 C12 18 20 12 28 14 C33 15 38 20 40 24 C42 20 47 15 52 14 C60 12 68 18 68 28 C68 46 40 64 40 64Z" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/>
        <circle cx="55" cy="20" r="8" stroke-width="2.2"/>
        <line x1="61" y1="26" x2="68" y2="33" stroke-width="2.5"/>
    </svg>`,
    // Módulo 3 — Idear/Prototipar: Bombilla con engranaje
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 8 C27 8 18 17 18 28 C18 37 24 44 32 48 L32 56 Q32 58 34 58 H46 Q48 58 48 56 L48 48 C56 44 62 37 62 28 C62 17 53 8 40 8Z" stroke-width="2.5"/>
        <line x1="33" y1="59" x2="47" y2="59" stroke-width="2.5"/>
        <line x1="35" y1="64" x2="45" y2="64" stroke-width="2.5"/>
        <path d="M37 64 Q40 70 43 64" stroke-width="2"/>
        <circle cx="40" cy="31" r="7" stroke-width="2" stroke="rgba(255,255,255,0.7)"/>
        <path d="M37 31 L39 33 L44 28" stroke-width="2" fill="none" stroke="rgba(255,255,255,0.9)"/>
    </svg>`,
    // Módulo 4 — DT en aula: Personas conectadas
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="20" cy="22" r="9" stroke-width="2.5"/>
        <path d="M8 50 C8 40 32 40 32 50 L32 56 L8 56 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <circle cx="60" cy="22" r="9" stroke-width="2.5"/>
        <path d="M48 50 C48 40 72 40 72 50 L72 56 L48 56 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <line x1="32" y1="25" x2="48" y2="25" stroke-width="2" stroke-dasharray="3 3"/>
        <circle cx="40" cy="25" r="4" stroke-width="2" fill="rgba(255,255,255,0.3)"/>
    </svg>`,
};

// ── Evaluación: naranja/ámbar ──
const EV_THEME = {
    1: { primary: '#E9A037', soft: '#FDF3E3' },
    2: { primary: '#F57C00', soft: '#FFF3E0' },
    3: { primary: '#E65100', soft: '#FBE9E7' },
    4: { primary: '#FF8F00', soft: '#FFF8E1' },
};
const EV_ILLUSTRATIONS = {
    // Módulo 1 — Evaluación auténtica: Diploma/estrella
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="10" y="16" width="60" height="42" rx="7" stroke-width="2.5"/>
        <line x1="20" y1="30" x2="60" y2="30" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <line x1="20" y1="40" x2="50" y2="40" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <circle cx="55" cy="62" r="10" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/>
        <path d="M55 54 L57 59 L62 59 L58 63 L60 68 L55 64 L50 68 L52 63 L48 59 L53 59 Z" fill="rgba(255,255,255,0.8)" stroke="none"/>
    </svg>`,
    // Módulo 2 — Rúbricas: Tabla
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="10" y="14" width="60" height="52" rx="7" stroke-width="2.5"/>
        <line x1="10" y1="30" x2="70" y2="30" stroke-width="2"/>
        <line x1="10" y1="46" x2="70" y2="46" stroke-width="2"/>
        <line x1="32" y1="14" x2="32" y2="66" stroke-width="2"/>
        <line x1="54" y1="14" x2="54" y2="66" stroke-width="2"/>
        <path d="M17 37 L21 41 L27 33" stroke-width="2.5" fill="none"/>
        <path d="M38 37 L42 41 L48 33" stroke-width="2.5" fill="none"/>
        <circle cx="61" cy="37" r="3" fill="rgba(255,255,255,0.6)" stroke="none"/>
        <path d="M17 54 L21 58 L27 50" stroke-width="2.5" fill="none"/>
    </svg>`,
    // Módulo 3 — Portafolios: Carpeta
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 28 L8 66 Q8 70 12 70 L68 70 Q72 70 72 66 L72 28 Q72 24 68 24 L40 24 L34 16 L12 16 Q8 16 8 20 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <line x1="18" y1="40" x2="62" y2="40" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <line x1="18" y1="50" x2="62" y2="50" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
        <line x1="18" y1="60" x2="45" y2="60" stroke-width="2" stroke="rgba(255,255,255,0.5)"/>
    </svg>`,
    // Módulo 4 — Coevaluación: Dos personas con flechas
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="20" cy="20" r="9" stroke-width="2.5"/>
        <path d="M8 46 C8 36 32 36 32 46" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <circle cx="60" cy="20" r="9" stroke-width="2.5"/>
        <path d="M48 46 C48 36 72 36 72 46" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <path d="M34 28 C38 24 42 24 46 28" stroke-width="2" fill="none"/>
        <path d="M46 24 L46 29 L41 26 Z" fill="white" stroke="none"/>
        <path d="M46 52 C42 56 38 56 34 52" stroke-width="2" fill="none"/>
        <path d="M34 56 L34 51 L39 54 Z" fill="white" stroke="none"/>
    </svg>`,
};

// ── Tipos de Estudiantes: violeta / personas ──
const TE_THEME = {
    1: { primary: '#7C3AED', soft: '#EDE9FE' },
    2: { primary: '#6D28D9', soft: '#E8E0FB' },
    3: { primary: '#9333EA', soft: '#F3E8FF' },
    4: { primary: '#7E22CE', soft: '#F5F3FF' },
    5: { primary: '#5B21B6', soft: '#EDEDFF' },
};
const TE_ILLUSTRATIONS = {
    // Módulo 1 — Mapa del aula: Grupo de personas
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="22" r="8" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/>
        <path d="M24 56 C24 44 56 44 56 56" stroke-width="2.2"/>
        <circle cx="18" cy="30" r="5.5" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
        <path d="M8 56 C8 47 28 47 28 56" stroke-width="2"/>
        <circle cx="62" cy="30" r="5.5" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
        <path d="M52 56 C52 47 72 47 72 56" stroke-width="2"/>
    </svg>`,
    // Módulo 2 — Estilos de aprendizaje: Cerebro con rayos
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 14 C28 14 18 22 18 34 C18 42 22 48 30 52 L30 64 L50 64 L50 52 C58 48 62 42 62 34 C62 22 52 14 40 14Z" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/>
        <line x1="40" y1="30" x2="40" y2="52" stroke-width="1.5" stroke-dasharray="3 2"/>
        <path d="M32 28 L36 36 L30 36 L36 46" stroke-width="2.2"/>
        <path d="M48 28 L44 36 L50 36 L44 46" stroke-width="2.2"/>
    </svg>`,
    // Módulo 3 — Perfiles emocionales: Corazón y mente
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 62 L16 40 C10 34 10 24 20 20 C28 17 34 22 40 30 C46 22 52 17 60 20 C70 24 70 34 64 40 Z" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/>
        <circle cx="40" cy="24" r="6" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
        <line x1="40" y1="30" x2="40" y2="40" stroke-width="1.8"/>
    </svg>`,
    // Módulo 4 — Casos de estudio: Lupa sobre persona
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="36" cy="36" r="20" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/>
        <line x1="50" y1="50" x2="66" y2="66" stroke-width="3" stroke-linecap="round"/>
        <circle cx="36" cy="30" r="5" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
        <path d="M24 46 C24 38 48 38 48 46" stroke-width="2"/>
    </svg>`,
    // Módulo 5 — Estrategias: Rompecabezas de personas
    5: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="12" y="12" width="24" height="24" rx="4" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/>
        <rect x="44" y="12" width="24" height="24" rx="4" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/>
        <rect x="12" y="44" width="24" height="24" rx="4" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/>
        <rect x="44" y="44" width="24" height="24" rx="4" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/>
        <circle cx="24" cy="21" r="3.5" stroke-width="1.8" fill="rgba(255,255,255,0.2)"/>
        <circle cx="56" cy="21" r="3.5" stroke-width="1.8" fill="rgba(255,255,255,0.2)"/>
        <path d="M18 28 C18 24 30 24 30 28" stroke-width="1.8"/>
        <path d="M50 28 C50 24 62 24 62 28" stroke-width="1.8"/>
        <line x1="24" y1="50" x2="24" y2="62" stroke-width="2"/>
        <line x1="16" y1="56" x2="32" y2="56" stroke-width="2"/>
        <line x1="56" y1="50" x2="56" y2="62" stroke-width="2"/>
        <line x1="48" y1="56" x2="64" y2="56" stroke-width="2"/>
    </svg>`,
};

// ════════════════════════════════════════════════════════════════
// CURSOS NUEVOS — temas e ilustraciones temáticas (trazo blanco)
// ════════════════════════════════════════════════════════════════

// ── Despertando la Creatividad (rosa/púrpura) ──
const CREA_THEME = {
    1: { primary: '#E83C8D', soft: '#FDE1F0' }, 2: { primary: '#C026D3', soft: '#FAE8FF' },
    3: { primary: '#9333EA', soft: '#F3E8FF' }, 4: { primary: '#7C3AED', soft: '#EDE9FE' },
    5: { primary: '#DB2777', soft: '#FCE7F3' },
};
const CREA_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 12 C28 12 20 21 20 32 C20 40 25 45 28 50 L52 50 C55 45 60 40 60 32 C60 21 52 12 40 12Z" stroke-width="2.5" fill="rgba(255,255,255,0.12)"/><line x1="32" y1="58" x2="48" y2="58" stroke-width="2.5"/><line x1="34" y1="64" x2="46" y2="64" stroke-width="2.5"/><line x1="40" y1="6" x2="40" y2="2" stroke-width="2"/><line x1="64" y1="14" x2="68" y2="10" stroke-width="2"/><line x1="16" y1="14" x2="12" y2="10" stroke-width="2"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 16 C30 16 24 22 24 30 C18 32 16 40 22 44 C20 52 28 58 36 54 C38 60 46 60 48 54 C56 58 64 52 62 44 C68 40 66 32 60 30 C60 22 50 16 40 16Z" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><line x1="40" y1="24" x2="40" y2="54" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><path d="M40 32 L32 36 M40 40 L48 44" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="14" width="24" height="24" rx="4" stroke-width="2.3"/><rect x="44" y="14" width="22" height="22" rx="11" stroke-width="2.3"/><path d="M14 50 L26 70 L38 50 Z" stroke-width="2.3"/><rect x="44" y="46" width="22" height="22" rx="4" stroke-width="2.3" transform="rotate(45 55 57)"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 10 L46 28 L64 28 L50 40 L56 58 L40 46 L24 58 L30 40 L16 28 L34 28 Z" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="26" r="10" stroke-width="2.5"/><path d="M22 64 C22 52 30 46 40 46 C50 46 58 52 58 64" stroke-width="2.5"/><path d="M58 16 L60 22 L66 24 L60 26 L58 32 L56 26 L50 24 L56 22 Z" fill="white" stroke="none"/></svg>`,
};

// ── Herramientas Tecnológicas (púrpura) ──
const TEC_THEME = {
    1: { primary: '#7C3AED', soft: '#EDE9FE' }, 2: { primary: '#6D28D9', soft: '#EDE9FE' },
    3: { primary: '#8B5CF6', soft: '#F5F3FF' }, 4: { primary: '#5B21B6', soft: '#EDE9FE' },
    5: { primary: '#7C3AED', soft: '#EDE9FE' },
};
const TEC_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="18" width="48" height="32" rx="3" stroke-width="2.5"/><line x1="10" y1="60" x2="70" y2="60" stroke-width="2.5"/><line x1="34" y1="50" x2="46" y2="50" stroke-width="2.5"/><circle cx="40" cy="34" r="7" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="16" width="52" height="40" rx="4" stroke-width="2.5"/><circle cx="28" cy="30" r="5" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/><path d="M18 52 L32 38 L42 48 L52 36 L62 50" stroke-width="2.3"/><line x1="30" y1="64" x2="50" y2="64" stroke-width="2.5"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="12" width="52" height="56" rx="6" stroke-width="2.5"/><path d="M24 28 L30 34 L42 22" stroke-width="2.5"/><path d="M24 46 L30 52 L42 40" stroke-width="2.5"/><line x1="48" y1="28" x2="58" y2="28" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="48" y1="46" x2="58" y2="46" stroke-width="2" stroke="rgba(255,255,255,0.5)"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 10 L62 20 V38 C62 52 52 64 40 70 C28 64 18 52 18 38 V20 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M31 40 L38 47 L51 32" stroke-width="2.5"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="18" width="48" height="32" rx="3" stroke-width="2.5"/><line x1="10" y1="60" x2="70" y2="60" stroke-width="2.5"/></svg>`,
};

// ── Mobile Learning (ámbar) ──
const ML_THEME = {
    1: { primary: '#F59E0B', soft: '#FEF3C7' }, 2: { primary: '#D97706', soft: '#FFEDD5' },
    3: { primary: '#EA580C', soft: '#FFEDD5' }, 4: { primary: '#B45309', soft: '#FEF3C7' },
    5: { primary: '#F59E0B', soft: '#FEF3C7' },
};
const ML_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="10" width="28" height="60" rx="6" stroke-width="2.5"/><line x1="36" y1="62" x2="44" y2="62" stroke-width="2.5"/><line x1="34" y1="18" x2="46" y2="18" stroke-width="2" stroke="rgba(255,255,255,0.5)"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="14" width="20" height="20" rx="4" stroke-width="2.3"/><rect x="46" y="14" width="20" height="20" rx="4" stroke-width="2.3"/><rect x="14" y="46" width="20" height="20" rx="4" stroke-width="2.3"/><rect x="46" y="46" width="20" height="20" rx="4" stroke-width="2.3"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M16 44 C30 28 50 28 64 44" stroke-width="2.5"/><path d="M24 52 C32 42 48 42 56 52" stroke-width="2.3" stroke="rgba(255,255,255,0.7)"/><circle cx="40" cy="60" r="4" fill="white" stroke="none"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="24" r="8" stroke-width="2.3"/><circle cx="54" cy="28" r="7" stroke-width="2.3"/><path d="M14 56 C14 46 20 40 28 40 C34 40 38 43 40 47" stroke-width="2.3"/><rect x="44" y="44" width="18" height="26" rx="4" stroke-width="2.3"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="10" width="28" height="60" rx="6" stroke-width="2.5"/><line x1="36" y1="62" x2="44" y2="62" stroke-width="2.5"/></svg>`,
};

// ── Aula Invertida / Flipped (rojo) ──
const FLIP_THEME = {
    1: { primary: '#EF4444', soft: '#FEE2E2' }, 2: { primary: '#DC2626', soft: '#FEE2E2' },
    3: { primary: '#B91C1C', soft: '#FEE2E2' }, 4: { primary: '#F87171', soft: '#FEF2F2' },
    5: { primary: '#EF4444', soft: '#FEE2E2' },
};
const FLIP_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M20 30 A20 20 0 0 1 60 30" stroke-width="2.5"/><path d="M60 50 A20 20 0 0 1 20 50" stroke-width="2.5"/><path d="M60 22 L60 32 L50 32" stroke-width="2.5"/><path d="M20 58 L20 48 L30 48" stroke-width="2.5"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="16" width="52" height="36" rx="4" stroke-width="2.5"/><path d="M34 28 L48 34 L34 40 Z" fill="white" stroke="none"/><line x1="30" y1="64" x2="50" y2="64" stroke-width="2.5"/><line x1="40" y1="52" x2="40" y2="64" stroke-width="2.5"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="26" cy="26" r="7" stroke-width="2.3"/><circle cx="54" cy="26" r="7" stroke-width="2.3"/><circle cx="40" cy="50" r="7" stroke-width="2.3"/><path d="M30 32 L36 44 M50 32 L44 44" stroke-width="2.2" stroke="rgba(255,255,255,0.6)"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M16 38 L40 18 L64 38" stroke-width="2.5"/><rect x="24" y="38" width="32" height="28" rx="3" stroke-width="2.5"/><path d="M34 52 A6 6 0 0 1 46 52" stroke-width="2.2"/><circle cx="40" cy="50" r="1.5" fill="white" stroke="none"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M20 30 A20 20 0 0 1 60 30" stroke-width="2.5"/><path d="M60 50 A20 20 0 0 1 20 50" stroke-width="2.5"/></svg>`,
};

// ── Aprendizaje Basado en Videos / ABV (índigo) ──
const ABV_THEME = {
    1: { primary: '#6366F1', soft: '#E0E7FF' }, 2: { primary: '#4F46E5', soft: '#E0E7FF' },
    3: { primary: '#4338CA', soft: '#E0E7FF' }, 4: { primary: '#818CF8', soft: '#EEF2FF' },
    5: { primary: '#6366F1', soft: '#E0E7FF' },
};
const ABV_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="26" stroke-width="2.5"/><path d="M34 30 L52 40 L34 50 Z" fill="white" stroke="none"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="18" width="52" height="44" rx="5" stroke-width="2.5"/><line x1="14" y1="30" x2="66" y2="30" stroke-width="2"/><line x1="14" y1="50" x2="66" y2="50" stroke-width="2"/><rect x="20" y="20" width="6" height="8" stroke-width="1.8"/><rect x="54" y="20" width="6" height="8" stroke-width="1.8"/><rect x="20" y="52" width="6" height="8" stroke-width="1.8"/><rect x="54" y="52" width="6" height="8" stroke-width="1.8"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="26" width="36" height="28" rx="4" stroke-width="2.5"/><path d="M52 36 L66 28 L66 52 L52 44 Z" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/><circle cx="28" cy="40" r="4" fill="white" stroke="none"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="12" width="44" height="56" rx="5" stroke-width="2.5"/><path d="M26 26 L30 30 L38 22" stroke-width="2.3"/><path d="M26 42 L30 46 L38 38" stroke-width="2.3"/><line x1="44" y1="26" x2="54" y2="26" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="44" y1="42" x2="54" y2="42" stroke-width="2" stroke="rgba(255,255,255,0.5)"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="26" stroke-width="2.5"/><path d="M34 30 L52 40 L34 50 Z" fill="white" stroke="none"/></svg>`,
};

// ── Micro-learning (naranja) ──
const MICRO_THEME = {
    1: { primary: '#F97316', soft: '#FFEDD5' }, 2: { primary: '#EA580C', soft: '#FFEDD5' },
    3: { primary: '#C2410C', soft: '#FFEDD5' }, 4: { primary: '#FB923C', soft: '#FFF7ED' },
    5: { primary: '#F97316', soft: '#FFEDD5' },
};
const MICRO_ILLUS = {
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M44 8 L22 44 L38 44 L34 72 L58 34 L42 34 Z" stroke-width="2.5" fill="rgba(255,255,255,0.12)"/></svg>`,
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="30" width="44" height="20" rx="10" stroke-width="2.5" transform="rotate(-35 40 40)"/><line x1="40" y1="28" x2="52" y2="40" stroke-width="2.3" transform="rotate(-35 40 40)"/></svg>`,
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M16 22 H64 V52 H40 L28 62 V52 H16 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><line x1="26" y1="34" x2="54" y2="34" stroke-width="2" stroke="rgba(255,255,255,0.6)"/><line x1="26" y1="42" x2="46" y2="42" stroke-width="2" stroke="rgba(255,255,255,0.6)"/></svg>`,
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="42" r="24" stroke-width="2.5"/><path d="M40 28 L40 42 L50 48" stroke-width="2.5"/><line x1="32" y1="12" x2="48" y2="12" stroke-width="2.5"/><line x1="40" y1="12" x2="40" y2="18" stroke-width="2.5"/></svg>`,
    5: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M44 8 L22 44 L38 44 L34 72 L58 34 L42 34 Z" stroke-width="2.5" fill="rgba(255,255,255,0.12)"/></svg>`,
};

// ── Storytelling: tonos ámbar/cálidos ──
const ST_THEME = {
    1: { primary: '#F59E0B', soft: '#FEF3C7' }, // Poder de las historias
    2: { primary: '#D97706', soft: '#FDE68A' }, // Estructura narrativa
    3: { primary: '#B45309', soft: '#FEF3C7' }, // Técnicas avanzadas
    4: { primary: '#F59E0B', soft: '#FFF7ED' }, // Storytelling digital
    5: { primary: '#92400E', soft: '#FFEDD5' }, // Práctica docente
};
const ST_ILLUS = {
    // Módulo 1 — Poder de las historias: libro abierto con estrellas
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 14 C40 14 22 18 18 32 L18 66 C22 54 36 52 40 54 C44 52 58 54 62 66 L62 32 C58 18 40 14 40 14Z" stroke-width="2.4" fill="rgba(255,255,255,0.1)"/>
        <line x1="40" y1="14" x2="40" y2="54" stroke-width="2.2"/>
        <line x1="26" y1="34" x2="38" y2="34" stroke-width="1.8" stroke="rgba(255,255,255,0.6)"/>
        <line x1="26" y1="40" x2="38" y2="40" stroke-width="1.8" stroke="rgba(255,255,255,0.6)"/>
        <line x1="26" y1="46" x2="34" y2="46" stroke-width="1.8" stroke="rgba(255,255,255,0.6)"/>
        <circle cx="58" cy="18" r="3" fill="rgba(255,255,255,0.7)" stroke="none"/>
        <circle cx="66" cy="12" r="2" fill="rgba(255,255,255,0.5)" stroke="none"/>
        <circle cx="62" cy="24" r="1.5" fill="rgba(255,255,255,0.4)" stroke="none"/>
    </svg>`,
    // Módulo 2 — Estructura narrativa: arco dramático (montaña con flecha)
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 62 Q28 28 40 20 Q52 28 68 62" stroke-width="2.5" fill="none"/>
        <circle cx="40" cy="20" r="4" fill="rgba(255,255,255,0.25)" stroke-width="2"/>
        <circle cx="12" cy="62" r="3.5" fill="rgba(255,255,255,0.2)" stroke-width="2"/>
        <circle cx="68" cy="62" r="3.5" fill="rgba(255,255,255,0.2)" stroke-width="2"/>
        <text x="6" y="74" font-size="8" fill="rgba(255,255,255,0.7)" font-family="sans-serif" stroke="none">Inicio</text>
        <text x="34" y="14" font-size="8" fill="rgba(255,255,255,0.7)" font-family="sans-serif" stroke="none">Clímax</text>
        <text x="58" y="74" font-size="8" fill="rgba(255,255,255,0.7)" font-family="sans-serif" stroke="none">Fin</text>
        <line x1="40" y1="20" x2="40" y2="62" stroke-width="1.5" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3 3"/>
    </svg>`,
    // Módulo 3 — Técnicas avanzadas: máscara de teatro
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="30" cy="38" rx="14" ry="18" stroke-width="2.4" fill="rgba(255,255,255,0.1)"/>
        <ellipse cx="52" cy="42" rx="13" ry="16" stroke-width="2.4" fill="rgba(255,255,255,0.08)"/>
        <path d="M25 44 Q30 48 35 44" stroke-width="2" fill="none"/>
        <path d="M47 50 Q52 46 57 50" stroke-width="2" fill="none"/>
        <path d="M24 33 Q27 31 30 33" stroke-width="1.8" fill="none"/>
        <path d="M49 36 Q52 34 55 36" stroke-width="1.8" fill="none"/>
    </svg>`,
    // Módulo 4 — Storytelling digital: pantalla con micrófono
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="12" y="18" width="56" height="36" rx="5" stroke-width="2.4" fill="rgba(255,255,255,0.08)"/>
        <line x1="30" y1="54" x2="50" y2="54" stroke-width="2.2"/>
        <line x1="40" y1="54" x2="40" y2="62" stroke-width="2.2"/>
        <line x1="32" y1="62" x2="48" y2="62" stroke-width="2.2"/>
        <rect x="34" y="26" width="12" height="20" rx="6" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/>
        <path d="M28 38 Q28 50 40 50 Q52 50 52 38" stroke-width="2.2" fill="none"/>
        <line x1="40" y1="50" x2="40" y2="54" stroke-width="2.2"/>
    </svg>`,
    // Módulo 5 — Práctica docente: docente con globo de diálogo
    5: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="30" cy="22" r="9" stroke-width="2.4" fill="rgba(255,255,255,0.1)"/>
        <path d="M14 62 Q14 46 30 46 Q46 46 46 62" stroke-width="2.4" fill="rgba(255,255,255,0.08)"/>
        <rect x="46" y="14" width="22" height="16" rx="5" stroke-width="2.2" fill="rgba(255,255,255,0.12)"/>
        <path d="M50 30 L48 36 L56 30" fill="rgba(255,255,255,0.5)" stroke="none"/>
        <line x1="50" y1="20" x2="64" y2="20" stroke-width="1.8" stroke="rgba(255,255,255,0.7)"/>
        <line x1="50" y1="25" x2="60" y2="25" stroke-width="1.8" stroke="rgba(255,255,255,0.7)"/>
    </svg>`,
};

// ── SVGs temáticos por ruta de aprendizaje ──────────────────────────────────
// Usados en el selector de rutas (_renderCourseSelector)
const PATH_SVG = {
    // steam20: Cohete STEAM (ciencia + tecnología + innovación)
    steam20: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 6 C22 6 32 10 32 22 L22 38 L12 22 C12 10 22 6 22 6Z" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
        <circle cx="22" cy="20" r="4" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
        <path d="M12 28 Q8 32 10 38 Q14 34 22 38 Q30 34 34 38 Q36 32 32 28" stroke-width="1.8" fill="rgba(255,255,255,0.1)"/>
        <line x1="16" y1="14" x2="13" y2="11" stroke-width="1.6" stroke="rgba(255,255,255,0.7)"/>
        <line x1="28" y1="14" x2="31" y2="11" stroke-width="1.6" stroke="rgba(255,255,255,0.7)"/>
    </svg>`,
    // creativo: Paleta de pintor + pincel
    creativo: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 30 Q8 22 14 16 Q20 10 28 12 Q36 14 36 22 Q36 28 30 30 Q26 32 24 28 Q20 24 24 22 Q26 20 28 22" stroke-width="2" fill="none"/>
        <circle cx="14" cy="34" r="4" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
        <line x1="30" y1="8" x2="38" y2="4" stroke-width="2"/>
        <line x1="34" y1="6" x2="36" y2="12" stroke-width="1.8"/>
    </svg>`,
    // metodologias: Engranajes interconectados (metodología activa, proceso)
    metodologias: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="16" cy="18" r="7" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
        <circle cx="16" cy="18" r="2.5" fill="rgba(255,255,255,0.4)" stroke="none"/>
        <path d="M16 9 L16 7 M16 29 L16 27 M7 18 L5 18 M27 18 L25 18 M9.6 11.6 L8.2 10.2 M22.4 24.4 L23.8 25.8 M22.4 11.6 L23.8 10.2 M9.6 24.4 L8.2 25.8" stroke-width="1.8"/>
        <circle cx="30" cy="30" r="6" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
        <circle cx="30" cy="30" r="2.2" fill="rgba(255,255,255,0.35)" stroke="none"/>
        <path d="M30 22.5 L30 21 M30 39 L30 37.5 M22.5 30 L21 30 M39 30 L37.5 30" stroke-width="1.6"/>
        <line x1="21" y1="24" x2="24" y2="25" stroke-width="1.8" stroke="rgba(255,255,255,0.6)"/>
    </svg>`,
    // ia: chip con nodos neuronales (inteligencia artificial)
    ia: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="14" width="16" height="16" rx="3" stroke-width="2" fill="rgba(255,255,255,0.12)"/>
        <circle cx="22" cy="22" r="3.5" stroke-width="1.8"/>
        <line x1="22" y1="6" x2="22" y2="14" stroke-width="1.8"/>
        <line x1="22" y1="30" x2="22" y2="38" stroke-width="1.8"/>
        <line x1="6" y1="22" x2="14" y2="22" stroke-width="1.8"/>
        <line x1="30" y1="22" x2="38" y2="22" stroke-width="1.8"/>
        <circle cx="22" cy="5" r="2" fill="rgba(255,255,255,0.55)" stroke="none"/>
        <circle cx="22" cy="39" r="2" fill="rgba(255,255,255,0.55)" stroke="none"/>
        <circle cx="5" cy="22" r="2" fill="rgba(255,255,255,0.55)" stroke="none"/>
        <circle cx="39" cy="22" r="2" fill="rgba(255,255,255,0.55)" stroke="none"/>
    </svg>`,
    // convivencia: dos figuras conectadas bajo un techo de aula (clima y comunidad)
    convivencia: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="15" cy="14" r="5" stroke-width="1.8"/>
        <path d="M6 30 C6 23 10 19 15 19 C20 19 24 23 24 30" stroke-width="1.8"/>
        <circle cx="30" cy="16" r="4.5" stroke-width="1.8"/>
        <path d="M22 32 C22 26 26 22 30 22 C34 22 38 26 38 32" stroke-width="1.8"/>
        <path d="M12 38 Q22 33 32 38" stroke-width="1.8" stroke="rgba(255,255,255,0.6)"/>
    </svg>`,
};

// Función que retorna el theme e ilustración del módulo activo según el curso
function getCourseThemeAndIllus(courseId, moduleIndex) {
    switch(courseId) {
        case 'creatividad':
            return { theme: CREA_THEME[moduleIndex] || { primary: '#E83C8D', soft: '#FDE1F0' }, illus: CREA_ILLUS[moduleIndex] || CREA_ILLUS[1] };
        case 'herramientas-tec':
            return { theme: TEC_THEME[moduleIndex] || { primary: '#7C3AED', soft: '#EDE9FE' }, illus: TEC_ILLUS[moduleIndex] || TEC_ILLUS[1] };
        case 'm-learning':
            return { theme: ML_THEME[moduleIndex] || { primary: '#F59E0B', soft: '#FEF3C7' }, illus: ML_ILLUS[moduleIndex] || ML_ILLUS[1] };
        case 'flipped-classroom':
            return { theme: FLIP_THEME[moduleIndex] || { primary: '#EF4444', soft: '#FEE2E2' }, illus: FLIP_ILLUS[moduleIndex] || FLIP_ILLUS[1] };
        case 'abv':
            return { theme: ABV_THEME[moduleIndex] || { primary: '#6366F1', soft: '#E0E7FF' }, illus: ABV_ILLUS[moduleIndex] || ABV_ILLUS[1] };
        case 'micro-learning':
            return { theme: MICRO_THEME[moduleIndex] || { primary: '#F97316', soft: '#FFEDD5' }, illus: MICRO_ILLUS[moduleIndex] || MICRO_ILLUS[1] };
        case 'abp':
            return {
                theme: ABP_THEME[moduleIndex] || { primary: '#2BA848', soft: '#E6F1E6' },
                illus: ABP_ILLUSTRATIONS[moduleIndex] || ABP_ILLUSTRATIONS[1]
            };
        case 'design-thinking':
            return {
                theme: DT_THEME[moduleIndex] || { primary: '#E83C8D', soft: '#FDE1F0' },
                illus: DT_ILLUSTRATIONS[moduleIndex] || DT_ILLUSTRATIONS[1]
            };
        case 'evaluacion':
            return {
                theme: EV_THEME[moduleIndex] || { primary: '#E9A037', soft: '#FDF3E3' },
                illus: EV_ILLUSTRATIONS[moduleIndex] || EV_ILLUSTRATIONS[1]
            };
        case 'tipos-estudiantes':
            return {
                theme: TE_THEME[moduleIndex] || { primary: '#7C3AED', soft: '#EDE9FE' },
                illus: TE_ILLUSTRATIONS[moduleIndex] || TE_ILLUSTRATIONS[1]
            };
        case 'storytelling':
            return {
                theme: ST_THEME[moduleIndex] || { primary: '#F59E0B', soft: '#FEF3C7' },
                illus: ST_ILLUS[moduleIndex] || ST_ILLUS[1]
            };
        default: {
            // Rutas IA y Convivencia: temas e ilustraciones propios por curso
            const custom = (typeof getConvivenciaOrIaThemeAndIllus === 'function')
                ? getConvivenciaOrIaThemeAndIllus(courseId, moduleIndex)
                : null;
            if (custom) return custom;
            return {
                theme: MODULE_THEME[moduleIndex] || { primary: '#0097A7', soft: '#E0F7FA' },
                illus: MODULE_ILLUSTRATIONS[moduleIndex] || ''
            };
        }
    }
}

// Paleta oficial por disciplina STEEAM
// S - Ciencias:      #FCC30A / #FFF9E0
// T - Tecnología:    #E9A037 / #FDE7CC
// E - Emprendimiento:#07B0E4 / #E0F1F5
// E - Ingeniería:    #2BA848 / #E6F1E6
// A - Artes:         #E83C8D / #FDE1E4
// M - Matemáticas:   #E52642 / #FCD7DA

const MODULE_THEME = {
    1: { primary: '#FCC30A', soft: '#FFF9E0', name: 'Módulo 1' }, // Ciencias
    2: { primary: '#2BA848', soft: '#E6F1E6', name: 'Módulo 2' }, // Ingeniería
    3: { primary: '#07B0E4', soft: '#E0F1F5', name: 'Módulo 3' }, // Emprendimiento
    4: { primary: '#E9A037', soft: '#FDE7CC', name: 'Módulo 4' }, // Tecnología
    5: { primary: '#E83C8D', soft: '#FDE1E4', name: 'Módulo 5' }, // Artes
};

// ── Iconos STEEAM — estilo outline fino, trazo blanco, sin relleno ──

const MODULE_ILLUSTRATIONS = {

    // Módulo 1 — Ciencias: Frasco Erlenmeyer
    1: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <!-- Cuello del frasco -->
        <rect x="30" y="7" width="20" height="20" rx="3" stroke-width="2.5"/>
        <!-- Tapón superior -->
        <line x1="26" y1="7" x2="54" y2="7" stroke-width="2.5"/>
        <!-- Cuerpo del frasco -->
        <path d="M30 27 L13 61 C11 67 15 72 21 72 H59 C65 72 69 67 67 61 L50 27 Z" stroke-width="2.5"/>
        <!-- Nivel de líquido -->
        <path d="M18 58 Q40 51 62 58" stroke="rgba(255,255,255,0.55)" stroke-width="2" fill="none"/>
        <!-- Burbujas -->
        <circle cx="33" cy="61" r="3.5" fill="rgba(255,255,255,0.55)" stroke="none"/>
        <circle cx="45" cy="56" r="2.5" fill="rgba(255,255,255,0.4)" stroke="none"/>
        <circle cx="54" cy="63" r="2" fill="rgba(255,255,255,0.35)" stroke="none"/>
    </svg>`,

    // Módulo 2 — Ingeniería: Engranaje
    2: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <!-- Círculo central -->
        <circle cx="40" cy="40" r="11" stroke-width="2.5"/>
        <!-- Dientes: 8 rectángulos alrededor -->
        <!-- arriba -->
        <rect x="36" y="7"  width="8" height="12" rx="2.5" stroke-width="2.5"/>
        <!-- abajo -->
        <rect x="36" y="61" width="8" height="12" rx="2.5" stroke-width="2.5"/>
        <!-- izquierda -->
        <rect x="7"  y="36" width="12" height="8" rx="2.5" stroke-width="2.5"/>
        <!-- derecha -->
        <rect x="61" y="36" width="12" height="8" rx="2.5" stroke-width="2.5"/>
        <!-- diagonal sup-der -->
        <rect x="55" y="11" width="8" height="12" rx="2.5" stroke-width="2.5" transform="rotate(45 59 17)"/>
        <!-- diagonal sup-izq -->
        <rect x="17" y="11" width="8" height="12" rx="2.5" stroke-width="2.5" transform="rotate(-45 21 17)"/>
        <!-- diagonal inf-der -->
        <rect x="55" y="57" width="8" height="12" rx="2.5" stroke-width="2.5" transform="rotate(-45 59 63)"/>
        <!-- diagonal inf-izq -->
        <rect x="17" y="57" width="8" height="12" rx="2.5" stroke-width="2.5" transform="rotate(45 21 63)"/>
    </svg>`,

    // Módulo 3 — Emprendimiento: Bombilla
    3: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <!-- Cuerpo de la bombilla -->
        <path d="M40 8 C25 8 15 18 15 30 C15 40 22 48 30 53 L30 60 Q30 62 32 62 H48 Q50 62 50 60 L50 53 C58 48 65 40 65 30 C65 18 55 8 40 8 Z" stroke-width="2.5"/>
        <!-- Base - líneas -->
        <line x1="31" y1="63" x2="49" y2="63" stroke-width="2.5"/>
        <line x1="32" y1="68" x2="48" y2="68" stroke-width="2.5"/>
        <!-- Punta redondeada de la base -->
        <path d="M34 68 Q40 75 46 68" stroke-width="2.5"/>
        <!-- Filamento interior -->
        <path d="M33 45 Q40 35 47 45" stroke="rgba(255,255,255,0.65)" stroke-width="2" fill="none"/>
        <!-- Destello -->
        <line x1="40" y1="17" x2="40" y2="22" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
        <line x1="50" y1="20" x2="47" y2="24" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>
        <line x1="30" y1="20" x2="33" y2="24" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>
    </svg>`,

    // Módulo 4 — Tecnología: Robot
    4: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <!-- Cabeza: rect redondeado -->
        <rect x="16" y="22" width="48" height="38" rx="8" stroke-width="2.5"/>
        <!-- Antena -->
        <line x1="40" y1="22" x2="40" y2="13" stroke-width="2.5"/>
        <circle cx="40" cy="10" r="3.5" stroke-width="2.5"/>
        <!-- Ojos: doble círculo izquierdo -->
        <circle cx="29" cy="37" r="7" stroke-width="2.2"/>
        <circle cx="29" cy="37" r="3" fill="rgba(255,255,255,0.7)" stroke="none"/>
        <!-- Ojos: doble círculo derecho -->
        <circle cx="51" cy="37" r="7" stroke-width="2.2"/>
        <circle cx="51" cy="37" r="3" fill="rgba(255,255,255,0.7)" stroke="none"/>
        <!-- Boca -->
        <path d="M27 52 Q40 58 53 52" stroke-width="2.5" fill="none"/>
        <!-- Brazos laterales -->
        <rect x="5"  y="30" width="11" height="6" rx="3" stroke-width="2.2"/>
        <rect x="64" y="30" width="11" height="6" rx="3" stroke-width="2.2"/>
    </svg>`,

    // Módulo 5 — Artes: Formas geométricas superpuestas
    5: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="white" stroke-linecap="round" stroke-linejoin="round">
        <!-- Diamante (cuadrado rotado) -->
        <path d="M40 8 L62 32 L40 56 L18 32 Z" stroke-width="2.5"/>
        <!-- Rectángulo superpuesto (desplazado) -->
        <rect x="28" y="38" width="34" height="32" rx="6" stroke-width="2.5"/>
        <!-- Detalles interiores del rect -->
        <line x1="35" y1="48" x2="55" y2="48" stroke="rgba(255,255,255,0.55)" stroke-width="1.8"/>
        <line x1="35" y1="56" x2="50" y2="56" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>
    </svg>`,
};

// Ilustración para tarjetas de quiz — trazo blanco estilo outline
const QUIZ_SVG = `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
        stroke="white" stroke-linecap="round" stroke-linejoin="round">
    <!-- Documento base -->
    <rect x="14" y="8" width="52" height="64" rx="8" stroke-width="2.5"/>
    <!-- Signo de interrogación -->
    <path d="M32 28 C32 20 48 18 48 28 C48 34 40 35 40 42" stroke-width="3" fill="none"/>
    <circle cx="40" cy="49" r="2.5" fill="white" stroke="none"/>
    <!-- Líneas decorativas abajo -->
    <line x1="22" y1="58" x2="58" y2="58" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-dasharray="4 3"/>
    <line x1="22" y1="65" x2="47" y2="65" stroke="rgba(255,255,255,0.35)" stroke-width="1.8" stroke-dasharray="4 3"/>
</svg>`;

// ════════════════════════════════════════════════════════════
// RUTA: DOCENTE Y LA IA — temas e ilustraciones por curso
// ════════════════════════════════════════════════════════════

// ── Docente y la Inteligencia Artificial (verde esmeralda) ──
const IAF_THEME = {
    1: { primary: '#10B981', soft: '#D1FAE5' }, 2: { primary: '#059669', soft: '#D1FAE5' },
    3: { primary: '#047857', soft: '#A7F3D0' }, 4: { primary: '#34D399', soft: '#ECFDF5' },
};
const IAF_ILLUS = {
    // Módulo 1 — ¿Qué es la IA?: chip con nodos neuronales
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="26" width="28" height="28" rx="4" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="40" r="6" stroke-width="2.2"/><line x1="40" y1="10" x2="40" y2="26" stroke-width="2.2"/><line x1="40" y1="54" x2="40" y2="70" stroke-width="2.2"/><line x1="10" y1="40" x2="26" y2="40" stroke-width="2.2"/><line x1="54" y1="40" x2="70" y2="40" stroke-width="2.2"/><circle cx="40" cy="8" r="3" fill="rgba(255,255,255,0.5)" stroke="none"/><circle cx="40" cy="72" r="3" fill="rgba(255,255,255,0.5)" stroke="none"/><circle cx="8" cy="40" r="3" fill="rgba(255,255,255,0.5)" stroke="none"/><circle cx="72" cy="40" r="3" fill="rgba(255,255,255,0.5)" stroke="none"/></svg>`,
    // Módulo 2 — Prompts: burbuja de chat con cursor
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18 H66 V50 H36 L24 62 V50 H14 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><line x1="24" y1="30" x2="52" y2="30" stroke-width="2" stroke="rgba(255,255,255,0.6)"/><line x1="24" y1="40" x2="44" y2="40" stroke-width="2" stroke="rgba(255,255,255,0.6)"/><line x1="56" y1="34" x2="56" y2="46" stroke-width="2.5"/></svg>`,
    // Módulo 3 — Asistente pedagógico: chip + libro
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22 C14 22 26 18 30 24 V58 C26 52 14 56 14 56 Z" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><path d="M66 22 C66 22 54 18 50 24 V58 C54 52 66 56 66 56 Z" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><line x1="40" y1="22" x2="40" y2="58" stroke-width="2"/><rect x="34" y="6" width="12" height="12" rx="2.5" stroke-width="2.2"/><circle cx="40" cy="12" r="2" fill="rgba(255,255,255,0.6)" stroke="none"/></svg>`,
    // Módulo 4 — Ética y límites: escudo con balanza
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8 L64 18 V38 C64 54 52 66 40 72 C28 66 16 54 16 38 V18 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><line x1="40" y1="24" x2="40" y2="52" stroke-width="2.2"/><path d="M26 32 L40 28 L54 32" stroke-width="2" fill="none"/><circle cx="26" cy="38" r="6" stroke-width="1.8"/><circle cx="54" cy="38" r="6" stroke-width="1.8"/></svg>`,
};

// ── IA para Ahorrar Tiempo (naranja) ──
const IAT_THEME = {
    1: { primary: '#F97316', soft: '#FFEDD5' }, 2: { primary: '#EA580C', soft: '#FFEDD5' },
    3: { primary: '#C2410C', soft: '#FFF7ED' }, 4: { primary: '#FB923C', soft: '#FFF7ED' },
};
const IAT_ILLUS = {
    // Módulo 1 — El problema del tiempo: reloj con papeles apilados
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="34" cy="44" r="20" stroke-width="2.5" fill="rgba(255,255,255,0.08)"/><line x1="34" y1="44" x2="34" y2="31" stroke-width="2.5"/><line x1="34" y1="44" x2="43" y2="48" stroke-width="2.5"/><rect x="50" y="14" width="20" height="14" rx="2" stroke-width="2" fill="rgba(255,255,255,0.15)"/><rect x="54" y="10" width="20" height="14" rx="2" stroke-width="2" fill="rgba(255,255,255,0.1)"/></svg>`,
    // Módulo 2 — Planificación rápida: checklist con rayo
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="10" width="40" height="56" rx="6" stroke-width="2.5"/><path d="M22 24 L26 28 L34 20" stroke-width="2.2"/><path d="M22 38 L26 42 L34 34" stroke-width="2.2"/><line x1="40" y1="24" x2="48" y2="24" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="40" y1="38" x2="48" y2="38" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><path d="M62 30 L52 48 L60 48 L54 66 L70 44 L61 44 Z" fill="rgba(255,255,255,0.35)" stroke-width="1.8"/></svg>`,
    // Módulo 3 — Calificación ágil: lápiz-check con líneas de velocidad
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M20 60 L48 32 L58 42 L30 70 L18 72 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><line x1="42" y1="38" x2="52" y2="48" stroke-width="2"/><path d="M52 12 L58 18" stroke-width="2.2" stroke="rgba(255,255,255,0.55)"/><path d="M60 16 L68 20" stroke-width="2.2" stroke="rgba(255,255,255,0.4)"/><path d="M58 24 L66 26" stroke-width="2.2" stroke="rgba(255,255,255,0.3)"/></svg>`,
    // Módulo 4 — Comunicación y organización: sobre con carpeta
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="20" width="40" height="30" rx="4" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M12 22 L32 38 L52 22" stroke-width="2.2"/><path d="M50 44 H68 V62 H50 Z" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><path d="M50 44 L59 50 L68 44" stroke-width="2"/></svg>`,
};

// ── Herramientas de IA Gratuitas (violeta) ──
const IAH_THEME = {
    1: { primary: '#8B5CF6', soft: '#EDE9FE' }, 2: { primary: '#7C3AED', soft: '#EDE9FE' },
    3: { primary: '#6D28D9', soft: '#F5F3FF' }, 4: { primary: '#A78BFA', soft: '#F5F3FF' },
};
const IAH_ILLUS = {
    // Módulo 1 — Panorama de herramientas: caja de herramientas abierta
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36 H68 V64 C68 67 66 69 63 69 H17 C14 69 12 67 12 64 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M26 36 V26 C26 22 29 19 33 19 H47 C51 19 54 22 54 26 V36" stroke-width="2.5"/><line x1="12" y1="48" x2="68" y2="48" stroke-width="2.2"/><rect x="34" y="42" width="12" height="12" rx="2" stroke-width="2" fill="rgba(255,255,255,0.2)"/></svg>`,
    // Módulo 2 — IA de texto: burbuja con líneas de texto
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16 H66 V48 H38 L26 60 V48 H14 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><line x1="22" y1="26" x2="58" y2="26" stroke-width="2" stroke="rgba(255,255,255,0.6)"/><line x1="22" y1="34" x2="58" y2="34" stroke-width="2" stroke="rgba(255,255,255,0.6)"/><line x1="22" y1="42" x2="42" y2="42" stroke-width="2" stroke="rgba(255,255,255,0.6)"/></svg>`,
    // Módulo 3 — IA de imagen: marco con pincel y destello
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="16" width="48" height="38" rx="4" stroke-width="2.5"/><path d="M12 46 L28 32 L38 42 L48 28 L60 40" stroke-width="2.2"/><circle cx="24" cy="26" r="4" fill="rgba(255,255,255,0.4)" stroke="none"/><path d="M62 54 L66 62 L74 66 L66 70 L62 78 L58 70 L50 66 L58 62 Z" fill="rgba(255,255,255,0.3)" stroke-width="1.6"/></svg>`,
    // Módulo 4 — IA de voz y flujo completo: micrófono con ondas
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="10" width="16" height="28" rx="8" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/><path d="M22 34 Q22 52 40 52 Q58 52 58 34" stroke-width="2.3" fill="none"/><line x1="40" y1="52" x2="40" y2="62" stroke-width="2.3"/><line x1="30" y1="62" x2="50" y2="62" stroke-width="2.3"/><path d="M12 28 Q8 34 12 40" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><path d="M68 28 Q72 34 68 40" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/></svg>`,
};

// ── IA e Inclusión Educativa (cian) ──
const IAI_THEME = {
    1: { primary: '#06B6D4', soft: '#CFFAFE' }, 2: { primary: '#0891B2', soft: '#CFFAFE' },
    3: { primary: '#0E7490', soft: '#ECFEFF' }, 4: { primary: '#22D3EE', soft: '#ECFEFF' },
};
const IAI_ILLUS = {
    // Módulo 1 — IA como equidad: balanza equilibrada
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><line x1="40" y1="12" x2="40" y2="58" stroke-width="2.5"/><line x1="18" y1="24" x2="62" y2="24" stroke-width="2.3"/><path d="M10 24 L18 24 L14 40 Q14 46 22 46 Q30 46 26 40 Z" stroke-width="2" fill="rgba(255,255,255,0.12)"/><path d="M54 24 L62 24 L58 40 Q58 46 66 46 Q74 46 70 40 Z" stroke-width="2" fill="rgba(255,255,255,0.12)"/><path d="M28 66 Q40 58 52 66" stroke-width="2.3"/></svg>`,
    // Módulo 2 — Accesibilidad: oreja y ojo
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M28 20 C40 12 54 20 54 34 C54 44 46 46 46 54 C46 60 40 62 36 58" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="42" cy="34" r="4" stroke-width="2"/><path d="M14 62 Q40 44 66 62" stroke-width="2.3"/><circle cx="40" cy="60" r="5" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/></svg>`,
    // Módulo 3 — Diferenciación curricular: tres barras de nivel
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="46" width="14" height="24" rx="3" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><rect x="33" y="30" width="14" height="40" rx="3" stroke-width="2.3" fill="rgba(255,255,255,0.2)"/><rect x="52" y="14" width="14" height="56" rx="3" stroke-width="2.3" fill="rgba(255,255,255,0.25)"/></svg>`,
    // Módulo 4 — Brecha digital: puente sobre señal
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M10 44 Q40 22 70 44" stroke-width="2.5" fill="none"/><line x1="10" y1="44" x2="10" y2="58" stroke-width="2.3"/><line x1="70" y1="44" x2="70" y2="58" stroke-width="2.3"/><line x1="22" y1="46" x2="22" y2="58" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="34" y1="40" x2="34" y2="58" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="46" y1="40" x2="46" y2="58" stroke-width="2" stroke="rgba(255,255,255,0.5)"/><line x1="58" y1="46" x2="58" y2="58" stroke-width="2" stroke="rgba(255,255,255,0.5)"/></svg>`,
};

// ── Ciudadanía Digital con IA (rosa) ──
const IAC_THEME = {
    1: { primary: '#EC4899', soft: '#FCE7F3' }, 2: { primary: '#DB2777', soft: '#FCE7F3' },
    3: { primary: '#BE185D', soft: '#FDF2F8' }, 4: { primary: '#F472B6', soft: '#FDF2F8' },
};
const IAC_ILLUS = {
    // Módulo 1 — Por qué enseñar IA a estudiantes: figuras con chip
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="26" cy="24" r="8" stroke-width="2.3"/><path d="M12 52 C12 40 18 34 26 34 C34 34 40 40 40 52" stroke-width="2.3"/><rect x="48" y="30" width="24" height="24" rx="4" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><circle cx="60" cy="42" r="5" stroke-width="1.8"/></svg>`,
    // Módulo 2 — Pensamiento crítico: lupa sobre chip
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="18" width="30" height="30" rx="4" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><line x1="26" y1="28" x2="40" y2="28" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><line x1="26" y1="36" x2="34" y2="36" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><circle cx="54" cy="52" r="14" stroke-width="2.5"/><line x1="64" y1="62" x2="72" y2="70" stroke-width="2.5"/></svg>`,
    // Módulo 3 — Integridad académica: birrete con escudo
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 16 L70 28 L40 40 L10 28 Z" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><path d="M22 32 V46 C22 52 30 58 40 58 C50 58 58 52 58 46 V32" stroke-width="2.2"/><path d="M35 44 L39 48 L46 40" stroke-width="2.2"/></svg>`,
    // Módulo 4 — Seguridad y bienestar digital: candado con corazón
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="36" width="40" height="30" rx="5" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M28 36 V26 C28 18 33 12 40 12 C47 12 52 18 52 26 V36" stroke-width="2.3"/><path d="M40 46 C40 43 36 41 34 44 C32 47 34 50 40 55 C46 50 48 47 46 44 C44 41 40 43 40 46 Z" fill="rgba(255,255,255,0.5)" stroke-width="1.6"/></svg>`,
};

// ════════════════════════════════════════════════════════════
// RUTA: CLIMA Y CONVIVENCIA ESCOLAR — temas e ilustraciones
// ════════════════════════════════════════════════════════════

// ── Manejo de Conductas Desafiantes (teal) ──
const MJC_THEME = {
    1: { primary: '#0891B2', soft: '#CFFAFE' }, 2: { primary: '#0E7490', soft: '#CFFAFE' },
    3: { primary: '#155E75', soft: '#ECFEFF' }, 4: { primary: '#22D3EE', soft: '#ECFEFF' },
};
const MJC_ILLUS = {
    // Módulo 1 — Entendiendo la conducta: iceberg (visible + oculto)
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M32 20 L48 20 L54 34 L26 34 Z" stroke-width="2.3" fill="rgba(255,255,255,0.2)"/><line x1="10" y1="34" x2="70" y2="34" stroke-width="1.8" stroke="rgba(255,255,255,0.4)" stroke-dasharray="4 3"/><path d="M18 34 L62 34 L70 62 L10 62 Z" stroke-width="2.3" fill="rgba(255,255,255,0.08)"/></svg>`,
    // Módulo 2 — Prevención: escudo con aula
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8 L64 18 V38 C64 54 52 66 40 72 C28 66 16 54 16 38 V18 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M28 44 L28 32 L40 24 L52 32 L52 44" stroke-width="2.2"/><rect x="33" y="44" width="14" height="12" stroke-width="2"/></svg>`,
    // Módulo 3 — Intervención en el momento: manos calmando
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M14 46 C14 46 20 34 30 34 C36 34 38 38 38 42" stroke-width="2.3" fill="none"/><path d="M66 46 C66 46 60 34 50 34 C44 34 42 38 42 42" stroke-width="2.3" fill="none"/><circle cx="40" cy="46" r="10" stroke-width="2.2" fill="rgba(255,255,255,0.15)"/><path d="M35 46 Q40 51 45 46" stroke-width="1.8"/></svg>`,
    // Módulo 4 — Reparación y consistencia: brote creciendo
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><line x1="40" y1="66" x2="40" y2="34" stroke-width="2.5"/><path d="M40 46 C40 46 26 42 24 28 C34 26 40 34 40 46Z" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><path d="M40 38 C40 38 54 34 56 20 C46 18 40 26 40 38Z" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><path d="M28 66 Q40 62 52 66" stroke-width="2.3"/></svg>`,
};

// ── Aprendizaje Socioemocional (SEL) (magenta) ──
const SEL_THEME = {
    1: { primary: '#DB2777', soft: '#FCE7F3' }, 2: { primary: '#BE185D', soft: '#FCE7F3' },
    3: { primary: '#9D174D', soft: '#FDF2F8' }, 4: { primary: '#EC4899', soft: '#FDF2F8' },
};
const SEL_ILLUS = {
    // Módulo 1 — Qué es el SEL: corazón dentro de silueta de cabeza
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 12 C24 12 16 24 16 36 C16 46 22 52 26 58 L26 68 H54 L54 58 C58 52 64 46 64 36 C64 24 56 12 40 12Z" stroke-width="2.4" fill="rgba(255,255,255,0.08)"/><path d="M40 44 C40 40 34 37 31 41 C28 45 31 49 40 56 C49 49 52 45 49 41 C46 37 40 40 40 44Z" fill="rgba(255,255,255,0.5)" stroke-width="1.6"/></svg>`,
    // Módulo 2 — Autoconciencia y autorregulación: figura respirando (ondas)
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="20" r="9" stroke-width="2.3"/><path d="M24 62 C24 46 30 40 40 40 C50 40 56 46 56 62" stroke-width="2.3"/><path d="M14 62 Q22 56 30 62" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><path d="M50 62 Q58 56 66 62" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/></svg>`,
    // Módulo 3 — Conciencia social y empatía: dos burbujas de corazón superpuestas
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="30" cy="38" r="18" stroke-width="2.3" fill="rgba(255,255,255,0.08)"/><circle cx="52" cy="42" r="16" stroke-width="2.3" fill="rgba(255,255,255,0.08)"/><path d="M38 36 C38 33 34 31 32 34 C30 37 32 40 38 45 C44 40 46 37 44 34 C42 31 38 33 38 36Z" fill="rgba(255,255,255,0.5)" stroke="none"/></svg>`,
    // Módulo 4 — Habilidades relacionales: nodos conectados con check
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="24" r="7" stroke-width="2.2"/><circle cx="62" cy="24" r="7" stroke-width="2.2"/><circle cx="40" cy="52" r="7" stroke-width="2.2"/><line x1="23" y1="29" x2="35" y2="47" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><line x1="57" y1="29" x2="45" y2="47" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><line x1="25" y1="24" x2="55" y2="24" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><path d="M35 60 L39 64 L47 55" stroke-width="2.3"/></svg>`,
};

// ── Comunicación Asertiva y Resolución de Conflictos (violeta) ──
const COM_THEME = {
    1: { primary: '#7C3AED', soft: '#EDE9FE' }, 2: { primary: '#6D28D9', soft: '#EDE9FE' },
    3: { primary: '#5B21B6', soft: '#F5F3FF' }, 4: { primary: '#8B5CF6', soft: '#F5F3FF' },
};
const COM_ILLUS = {
    // Módulo 1 — Los tres estilos: tres burbujas de habla distintas
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="20" cy="26" rx="12" ry="9" stroke-width="2" stroke-dasharray="3 3" fill="rgba(255,255,255,0.06)"/><path d="M32 46 H60 V62 H44 L38 70 V62 H32 Z" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><path d="M50 12 L66 12 L70 20 L66 28 L50 28 Z" stroke-width="2.2" fill="rgba(255,255,255,0.1)"/></svg>`,
    // Módulo 2 — Escucha activa: oreja con ondas de sonido
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M30 22 C42 14 56 22 56 36 C56 46 48 48 48 56 C48 62 42 64 38 60" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="44" cy="36" r="4" stroke-width="2"/><path d="M14 30 Q10 40 14 50" stroke-width="1.8" stroke="rgba(255,255,255,0.45)"/><path d="M20 26 Q14 40 20 54" stroke-width="1.8" stroke="rgba(255,255,255,0.3)"/></svg>`,
    // Módulo 3 — Mediación de conflictos: dos figuras con puente
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="24" r="7" stroke-width="2.2"/><path d="M6 50 C6 40 10 34 16 34 C22 34 26 40 26 50" stroke-width="2.2"/><circle cx="64" cy="24" r="7" stroke-width="2.2"/><path d="M54 50 C54 40 58 34 64 34 C70 34 74 40 74 50" stroke-width="2.2"/><path d="M24 58 Q40 48 56 58" stroke-width="2.3" stroke-dasharray="4 3"/></svg>`,
    // Módulo 4 — Comunicación con padres y colegas: burbuja con familia
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16 H68 V48 H42 L32 60 V48 H12 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="28" cy="28" r="5" stroke-width="2"/><circle cx="46" cy="28" r="5" stroke-width="2"/><path d="M20 40 C20 34 24 31 28 31 C32 31 36 34 36 40" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/><path d="M38 40 C38 34 42 31 46 31 C50 31 54 34 54 40" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/></svg>`,
};

// ── Disciplina Positiva y Motivación Intrínseca (naranja intenso) ──
const DIS_THEME = {
    1: { primary: '#EA580C', soft: '#FFEDD5' }, 2: { primary: '#C2410C', soft: '#FFEDD5' },
    3: { primary: '#9A3412', soft: '#FFF7ED' }, 4: { primary: '#F97316', soft: '#FFF7ED' },
};
const DIS_ILLUS = {
    // Módulo 1 — Límites de premios y castigos: estrella con línea descendente
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 10 L46 26 L64 26 L50 37 L55 55 L40 44 L25 55 L30 37 L16 26 L34 26 Z" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><path d="M14 66 L30 60 L46 64 L66 54" stroke-width="2" stroke="rgba(255,255,255,0.45)" stroke-dasharray="4 3"/></svg>`,
    // Módulo 2 — Tres pilares de la motivación: tres columnas
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="42" width="14" height="28" rx="2" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><rect x="33" y="26" width="14" height="44" rx="2" stroke-width="2.3" fill="rgba(255,255,255,0.2)"/><rect x="52" y="34" width="14" height="36" rx="2" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><line x1="10" y1="70" x2="70" y2="70" stroke-width="2.3"/></svg>`,
    // Módulo 3 — Firme y amable: escudo con corazón
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8 L64 18 V38 C64 54 52 66 40 72 C28 66 16 54 16 38 V18 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><path d="M40 34 C40 31 36 29 34 32 C32 35 34 38 40 43 C46 38 48 35 46 32 C44 29 40 31 40 34Z" fill="rgba(255,255,255,0.5)" stroke="none"/></svg>`,
    // Módulo 4 — Sostener la motivación: planta con flecha ascendente
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><line x1="24" y1="70" x2="24" y2="44" stroke-width="2.3"/><path d="M24 54 C24 54 14 50 13 40 C21 39 24 46 24 54Z" stroke-width="2" fill="rgba(255,255,255,0.15)"/><path d="M24 48 C24 48 34 44 35 34 C27 33 24 40 24 48Z" stroke-width="2" fill="rgba(255,255,255,0.1)"/><path d="M46 62 L58 44 L52 44 L64 26 L58 40 L64 40 Z" stroke-width="2.2" fill="rgba(255,255,255,0.3)"/></svg>`,
};

// ── Bienestar Docente: Prevención del Desgaste (verde) ──
const BIE_THEME = {
    1: { primary: '#16A34A', soft: '#DCFCE7' }, 2: { primary: '#15803D', soft: '#DCFCE7' },
    3: { primary: '#166534', soft: '#F0FDF4' }, 4: { primary: '#4ADE80', soft: '#F0FDF4' },
};
const BIE_ILLUS = {
    // Módulo 1 — Qué es el burnout: llama/batería agotándose
    1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="18" width="28" height="48" rx="6" stroke-width="2.5"/><rect x="34" y="10" width="12" height="8" rx="2" stroke-width="2.2"/><rect x="30" y="46" width="20" height="16" fill="rgba(255,255,255,0.3)" stroke="none"/><line x1="30" y1="38" x2="50" y2="38" stroke-width="1.6" stroke="rgba(255,255,255,0.3)"/><line x1="30" y1="30" x2="50" y2="30" stroke-width="1.6" stroke="rgba(255,255,255,0.15)"/></svg>`,
    // Módulo 2 — Regulación emocional: figura con ondas de calma (loto)
    2: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="44" r="8" stroke-width="2.3" fill="rgba(255,255,255,0.15)"/><path d="M40 36 C40 36 32 24 20 28 C24 40 34 40 40 36Z" stroke-width="2" fill="rgba(255,255,255,0.1)"/><path d="M40 36 C40 36 48 24 60 28 C56 40 46 40 40 36Z" stroke-width="2" fill="rgba(255,255,255,0.1)"/><path d="M20 60 Q40 52 60 60" stroke-width="2" stroke="rgba(255,255,255,0.4)"/></svg>`,
    // Módulo 3 — Límites y sostenibilidad: escudo con figura
    3: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8 L64 18 V38 C64 54 52 66 40 72 C28 66 16 54 16 38 V18 Z" stroke-width="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="32" r="6" stroke-width="2.2"/><path d="M28 52 C28 44 33 40 40 40 C47 40 52 44 52 52" stroke-width="2.2"/></svg>`,
    // Módulo 4 — Práctica sostenible: árbol con raíces
    4: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="28" r="16" stroke-width="2.3" fill="rgba(255,255,255,0.1)"/><line x1="40" y1="42" x2="40" y2="58" stroke-width="2.3"/><path d="M40 58 L28 70 M40 58 L52 70 M40 62 L34 72 M40 62 L46 72" stroke-width="1.8" stroke="rgba(255,255,255,0.5)"/></svg>`,
};

// ── Ruta Educación Inclusiva — cada curso con su propio ícono (escalado 2x
// desde su `icon` en data.js), en vez de caer al ilustración por defecto de
// STEAM/ciencias cuando un courseId no está en el switch de arriba.
const EDU_INCL_ILLUS = { 1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="32" r="12" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><circle cx="52" cy="32" r="12" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><path d="M16 60c0-10 6-16 12-16h24c6 0 12 6 12 16" stroke-width="2.3"/></svg>` };
const TEA_PROF_ILLUS  = { 1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="10" stroke-width="2.3" fill="rgba(255,255,255,0.12)"/><line x1="40" y1="8" x2="40" y2="22" stroke-width="2.3"/><line x1="40" y1="58" x2="40" y2="72" stroke-width="2.3"/><line x1="8" y1="40" x2="22" y2="40" stroke-width="2.3"/><line x1="58" y1="40" x2="72" y2="40" stroke-width="2.3"/><line x1="18" y1="18" x2="28" y2="28" stroke-width="2"/><line x1="52" y1="52" x2="62" y2="62" stroke-width="2"/></svg>` };
const DOWN_TDAH_ILLUS = { 1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M12 68h14v-16h14v-16h14v-16h14" stroke-width="2.5"/><circle cx="68" cy="20" r="3.5" fill="white" stroke="none"/></svg>` };
const LSG_ILLUS       = { 1: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M26 38V16a4 4 0 018 0v18M36 36V12a4 4 0 018 0v22M46 36V16a4 4 0 018 0v18M54 38v-12a4 4 0 018 0v20c0 12-8 22-22 22h-2c-10 0-14-4-18-12l-8-14a4 4 0 016.8-4.4l5.2 7.6" stroke-width="2" fill="rgba(255,255,255,0.1)"/></svg>` };

// Función que retorna theme+illus para el módulo activo de las 2 nuevas rutas
function getConvivenciaOrIaThemeAndIllus(courseId, moduleIndex) {
    const map = {
        'ia-fundamentos':      { THEME: IAF_THEME, ILLUS: IAF_ILLUS, fallback: '#10B981', fallbackSoft: '#D1FAE5' },
        'ia-tiempo':           { THEME: IAT_THEME, ILLUS: IAT_ILLUS, fallback: '#F97316', fallbackSoft: '#FFEDD5' },
        'ia-herramientas':     { THEME: IAH_THEME, ILLUS: IAH_ILLUS, fallback: '#8B5CF6', fallbackSoft: '#EDE9FE' },
        'ia-inclusion':        { THEME: IAI_THEME, ILLUS: IAI_ILLUS, fallback: '#06B6D4', fallbackSoft: '#CFFAFE' },
        'ia-ciudadania':       { THEME: IAC_THEME, ILLUS: IAC_ILLUS, fallback: '#EC4899', fallbackSoft: '#FCE7F3' },
        'manejo-conductas':    { THEME: MJC_THEME, ILLUS: MJC_ILLUS, fallback: '#0891B2', fallbackSoft: '#CFFAFE' },
        'sel-docentes':        { THEME: SEL_THEME, ILLUS: SEL_ILLUS, fallback: '#DB2777', fallbackSoft: '#FCE7F3' },
        'comunicacion-asertiva': { THEME: COM_THEME, ILLUS: COM_ILLUS, fallback: '#7C3AED', fallbackSoft: '#EDE9FE' },
        'disciplina-positiva': { THEME: DIS_THEME, ILLUS: DIS_ILLUS, fallback: '#EA580C', fallbackSoft: '#FFEDD5' },
        'bienestar-docente':   { THEME: BIE_THEME, ILLUS: BIE_ILLUS, fallback: '#16A34A', fallbackSoft: '#DCFCE7' },
        'educacion-inclusiva':     { THEME: {}, ILLUS: EDU_INCL_ILLUS,  fallback: '#8B5CF6', fallbackSoft: '#EDE9FE' },
        'tea-profundidad':         { THEME: {}, ILLUS: TEA_PROF_ILLUS,  fallback: '#6366F1', fallbackSoft: '#E0E7FF' },
        'discapacidad-down-tdah':  { THEME: {}, ILLUS: DOWN_TDAH_ILLUS, fallback: '#F59E0B', fallbackSoft: '#FEF3C7' },
        'lengua-senas-docentes':   { THEME: {}, ILLUS: LSG_ILLUS,       fallback: '#0EA5E9', fallbackSoft: '#E0F2FE' },
    };
    const m = map[courseId];
    if (!m) return null;
    return {
        theme: m.THEME[moduleIndex] || { primary: m.fallback, soft: m.fallbackSoft },
        illus: m.ILLUS[moduleIndex] || m.ILLUS[1]
    };
}
