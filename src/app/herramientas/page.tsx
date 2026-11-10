import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "@/components/PublicPage";
import { TOOLS } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Herramientas gratuitas para negocios",
  description: "Calculadora de IVA, calculadora de margen y generador de enlace de WhatsApp. Gratis y sin registro.",
};

export default function Tools() {
  return (
    <PublicPage kicker="Gratis y sin registro" title="Herramientas para tu negocio" intro="Pequeñas utilidades para el día a día.">
      {TOOLS.map((t) => (
        <section key={t.slug}>
          <h2><Link href={`/herramientas/${t.slug}`}>{t.title}</Link></h2>
          <p>{t.description}</p>
        </section>
      ))}
    </PublicPage>
  );
}
