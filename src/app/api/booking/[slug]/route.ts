import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/supabase-admin";

// Público: formulario de cita/reserva de la web de un negocio.
// Solo se guardan datos si el negocio ya es cliente; en las webs de muestra el formulario es una demostración.
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const back = (q: string) => NextResponse.redirect(`${process.env.APP_URL ?? ""}/s/${slug}?${q}#reserva`, 303);

  const form = await req.formData();
  if (String(form.get("web") ?? "")) return back("reserva=ok"); // campo trampa para bots

  const name = String(form.get("nombre") ?? "").trim().slice(0, 80);
  const contact = String(form.get("contacto") ?? "").trim().slice(0, 120);
  const wanted = String(form.get("cuando") ?? "").trim().slice(0, 80);
  const message = String(form.get("mensaje") ?? "").trim().slice(0, 600);
  if (name.length < 2 || contact.length < 5) return back("reserva=faltan-datos");

  const admin = getAdmin();
  const { data: lead } = await admin.from("leads").select("id,owner_id,status").eq("slug", slug).maybeSingle();
  if (!lead) return back("reserva=error");
  if (lead.status !== "client") return back("reserva=demo");

  const { error } = await admin.from("booking_requests").insert({
    owner_id: lead.owner_id,
    lead_id: lead.id,
    customer_name: name,
    customer_contact: contact,
    wanted_at: wanted || null,
    message: message || null,
  });
  return back(error ? "reserva=error" : "reserva=ok");
}
