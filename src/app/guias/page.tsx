import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "@/components/PublicPage";
import { GUIDES } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Guías para negocios locales",
  description: "Guías breves y prácticas para llevar tu negocio a internet.",
};

export default function Guides() {
  return (
    <PublicPage kicker="Guías" title="Guías para negocios locales" intro="Breves, prácticas y sin relleno.">
      {GUIDES.map((g) => (
        <section key={g.slug}>
          <h2><Link href={`/guias/${g.slug}`}>{g.title}</Link></h2>
          <p>{g.description}</p>
        </section>
      ))}
    </PublicPage>
  );
}
