import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con service_role: SOLO en rutas de servidor, tras validar la sesión del usuario.
export function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en el servidor");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function audit(
  ownerId: string,
  actor: string,
  action: string,
  entity?: string,
  entityId?: string,
  detail: Record<string, unknown> = {}
) {
  await getAdmin()
    .from("audit_logs")
    .insert({ owner_id: ownerId, actor, action, entity, entity_id: entityId, detail });
}
