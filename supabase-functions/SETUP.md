# Configuración de Emails Automáticos

## Paso 1 — Agregar el API Key de Resend como Secret

> ⚠️ **SEGURIDAD:** Una versión anterior de este archivo contenía la API key de
> Resend en texto plano y quedó en el historial de git. Esa key debe considerarse
> comprometida: **revócala en https://resend.com/api-keys y genera una nueva.**
> Nunca escribas el valor de un secret en este repositorio.

1. Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/settings/functions
2. En "Secrets", agrega:
   - Nombre: `RESEND_API_KEY`
   - Valor: *(la key nueva generada en resend.com — no la escribas aquí)*
   - Nombre: `FROM_EMAIL`
   - Valor: `onboarding@resend.dev`  ← cambiar por tu dominio verificado después
   - Nombre: `APP_URL`
   - Valor: la URL pública de la app (GitHub Pages), ej. `https://billiog.github.io/curso-steam`

## Paso 2 — Crear las 3 Edge Functions

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/functions

Para cada función:
1. Clic en "New Function"
2. Usa el nombre exacto indicado
3. Pega el código del archivo correspondiente
4. Clic en "Deploy"

| Nombre de la función | Archivo                              |
|----------------------|--------------------------------------|
| `weekly-stats`       | weekly-stats/index.ts                |
| `daily-reminders`    | daily-reminders/index.ts             |
| `new-user-alert`     | new-user-alert/index.ts              |

## Paso 3 — Activar extensiones pg_cron y pg_net

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/database/extensions
- Activa **pg_cron**
- Activa **pg_net**

## Paso 4 — Programar los emails con pg_cron

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta este SQL:

