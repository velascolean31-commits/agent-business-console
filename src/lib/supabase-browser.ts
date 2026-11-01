import { createBrowserClient } from "@supabase/ssr";

// Solo usa la clave pública (anon). Nunca pongas secretos aquí.
export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
