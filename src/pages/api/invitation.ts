import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../db/supabase';

export const prerender = false;

// GET - Fetch all invitations
export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('invitation')
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

// POST - Add new invitation
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { guest_name, phone_number } = body as { guest_name: string; phone_number: string };

  if (!guest_name || guest_name.trim().length < 1) {
    return new Response(JSON.stringify({ ok: false, error: 'Nama wajib diisi' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!phone_number || phone_number.trim().length < 10) {
    return new Response(JSON.stringify({ ok: false, error: 'Nomor WhatsApp tidak valid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabaseAdmin
    .from('invitation')
    .insert([{ guest_name: guest_name.trim(), phone_number: phone_number.trim(), is_sent: false }])
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

// PUT - Update invitation (edit or mark as sent)
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { id, guest_name, phone_number, is_sent } = body as { id: string; guest_name?: string; phone_number?: string; is_sent?: boolean };

  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'ID wajib diisi' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const updateData: Record<string, unknown> = {};
  if (guest_name !== undefined) updateData.guest_name = guest_name.trim();
  if (phone_number !== undefined) updateData.phone_number = phone_number.trim();
  if (is_sent !== undefined) updateData.is_sent = is_sent;

  const { data, error } = await supabaseAdmin
    .from('invitation')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

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

// DELETE - Delete invitation(s)
export const DELETE: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { id, deleteAll } = body as { id?: string; deleteAll?: boolean };

  if (deleteAll) {
    // First get all IDs, then delete them
    const { data: allRecords } = await supabaseAdmin
      .from('invitation')
      .select('id');

    if (!allRecords || allRecords.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: 'Tidak ada data untuk dihapus' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ids = allRecords.map((r) => r.id);
    const { error } = await supabaseAdmin
      .from('invitation')
      .delete()
      .in('id', ids);

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, message: 'Semua undangan dihapus' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'ID wajib diisi' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabaseAdmin
    .from('invitation')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, message: 'Undangan dihapus' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
