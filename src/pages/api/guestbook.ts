import type { APIRoute } from 'astro';
import { supabase } from '../../db/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { name, message } = body as { name: string; message: string };

  if (!name || name.trim().length < 2) {
    return new Response(JSON.stringify({ ok: false, error: 'Nama wajib diisi (minimal 2 karakter)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!message || message.trim().length < 5) {
    return new Response(JSON.stringify({ ok: false, error: 'Ucapan wajib diisi (minimal 5 karakter)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('guestbook')
    .insert([{ name: name.trim(), message: message.trim() }])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
