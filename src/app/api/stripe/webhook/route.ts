import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getAdmin, audit } from "@/lib/supabase-admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe llama aquí cuando alguien paga, se cobra una mensualidad o se cancela una suscripción.
// Nada se marca como pagado sin la firma verificada de Stripe.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "no configurado" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "firma no válida" }, { status: 400 });
  }

  const HANDLED = ["checkout.session.completed", "invoice.paid", "customer.subscription.deleted"];
  if (!HANDLED.includes(event.type)) return NextResponse.json({ received: true, ignored: event.type });

  const admin = getAdmin();

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const leadId = s.client_reference_id;
    // Con periodo de prueba no hay cobro inicial: Stripe indica «no_payment_required»
    if (leadId && (s.payment_status === "paid" || s.payment_status === "no_payment_required")) {
      const { data: lead } = await admin
        .from("leads")
        .update({
          status: "client",
          became_client_at: new Date().toISOString(),
          stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
          stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : s.subscription?.id ?? null,
        })
        .eq("id", leadId)
        .select("id,owner_id,business_name")
        .maybeSingle();
      if (lead) await audit(lead.owner_id, "ledger", "client.activated", "leads", lead.id, { via: "stripe_checkout" });
    }
  }

  if (event.type === "invoice.paid") {
    const inv = event.data.object as Stripe.Invoice;
    // El campo cambió de sitio entre versiones de la API de Stripe: se comprueban los dos.
    const raw = inv as unknown as {
      subscription?: string | { id: string } | null;
      parent?: { subscription_details?: { subscription?: string | { id: string } | null } | null } | null;
    };
    const subRef = raw.parent?.subscription_details?.subscription ?? raw.subscription ?? null;
    const subId = typeof subRef === "string" ? subRef : subRef?.id ?? null;
    if (subId && inv.id && inv.amount_paid > 0) {
      const { data: lead } = await admin
        .from("leads")
        .select("id,owner_id")
        .eq("stripe_subscription_id", subId)
        .maybeSingle();
      if (lead) {
        const businessId = await agencyBusinessId(lead.owner_id);
        if (businessId) {
          // unique (platform, external_id) evita contar dos veces la misma factura
          await admin.from("revenue_records").upsert(
            {
              owner_id: lead.owner_id,
              business_id: businessId,
              agent: "ledger",
              platform: "stripe",
              external_id: inv.id,
              amount: inv.amount_paid / 100,
              fee: 0, // la comisión real de Stripe se concilia con las liquidaciones
              currency: inv.currency.toUpperCase(),
              status: "confirmed",
              origin: "real",
              occurred_at: new Date((inv.status_transitions?.paid_at ?? inv.created) * 1000).toISOString(),
            },
            { onConflict: "platform,external_id", ignoreDuplicates: true }
          );
        }
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const { data: lead } = await admin
      .from("leads")
      .update({ status: "paused" })
      .eq("stripe_subscription_id", sub.id)
      .select("id,owner_id")
      .maybeSingle();
    if (lead) await audit(lead.owner_id, "ledger", "client.paused", "leads", lead.id, { reason: "subscription_deleted" });
  }

  return NextResponse.json({ received: true });
}

async function agencyBusinessId(ownerId: string): Promise<string | null> {
  const admin = getAdmin();
  const { data: found } = await admin
    .from("businesses")
    .select("id")
    .eq("owner_id", ownerId)
    .eq("agent", "ledger")
    .limit(1)
    .maybeSingle();
  if (found) return found.id;
  const { data: created } = await admin
    .from("businesses")
    .insert({
      owner_id: ownerId,
      agent: "ledger",
      name: "Agencia de webs locales",
      business_model: "Suscripción mensual por web con reservas",
    })
    .select("id")
    .single();
  return created?.id ?? null;
}