```sql
-- Reemplaza TU_PROJECT_REF con: grkjhzkgcmackbafqudu

-- Email semanal: cada lunes a las 8am Guatemala (14:00 UTC)
SELECT cron.schedule(
  'weekly-stats-email',
  '0 14 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://grkjhzkgcmackbafqudu.supabase.co/functions/v1/weekly-stats',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Recordatorios diarios: cada día a las 9am Guatemala (15:00 UTC)
SELECT cron.schedule(
  'daily-reminders-email',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url := 'https://grkjhzkgcmackbafqudu.supabase.co/functions/v1/daily-reminders',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

## Paso 5 — Webhook para nuevos usuarios

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/database/webhooks
1. Clic en "Create a new hook"
2. Configura:
   - Name: `new-user-notification`
   - Table: `progress`
   - Events: ✅ INSERT
   - Type: **Supabase Edge Functions**
   - Function: `new-user-alert`
3. Guardar

## Verificar tu dominio en Resend (para enviar a todos los usuarios)

1. Ve a: https://resend.com/domains
2. Agrega tu dominio propio (no un dominio de terceros)
3. Copia los registros DNS que te da Resend
4. Agrégalos en donde administras tu dominio
5. Una vez verificado, cambia el Secret `FROM_EMAIL` a: `no-reply@tu-dominio.com`

Mientras tanto, los emails de prueba solo llegarán al correo de tu cuenta Resend.

---

# Configuración de Notificaciones Push (Web Push / VAPID)

Gratis, sin servicio de terceros — usa el estándar Web Push nativo del navegador.

## Paso 1 — Ejecutar la migración SQL

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta el contenido de `migrations/announcements-and-push.sql` (crea la tabla
`push_subscriptions` y siembra la clave `announcement` en `app_config`).

## Paso 2 — Agregar los secrets VAPID

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/settings/functions

> ⚠️ Las llaves ya fueron generadas para este proyecto. La llave **pública** ya
> está escrita en `app.js` (es segura de exponer). La llave **privada** debe
> guardarse SOLO como secret aquí — nunca en el código.

En "Secrets", agrega:
- Nombre: `VAPID_PUBLIC_KEY`
- Valor: `BBh5oCbg97EdQKAkW4O7ljYHK0l9oEGs3G7UHksP_xcFdOopyrDl3Gz5fQXUhnz2nvKGgjye-l7Hxq8kjH_kyAo`
- Nombre: `VAPID_PRIVATE_KEY`
- Valor: `gmM7oPSg9HY0PpO1R3gGvncA-f6EzN3Q-4w6o1aV_7Y`

Si en algún momento sospechas que la llave privada se filtró (por ejemplo si
quedó en un commit de git), genera un par nuevo con `npx web-push generate-vapid-keys`,
actualiza este secret con la privada nueva, y reemplaza `VAPID_PUBLIC_KEY` en
`app.js` con la pública nueva — los usuarios con suscripciones viejas tendrán
que volver a activar las notificaciones.

`SUPABASE_SERVICE_ROLE_KEY` normalmente ya existe como secret automático en
todo proyecto de Supabase — no necesitas agregarlo a mano.

## Paso 3 — Crear la Edge Function `send-push`

Igual que las funciones de email: "New Function" → nombre exacto `send-push` →
pega el código de `supabase-functions/send-push/index.ts` → Deploy.

## Paso 4 — Probar

1. En la app, como docente, entra a Perfil → Notificaciones → "Activar notificaciones"
   y acepta el permiso del navegador.
2. En el panel admin → Configuración → "Notificaciones push", escribe un título
   y mensaje de prueba → "Enviar a todos".
3. Deberías recibir la notificación en el dispositivo donde activaste el paso 1,
   incluso con la pestaña de la app cerrada (con el navegador abierto en segundo plano).

**Nota sobre iOS:** en iPhone, las notificaciones push solo funcionan si el
docente agregó la app a su pantalla de inicio ("Agregar a inicio" desde Safari)
Y tiene iOS 16.4 o superior. Es una limitación de Apple, no de esta app — en
Android y escritorio funciona sin ese requisito.

## Paso 5 — Recordatorio automático diario (3pm Guatemala)

Push automático a quienes tienen notificaciones activas y todavía no han
entrado a la plataforma ese día. Usa el mismo mecanismo que `weekly-stats`
y `daily-reminders` (pg_cron + service role key), sin botón manual.

1. Crea la Edge Function `daily-push-reminder` con el código de
   `supabase-functions/daily-push-reminder/index.ts` → Deploy.
2. En el SQL Editor, programa el cron (requiere pg_cron y pg_net activos,
   ver Paso 3 de la sección de emails más arriba):

```sql
SELECT cron.schedule(
  'daily-push-reminder',
  '0 21 * * *',  -- 21:00 UTC = 15:00 (3pm) Guatemala, sin horario de verano
  $$
  SELECT net.http_post(
    url := 'https://grkjhzkgcmackbafqudu.supabase.co/functions/v1/daily-push-reminder',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

3. Para probarlo sin esperar al cron, invócalo una vez a mano desde el SQL
   Editor con el mismo `net.http_post` de arriba, o desde una pestaña de
   terminal con `curl` usando la service role key.

Solo les llega a docentes que ya activaron notificaciones (Perfil →
Notificaciones) y que no tienen actividad registrada hoy — no es spam
diario para quienes ya entraron.

---

# Configuración del Módulo de Reclutamiento

Postulación pública → filtro duro → evaluación de casos de estudio con IA (Groq)
→ el candidato decide continuar → admin contrata desde `reclutamiento.html`.

## Paso 1 — Ejecutar la migración SQL

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta el contenido de `migrations/recruitment-schema.sql` (crea las tablas
`candidates` y `candidate_evaluations`, con RLS habilitado y **sin políticas**
— todo el acceso pasa por Edge Functions con el service-role key).

## Paso 2 — Crear las 2 Edge Functions nuevas

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/functions

| Nombre de la función  | Archivo                                     |
|------------------------|---------------------------------------------|
| `submit-application`   | supabase-functions/submit-application/index.ts |
| `evaluate-candidate`   | supabase-functions/evaluate-candidate/index.ts |

No requieren secrets nuevos — reutilizan `GROQ_API_KEY` y
`SUPABASE_SERVICE_ROLE_KEY`, que ya existen como secrets del proyecto
(usados por `groq-proxy` y `evaluate-portfolio`).

## Paso 3 — Re-desplegar `admin-users`

Este archivo existente (`supabase/functions/admin-users/index.ts`) se
modificó para agregar las acciones `listCandidates` y `provisionCandidate`.
Ve a la función `admin-users` en el Dashboard, pega el código actualizado
y clic en "Deploy" — si no se re-despliega, el panel de reclutamiento no
podrá listar candidatos ni contratarlos.

## Paso 4 — Probar el flujo completo

1. Abre `postulacion.html`, llena el formulario con los 3 checkboxes
   marcados → debe redirigir a `evaluacion.html?token=...`.
2. Responde los 4 casos de estudio (contenido placeholder, editar en
   `evaluacion.html` antes de publicar el enlace real a candidatos) →
   debe mostrar puntaje técnico/blandas real generado por Groq.
3. Intenta recargar `evaluacion.html` con el mismo `token` y reenviar —
   debe rechazar con error (una sola evaluación por candidato).
4. Entra a `reclutamiento.html` como `billy@1bot.org`, verifica que el
   candidato evaluado aparece, clic en "Contratar" → confirma que llega
   el correo de invitación y que el candidato pasa a `status=contratado`.

## Nota de seguridad

`candidates` y `candidate_evaluations` contienen PII (nombre, correo,
teléfono, respuestas de evaluación) — **no agregar una política RLS de
lectura permisiva** a estas tablas por costumbre al copiar el patrón de
otras tablas del schema. Todo acceso debe pasar por una Edge Function.

---

# Reclutamiento multi-tenant (Fase 1) — white-label por colegio

Vender el módulo de reclutamiento a otros colegios (ej. "VDF") con su propia
marca y su propio login de admin, en `yoaprendo.online/<slug>/`, dentro del
mismo proyecto Supabase.

## Paso 1 — Ejecutar la migración SQL

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta `migrations/multi-tenant-phase1.sql` (crea `tenants`, agrega
`tenant_id` a `user_roles`/`candidates`/`candidate_evaluations`, cambia el
unique de `user_roles` a compuesto tenant+usuario).

⚠️ Si la línea `UNIQUE NULLS NOT DISTINCT` falla, tu proyecto está en una
versión de Postgres anterior a la 15 — avísame antes de continuar, hay que
resolverlo de otra forma.

## Paso 2 — Re-desplegar las 3 funciones que cambiaron

`submit-application`, `evaluate-candidate` y `admin-users` se modificaron
para aceptar/validar `tenant_id`. Pega el código actualizado de cada una en
el Dashboard y Deploy — sin esto, las postulaciones no quedarán asociadas a
ningún colegio y el panel de reclutamiento no distinguirá tenants.

## Paso 3 — Publicar `.nojekyll` y `404.html`

Ya están en el repo (raíz) — solo asegúrate de que el deploy a `main` los
incluya. Sin `.nojekyll`, GitHub Pages corre Jekyll y podría comportarse
raro con `404.html`.

## Paso 4 — Crear el primer colegio de prueba (ej. VDF)

En el SQL Editor:
```sql
insert into public.tenants (slug, name, program_name, primary_color)
values ('vdf', 'Colegio VDF', 'Programa STEEAM VDF', '#7C3AED')
returning id;
```
Guarda el `id` que regresa — lo necesitas para el siguiente paso.

## Paso 5 — Invitar al primer admin de ese colegio

Como super admin (`billy@1bot.org`, sesión iniciada en cualquier página que
tenga `admin-users` disponible), llama la Edge Function con:
```json
{ "action": "invite", "email": "admin@vdf.edu.gt", "role": "admin", "tenantId": "<uuid del paso 4>" }
```
(Puedes hacerlo con `curl` + tu `access_token` de sesión, o agregar un botón
temporal en algún panel — no hay UI para esto en Fase 1, es proceso manual.)

## Paso 6 — Probar

1. `yoaprendo.online/vdf/postulacion.html` → debe verse con el color/nombre
   de VDF (no los de 1bot), y la URL debe quedar bonita en la barra.
2. Postular → confirmar en `candidates` que la fila tiene el `tenant_id` de VDF.
3. Login del admin de VDF en `yoaprendo.online/vdf/reclutamiento.html` → debe
   ver SOLO candidatos de VDF, sin el link "← Panel Administrativo" (ese
   panel es solo de 1bot en Fase 1).
4. `yoaprendo.online/postulacion.html` (sin slug) → debe seguir viéndose
   exactamente como antes, cero cambios para 1bot.

---

# Salario configurable + casos de estudio generados por IA

Cada colegio ahora puede configurar su propio presupuesto/tope salarial y
qué áreas evaluar (didáctica, pedagogía, manejo de grupo, tecnología) —
antes eran valores fijos (Q3,100/Q3,200) y casos de estudio fijos con
enfoque en robótica STEAM.

## Paso 1 — Ejecutar la migración SQL

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta `migrations/multi-tenant-salario-y-casos-ia.sql` (agrega
`salario_presupuesto`, `salario_maximo`, `evaluation_areas` a `tenants`,
y `generated_cases` a `candidates`).

## Paso 2 — Crear la Edge Function nueva `generate-cases`

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/functions
→ "New Function" → nombre exacto `generate-cases` → pega el código de
`supabase-functions/generate-cases/index.ts` → Deploy. Sin secrets
nuevos — reutiliza `GROQ_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.

## Paso 3 — Re-desplegar `submit-application` y `admin-users`

Ambas cambiaron: `submit-application` ahora lee `salario_maximo` de la
tabla `tenants` en vez de usar un valor fijo; `admin-users` acepta/
devuelve los campos nuevos en `createTenant`/`updateTenant`/`listTenants`.
Pega el código actualizado de cada una y Deploy.

## Paso 4 — Configurar un colegio

⚠️ **Actualizado** — ver la sección "Configuración por el admin del colegio
(no el super admin)" más abajo: el presupuesto/salario y las áreas ya NO
se configuran desde `colegios.html`, se movieron al panel del propio
admin del colegio en `reclutamiento.html`.

## Paso 5 — Probar

1. Configura un colegio (desde su propio panel, ver abajo) con
   `salario_maximo = 2500` → postular con pretensión Q3,000 debe rechazar
   por salario (antes hubiera pasado).
2. Entra a `evaluacion.html?token=...` de un candidato de ese colegio →
   los 5 casos generados deben cubrir didáctica/pedagogía/manejo de
   grupo/tecnología (siempre las 4, ya no configurable).
3. Recarga `evaluacion.html` con el mismo token ANTES de enviar
   respuestas → deben aparecer los MISMOS casos (cache en
   `candidates.generated_cases`, no se regeneran ni se gasta otra
   llamada a Groq).
4. Corta la conexión a internet antes de cargar `evaluacion.html` (o
   simula que `generate-cases` fallara) → deben aparecer los 5 casos de
   `FALLBACK_CASES` (genéricos, sin robótica) en vez de un error.

---

# Configuración por el admin del colegio (no el super admin)

El super admin (`colegios.html`) solo crea la identidad del colegio
(nombre, slug, colores, logo). El salario y las áreas de evaluación las
configura el propio admin del colegio, desde su panel de reclutamiento —
separa "quién onboarda el colegio" de "quién opera el reclutamiento".

## Paso 1 — Ejecutar la migración SQL

Ve a: https://supabase.com/dashboard/project/grkjhzkgcmackbafqudu/sql
Ejecuta `migrations/multi-tenant-cnb-areas.sql` (agrega `cnb_areas` a
`tenants` — las columnas `salario_presupuesto`/`salario_maximo` ya
existían de un paso anterior).

## Paso 2 — Re-desplegar `admin-users` y `generate-cases`

- `admin-users`: `createTenant`/`updateTenant` ya NO aceptan salario ni
  áreas (solo identidad). Nuevas acciones `getTenantSettings` /
  `updateTenantSettings` — el admin de un colegio solo puede leer/editar
  la configuración de SU PROPIO tenant (verificado server-side, igual
  que `listCandidates`/`provisionCandidate`).
- `generate-cases`: las 4 áreas base ya no se leen de configuración
  (siempre las 4). Ahora lee `tenants.cnb_areas` para ambientar los
  casos dentro de una materia del CNB si el colegio la configuró.

Pega el código actualizado de ambas y Deploy.

## Paso 3 — Cómo lo usa el admin del colegio

1. Login en `yoaprendo.online/<slug>/reclutamiento.html`.
2. Botón **"⚙️ Configuración"** (arriba a la derecha, solo visible para
   admins de colegio, no para el super admin en su vista sin slug).
3. Ahí configura: Presupuesto mensual, Pretensión máxima aceptada, y
   opcionalmente una o más materias del CNB (Comunicación y Lenguaje,
   Matemáticas, Medio Social y Natural, Expresión Artística, Educación
   Física, Formación Ciudadana, Emprendimiento, Tecnología/TAC) para que
   la IA ambiente los casos de estudio en esas materias.

## Paso 4 — Probar

1. Como admin de un colegio, abre "Configuración", guarda un
   `salario_maximo` bajo y una materia del CNB (ej. Matemáticas).
2. Postula con una pretensión salarial por encima de ese tope → debe
   rechazar por salario.
3. Entra a `evaluacion.html?token=...` de un candidato evaluado de ese
   colegio → los casos deben mencionar situaciones de una clase de
   Matemáticas, evaluando igual didáctica/pedagogía/manejo de grupo/
   tecnología (no contenido matemático en sí).
4. Como super admin en `colegios.html`, confirma que el formulario de
   crear/editar colegio YA NO tiene campos de salario ni áreas — solo
   nombre/slug/programa/colores/logo.
