import "server-only";
import { getAdmin, audit } from "@/lib/supabase-admin";

// Permisos mínimos de la Fase 2: solo lectura. El permiso de subida se pedirá en la Fase 3.
export const YT_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

const redirectUri = () => `${process.env.APP_URL}/api/connect/youtube/callback`;

export function buildAuthUrl(state: string): string {
  for (const k of ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "APP_URL"])
    if (!process.env[k]) throw new Error(`Falta la variable de entorno ${k}`);
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: YT_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

export interface TokenSet {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

async function tokenRequest(params: Record<string, string>) {
  return fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      ...params,
    }),
  });
}

export async function exchangeCode(code: string): Promise<TokenSet> {
  const r = await tokenRequest({ code, redirect_uri: redirectUri(), grant_type: "authorization_code" });
  if (!r.ok) throw new Error(`Intercambio de código fallido (${r.status})`);
  return r.json();
}

export async function fetchChannel(accessToken: string): Promise<{ id: string; title: string; customUrl?: string }> {
  const r = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`No se pudo leer el canal (${r.status})`);
  const item = (await r.json()).items?.[0];
  if (!item) throw new Error("La cuenta de Google no tiene un canal de YouTube");
  return { id: item.id, title: item.snippet.title, customUrl: item.snippet.customUrl };
}

export async function revokeAtGoogle(token: string): Promise<boolean> {
  const r = await fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
  });
  return r.ok;
}

// Devuelve un access token fresco o null. Si Google rechaza el refresh token (invalid_grant),
// marca la conexión como caducada para que las tareas dependientes se detengan.
export async function getAccessToken(userId: string, accountId: string, connectionId: string): Promise<string | null> {
  const admin = getAdmin();
  const { data: acc } = await admin.from("connected_accounts").select("secret_ref").eq("id", accountId).single();
  if (!acc?.secret_ref) return null;
  const { data: refresh } = await admin.rpc("app_read_secret", { p_id: acc.secret_ref });
  if (!refresh) return null;

  const r = await tokenRequest({ refresh_token: refresh as string, grant_type: "refresh_token" });
  if (r.ok) return (await r.json()).access_token as string;

  if (r.status === 400 || r.status === 401) {
    const detail = "Acceso caducado o revocado en Google. Reconecta la cuenta.";
    await admin.from("platform_connections").update({ status: "expired", status_detail: detail }).eq("id", connectionId);
    await admin.from("connected_accounts").update({ status: "expired" }).eq("id", accountId);
    await audit(userId, "system", "connection.expired", "connected_accounts", accountId, { platform: "youtube" });
    return null;
  }
  throw new Error(`Error al renovar el acceso (${r.status})`);
}
