import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { getAdmin, audit } from "@/lib/supabase-admin";
import { revokeAtGoogle } from "@/lib/integrations/youtube";

export async function POST() {
  const base = process.env.APP_URL ?? "";
  const sb = await getSupabase();
  const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
  const user = data.user;
  if (!user) return NextResponse.redirect(`${base}/login`, 303);

  const admin = getAdmin();
  const { data: conn } = await admin.from("platform_connections").select("id").eq("owner_id", user.id).eq("platform", "youtube").maybeSingle();
  if (!conn) return NextResponse.redirect(`${base}/connections`, 303);

  const { data: accounts } = await admin.from("connected_accounts").select("id,secret_ref").eq("connection_id", conn.id);
  for (const a of accounts ?? []) {
    if (a.secret_ref) {
      const { data: token } = await admin.rpc("app_read_secret", { p_id: a.secret_ref });
      if (token) await revokeAtGoogle(token as string);
      await admin.rpc("app_delete_secret", { p_id: a.secret_ref });
    }
    await admin.from("connected_accounts").update({ status: "disconnected", secret_ref: null }).eq("id", a.id);
    await admin.from("agent_platform_permissions").update({ revoked_at: new Date().toISOString() }).eq("account_id", a.id);
    await audit(user.id, "user", "connection.revoked", "connected_accounts", a.id, { platform: "youtube" });
  }
  await admin.from("platform_connections").update({ status: "disconnected", status_detail: "Acceso revocado por el usuario", scopes_granted: [], updated_at: new Date().toISOString() }).eq("id", conn.id);

  return NextResponse.redirect(`${base}/connections?ok=revoked`, 303);
}
