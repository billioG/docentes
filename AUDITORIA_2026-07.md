# Auditoría de código — Curso STEAM 2.0 (2026-07-01)

> **Estado (2026-07-01):** todos los hallazgos S1-S3, B1-B4 y M1-M5 fueron
> corregidos en la rama `fix/auditoria-julio-2026`. P1/P2 quedan como deuda
> técnica (requieren build step / refactor de data.js). Pendientes manuales:
> 1. **Rotar la API key de Resend** (https://resend.com/api-keys) — la vieja quedó en el historial de git.
> 2. Re-desplegar `groq-proxy` en Supabase **después** de publicar el nuevo app.js.
> 3. Agregar secret `APP_URL` en Supabase Functions.
>
> **Hallazgo extra durante los fixes (B5):** `submitPortfolio` llamaba a
> `evaluate-portfolio` con el anon key, pero la función valida JWT de usuario →
> retornaba 401 siempre: la evaluación de portafolio con IA estaba rota.
> Corregido: ahora envía `session.access_token`.

Revisión de app.js, admin.js, coordinator.html, diagnostico.js, verificar.html,
sw.js, edge functions y schema SQL.

## 🔴 Críticos (seguridad / rompen datos)

### S1 — XSS almacenado en panel admin (comentarios)
`admin.js:1358` y `admin.js:1361` interpolan `c._userName` y `c.comment` sin
escapar dentro de `innerHTML`. Un docente puede publicar un comentario con
`<img src=x onerror=...>`; cuando el admin abre la pestaña de comentarios, el
script corre con la sesión del admin. La app cliente sí escapa (`_escHtml` en
`app.js:6305/6309`), pero el panel admin no. Existe `esc()` en `admin.js:78` — usarlo:
```js
<span ...>${esc(c._userName)}</span>
<p ...>${esc(c.comment)}</p>
```

### S2 — XSS en panel coordinador (nombre de centro)
`coordinator.html:301` interpola `s.name` sin escapar. El nombre de escuela lo
controla el admin, riesgo menor que S1, pero mismo patrón — escapar igual.

### S3 — API key de Resend commiteada en git
`supabase-functions/SETUP.md:8` contiene `RESEND_API_KEY = re_2nxRvfzP_...` en
texto plano y está trackeada en el repo (`git ls-files`). Cualquiera con acceso
al repo puede enviar correos desde tu cuenta Resend.
**Acción:** rotar la key en Resend YA, quitarla del archivo, y purgar del historial
(`git filter-repo` o similar). Documentar el nombre del secret, nunca el valor.

## 🟠 Altos (bugs funcionales)

### B1 — Sesión duplicada en cada login (fuga + datos inflados)
`app.js:473` `startSessionTracking()` hace `setInterval` sin guardar el id ni
limpiarlo. Cada login abre un nuevo interval; los viejos siguen vivos y siguen
haciendo `UPDATE user_sessions` de sesiones que ya terminaron. En una sesión
larga con varios login/logout se acumulan timers y writes fantasma.
**Fix:** guardar `_sessionInterval = setInterval(...)` y `clearInterval` en `logout()`.

### B2 — `syncWithSupabase` se dispara en ráfaga
`saveProgress()` (`app.js:844`) llama `syncWithSupabase()` en cada acción
(cada XP, cada tarjeta). `addXP` además llama `saveProgress()` y luego
`updateUI()` otra vez. Un solo evento de tarjeta puede producir 3-4 upserts a
Supabase. Agregar debounce (ej. 800-1200 ms) al upsert reduce escrituras y
condiciones de carrera. Ya existe el patrón en `saveCardNote._t` (`app.js:3224`).

### B3 — `getCourseExam` nunca retorna null, pero se compara con null
`app.js:620`: `const _hasFinalExam = ... getCourseExam(_activeCourse) !== null`.
`getCourseExam` (`app.js:53`) siempre retorna un objeto `{title, passingScore,
questions}`, aun con `questions: []`. Así `_hasFinalExam` es siempre `true`, y el
banner "¡Listo para examen!" aparece en cursos sin quizzes; al entrar, el examen
tiene 0 preguntas → `showExamResults` divide por `examQuestions.length` = 0 →
`pct = NaN`. **Fix:** `_hasFinalExam = getCourseExam(_activeCourse).questions.length > 0`.

### B4 — `startExam` con banco < 20 preguntas
`app.js:3330` `examQuestions = allQ.slice(0, 20)`. Si el curso tiene menos de 20
quizzes, el examen corre con las que haya (ok), pero si tiene 0, entra igual y
produce el NaN de B3. Validar `if (!allQ.length) { showToast('Este curso aún no
tiene examen'); return; }` antes de arrancar.

## 🟡 Medios (robustez / mantenimiento)

### M1 — CORS abierto en groq-proxy sin auth real
`supabase-functions/groq-proxy/index.ts:9` usa `Access-Control-Allow-Origin: '*'`
y no valida el JWT del usuario (a diferencia de evaluate-portfolio que sí lo
hace en la línea 27). Cualquiera puede llamar tu proxy Groq y gastar tu cuota.
Validar el token de usuario igual que en `evaluate-portfolio`.

### M2 — `.single()` lanza en usuario nuevo
`loadFromSupabase` (`app.js:264`) usa `.single()` y filtra el error `PGRST116`
manualmente. `.maybeSingle()` es la forma correcta (retorna null sin error) y
evita el `throw`/catch innecesario.

### M3 — CLAUDE.md desactualizado
`CLAUDE.md:43` dice `ADMIN_EMAILS = ['billy@1bot.org']` pero el código
(`admin.js:7`) ya incluye ambos correos. Sincronizar para no confundir sesiones
futuras.

### M4 — `showToast` usa innerHTML con el mensaje
`app.js:565` `toast.innerHTML = message`. Hoy los mensajes son literales, pero
si alguno llega a incluir dato de usuario (ej. `Invitación enviada a ${email}`
en `admin.js:714`) es un vector. Preferir `textContent` salvo cuando de verdad
se necesite HTML (emojis funcionan igual con textContent).

### M5 — APP_URL hardcodeada en 3 edge functions
`daily-reminders`, `weekly-stats`, `new-user-alert` repiten
`https://1bot-org.github.io/Curso-STEAM-2.0`. El repo real es `billioG/curso-steam`
→ verificar que la URL de Pages sea correcta (posible 404 en los correos).
Mover a `Deno.env.get('APP_URL')`.

## 🟢 Optimización de rendimiento

### P1 — Tailwind por CDN en producción
`index.html:10`, `admin.html:7`, `admin-login.html:7` cargan
`cdn.tailwindcss.com` (compilador JIT en el navegador, ~300 KB + FOUC). Para
producción conviene Tailwind CLI precompilado a un CSS estático. Reduce carga y
elimina el flash de estilos.

### P2 — `data.js` 680 KB bloquea el arranque
`data.js` (3511 líneas) carga como `<script>` síncrono antes de `app.js`. Solo
el curso activo se usa al inicio. Considerar separar cada curso (ya existen
`course_*.js`) y cargar bajo demanda, o marcar `defer`. `schools_gt.js` (2.4 MB)
ya usa carga lazy — buen patrón, replicarlo.

### P3 — Scripts sin `defer`
`index.html:16` (`iconos.js`) y los `<script>` inline `DOMContentLoaded`
podrían simplificarse con `defer` en las etiquetas, evitando los listeners
manuales repetidos (líneas 1555, 1593, 1721).

## Notas positivas
- Service worker con network-first para JS/HTML evita el bug clásico de PWA de
  servir bundle viejo (sw.js:99-119). Bien resuelto.
- RLS bien cubierto en el schema (progress, feedback, portfolios con INSERT
  restringido a `pending`).
- evaluate-portfolio valida JWT y normaliza el puntaje server-side — correcto.
- verificar.html escapa toda salida y maneja reintentos de red. Sólido.
