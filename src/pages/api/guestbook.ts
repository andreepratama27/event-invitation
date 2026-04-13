import type { APIRoute } from 'astro';
import { supabase } from '../../db/supabase';

export const prerender = false;

// ── Rate limiter ─────────────────────────────────────────────
// Max 3 submissions per IP per 10 minutes (in-memory, resets on cold start)
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const ipSubmissions = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipSubmissions.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

// ── Validation limits ─────────────────────────────────────────
const NAME_MIN = 2;
const NAME_MAX = 100;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 1000;

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
  // ── Rate limiting ─────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Terlalu banyak pengiriman. Coba lagi dalam 10 menit.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const body = await request.json();
  const { name, message } = body as { name: string; message: string };

  // ── Validate name ─────────────────────────────────────────
  if (!name || name.trim().length < NAME_MIN) {
    return new Response(
      JSON.stringify({ ok: false, error: `Nama wajib diisi (minimal ${NAME_MIN} karakter)` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (name.trim().length > NAME_MAX) {
    return new Response(
      JSON.stringify({ ok: false, error: `Nama terlalu panjang (maksimal ${NAME_MAX} karakter)` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── Validate message ──────────────────────────────────────
  if (!message || message.trim().length < MESSAGE_MIN) {
    return new Response(
      JSON.stringify({ ok: false, error: `Ucapan wajib diisi (minimal ${MESSAGE_MIN} karakter)` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (message.trim().length > MESSAGE_MAX) {
    return new Response(
      JSON.stringify({ ok: false, error: `Ucapan terlalu panjang (maksimal ${MESSAGE_MAX} karakter)` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
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
