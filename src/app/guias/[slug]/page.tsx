import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/PublicPage";
import { GUIDES } from "@/lib/public-content";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  return guide ? { title: guide.title, description: guide.description } : { title: "No encontrado" };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <PublicPage kicker="Guía" title={guide.title} intro={guide.description}>
      {guide.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}
      <section>
        <h2>Siguiente paso</h2>
        <ul className="chips">
          {guide.links.map((l) => (
            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </PublicPage>
  );
}
