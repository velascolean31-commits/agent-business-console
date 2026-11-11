import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Cookie = { name: string; value: string; options?: Record<string, unknown> };

// Públicas: acceso, páginas de captación, webs de los negocios, su pago y el aviso firmado de Stripe
const OPEN = [
  "/login", "/auth", "/s/", "/webs", "/legal", "/sitemap.xml", "/robots.txt", "/herramientas", "/guias",
  "/api/signup", "/api/checkout/", "/api/booking/", "/api/stripe/webhook",
];

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const open = OPEN.some((x) => p.startsWith(x));
  const away = (path: string) => {
    const to = req.nextUrl.clone();
    to.pathname = path;
    to.search = "";
    return NextResponse.redirect(to);
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allowed = process.env.ALLOWED_EMAIL;
  // Sin configuración de acceso, el panel privado queda cerrado (nunca abierto por defecto)
  if (!url || !anon || !allowed) return open ? NextResponse.next() : away("/webs");

  let res = NextResponse.next({ request: req });
  const sb = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list: Cookie[]) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await sb.auth.getUser();

  const isOwner = user?.email?.toLowerCase() === allowed.toLowerCase();
  // La portada pública es la página de alta; el resto de rutas privadas llevan al acceso
  if (!isOwner && !open) return away(p === "/" ? "/webs" : "/login");
  return res;
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
