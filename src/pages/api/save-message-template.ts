import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../db/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { template?: unknown };
    const template = typeof body.template === 'string' ? body.template : '';

    // Upsert: update existing active template or insert new one
    const { data: existing } = await supabaseAdmin
      .from('message_template')
      .select('id')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabaseAdmin
        .from('message_template')
        .update({ content: template, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('message_template')
        .insert({ name: 'default', content: template, is_active: true });

      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
