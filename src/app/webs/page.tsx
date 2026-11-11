import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { JsonLd, PriceAndFaq, PublicFooter, SectorLinks } from "@/components/WebsParts";
import { SITE_CSS } from "@/lib/site-css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Web con citas por WhatsApp para tu negocio, lista en un minuto",
  description:
    "Escribe el nombre de tu negocio y mira tu web hecha al momento: botón de WhatsApp, horario, mapa y petición de cita. Gratis para verla, sin permanencia.",
  alternates: { canonical: "/webs" },
};

export default async function Webs({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const base = process.env.APP_URL;

  return (
    <div className="site">
      <style>{SITE_CSS}</style>
      {base && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Webs para negocios locales", url: `${base}/webs` }} />
      )}

      <header className="hero">
        <p className="kicker">Para peluquerías, bares, clínicas, talleres y tiendas</p>
        <h1>Mira la web de tu negocio hecha en un minuto</h1>
        <p className="tag">
          Escribe el nombre de tu negocio y la ves al momento, con tu horario, tu mapa y un botón para que te pidan cita
          por WhatsApp. Si te gusta, la activas tú mismo.
        </p>
        <div className="actions">
          <a href="#crear" className="btn">Ver mi web gratis</a>
        </div>
        <p className="micro">Sin tarjeta y sin permanencia.</p>
      </header>

      <section>
        <h2>Qué tiene tu web</h2>
        <ul className="plain">
          <li>Un botón para que te pidan cita o reserva por WhatsApp, también cuando estás cerrado.</li>
          <li>Tu horario, tu dirección y el mapa, en la primera pantalla.</li>
          <li>Botón de llamada directa desde el móvil.</li>
          <li>Se lee bien en el móvil, que es donde te buscan.</li>
        </ul>
      </section>

      <SignupForm error={error} />
      <PriceAndFaq />
      <SectorLinks />
      <PublicFooter />
    </div>
  );
}
