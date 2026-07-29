// ============================================================
// tenant.js — Resolución de tenant (Fase 1: solo módulo reclutamiento)
// Cargar ANTES que cualquier otro script en postulacion.html,
// evaluacion.html y reclutamiento.html.
// ============================================================
//
// Sin tenant (uso directo, ej. yoaprendo.online/postulacion.html):
// window.TENANT = null — comportamiento actual de 1bot, sin cambios.
//
// Con tenant (ej. yoaprendo.online/vdf/postulacion.html, resuelto por
// 404.html): window.TENANT = { id, slug, name, program_name,
// primary_color, secondary_color, tertiary_color, logo_url }, se inyectan
// variables CSS (--brand-primary/--brand-secondary/--brand-tertiary) y se
// reemplazan los elementos marcados con data-tenant="name|program|logo".
//
// El logo SIEMPRE se muestra: cada página pone su propio <img
// data-tenant="logo" src="icon.svg"> con el ícono de 1bot como default;
// si el tenant no subió logo propio, ese default se queda tal cual.
//
// window.svgIcon(name, sizePx) devuelve un <svg> inline listo para usar
// en templates — reemplaza los emojis por iconos consistentes.

(function () {
  const TENANT_SUPABASE_URL = "https://grkjhzkgcmackbafqudu.supabase.co";
  const TENANT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya2poemtnY21hY2tiYWZxdWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjg5MzQsImV4cCI6MjA5NjcwNDkzNH0.2nVTRlhey6HkGs_KZxtCaEp8L2QrvD0NUwY8ZFwZVHY";

  // Set de iconos SVG inline — reemplaza los emojis en las páginas del
  // módulo de reclutamiento. fill:true = ícono sólido (star/heart),
  // fill:false = ícono de líneas (el resto).
  const ICONS = {
    plane:     { fill: false, paths: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>' },
    heart:     { fill: true,  paths: '<path d="M12 21s-7-4.35-9.5-9C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 21.5 12 19 16.65 12 21 12 21z"/>' },
    clipboard: { fill: false, paths: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v2H9z"/><path d="M9 11h6M9 15h4"/>' },
    lock:      { fill: false, paths: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>' },
    document:  { fill: false, paths: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>' },
    star:      { fill: true,  paths: '<path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.7L12 2z"/>' },
    chart:     { fill: false, paths: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>' },
    exit:      { fill: false, paths: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5"/>' },
    bank:      { fill: false, paths: '<path d="M3 10l9-6 9 6"/><path d="M5 10v9M9 10v9M15 10v9M19 10v9"/><path d="M3 21h18"/>' },
    book:      { fill: false, paths: '<path d="M12 6c-1.5-1.2-4-2-6-2-1 0-2 .1-3 .4v13c1-.3 2-.4 3-.4 2 0 4.5.8 6 2 1.5-1.2 4-2 6-2 1 0 2 .1 3 .4v-13c-1-.3-2-.4-3-.4-2 0-4.5.8-6 2z"/><path d="M12 6v13"/>' },
    check:     { fill: false, paths: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>' },
    clock:     { fill: false, paths: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  };

  window.svgIcon = function (name, size) {
    const icon = ICONS[name];
    if (!icon) return '';
    size = size || 24;
    const attrs = icon.fill
      ? 'fill="currentColor" stroke="none"'
      : 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${attrs} style="display:inline-block;vertical-align:middle">${icon.paths}</svg>`;
  };

  window.TENANT = null;
  window.TENANT_READY = (async function resolveTenant() {
    // El slug llega vía sessionStorage (redirigido por 404.html) o, para
    // pruebas directas, por ?tenant=. Se consume una sola vez: así una
    // navegación posterior a una URL sin tenant en la misma pestaña no
    // arrastra la marca del tenant anterior.
    let slug = sessionStorage.getItem('tenantSlug');
    sessionStorage.removeItem('tenantSlug');
    if (!slug) slug = new URLSearchParams(location.search).get('tenant');
    if (!slug) return null;

    try {
      const url = `${TENANT_SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slug)}&active=eq.true&select=id,slug,name,program_name,primary_color,secondary_color,tertiary_color,logo_url,salario_presupuesto`;
      const res = await fetch(url, {
        headers: { 'apikey': TENANT_ANON_KEY, 'Authorization': `Bearer ${TENANT_ANON_KEY}` },
      });
      if (!res.ok) return null;
      const rows = await res.json();
      const tenant = rows[0] || null;
      if (!tenant) return null;

      window.TENANT = tenant;

      // Restaura la URL "bonita" /slug/pagina.html SOLO cuando el colegio
      // existe y está activo (la página real se sirvió desde la raíz vía el
      // redirect de 404.html). Si el slug no resolvió, la barra se queda en
      // /pagina.html — honesto: se está renderizando como 1bot, no con la
      // marca de un colegio inexistente/inactivo.
      const currentPage = location.pathname.split('/').filter(Boolean).pop() || 'postulacion.html';
      if (location.pathname !== '/' + slug + '/' + currentPage) {
        history.replaceState(null, '', '/' + slug + '/' + currentPage + location.search);
      }

      applyBranding(tenant);
      return tenant;
    } catch (e) {
      return null; // sin conexión / tenant inválido -> se ve como 1bot por defecto, no rompe la página
    }
  })();

  // Un colegio puede elegir blanco (u otro color casi blanco) como color
  // de marca — sobre las tarjetas blancas eso vuelve invisibles botones y
  // bordes. hexToRgb/luminance/ensureVisible oscurecen automáticamente
  // cualquier color que quede ilegible sobre fondo blanco, sin tocar
  // colores normales.
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }

  function luminance(rgb) {
    return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  }

  function ensureVisible(hex, fallback) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex || fallback;
    if (luminance(rgb) < 0.85) return hex; // suficiente contraste sobre blanco, no tocar

    // demasiado claro (blanco/casi blanco) — mezcla hacia un tono oscuro
    // neutro para que siga siendo visible en botones/bordes/texto.
    const dark = { r: 15, g: 23, b: 42 }; // #0F172A
    const mix = (a, b, t) => Math.round(a + (b - a) * t);
    const blended = {
      r: mix(rgb.r, dark.r, 0.6),
      g: mix(rgb.g, dark.g, 0.6),
      b: mix(rgb.b, dark.b, 0.6),
    };
    return `rgb(${blended.r},${blended.g},${blended.b})`;
  }

  function applyBranding(tenant) {
    const primary = ensureVisible(tenant.primary_color, '#07B0E4');
    const secondary = ensureVisible(tenant.secondary_color, primary);
    const tertiary = ensureVisible(tenant.tertiary_color, primary);
    const style = document.createElement('style');
    style.id = 'tenant-theme';
    style.textContent = `:root {
      --brand-primary: ${primary};
      --brand-secondary: ${secondary};
      --brand-tertiary: ${tertiary};
    }`;
    document.head.appendChild(style);

    if (tenant.name) document.title = tenant.name + ' — ' + document.title;

    document.querySelectorAll('[data-tenant="name"]').forEach(el => { el.textContent = tenant.name; });
    document.querySelectorAll('[data-tenant="program"]').forEach(el => { el.textContent = tenant.program_name || tenant.name; });
    document.querySelectorAll('[data-tenant="logo"]').forEach(el => {
      if (tenant.logo_url) { el.src = tenant.logo_url; el.style.display = ''; }
    });
  }
})();
