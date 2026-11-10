import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdmin } from "@/lib/supabase-admin";
import { CATEGORIES, planPrice, type LeadCategory } from "@/lib/leads";

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
  searchParams: Promise<{ pago?: string; reserva?: string }>;
}) {
  const { slug } = await params;
  const q = await searchParams;
  const lead = await load(slug);
  if (!lead) notFound();

  const cat = CATEGORIES[lead.category as LeadCategory] ?? CATEGORIES.otro;
  const isClient = lead.status === "client";
  const paused = lead.status === "paused";
  const price = planPrice();
  const notice = NOTICE[q.pago ? `pago=${q.pago}` : q.reserva ? `reserva=${q.reserva}` : ""];
  const digits = (lead.phone ?? "").replace(/\D/g, "");
  const wa = digits.length === 9 ? `34${digits}` : digits;
  const maps = lead.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.address}, ${lead.city}`)}`
    : null;

  if (paused) {
    return (
      <div className="site">
        <style>{CSS}</style>
        <header className="hero"><h1>{lead.business_name}</h1><p>Esta web está temporalmente desactivada.</p></header>
      </div>
    );
  }

  return (
    <div className="site">
      <style>{CSS}</style>

      {!isClient && (
        <div className="demo">
          <span>
            Web de muestra preparada para <b>{lead.business_name}</b>. Los textos son de ejemplo y se adaptan a vuestro
            negocio.
          </span>
          <a href={`/api/checkout/${lead.slug}`} className="btn light">
            Activar{price ? ` por ${price} €/mes` : ""}
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

const CSS = `
main:has(.site){max-width:none;padding:0}
.site{--ink:#1b1f27;--soft:#5a6272;--line:#e4e7ec;--brand:#b4532a;--paper:#fffdf9;background:var(--paper);color:var(--ink);min-height:100vh;font:16px/1.6 Georgia,'Times New Roman',serif}
.site section,.site .hero,.site footer{max-width:760px;margin:0 auto;padding:28px 20px}
.site h1{font-size:clamp(32px,7vw,54px);line-height:1.1;margin:6px 0 10px}
.site h2{font-size:20px;margin:0 0 10px;color:var(--ink)}
.site h2 small{font-weight:400;color:var(--soft);font-size:14px}
.site .hero{padding-top:56px;padding-bottom:36px;border-bottom:1px solid var(--line)}
.site .kicker{font:600 13px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--brand);margin:0}
.site .tag{font-size:20px;color:var(--soft);margin:0 0 22px}
.site .actions{display:flex;gap:10px;flex-wrap:wrap}
.site .btn{font:600 15px system-ui,sans-serif;background:var(--brand);color:#fff;border:1px solid var(--brand);padding:11px 20px;border-radius:999px;text-decoration:none;cursor:pointer}
.site .btn.ghost{background:transparent;color:var(--brand)}
.site .btn.light{background:#fff;color:var(--ink);border-color:#fff;white-space:nowrap}
.site .chips{list-style:none;padding:0;margin:0;display:flex;gap:8px;flex-wrap:wrap}
.site .chips li{border:1px solid var(--line);border-radius:999px;padding:6px 14px;background:#fff;font:15px system-ui,sans-serif}
.site .two{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.site .two p{margin:0 0 6px}
.site a{color:var(--brand)}
.site .form{display:grid;gap:10px;max-width:460px}
.site .form input,.site .form textarea{font:16px system-ui,sans-serif;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.site .form .btn{justify-self:start}
.site .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.site .legal{font:13px system-ui,sans-serif;color:var(--soft);margin:0}
.site .demo{background:var(--ink);color:#fff;font:14px system-ui,sans-serif;padding:10px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center}
.site .flash{background:#eef7ee;color:#1d5b2c;font:600 15px system-ui,sans-serif;padding:12px 20px;text-align:center}
.site footer{color:var(--soft);font:14px system-ui,sans-serif;border-top:1px solid var(--line)}
`;
