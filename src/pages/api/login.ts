import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const SESSION_COOKIE = 'manage_session';
const SESSION_MAX_AGE = 60 * 5; // 5 minutes

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = form.get('email')?.toString().trim() ?? '';
  const password = form.get('password')?.toString() ?? '';

  const validEmail = import.meta.env.USER_EMAIL ?? '';
  const validPassword = import.meta.env.USER_PASSWORD ?? '';

  if (!validEmail || !validPassword) {
    return new Response(JSON.stringify({ ok: false, error: 'Kredensial belum dikonfigurasi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (email === validEmail && password === validPassword) {
    const token = crypto.randomBytes(32).toString('hex');
    cookies.set(SESSION_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
    });

    return redirect('/admin', 302);
  }

  // Wrong credentials — redirect back with error
  return redirect('/login?error=1', 302);
};
