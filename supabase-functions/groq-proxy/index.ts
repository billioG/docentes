// Edge Function: groq-proxy
// Proxy seguro para llamadas a Groq API — la clave nunca se expone al cliente
// El cliente envía: { messages: [...], max_tokens?, temperature? }
// Requiere JWT de usuario autenticado (no basta el anon key).
// ⚠️ Desplegar DESPUÉS de publicar el app.js que envía session.access_token.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GROQ_API_KEY  = Deno.env.get('GROQ_API_KEY')!;
const GROQ_MODEL    = 'llama-3.3-70b-versatile';
const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

// Límites server-side — el cliente no puede inflar el costo
const MAX_TOKENS_CAP   = 800;
const MAX_MESSAGES     = 30;
const MAX_MSG_CHARS    = 4000;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  // Verificar JWT del usuario autenticado (igual que evaluate-portfolio)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);
  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return json({ error: 'Invalid token' }, 401);

  try {
    const { messages, max_tokens = 600, temperature = 0.7 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return json({ error: 'messages requerido' }, 400);
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: 'Demasiados mensajes en el historial' }, 400);
    }
    const safeMessages = messages.map((m: any) => ({
      role: m.role === 'system' || m.role === 'assistant' ? m.role : 'user',
      content: String(m.content ?? '').slice(0, MAX_MSG_CHARS),
    }));

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: safeMessages,
        max_tokens: Math.min(Number(max_tokens) || 600, MAX_TOKENS_CAP),
        temperature: Math.min(Math.max(Number(temperature) || 0.7, 0), 1.5),
      }),
    });

    const data = await res.json();
    return json(data, res.status);

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
