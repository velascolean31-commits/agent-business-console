import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { getAdmin } from "@/lib/supabase-admin";
import { getAccessToken, fetchChannel } from "@/lib/integrations/youtube";

export async function POST() {
  const base = process.env.APP_URL ?? "";
  const sb = await getSupabase();
  const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
  const user = data.user;
  if (!user) return NextResponse.redirect(`${base}/login`, 303);

  const admin = getAdmin();
  const { data: conn } = await admin.from("platform_connections").select("id,status").eq("owner_id", user.id).eq("platform", "youtube").maybeSingle();
  if (!conn || conn.status === "disconnected") return NextResponse.redirect(`${base}/connections?error=YouTube%20no%20est%C3%A1%20conectado`, 303);

  const { data: log } = await admin.from("integration_sync_logs").insert({ owner_id: user.id, connection_id: conn.id }).select("id").single();
  const { data: acc } = await admin.from("connected_accounts").select("id").eq("connection_id", conn.id).neq("status", "disconnected").limit(1).maybeSingle();

  const finish = async (ok: boolean, msg: string | null, read = 0) => {
    if (log) await admin.from("integration_sync_logs").update({ finished_at: new Date().toISOString(), ok, error_message: msg, records_read: read }).eq("id", log.id);
  };

  try {
    if (!acc) throw new Error("No hay cuenta conectada");
    const token = await getAccessToken(user.id, acc.id, conn.id);
    if (!token) {
      await finish(false, "Acceso caducado o inválido; tareas dependientes detenidas");
      return NextResponse.redirect(`${base}/connections?error=Conexi%C3%B3n%20caducada.%20Reconecta%20YouTube`, 303);
    }
    await fetchChannel(token);
    const now = new Date().toISOString();
    await admin.from("platform_connections").update({ status: "connected", status_detail: null, last_sync_at: now, updated_at: now }).eq("id", conn.id);
    await admin.from("connected_accounts").update({ last_sync_at: now, status: "connected" }).eq("id", acc.id);
    await finish(true, null, 1);
    return NextResponse.redirect(`${base}/connections?ok=synced`, 303);
  } catch (e) {
    await finish(false, (e as Error).message);
    await admin.from("platform_connections").update({ status: "error", status_detail: (e as Error).message }).eq("id", conn.id);
    return NextResponse.redirect(`${base}/connections?error=${encodeURIComponent((e as Error).message)}`, 303);
  }
}
