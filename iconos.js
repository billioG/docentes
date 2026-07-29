// ============================================================
// ICONOS SVG — Sistema de iconos contextual para Curso STEAM 2.0
// Todos los iconos son inline SVG con currentColor para heredar color CSS.
// Uso: elemento.innerHTML = ICONS.home  o  `${ICONS.checkCircle}`
// ============================================================

const ICONS = {

  // ── NAVEGACIÓN INFERIOR ──────────────────────────────────

  // Inicio: tarjetas apiladas con flecha de "jugar"
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="3"/>
    <rect x="5" y="3" width="14" height="14" rx="2.5" fill="currentColor" fill-opacity=".08"/>
    <path d="M10 10l4 2-4 2V10z" stroke-width="1.6" fill="currentColor"/>
  </svg>`,

  // Módulos: libro abierto con marcador
  modules: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="13" y2="11"/>
  </svg>`,

  // Perfil: docente con toga
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    <path d="M9 6.5L12 5l3 1.5" stroke-width="1.5"/>
    <path d="M16 6l1-1" stroke-width="1.5"/>
  </svg>`,

  // Ranking: copa con estrella
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 21h8M12 17v4"/>
    <path d="M7 4H5a2 2 0 000 4c0 2.5 2 4.5 4.5 5"/>
    <path d="M17 4h2a2 2 0 010 4c0 2.5-2 4.5-4.5 5"/>
    <path d="M7 4h10v6a5 5 0 01-10 0V4z"/>
    <path d="M11 9l.6 1.2 1.4.2-1 1 .2 1.4L11 12l-1.2.8.2-1.4-1-1 1.4-.2L11 9z" stroke-width="1.2" fill="currentColor" fill-opacity=".5"/>
  </svg>`,

  // Biblioteca: libros apilados (distinto del "modules" — libro abierto)
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="7" height="17" rx="1.5" fill="currentColor" fill-opacity=".1"/>
    <rect x="12" y="2" width="7" height="19" rx="1.5" fill="currentColor" fill-opacity=".15"/>
    <line x1="5.5" y1="8" x2="7.5" y2="8" stroke-width="1.5"/>
  </svg>`,

  // Progreso: barras de tendencia ascendente
  progress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="13" width="4" height="7" rx="1" fill="currentColor" fill-opacity=".15"/>
    <rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" fill-opacity=".15"/>
    <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" fill-opacity=".15"/>
  </svg>`,

  // ── PERFIL — BOTONES DE ACCIÓN ───────────────────────────

  // Examen Final: clipboard con lápiz
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>`,

  // Mis Logros: medalla con cinta
  medal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="15" r="5"/>
    <path d="M8.5 2l-2 5h7L12 2l-3.5 0z"/>
    <path d="M8 7l-1.5 3.5"/>
    <path d="M16 7l1.5 3.5"/>
    <path d="M11 13.5l.6 1.2 1.4.2-.9 1 .2 1.4L12 16.5l-1.2.8.2-1.4-.9-1 1.4-.2L11 13.5z" stroke-width="1.2" fill="currentColor" fill-opacity=".6"/>
  </svg>`,

  // Estadísticas: gráfica de barras creciendo
  barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="20" x2="21" y2="20"/>
    <rect x="4" y="14" width="4" height="6" rx="1"/>
    <rect x="10" y="9" width="4" height="11" rx="1"/>
    <rect x="16" y="4" width="4" height="16" rx="1"/>
    <path d="M5 14l5-5 4 3 5-6" stroke-width="1.5" stroke-dasharray="2 1.5"/>
  </svg>`,

  // Racha: llama
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c1 4-4 5-4 9a4 4 0 008 0c0-2.5-1.5-4-1.5-6" fill="currentColor" fill-opacity=".15"/>
    <path d="M9.5 14c0 2 1.1 3.5 2.5 3.5s2.5-1.2 2.5-3.5" fill="currentColor" fill-opacity=".3"/>
  </svg>`,

  // Ligas/récords altos: gema
  gem: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3h12l3 5-9 13L3 8z" fill="currentColor" fill-opacity=".15"/>
    <path d="M3 8h18M9 3l-2 5 5 13 5-13-2-5" stroke-width="1.5"/>
  </svg>`,

  // Podio del ranking: corona del 1er lugar
  crown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" fill="currentColor" fill-opacity=".25"/>
  </svg>`,

  // XP / energía: rayo
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" fill-opacity=".2"/>
  </svg>`,

  // Misiones de tarjetas: mazo de tarjetas
  cards: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="7" width="14" height="14" rx="2" fill="currentColor" fill-opacity=".1"/>
    <path d="M7 7V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
  </svg>`,

  // "Lo apliqué en clase": manzana
  apple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 9c-3.5 0-6 2.5-6 6.5S8 21 11 21c.7 0 1.3-.2 1-.2s.3.2 1 .2c3 0 5-2 5-5.5S15.5 9 12 9z" fill="currentColor" fill-opacity=".15"/>
    <path d="M12 9c0-2 1-3.5 3-4" stroke-width="1.6"/>
  </svg>`,

  // Racha rota / bloqueado temporal: copo de nieve (protector de racha)
  snowflake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="4" y1="7" x2="20" y2="17"/>
    <line x1="4" y1="17" x2="20" y2="7"/>
  </svg>`,

  // Misión pendiente: reloj de arena
  hourglass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" fill="currentColor" fill-opacity=".1"/>
  </svg>`,

  // Misión desbloqueada sin reclamar: candado abierto
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="11" width="14" height="9" rx="2" fill="currentColor" fill-opacity=".12"/>
    <path d="M7.5 11V7.5a4 4 0 017-2.6"/>
  </svg>`,

  // Misiones: diana con flecha
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <line x1="19" y1="5" x2="14" y2="10"/>
    <path d="M21 3l-3 .5-.5 3"/>
  </svg>`,

  // Chevron abajo
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`,

  // Certificado: diploma con cinta y lazo
  certificate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="6" y1="8" x2="13" y2="8"/>
    <line x1="6" y1="12" x2="10" y2="12"/>
    <circle cx="17" cy="15" r="3"/>
    <path d="M15 18l-1.5 3 1.5-1 1.5 1L15 18z" fill="currentColor" stroke-width="1.2"/>
  </svg>`,

  // Compartir: tres nodos conectados
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.7" y1="10.7" x2="15.3" y2="6.3"/>
    <line x1="8.7" y1="13.3" x2="15.3" y2="17.7"/>
  </svg>`,

  // Referir colega: dos personas
  addUser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="17" y1="11" x2="23" y2="11"/>
  </svg>`,

  // Evidencia / Cámara: lente con cuerpo
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
    <circle cx="12" cy="13" r="2" stroke-width="1.4"/>
  </svg>`,

  // Nube con flecha arriba (sync / upload)
  cloudUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.4 15.4A5 5 0 0018 6h-1.3A8 8 0 103 16.3"/>
  </svg>`,

  // Sincronizar: flechas circulares
  sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.5 9A9 9 0 0121 11"/>
    <path d="M20.5 15A9 9 0 013 13"/>
  </svg>`,

  // Cambiar curso: libro con flechas (intercambio)
  switchCourse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    <path d="M7 16l-3 3 3 3" stroke-width="1.6"/>
    <path d="M17 4l3 3-3 3" stroke-width="1.6"/>
  </svg>`,

  // Tutorial: brújula / mapa con ruta
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fill-opacity=".15"/>
    <line x1="12" y1="2" x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
  </svg>`,

  // Cerrar sesión: puerta con flecha saliendo
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>`,

  // Editar: lápiz escribiendo
  pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`,

  // ── TARJETAS ─────────────────────────────────────────────

  // Comentarios: burbuja de diálogo con puntos
  comments: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>`,

  // Flecha izquierda (swipe / anterior)
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>`,

  // Flecha derecha (swipe / siguiente)
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>`,

  // Mano apuntando (seleccionar quiz)
  pointer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 11V6a2 2 0 114 0v5"/>
    <path d="M13 11v-1a2 2 0 114 0v1"/>
    <path d="M17 12a2 2 0 114 0v2c0 3.3-2.7 6-6 6H8c-1.7 0-3.3-.8-4.3-2.2L2 16"/>
    <path d="M9 11a2 2 0 00-4 0v1l1.6 2"/>
  </svg>`,

  // Check circle (respuesta correcta)
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M7 12.5l3.5 3.5 6.5-7"/>
  </svg>`,

  // X circle (respuesta incorrecta)
  xCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>`,

  // Check simple (de acuerdo / canjeado)
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  // X simple (en desacuerdo)
  xMark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  // Bombilla (dato clave / reflexiona)
  lightbulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M12 2a7 7 0 017 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3A7 7 0 015 9a7 7 0 017-7z"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>`,

  // Flecha circular (repasar / refresh)
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.5 15A9 9 0 1021 11"/>
  </svg>`,

  // Estrella (premios / XP)
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" fill="currentColor" fill-opacity=".15"/>
  </svg>`,

  // Spinner (cargando)
  spinner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <circle cx="12" cy="12" r="9" stroke-opacity=".25"/>
    <path d="M12 3a9 9 0 019 9" stroke-dasharray="14 100"/>
    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
  </svg>`,

  // Chevron derecha (selector de curso)
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,

  // Copiar (link de referido)
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>`,

  // Descargar CSV
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`,

  // Borrar / papelera
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>`,

  // Video / cámara de video
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>`,

  // Enviar mensaje (avión de papel)
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>`,

  // ── ONBOARDING / DECORATIVOS ──────────────────────────────

  // Bienvenida: mano saludando (wave)
  wave: `<svg viewBox="0 0 80 80" fill="none" stroke="#1A6B68" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 14c0-3 4-3 4 0v16" stroke-width="3"/>
    <path d="M34 18c0-3 4-3 4 0v14" stroke-width="3"/>
    <path d="M38 20c0-3 4-3 4 0v12" stroke-width="3"/>
    <path d="M42 24c0-3 4-3 4 0v8"/>
    <path d="M30 22v8c0 6 4 12 10 14 6 2 12-2 14-8l2-8" stroke-width="3"/>
    <path d="M20 28c4-8 6-6 10-4" stroke-width="2"/>
    <circle cx="25" cy="22" r="3" fill="#1A6B68" fill-opacity=".15"/>
  </svg>`,

  // Tarjetas: mazo de flashcards
  flashCards: `<svg viewBox="0 0 80 80" fill="none" stroke="#07B0E4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="20" width="52" height="36" rx="6" fill="#07B0E4" fill-opacity=".08"/>
    <rect x="14" y="16" width="52" height="36" rx="6" fill="#07B0E4" fill-opacity=".12" stroke-dasharray="4 2"/>
    <rect x="18" y="12" width="52" height="36" rx="6" fill="white"/>
    <line x1="28" y1="26" x2="58" y2="26"/>
    <line x1="28" y1="33" x2="52" y2="33"/>
    <line x1="28" y1="40" x2="45" y2="40"/>
    <polygon points="50 42 62 36 62 48" fill="#07B0E4" fill-opacity=".6" stroke="#07B0E4"/>
  </svg>`,

  // Interactivo: rompecabezas engranando
  puzzle: `<svg viewBox="0 0 80 80" fill="none" stroke="#E83C8D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 10h20v8c2 0 4 2 4 4s-2 4-4 4v8H10V10z" fill="#E83C8D" fill-opacity=".08"/>
    <path d="M10 42v20h8c0-2 2-4 4-4s4 2 4 4h8V42H10z" fill="#E83C8D" fill-opacity=".08"/>
    <path d="M42 10h20v8c2 0 4 2 4 4s-2 4-4 4v8H42v-8c-2 0-4-2-4-4s2-4 4-4V10z" fill="#E83C8D" fill-opacity=".12"/>
    <path d="M42 42h20v20H50c0-2-2-4-4-4s-4 2-4 4v-8c-2 0-4-2-4-4s2-4 4-4v-8z" fill="#E83C8D" fill-opacity=".08"/>
  </svg>`,

  // XP / Puntos: rayo con monedas
  lightning: `<svg viewBox="0 0 80 80" fill="none" stroke="#FCC30A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="44 8 26 44 40 44 36 72 58 36 44 36" fill="#FCC30A" fill-opacity=".2" stroke-linejoin="round"/>
    <circle cx="18" cy="20" r="5" stroke-width="2" fill="#FCC30A" fill-opacity=".15"/>
    <circle cx="62" cy="58" r="4" stroke-width="2" fill="#FCC30A" fill-opacity=".15"/>
    <line x1="15" y1="33" x2="20" y2="38" stroke-width="1.8" opacity=".5"/>
    <line x1="60" y1="18" x2="65" y2="23" stroke-width="1.8" opacity=".5"/>
  </svg>`,

  // Módulos por semana: calendario con libro
  calendar: `<svg viewBox="0 0 80 80" fill="none" stroke="#2BA848" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="18" width="60" height="50" rx="6" fill="#2BA848" fill-opacity=".08"/>
    <line x1="10" y1="32" x2="70" y2="32"/>
    <line x1="24" y1="8" x2="24" y2="24"/>
    <line x1="56" y1="8" x2="56" y2="24"/>
    <rect x="18" y="40" width="12" height="10" rx="2" fill="#2BA848" fill-opacity=".3"/>
    <rect x="34" y="40" width="12" height="10" rx="2" fill="#2BA848" fill-opacity=".5"/>
    <rect x="50" y="40" width="12" height="10" rx="2" fill="#2BA848" fill-opacity=".2"/>
  </svg>`,

  // Evidencia de práctica: cámara con estrella
  photoStar: `<svg viewBox="0 0 80 80" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M70 60a6 6 0 01-6 6H16a6 6 0 01-6-6V30a6 6 0 016-6h10l6-8h16l6 8h10a6 6 0 016 6z" fill="#7C3AED" fill-opacity=".08"/>
    <circle cx="40" cy="44" r="12" fill="#7C3AED" fill-opacity=".1"/>
    <circle cx="40" cy="44" r="7"/>
    <polygon points="60 16 62 21 68 21 63 25 65 30 60 27 55 30 57 25 52 21 58 21" stroke-width="1.8" fill="#FCC30A" fill-opacity=".4" stroke="#FCC30A"/>
  </svg>`,

  // Perfil completo: persona con check
  personCheck: `<svg viewBox="0 0 80 80" fill="none" stroke="#07B0E4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="36" cy="26" r="14" fill="#07B0E4" fill-opacity=".1"/>
    <path d="M10 70c0-14 11-24 26-24s26 10 26 24" />
    <circle cx="62" cy="52" r="12" fill="#2BA848" fill-opacity=".15" stroke="#2BA848" stroke-width="2"/>
    <path d="M56 52l4 4 8-8" stroke="#2BA848" stroke-width="2.5"/>
  </svg>`,

  // Examen / toga: birrete de graduación
  graduation: `<svg viewBox="0 0 80 80" fill="none" stroke="#E9A037" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="40 16 72 32 40 48 8 32" fill="#E9A037" fill-opacity=".12"/>
    <path d="M60 38v18c0 0-4 8-20 8s-20-8-20-8V38"/>
    <line x1="72" y1="32" x2="72" y2="52"/>
    <circle cx="72" cy="54" r="3" fill="#E9A037" fill-opacity=".5"/>
    <line x1="40" y1="48" x2="40" y2="56"/>
  </svg>`,

  // Trofeo grande: copa con rayos
  trophyLarge: `<svg viewBox="0 0 80 80" fill="none" stroke="#FCC30A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 12h28v20a14 14 0 01-28 0V12z" fill="#FCC30A" fill-opacity=".12"/>
    <path d="M54 16h10a4 4 0 010 8c0 6-4 10-10 12"/>
    <path d="M26 16H16a4 4 0 000 8c0 6 4 10 10 12"/>
    <path d="M40 46v10M30 62h20"/>
    <line x1="28" y1="12" x2="52" y2="12"/>
    <polygon points="40 20 42 26 48 26 43 30 45 36 40 32 35 36 37 30 32 26 38 26" fill="#FCC30A" fill-opacity=".4" stroke="#FCC30A" stroke-width="1.5"/>
  </svg>`,

  // Cohete (login / lanzar)
  rocket: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 10c0 0 20 10 20 30v6l-8 4v-10a12 12 0 00-24 0v10l-8-4v-6c0-20 20-30 20-30z" fill="rgba(255,255,255,0.15)"/>
    <circle cx="40" cy="34" r="6" fill="rgba(255,255,255,0.2)"/>
    <path d="M26 46l-8 16 12-4"/>
    <path d="M54 46l8 16-12-4"/>
    <path d="M34 58c0 4 12 4 12 0"/>
  </svg>`,

  // Libros (selector de cursos / módulos)
  books: `<svg viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="16" width="18" height="48" rx="3" fill="rgba(255,255,255,0.15)"/>
    <rect x="30" y="8" width="20" height="56" rx="3" fill="rgba(255,255,255,0.2)"/>
    <rect x="54" y="20" width="18" height="44" rx="3" fill="rgba(255,255,255,0.12)"/>
    <line x1="13" y1="26" x2="21" y2="26" stroke-width="1.8"/>
    <line x1="13" y1="32" x2="21" y2="32" stroke-width="1.8"/>
    <line x1="35" y1="18" x2="45" y2="18" stroke-width="1.8"/>
    <line x1="35" y1="24" x2="45" y2="24" stroke-width="1.8"/>
    <line x1="35" y1="30" x2="45" y2="30" stroke-width="1.8"/>
    <line x1="59" y1="30" x2="67" y2="30" stroke-width="1.8"/>
    <line x1="59" y1="36" x2="67" y2="36" stroke-width="1.8"/>
  </svg>`,

  // Nube sincronizado (status ok)
  cloudOk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.3A7 7 0 103 16.3"/>
    <polyline points="9 15 11 17 15 13"/>
  </svg>`,

};

// ─────────────────────────────────────────────────────────
// Helper: crea un <span> con el icono SVG inline
// Uso: iconEl('home', 'w-5 h-5 text-cyan-500')
// ─────────────────────────────────────────────────────────
function iconEl(name, cls = '') {
  return `<span class="icon-wrap ${cls}" style="display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em;vertical-align:middle">${ICONS[name] || ''}</span>`;
}

// Helper para bottom-nav (cuadrado más grande)
function navIcon(name) {
  return `<span style="display:block;width:22px;height:22px;margin:0 auto">${ICONS[name] || ''}</span>`;
}
