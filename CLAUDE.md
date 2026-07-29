# Curso STEAM 2.0 — Instrucciones para Claude

## Repositorio
- GitHub: `billioG/curso-steam`
- Deploy: GitHub Pages (rama `main`)

## Flujo de trabajo con ramas y PRs

**Siempre trabajar en una rama de feature, nunca directamente en `main`.**

Al iniciar una sesión con cambios de código:
1. Verificar la rama actual con `git branch`
2. Si estamos en `main`, crear una rama descriptiva antes de cualquier cambio:
   ```
   git checkout -b fix/nombre-corto
   ```
   o
   ```
   git checkout -b feat/nombre-corto
   ```
3. Hacer commits en esa rama durante la sesión
4. Al finalizar, hacer push y crear PR hacia `main`:
   ```
   gh pr create --title "..." --body "..."
   ```
   Si `gh` no está disponible, reportar la URL del compare de GitHub para que el usuario cree el PR manualmente.

**Convenciones de nombre de rama:**
- `fix/descripcion` — corrección de bugs
- `feat/descripcion` — nueva funcionalidad
- `chore/descripcion` — mantenimiento, limpieza

**Nota:** GitHub Pages sirve desde `main`. No hacer merge hasta verificar que los cambios funcionan.

## Stack técnico
- PWA con Service Worker (`sw.js`) — bump de versión `steam-vXX` en cada deploy
- Supabase: tabla `progress`, `resource_views`, `feedback`, `courses`, `user_roles`
- `app.js` — lógica principal de la app de docentes
- `admin.js` — panel de administración
- `data.js` — contenido de cursos (tarjetas, módulos, exámenes)
- `diagnostico.js` — prueba diagnóstica inicial
- `schools_gt.js` — base de datos de 35,136 centros educativos (carga lazy)
- `ADMIN_EMAILS = ['billy@1bot.org']` (definido en admin.js)

## Convenciones de código
- IDs de tarjetas por curso: STEAM=numérico, ABP=`abp-`, DT=`dt-`, EV=`ev-`, TE=`te-`
- `examScores` (objeto por courseId) es el campo principal; `examScore` (singular) es legacy solo para STEAM
- Dropdowns dentro de contenedores `overflow:auto` deben usar `position:fixed` + `getBoundingClientRect()`
