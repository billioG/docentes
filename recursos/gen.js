// Generator script - reads data.js and diagnostico.js, outputs contenido-completo.html
const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\billi\\Downloads\\Curso STEAM 2.0';
const outDir = path.join(base, 'recursos');

// Load the source files by evaluating them
const dataCode = fs.readFileSync(path.join(base, 'data.js'), 'utf8');
const diagCode = fs.readFileSync(path.join(base, 'diagnostico.js'), 'utf8');

// Execute in a context
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataCode, ctx);
vm.runInContext(diagCode, ctx);

const allCourses = ctx.allCourses;
const DIAG_QUESTIONS = ctx.DIAG_QUESTIONS;
const DIAG_DOMAINS = ctx.DIAG_DOMAINS;

// Course order per user spec: design-thinking, tipos-estudiantes, abp, steam, evaluacion, storytelling
const courseOrder = ['design-thinking','tipos-estudiantes','abp','steam','evaluacion','storytelling'];

const courseColors = {
  'steam': '#07B0E4',
  'abp': '#2BA848',
  'design-thinking': '#E83C8D',
  'evaluacion': '#E9A037',
  'tipos-estudiantes': '#7C3AED',
  'storytelling': '#F59E0B'
};

const courseCssClass = {
  'steam': 'course-steam',
  'abp': 'course-abp',
  'design-thinking': 'course-dt',
  'evaluacion': 'course-ev',
  'tipos-estudiantes': 'course-te',
  'storytelling': 'course-st'
};

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function renderExtra(extra) {
  if (!extra) return '';
  if (typeof extra === 'string') {
    return `<div class="tip-box">💡 ${esc(extra)}</div>`;
  }
  let html = '';
  if (extra.tip) html += `<div class="tip-box">💡 ${esc(extra.tip)}</div>`;
  if (extra.activity) html += `<div class="activity-box">🎯 <strong>Actividad:</strong> ${esc(extra.activity)}</div>`;
  return html;
}

function renderProject(proj) {
  if (!proj) return '';
  let html = `<div class="project-box">`;
  if (proj.title) html += `<h4>📋 Proyecto: ${esc(proj.title)}</h4>`;
  if (proj.duration) html += `<p><strong>Duración:</strong> ${esc(proj.duration)}</p>`;
  if (proj.difficulty) html += `<p><strong>Dificultad:</strong> ${esc(proj.difficulty)}</p>`;
  if (proj.objective) html += `<p><strong>Objetivo:</strong> ${esc(proj.objective)}</p>`;
  if (proj.description) html += `<p>${esc(proj.description)}</p>`;
  if (proj.materials && proj.materials.length) {
    html += `<p><strong>Materiales:</strong></p><ul>`;
    proj.materials.forEach(m => html += `<li>${esc(m)}</li>`);
    html += `</ul>`;
  }
  if (proj.steps && proj.steps.length) {
    html += `<p><strong>Pasos:</strong></p><ol>`;
    proj.steps.forEach(s => html += `<li>${esc(s)}</li>`);
    html += `</ol>`;
  }
  if (proj.think && proj.think.length) {
    html += `<p><strong>🤔 Pensar (Think):</strong></p><ul>`;
    proj.think.forEach(t => html += `<li>${esc(t)}</li>`);
    html += `</ul>`;
  }
  if (proj.make && proj.make.length) {
    html += `<p><strong>🛠️ Hacer (Make):</strong></p><ul>`;
    proj.make.forEach(m => html += `<li>${esc(m)}</li>`);
    html += `</ul>`;
  }
  if (proj.improve && proj.improve.length) {
    html += `<p><strong>🔄 Mejorar (Improve):</strong></p><ul>`;
    proj.improve.forEach(i => html += `<li>${esc(i)}</li>`);
    html += `</ul>`;
  }
  if (proj.disciplines && proj.disciplines.length) {
    html += `<p><strong>Disciplinas:</strong> ${proj.disciplines.map(esc).join(', ')}</p>`;
  }
  html += `</div>`;
  return html;
}

