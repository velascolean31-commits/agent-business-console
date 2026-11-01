import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { getAdmin, audit } from "@/lib/supabase-admin";
import { exchangeCode, fetchChannel, YT_SCOPES } from "@/lib/integrations/youtube";

export async function GET(req: NextRequest) {
  const base = process.env.APP_URL ?? req.nextUrl.origin;
  const back = (q: string) => NextResponse.redirect(`${base}/connections?${q}`);

  const sb = await getSupabase();
  const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
  const user = data.user;
  if (!user) return NextResponse.redirect(`${base}/login`);

  const params = req.nextUrl.searchParams;
  if (params.get("error")) return back(`error=${encodeURIComponent("Autorización cancelada o denegada en Google")}`);

  const state = params.get("state");
  const code = params.get("code");
  const cookieState = req.cookies.get("yt_oauth_state")?.value;
  if (!code || !state || !cookieState || state !== cookieState) return back("error=Estado%20OAuth%20no%20v%C3%A1lido");

  try {
    const tok = await exchangeCode(code);
    if (!tok.refresh_token) throw new Error("Google no devolvió refresh token. Revoca el acceso previo en tu cuenta de Google y reconecta.");
    const granted = tok.scope.split(" ");
    const missing = YT_SCOPES.filter((s) => !granted.includes(s));
    if (missing.length) throw new Error("No concediste todos los permisos necesarios.");

    const channel = await fetchChannel(tok.access_token);
    const admin = getAdmin();

    const { data: conn, error: e1 } = await admin
      .from("platform_connections")
      .upsert(
        { owner_id: user.id, platform: "youtube", display_name: "YouTube", status: "connected", status_detail: null, scopes_granted: granted, last_sync_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: "owner_id,platform" }
      )
      .select("id")
      .single();
    if (e1 || !conn) throw new Error(e1?.message ?? "No se pudo guardar la conexión");

    const { data: secretId, error: e2 } = await admin.rpc("app_store_secret", {
      p_name: `youtube:${user.id}:${channel.id}`,
      p_secret: tok.refresh_token,
    });
    if (e2 || !secretId) throw new Error("No se pudo guardar el secreto (¿migración 0002 aplicada?)");

    const { data: acc, error: e3 } = await admin
      .from("connected_accounts")
      .upsert(
        { owner_id: user.id, connection_id: conn.id, external_account_id: channel.id, handle: channel.customUrl ?? channel.title, purpose: "Publicación de clips (Agente Alpha)", secret_ref: secretId, status: "connected", last_sync_at: new Date().toISOString() },
        { onConflict: "connection_id,external_account_id" }
      )
      .select("id")
      .single();
    if (e3 || !acc) throw new Error(e3?.message ?? "No se pudo guardar la cuenta");

    await admin.from("agent_platform_permissions").upsert(
      { owner_id: user.id, agent: "alpha", account_id: acc.id, permissions: ["read_channel", "read_analytics"], shared_use_allowed: false, revoked_at: null },
      { onConflict: "agent,account_id" }
    );
    await audit(user.id, "user", "connection.connected", "connected_accounts", acc.id, { platform: "youtube", channel: channel.id, scopes: granted });

    const res = back("ok=youtube");
    res.cookies.delete("yt_oauth_state");
    return res;
  } catch (e) {
    return back(`error=${encodeURIComponent((e as Error).message)}`);
  }
}
