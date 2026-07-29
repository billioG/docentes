// Edge Function: evaluate-candidate
// Evalúa los casos de estudio de un candidato a un puesto docente usando
// Groq (Llama 3.3) — rúbrica técnica (didáctica/pedagogía/tecnología) +
// habilidades blandas, estilo Hurix: el candidato ve su propio puntaje y
// decide si continúa el proceso. General, no ligado a un programa
// específico (ver generate-cases para los casos que responde).
// Pública — el candidato no tiene cuenta Supabase, se autentica con el
// `access_token` que recibió de submit-application (no un JWT).
//
// Dos formas de request, mismo endpoint:
//   1) Evaluar:  { access_token, responses: [{ case_id, answer_text }, ...] }
//      → { ok:true, technical_score, soft_score, overall_score, passed,
//          feedback, weak_areas, recommended_paths:[{id,label,courses}] }
//   2) Decidir:  { access_token, decision: 'continuar' | 'retirar' }
//      → { ok:true }
//
// Un solo intento de evaluación por candidato: la transición de estado
// `evaluacion_pendiente → evaluado` se hace con un UPDATE condicionado
// (WHERE status='evaluacion_pendiente') ANTES de llamar a Groq; si no
// afecta ninguna fila, se rechaza con 409. Esto evita que un candidato
// reintente hasta obtener buen puntaje.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GROQ_API_KEY         = Deno.env.get('GROQ_API_KEY')!;
const GROQ_MODEL           = 'llama-3.3-70b-versatile';
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// Espejo de LEARNING_PATHS (admin.js:11-17) — mismos ids, no se inventa taxonomía nueva.
const LEARNING_PATHS: Record<string, { label: string; courses: string[] }> = {
  steam20:      { label: 'Docente STEAM 2.0',            courses: ['steam', 'abp', 'design-thinking', 'evaluacion', 'tipos-estudiantes'] },
  creativo:     { label: 'Docente Creativo',              courses: ['creatividad', 'herramientas-tec', 'abp'] },
  metodologias: { label: 'Metodologías Activas',          courses: ['abp', 'm-learning', 'flipped-classroom', 'abv', 'micro-learning'] },
  ia:           { label: 'Docente y la IA',               courses: ['ia-fundamentos', 'ia-tiempo', 'ia-herramientas', 'ia-inclusion', 'ia-ciudadania'] },
  convivencia:  { label: 'Clima y Convivencia Escolar',    courses: ['manejo-conductas', 'sel-docentes', 'comunicacion-asertiva', 'disciplina-positiva', 'bienestar-docente'] },
};
const VALID_PATH_IDS = Object.keys(LEARNING_PATHS);

