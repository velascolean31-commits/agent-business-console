"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// La barra de la consola no se muestra en las webs públicas de los negocios (/s/...)
export function Nav() {
  const path = usePathname();
  if (["/s/", "/webs", "/legal", "/herramientas", "/guias"].some((x) => path.startsWith(x))) return null;
  return (
    <nav>
      <strong>Consola de agentes</strong>
      <Link href="/">Panel</Link>
      <Link href="/leads">Leads y clientes</Link>
      <Link href="/finance">Finance &amp; Payouts</Link>
      <Link href="/agents">Agentes</Link>
      <Link href="/connections">Connections &amp; Accounts</Link>
      <Link href="/settings/payout">Cuenta de cobro</Link>
    </nav>
  );
}
