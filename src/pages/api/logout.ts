import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request }) => {
  cookies.delete('manage_session', { path: '/' });
  return Response.redirect(new URL('/login', request.url), 302);
};
