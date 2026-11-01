import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSupabase } from "@/lib/supabase-server";
import { buildAuthUrl } from "@/lib/integrations/youtube";

export async function GET() {
  const sb = await getSupabase();
  const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
  if (!data.user) return NextResponse.redirect(`${process.env.APP_URL ?? ""}/login`);

  let url: string;
  const state = randomBytes(24).toString("hex");
  try {
    url = buildAuthUrl(state);
  } catch (e) {
    return NextResponse.redirect(`${process.env.APP_URL ?? ""}/connections?error=${encodeURIComponent((e as Error).message)}`);
  }
  const res = NextResponse.redirect(url);
  res.cookies.set("yt_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}
