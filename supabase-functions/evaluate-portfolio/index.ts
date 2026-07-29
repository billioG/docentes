// Edge Function: evaluate-portfolio
// Evalúa el portafolio de práctica docente usando Groq (Llama 3.3)
// Recibe: { items: [{label, text}], examScore50: number }   ← formato dinámico por ruta
//   (compat. hacia atrás: { entregables: {steam,abp,dt,eval,tipos}, examScore50 })
// Devuelve: { scores: number[], feedback: string[], total: number (0-50), summary, combined, passed }
// El total se normaliza SIEMPRE a 50 puntos, sin importar cuántos entregables tenga la ruta.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GROQ_API_KEY    = Deno.env.get('GROQ_API_KEY')!;
const GROQ_MODEL      = 'llama-3.3-70b-versatile';
const SUPABASE_URL    = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON   = Deno.env.get('SUPABASE_ANON_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LEGACY_LABELS = ['STEAM', 'ABP', 'Design Thinking', 'Evaluación Formativa', 'Conoce a tus Estudiantes'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // Verificar JWT del usuario autenticado
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }
  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json();
    const { examScore50 } = body;

    // Normalizar a una lista [{label, text}]
    let items: { label: string; text: string }[] = [];
    if (Array.isArray(body.items) && body.items.length > 0) {
      items = body.items.map((it: any) => ({ label: String(it.label || ''), text: String(it.text || '') }));
    } else if (body.entregables) {
      const e = body.entregables;
      items = [
        { label: 'STEAM', text: e.steam || '' },
        { label: 'ABP', text: e.abp || '' },
        { label: 'Design Thinking', text: e.dt || '' },
        { label: 'Evaluación Formativa', text: e.eval || '' },
        { label: 'Conoce a tus Estudiantes', text: e.tipos || '' },
      ];
    }

    if (items.length === 0) {
      return new Response(JSON.stringify({ error: 'entregables requeridos' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    const n = items.length;
    const entregablesText = items.map((it, i) =>
      `${i + 1}. ${it.label}:\n"${(it.text || '').substring(0, 800)}"`
    ).join('\n\n');

    const exampleScores   = items.map(() => 8);
    const exampleFeedback = items.map((it) => `Retroalimentación específica para ${it.label} (2-3 oraciones).`);

    const systemPrompt = `Eres un evaluador pedagógico experto en formación docente en Guatemala. Evalúas portafolios de práctica de docentes que completaron un programa de formación en pedagogía innovadora. Siempre respondes ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código markdown.`;

    const userPrompt = `Evalúa el portafolio de práctica de este/a docente. Hay ${n} entregable(s), uno por curso de la ruta. Asigna de 0 a 10 puntos a CADA entregable usando esta rúbrica:

RÚBRICA (por entregable, 0-10):
- Pertinencia (0-3 pts): ¿La evidencia corresponde claramente al enfoque del curso?
- Profundidad (0-4 pts): ¿Demuestra comprensión genuina de los conceptos centrales?
- Aplicación real (0-3 pts): ¿Hay evidencia de implementación con estudiantes reales o planificación concreta y detallada?

CRITERIOS ADICIONALES:
- Si el texto tiene menos de 80 palabras, máximo 5 puntos (evidencia insuficiente).
- Si el texto no tiene relación con el curso indicado, 0-2 puntos.
- Sé justo pero riguroso. El objetivo es certificar docentes que realmente aprendieron.

ENTREGABLES:

${entregablesText}

Responde ÚNICAMENTE con este JSON (sin texto antes ni después). El arreglo "scores" y "feedback" deben tener EXACTAMENTE ${n} elemento(s), en el mismo orden que los entregables:
{
  "scores": ${JSON.stringify(exampleScores)},
  "feedback": ${JSON.stringify(exampleFeedback)},
  "summary": "Retroalimentación global de 2-3 oraciones sobre el portafolio completo y el potencial del docente."
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
        max_tokens: 900,
        temperature: 0.3,
      }),
    });

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content || '';

    // Parse JSON — strip markdown fences if present
    const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let evaluation;
    try {
      evaluation = JSON.parse(jsonStr);
    } catch {
      return new Response(JSON.stringify({ error: 'Error al parsear respuesta de IA', raw }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    // Validar y normalizar puntajes — el portafolio SIEMPRE vale 50 pts sin importar nº de entregables
    let scores = (Array.isArray(evaluation.scores) ? evaluation.scores : [])
      .map((s: number) => Math.min(10, Math.max(0, Math.round(s))));
    // Ajustar longitud a n (rellena con 0 o recorta)
    while (scores.length < n) scores.push(0);
    if (scores.length > n) scores = scores.slice(0, n);
    const rawSum = scores.reduce((a: number, b: number) => a + b, 0); // 0..(n*10)
    const maxSum = n * 10;
    const total  = maxSum > 0 ? Math.round((rawSum / maxSum) * 50) : 0; // normalizado a /50
    const combined = Math.min(100, (examScore50 || 0) + total);

    return new Response(JSON.stringify({
      scores,
      feedback: evaluation.feedback || [],
      total,
      summary:  evaluation.summary || '',
      combined,
      passed:   combined >= 85,
    }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }
});
