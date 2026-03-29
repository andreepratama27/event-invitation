import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('manage_session', { path: '/' });
  return redirect('/login', 302);
};
