import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

/** Anon/publishable client — subject to RLS (safe for client-facing reads) */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Admin client using the service role key — bypasses RLS.
 * Use ONLY in server-side API routes, never expose to the browser.
 * Falls back to the anon client if SUPABASE_SERVICE_KEY is not set.
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : supabase;
