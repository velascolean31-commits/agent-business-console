import { NextResponse, type NextRequest } from "next/server";
import { getAdmin, audit } from "@/lib/supabase-admin";
import { ownerId, legalIdentity } from "@/lib/owner";
import { CATEGORIES, slugify } from "@/lib/leads";

const DAILY_CAP = 40; // tope global de altas públicas al día, contra abuso

// Público: un negocio crea su propia web de muestra desde /webs.
export async function POST(req: NextRequest) {
  const base = process.env.APP_URL ?? "";
  const back = (q: string) => NextResponse.redirect(`${base}/webs?${q}#crear`, 303);

  const form = await req.formData();
  if (String(form.get("web") ?? "")) return NextResponse.redirect(`${base}/webs`, 303); // bots

  const text = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const name = text("business_name", 120);
  const city = text("city", 80);
  const category = text("category", 20);
  const email = text("email", 120);
  if (name.length < 2 || city.length < 2 || !(category in CATEGORIES)) return back("error=datos");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return back("error=correo");
  if (form.get("acepto") !== "on") return back("error=condiciones");

  if (!legalIdentity()) return back("error=no-disponible");
  const owner = await ownerId();
  if (!owner) return back("error=no-disponible");

  const admin = getAdmin();
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("source", "self_serve")
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_CAP) return back("error=limite");

  const slug = slugify(name, city);
  const { data, error } = await admin
    .from("leads")
    .insert({
      owner_id: owner,
      business_name: name,
      city,
      category,
      email,
      phone: text("phone", 30) || null,
      address: text("address", 160) || null,
      opening_hours: text("opening_hours", 160) || null,
      slug,
      source: "self_serve",
      accepted_terms_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) return back(error.code === "23505" ? "error=existe" : "error=guardar");

  await audit(owner, "forge", "lead.self_serve_created", "leads", data.id);
  return NextResponse.redirect(`${base}/s/${slug}?creada=1`, 303);
}
