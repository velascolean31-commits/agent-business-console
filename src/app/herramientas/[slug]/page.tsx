import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/PublicPage";
import { MarginCalculator, VatCalculator, WhatsAppLink } from "@/components/tools/Tools";
import { TOOLS } from "@/lib/public-content";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  return tool ? { title: tool.title, description: tool.description } : { title: "No encontrado" };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <PublicPage kicker="Herramienta gratuita" title={tool.title} intro={tool.description}>
      <section>
        {tool.slug === "calculadora-iva" && <VatCalculator />}
        {tool.slug === "calculadora-margen" && <MarginCalculator />}
        {tool.slug === "enlace-whatsapp" && <WhatsAppLink />}
      </section>
      <section>
        <h2>Cómo funciona</h2>
        {tool.notes.map((n) => <p key={n}>{n}</p>)}
      </section>
      <section>
        <h2>¿Tu negocio aún no tiene web?</h2>
        <p>
          <Link href="/webs">Crea una de muestra en un minuto</Link>, con botón de WhatsApp, horario y formulario de citas.
        </p>
      </section>
    </PublicPage>
  );
}