function renderCard(card, color) {
  let html = `<div class="card" style="border-left:4px solid ${color};">`;

  if (card.type === 'content') {
    html += `<h3 class="card-title">${esc(card.title)}</h3>`;
    html += `<p>${esc(card.content)}</p>`;
    if (card.extra) html += renderExtra(card.extra);
    if (card.project) html += renderProject(card.project);
  } else if (card.type === 'quiz') {
    html += `<div class="quiz-box">`;
    html += `<p class="quiz-q"><strong>❓ ${esc(card.question || card.title)}</strong></p>`;
    const opts = card.options || [];
    opts.forEach((opt, i) => {
      if (i === card.correct) {
        html += `<div class="option correct">✓ ${esc(opt)}</div>`;
      } else {
        html += `<div class="option">○ ${esc(opt)}</div>`;
      }
    });
    if (card.explanation) {
      html += `<div class="tip-box" style="margin-top:8px;">📚 <strong>Explicación:</strong> ${esc(card.explanation)}</div>`;
    }
    html += `</div>`;
  } else if (card.type === 'simulation') {
    html += `<h3 class="card-title">${esc(card.title || 'Simulación')}</h3>`;
    if (card.scenario) html += `<p><strong>Escenario:</strong> ${esc(card.scenario)}</p>`;
    if (card.statement) html += `<p><strong>Situación:</strong> ${esc(card.statement)}</p>`;
    if (card.rightOutcome || card.correctSwipe === 'right') {
      html += `<div class="outcome-box outcome-right"><strong>✅ Respuesta correcta (derecha):</strong> ${esc(card.rightOutcome || '')}</div>`;
    }
    if (card.leftOutcome) {
      html += `<div class="outcome-box outcome-left"><strong>❌ Alternativa (izquierda):</strong> ${esc(card.leftOutcome)}</div>`;
    }
    if (card.extra) html += renderExtra(card.extra);
  } else if (card.type === 'project') {
    html += `<h3 class="card-title">${esc(card.title)}</h3>`;
    if (card.description) html += `<p>${esc(card.description)}</p>`;
    html += renderProject(card);
  } else {
    // fallback
    html += `<h3 class="card-title">${esc(card.title || card.id)}</h3>`;
    if (card.content) html += `<p>${esc(card.content)}</p>`;
  }

  html += `</div>`;
  return html;
}

// Build TOC
function buildTOC() {
  let html = `<div class="toc"><h2>Índice de Contenidos</h2><ul>`;
  courseOrder.forEach(cid => {
    const course = allCourses.find(c => c.id === cid);
    if (!course) return;
    const color = courseColors[cid] || '#333';
    html += `<li style="margin-bottom:8px;"><strong style="color:${color};">${esc(course.icon||'')} ${esc(course.title)}</strong><ul>`;
    course.modules.forEach(mod => {
      html += `<li>${esc(mod.title)} (${(mod.cards||[]).length} tarjetas)</li>`;
    });
    html += `</ul></li>`;
  });
  html += `<li><strong>🎯 Examen Diagnóstico</strong> (20 preguntas en 5 dominios)</li>`;
  html += `</ul></div>`;
  return html;
}

// Build full HTML
let parts = [];

