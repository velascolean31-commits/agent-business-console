import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase-server";
import { getAdmin, audit } from "@/lib/supabase-admin";
import { missingStripeEnv } from "@/lib/stripe";
import {
  CATEGORIES,
  LEAD_FIELDS,
  STATUS_TEXT,
  outreachMessage,
  planPrice,
  siteUrl,
  slugify,
  whatsappLink,
  type Lead,
  type LeadCategory,
  type LeadStatus,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

async function requireUser() {
  const sb = await getSupabase();
  const user = (await sb?.auth.getUser())?.data.user;
  if (!user) redirect("/login");
  return user;
}

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max) || null;

async function addLead(fd: FormData) {
  "use server";
  const user = await requireUser();
  const name = clean(fd.get("business_name"), 120);
  const city = clean(fd.get("city"), 80);
  const category = String(fd.get("category") ?? "otro");
  if (!name || name.length < 2 || !city || city.length < 2 || !(category in CATEGORIES)) return;

  const { data, error } = await getAdmin()
    .from("leads")
    .insert({
      owner_id: user.id,
      business_name: name,
      city,
      category,
      phone: clean(fd.get("phone"), 30),
      email: clean(fd.get("email"), 120),
      address: clean(fd.get("address"), 160),
      opening_hours: clean(fd.get("opening_hours"), 160),
      notes: clean(fd.get("notes"), 400),
      slug: slugify(name, city),
    })
    .select("id")
    .single();
  if (!error && data) await audit(user.id, "forge", "lead.demo_created", "leads", data.id);
  revalidatePath("/leads");
}

// Los estados «client» y «paused» solo los cambia Stripe, nunca a mano.
const MANUAL: LeadStatus[] = ["demo_ready", "contacted", "interested", "lost"];

async function setStatus(fd: FormData) {
  "use server";
  const user = await requireUser();
  const id = String(fd.get("id") ?? "");
  const status = String(fd.get("status") ?? "") as LeadStatus;
  if (!id || !MANUAL.includes(status)) return;
  await getAdmin()
    .from("leads")
    .update({ status, ...(status === "contacted" ? { contacted_at: new Date().toISOString() } : {}) })
    .eq("id", id)
    .eq("owner_id", user.id)
    .in("status", MANUAL);
  await audit(user.id, "user", "lead.status_changed", "leads", id, { status });
  revalidatePath("/leads");
}

export default async function LeadsPage() {
  const sb = await getSupabase();
  let leads: Lead[] = [];
  let dbError = false;
  let bookings = 0;
  if (sb) {
    const { data, error } = await sb.from("leads").select(LEAD_FIELDS).order("created_at", { ascending: false });
    if (error) dbError = true;
    else leads = (data ?? []) as unknown as Lead[];
    const b = await sb.from("booking_requests").select("id", { count: "exact", head: true });
    bookings = b.count ?? 0;
  }

  const price = planPrice();
  const stripeMissing = missingStripeEnv();
  const count = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
  const clients = count("client");
  const localOnly = (process.env.APP_URL ?? "").includes("localhost");

  return (
    <>
      <h1>Agencia · Leads y clientes</h1>
      <p className="sub">
        Cada negocio que añades recibe al instante una web de muestra. Si el dueño la activa, paga en Stripe y pasa a
        «Cliente» de forma automática.
      </p>

      {dbError && (
        <div className="banner err">
          No se pudo leer la tabla de leads. Aplica la migración <code>0004_agency.sql</code> en Supabase.
        </div>
      )}
      {stripeMissing.length > 0 && (
        <div className="notice">
          Cobro automático desactivado. Faltan en <code>.env.local</code>: {stripeMissing.join(", ")}.
        </div>
      )}
      {localOnly && (
        <div className="notice">
          La app corre en <code>localhost</code>: las webs de muestra solo se ven desde tu ordenador. Hay que
          desplegarla en internet antes de enviar enlaces a nadie.
        </div>
      )}

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card"><div className="label">Webs de muestra</div><div className="value">{count("demo_ready")}</div></div>
        <div className="card"><div className="label">Contactados</div><div className="value">{count("contacted")}</div></div>
        <div className="card"><div className="label">Interesados</div><div className="value">{count("interested")}</div></div>
        <div className="card"><div className="label">Clientes pagando</div><div className="value">{clients}</div></div>
        <div className="card">
          <div className="label">Ingreso mensual previsto</div>
          <div className="value">{price ? `${(clients * Number(price.replace(",", "."))).toFixed(0)} €` : "Sin precio"}</div>
          <span className="badge est">Estimado</span>
        </div>
        <div className="card"><div className="label">Reservas recibidas</div><div className="value">{bookings}</div></div>
      </div>

      <h2>Añadir negocio</h2>
      <form action={addLead} className="card leadform">
        <input name="business_name" placeholder="Nombre del negocio *" required minLength={2} maxLength={120} />
        <input name="city" placeholder="Ciudad o barrio *" required minLength={2} maxLength={80} />
        <select name="category" defaultValue="otro">
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <option key={k} value={k}>{c.label}</option>
          ))}
        </select>
        <input name="phone" placeholder="Teléfono público" maxLength={30} />
        <input name="email" type="email" placeholder="Correo público (opcional)" maxLength={120} />
        <input name="address" placeholder="Dirección" maxLength={160} />
        <input name="opening_hours" placeholder="Horario (ej. L–V 9:00–20:00)" maxLength={160} />
        <input name="notes" placeholder="Notas internas" maxLength={400} />
        <button className="go">Crear web de muestra</button>
      </form>

      <h2>Negocios ({leads.length})</h2>
      {leads.length === 0 && <div className="notice">Sin datos. Añade el primer negocio arriba.</div>}
      {leads.map((l) => {
        const msg = outreachMessage(l);
        const wa = whatsappLink(l.phone, msg);
        const locked = l.status === "client" || l.status === "paused";
        return (
          <section className="card" key={l.id} style={{ marginBottom: 12 }}>
            <strong>{l.business_name}</strong>{" "}
            <span className="muted">· {CATEGORIES[l.category as LeadCategory]?.label} · {l.city}</span>
            <div className={l.status === "client" ? "real" : l.status === "lost" || l.status === "paused" ? "bad" : "est"}>
              {STATUS_TEXT[l.status]}
            </div>
            <p style={{ margin: "8px 0" }}>
              <a href={siteUrl(l.slug)} target="_blank" rel="noreferrer">Ver su web</a>
              {wa && !locked && (
                <>
                  {" · "}
                  <a href={wa} target="_blank" rel="noreferrer">Abrir WhatsApp con el mensaje</a>
                </>
              )}
            </p>
            {!locked && (
              <>
                <textarea readOnly rows={6} defaultValue={msg} className="msg" aria-label="Mensaje de contacto" />
                <form action={setStatus} className="row">
                  <input type="hidden" name="id" value={l.id} />
                  {MANUAL.filter((s) => s !== l.status).map((s) => (
                    <button key={s} name="status" value={s} className="go small">
                      Marcar: {STATUS_TEXT[s]}
                    </button>
                  ))}
                </form>
              </>
            )}
          </section>
        );
      })}
    </>
  );
}
