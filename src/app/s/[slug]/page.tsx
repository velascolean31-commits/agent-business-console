import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdmin } from "@/lib/supabase-admin";
import { CATEGORIES, planPrice, trialDays, type LeadCategory } from "@/lib/leads";
import { SITE_CSS } from "@/lib/site-css";

export const dynamic = "force-dynamic";

const PUBLIC_FIELDS = "business_name,category,city,phone,address,opening_hours,slug,status";

async function load(slug: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await getAdmin().from("leads").select(PUBLIC_FIELDS).eq("slug", slug).maybeSingle();
  return data && data.status !== "lost" ? data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lead = await load((await params).slug);
  return lead
    ? { title: `${lead.business_name} · ${lead.city}`, robots: lead.status === "client" ? undefined : "noindex" }
    : { title: "No encontrado" };
}

const NOTICE: Record<string, string> = {
  "pago=ok": "¡Gracias! El pago se ha recibido y la web queda activada.",
  "pago=cancelado": "El pago se ha cancelado. No se ha cobrado nada.",
  "pago=error": "No se pudo iniciar el pago. Inténtalo de nuevo más tarde.",
  "pago=no-disponible": "El pago en línea todavía no está disponible.",
  "pago=ya-activo": "Esta web ya está activada.",
  "creada=1": "Tu web de muestra está lista. Revísala y actívala cuando quieras.",
  "reserva=ok": "Solicitud enviada. El negocio se pondrá en contacto contigo.",
  "reserva=demo": "Formulario de muestra: en la web activada, la solicitud llega al negocio.",
  "reserva=faltan-datos": "Indica tu nombre y un teléfono o correo de contacto.",
  "reserva=error": "No se pudo enviar la solicitud. Inténtalo de nuevo.",
};

export default async function Site({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pago?: string; reserva?: string; creada?: string }>;
}) {
  const { slug } = await params;
  const q = await searchParams;
  const lead = await load(slug);
  if (!lead) notFound();

  const cat = CATEGORIES[lead.category as LeadCategory] ?? CATEGORIES.otro;
  const isClient = lead.status === "client";
  const paused = lead.status === "paused";
  const price = planPrice();
  const notice = NOTICE[q.pago ? `pago=${q.pago}` : q.reserva ? `reserva=${q.reserva}` : q.creada ? "creada=1" : ""];
  const trial = trialDays();
  const digits = (lead.phone ?? "").replace(/\D/g, "");
  const wa = digits.length === 9 ? `34${digits}` : digits;
  const maps = lead.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.address}, ${lead.city}`)}`
    : null;

  if (paused) {
    return (
      <div className="site">
        <style>{SITE_CSS}</style>
        <header className="hero"><h1>{lead.business_name}</h1><p>Esta web está temporalmente desactivada.</p></header>
      </div>
    );
  }

  return (
    <div className="site">
      <style>{SITE_CSS}</style>

      {!isClient && (
        <div className="demo">
          <span>
            Web de muestra preparada para <b>{lead.business_name}</b>. Los textos son de ejemplo y se adaptan a vuestro
            negocio.
          </span>
          <a href={`/api/checkout/${lead.slug}`} className="btn light">
            {trial ? `Probar ${trial} días gratis` : "Activar"}{price ? ` · luego ${price} €/mes` : ""}
          </a>
        </div>
      )}
      {notice && <div className="flash" role="status">{notice}</div>}

      <header className="hero">
        <p className="kicker">{cat.label} · {lead.city}</p>
        <h1>{lead.business_name}</h1>
        <p className="tag">{cat.tagline}</p>
        <div className="actions">
          <a href="#reserva" className="btn">{cat.cta}</a>
          {digits && <a href={`tel:${digits}`} className="btn ghost">Llamar</a>}
          {wa.length >= 10 && (
            <a href={`https://wa.me/${wa}`} className="btn ghost" target="_blank" rel="noreferrer">WhatsApp</a>
          )}
        </div>
      </header>

      <section>
        <h2>Servicios{!isClient && <small> (ejemplo)</small>}</h2>
        <ul className="chips">{cat.examples.map((e) => <li key={e}>{e}</li>)}</ul>
      </section>

      <section className="two">
        <div>
          <h2>Horario</h2>
          <p>{lead.opening_hours ?? "Consultar por teléfono"}</p>
        </div>
        <div>
          <h2>Dónde estamos</h2>
          <p>{lead.address ? `${lead.address}, ${lead.city}` : lead.city}</p>
          {maps && <a href={maps} target="_blank" rel="noreferrer">Ver en el mapa</a>}
        </div>
      </section>

      <section id="reserva">
        <h2>{cat.cta}</h2>
        <form method="post" action={`/api/booking/${lead.slug}`} className="form">
          <input name="nombre" placeholder="Tu nombre" required minLength={2} maxLength={80} />
          <input name="contacto" placeholder="Teléfono o correo" required minLength={5} maxLength={120} />
          <input name="cuando" placeholder="Día y hora que prefieres" maxLength={80} />
          <textarea name="mensaje" placeholder="Mensaje (opcional)" rows={3} maxLength={600} />
          <input name="web" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          <button className="btn">Enviar solicitud</button>
          <p className="legal">
            Tus datos se usan solo para gestionar esta solicitud con {lead.business_name}.
          </p>
        </form>
      </section>

      <footer>{lead.business_name} · {lead.city}</footer>
    </div>
  );
}