parts.push(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Formación Docente en Pedagogía Innovadora — Contenido Completo</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
* { font-family: 'Inter', sans-serif; box-sizing: border-box; }
body { background: white; color: #1e293b; margin: 0; }
.page { page-break-before: always; min-height: 100vh; padding: 40px; }
.cover-page { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
@media print { .no-print { display: none !important; } .page { page-break-before: always; } body { margin: 0; } }
.course-steam { border-color: #07B0E4; }
.course-abp { border-color: #2BA848; }
.course-dt { border-color: #E83C8D; }
.course-ev { border-color: #E9A037; }
.course-te { border-color: #7C3AED; }
.course-st { border-color: #F59E0B; }
.quiz-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
.correct { color: #16a34a; font-weight: 700; }
.option { padding: 4px 0; }
.tip-box { background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px 12px; margin-top: 8px; font-size: 13px; }
.activity-box { background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 12px; margin-top: 8px; font-size: 13px; }
.project-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-top: 12px; }
.project-box h4 { margin: 0 0 8px 0; }
.outcome-box { padding: 8px 12px; margin-top: 8px; border-radius: 6px; font-size: 13px; }
.outcome-right { background: #f0fdf4; border-left: 3px solid #16a34a; }
.outcome-left { background: #fff1f2; border-left: 3px solid #ef4444; }
.card { margin: 16px 0; padding: 16px; border-left: 4px solid #e2e8f0; border-radius: 0 8px 8px 0; background: #fafafa; }
.card-title { margin: 0 0 8px 0; font-size: 16px; }
.course-header { padding: 32px; margin-bottom: 24px; border-radius: 12px; color: white; }
.module-header { padding: 16px 20px; margin: 24px 0 12px 0; border-radius: 8px; }
.toc { max-width: 700px; margin: 40px auto; }
.toc ul { line-height: 2; }
.toc li { margin-bottom: 4px; }
.footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
.diag-domain { margin: 24px 0; padding: 16px; border-radius: 8px; background: #f8fafc; }
.diag-q { margin: 16px 0; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; }
h1 { font-size: 2.5rem; font-weight: 800; }
h2 { font-size: 1.6rem; font-weight: 700; }
h3 { font-size: 1.1rem; font-weight: 600; }
p { line-height: 1.6; }
ul, ol { line-height: 1.7; }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()" style="position:fixed;top:16px;right:16px;background:#4f46e5;color:white;border:none;border-radius:8px;padding:10px 20px;cursor:pointer;font-weight:600;z-index:999;">Imprimir / Guardar PDF</button>
`);

// Cover page
parts.push(`<div class="page cover-page">
  <div style="margin-bottom:24px;font-size:3rem;">🎓</div>
  <h1 style="font-size:2.8rem;margin-bottom:8px;">Formación Docente<br>en Pedagogía Innovadora</h1>
  <p style="font-size:1.2rem;color:#64748b;margin-bottom:4px;">Guatemala</p>
  <p style="font-size:1rem;color:#94a3b8;margin-bottom:40px;">Compendio completo de contenidos para impresión</p>
  ${buildTOC()}
  <div class="footer">Generado el ${new Date().toLocaleDateString('es-GT', {year:'numeric',month:'long',day:'numeric'})} · Uso exclusivo docente</div>
</div>`);

// Each course
courseOrder.forEach(cid => {
  const course = allCourses.find(c => c.id === cid);
  if (!course) return;
  const color = courseColors[cid] || '#333';
  const cssClass = courseCssClass[cid] || '';

  // Course header page
  parts.push(`<div class="page">
  <div class="course-header" style="background:${color};">
    <div style="font-size:3rem;margin-bottom:12px;">${esc(course.icon||'')}</div>
    <h1 style="margin:0 0 8px 0;">${esc(course.title)}</h1>
    <p style="margin:0;opacity:0.9;font-size:1.1rem;">${esc(course.subtitle||'')}</p>
    <p style="margin:8px 0 0 0;opacity:0.8;">${(course.modules||[]).length} módulos · ${course.totalCards||'?'} tarjetas · ${course.durationHours||'?'}h</p>
  </div>`);

  // Modules
  course.modules.forEach((mod, mi) => {
    parts.push(`<div class="module-header" style="background:${color}22;border-left:4px solid ${color};">
    <h2 style="margin:0;color:${color};">Módulo ${mi+1}: ${esc(mod.title)}</h2>
    <p style="margin:4px 0 0 0;font-size:13px;color:#64748b;">${(mod.cards||[]).length} tarjetas</p>
  </div>`);
    (mod.cards||[]).forEach(card => {
      parts.push(renderCard(card, color));
    });
  });

  parts.push(`<div class="footer">Curso: ${esc(course.title)} · Formación Docente en Pedagogía Innovadora · Guatemala</div>
</div>`);
});

// Diagnostic exam page
parts.push(`<div class="page">
  <div class="course-header" style="background:#1e293b;">
    <div style="font-size:3rem;margin-bottom:12px;">🎯</div>
    <h1 style="margin:0 0 8px 0;">Examen Diagnóstico</h1>
    <p style="margin:0;opacity:0.9;">20 preguntas agrupadas por dominio · Evalúa tu punto de partida</p>
  </div>`);

Object.keys(DIAG_DOMAINS).forEach(domKey => {
  const dom = DIAG_DOMAINS[domKey];
  const questions = DIAG_QUESTIONS.filter(q => q.domain === domKey);
  parts.push(`<div class="diag-domain" style="border-left:4px solid ${dom.color};">
    <h2 style="color:${dom.color};margin:0 0 12px 0;">${esc(dom.icon)} ${esc(dom.label)}</h2>`);
  questions.forEach((q, qi) => {
    parts.push(`<div class="diag-q">
      <p><strong>${qi+1}. ${esc(q.text)}</strong></p>`);
    q.options.forEach((opt, oi) => {
      if (oi === q.correct) {
        parts.push(`<div class="option correct">✓ ${esc(opt)}</div>`);
      } else {
        parts.push(`<div class="option">○ ${esc(opt)}</div>`);
      }
    });
    parts.push(`<div class="tip-box" style="margin-top:8px;">📚 ${esc(q.explanation)}</div>
    </div>`);
  });
  parts.push(`</div>`);
});

parts.push(`<div class="footer">Examen Diagnóstico · Formación Docente en Pedagogía Innovadora · Guatemala</div>
</div>`);

parts.push(`</body></html>`);

const html = parts.join('\n');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Done. Lines:', html.split('\n').length, '| Size:', (html.length/1024).toFixed(1)+'KB');
