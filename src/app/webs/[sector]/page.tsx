import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { PriceAndFaq, PublicFooter, SectorLinks } from "@/components/WebsParts";
import { SECTORS } from "@/lib/public-content";
import { SITE_CSS } from "@/lib/site-css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> {
  const { sector } = await params;
  const s = SECTORS.find((x) => x.slug === sector);
  return s
    ? { title: s.title, description: s.intro, alternates: { canonical: `/webs/${s.slug}` } }
    : { title: "No encontrado" };
}

export default async function SectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ sector: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { sector } = await params;
  const { error } = await searchParams;
  const s = SECTORS.find((x) => x.slug === sector);
  if (!s) notFound();

  return (
    <div className="site">
      <style>{SITE_CSS}</style>
      <header className="hero">
        <p className="kicker">{s.name}</p>
        <h1>{s.title}</h1>
        <p className="tag">{s.intro}</p>
        <div className="actions">
          <a href="#crear" className="btn">Ver mi web gratis</a>
        </div>
        <p className="micro">Sin tarjeta y sin permanencia.</p>
      </header>

      <section>
        <h2>Lo que suele pasar</h2>
        <ul className="plain">{s.problems.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>

      <section>
        <h2>Qué tiene tu web</h2>
        <ul className="plain">{s.includes.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>

      <SignupForm error={error} category={s.category} origin={s.slug} />
      <PriceAndFaq />
      <SectorLinks except={s.slug} />
      <PublicFooter />
    </div>
  );
}
