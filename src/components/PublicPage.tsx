import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_CSS } from "@/lib/site-css";

// Marco común de las páginas públicas propias (herramientas y guías)
export function PublicPage({ kicker, title, intro, children }: { kicker: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="site">
      <style>{SITE_CSS}</style>
      <header className="hero">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {intro && <p className="tag">{intro}</p>}
      </header>
      {children}
      <footer>
        <Link href="/herramientas">Herramientas</Link> · <Link href="/guias">Guías</Link> ·{" "}
        <Link href="/webs">Web para tu negocio</Link> · <Link href="/legal">Aviso legal</Link>
      </footer>
    </div>
  );
}
