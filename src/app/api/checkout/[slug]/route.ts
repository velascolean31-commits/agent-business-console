import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/supabase-admin";
import { getStripe, missingStripeEnv } from "@/lib/stripe";

// Público: el dueño del negocio pulsa «Activar» en su web de muestra y paga en la página de Stripe.
// Aquí no se maneja ningún dato de pago: solo se crea la sesión y se redirige.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = process.env.APP_URL ?? "";
  const back = (q: string) => NextResponse.redirect(`${base}/s/${slug}?${q}`, 303);

  if (missingStripeEnv().length) return back("pago=no-disponible");

  const { data: lead } = await getAdmin()
    .from("leads")
    .select("id,status,email")
    .eq("slug", slug)
    .maybeSingle();
  if (!lead || lead.status === "lost") return NextResponse.redirect(`${base}/`, 303);
  if (lead.status === "client") return back("pago=ya-activo");

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      client_reference_id: lead.id,
      customer_email: lead.email ?? undefined,
      subscription_data: { metadata: { lead_id: lead.id } },
      success_url: `${base}/s/${slug}?pago=ok`,
      cancel_url: `${base}/s/${slug}?pago=cancelado`,
      locale: "es",
    });
    if (!session.url) return back("pago=error");
    return NextResponse.redirect(session.url, 303);
  } catch {
    return back("pago=error");
  }
}
