import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Cookie = { name: string; value: string; options?: Record<string, unknown> };

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

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

  const p = req.nextUrl.pathname;
  // Públicas: acceso, webs de los negocios, su pago y reservas, y el aviso firmado de Stripe
  const open = ["/login", "/auth", "/s/", "/api/checkout/", "/api/booking/", "/api/stripe/webhook"].some((x) =>
    p.startsWith(x)
  );
  const allowed = process.env.ALLOWED_EMAIL;
  const forbidden = user && allowed && user.email?.toLowerCase() !== allowed.toLowerCase();

  if ((!user || forbidden) && !open) {
    const to = req.nextUrl.clone();
    to.pathname = "/login";
    to.search = "";
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