const MAX_RESPONSES  = 10;
const MAX_ANSWER_CHARS = 2000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = await req.json();
    const access_token = String(body.access_token || '').trim();
    if (!access_token) return json({ error: 'access_token es requerido' }, 400);

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: candidate, error: findErr } = await admin
      .from('candidates')
      .select('id, full_name, status, tenant_id, generated_cases')
      .eq('access_token', access_token)
      .maybeSingle();

    if (findErr) return json({ error: findErr.message }, 500);
    if (!candidate) return json({ error: 'Token inválido' }, 404);

    // ── Rama 2: registrar decisión del candidato ──────────────
    if (body.decision) {
      const decision = body.decision === 'continuar' || body.decision === 'retirar' ? body.decision : null;
      if (!decision) return json({ error: 'decision inválida' }, 400);
      if (candidate.status !== 'evaluado') return json({ error: 'El candidato aún no tiene evaluación' }, 409);

      const { error: updEvalErr } = await admin
        .from('candidate_evaluations')
        .update({ candidate_decision: decision })
        .eq('candidate_id', candidate.id);
      if (updEvalErr) return json({ error: updEvalErr.message }, 500);

      if (decision === 'retirar') {
        await admin.from('candidates').update({ status: 'desertado' }).eq('id', candidate.id);
      }
      return json({ ok: true });
    }

    // ── Rama 1: evaluar respuestas ─────────────────────────────
    const responses = Array.isArray(body.responses) ? body.responses.slice(0, MAX_RESPONSES) : [];
    if (responses.length === 0) return json({ error: 'responses requerido' }, 400);

    const safeResponses = responses.map((r: any) => ({
      case_id: String(r.case_id || '').slice(0, 60),
      answer_text: String(r.answer_text || '').slice(0, MAX_ANSWER_CHARS),
    }));

    // Transición atómica de estado — bloquea reintentos.
    const { data: updated, error: transErr } = await admin
      .from('candidates')
      .update({ status: 'evaluado', updated_at: new Date().toISOString() })
      .eq('id', candidate.id)
      .eq('status', 'evaluacion_pendiente')
      .select('id');

    if (transErr) return json({ error: transErr.message }, 500);
    if (!updated || updated.length === 0) {
      return json({ error: 'Esta postulación ya fue evaluada o no está lista para evaluación' }, 409);
    }

    // Recupera el enunciado real de cada caso (generado por generate-cases
    // y cacheado en candidates.generated_cases) para que el LLM pueda
    // juzgar si la respuesta es coherente con lo que se preguntó — sin
    // esto solo vería el id genérico ("caso-3") y la respuesta, sin saber
    // qué situación se planteó.
    const casesById = new Map(
      (Array.isArray(candidate.generated_cases) ? candidate.generated_cases : [])
        .map((c: any) => [String(c.id), String(c.prompt || '')])
    );

    const responsesText = safeResponses.map((r, i) => {
      const prompt = casesById.get(r.case_id);
      return `${i + 1}. Caso${prompt ? `: "${prompt}"` : ` "${r.case_id}"`}\nRespuesta del candidato: "${r.answer_text}"`;
    }).join('\n\n');

    const systemPrompt = `Eres un especialista en selección de personal docente en Guatemala. Evalúas candidatos a un puesto de facilitador/docente general — no de una materia, programa o tecnología específica. Siempre respondes ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código markdown.`;

    const userPrompt = `Evalúa las respuestas de este/a candidato/a a ${safeResponses.length} caso(s) de estudio de un proceso de selección docente.

Califica DOS dimensiones, cada una de 0 a 100:

TÉCNICA (didáctica, pedagogía, resolución de problemas de aula, uso de tecnología educativa):
- ¿Propone una solución coherente y aplicable al caso?
- ¿Demuestra lógica pedagógica estructurada (pasos, causa-efecto, iteración tipo "prueba y mejora")?
- ¿Entiende principios de didáctica/pedagogía aplicados a la situación?

BLANDAS (manejo de grupo, comunicación, adaptabilidad):
- ¿La respuesta muestra empatía y manejo de grupo realista?
- ¿Comunica ideas con claridad?
- ¿Muestra disposición a adaptarse a un aula real, no solo teoría?

CRITERIOS ADICIONALES:
- Si una respuesta tiene menos de 15 palabras o no responde al caso planteado, penaliza fuerte esa dimensión.
- Sé justo pero riguroso — el objetivo es identificar candidatos con potencial real para un aula, no títulos académicos.

Identifica las áreas más débiles del candidato ÚNICAMENTE de esta lista fija de rutas de formación (usa los ids exactos, incluye solo las que aplican, máximo 3):
- "steam20": metodología STEAM/ABP/Design Thinking — fundamentos pedagógicos
- "convivencia": manejo de aula, disciplina, comunicación asertiva, clima escolar
- "ia": herramientas de inteligencia artificial aplicadas a la enseñanza
- "creativo": creatividad y herramientas tecnológicas generales
- "metodologias": metodologías activas (aprendizaje móvil, aula invertida, microlearning)

RESPUESTAS DEL CANDIDATO:

${responsesText}

Responde ÚNICAMENTE con este JSON (sin texto antes ni después):
{
  "technical_score": 75,
  "soft_score": 80,
  "feedback_technical": "2-3 oraciones sobre la dimensión técnica.",
  "feedback_soft": "2-3 oraciones sobre la dimensión blanda.",
  "summary": "2-3 oraciones de retroalimentación global y potencial del candidato.",
  "weak_path_ids": ["convivencia"]
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        max_tokens: 700,
        temperature: 0.3,
      }),
    });

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content || '';
    const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let evaluation: any;
    try {
      evaluation = JSON.parse(jsonStr);
    } catch {
      // No revertir el estado 'evaluado' — evita reintentos infinitos por fallos de parseo del LLM.
      // Se guarda un registro con puntaje 0 para que el admin pueda revisar/re-evaluar manualmente.
      await admin.from('candidate_evaluations').insert({
        candidate_id: candidate.id,
        tenant_id: candidate.tenant_id,
        technical_score: 0, soft_score: 0, overall_score: 0, passed: false,
        feedback: { error: 'parse_error', raw },
        raw_responses: Object.fromEntries(safeResponses.map(r => [r.case_id, r.answer_text])),
      });
      return json({ error: 'Error al parsear respuesta de IA — contactar al administrador' }, 500);
    }

    const clamp = (n: any) => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));
    const technical_score = clamp(evaluation.technical_score);
    const soft_score      = clamp(evaluation.soft_score);
    const overall_score   = Math.round((technical_score + soft_score) / 2);
    const passed = overall_score >= 60;

    const weak_areas: string[] = (Array.isArray(evaluation.weak_path_ids) ? evaluation.weak_path_ids : [])
      .filter((id: any) => VALID_PATH_IDS.includes(id))
      .slice(0, 3);

    const recommended_paths = weak_areas.map((id) => ({ id, label: LEARNING_PATHS[id].label, courses: LEARNING_PATHS[id].courses }));

    const feedback = {
      technical: evaluation.feedback_technical || '',
      soft: evaluation.feedback_soft || '',
      summary: evaluation.summary || '',
    };

    const { error: insErr } = await admin.from('candidate_evaluations').insert({
      candidate_id: candidate.id,
      tenant_id: candidate.tenant_id,
      technical_score,
      soft_score,
      overall_score,
      passed,
      feedback,
      weak_areas,
      recommended_path_ids: weak_areas,
      raw_responses: Object.fromEntries(safeResponses.map(r => [r.case_id, r.answer_text])),
    });
    if (insErr) return json({ error: insErr.message }, 500);

    return json({
      ok: true,
      technical_score,
      soft_score,
      overall_score,
      passed,
      feedback,
      weak_areas,
      recommended_paths,
    });

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
