import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "Consola de negocios de agentes" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav>
          <strong>Consola de agentes</strong>
          <Link href="/">Panel</Link>
          <Link href="/connections">Connections &amp; Accounts</Link>
          <Link href="/finance">Finance &amp; Payouts</Link>
          <Link href="/agents">Agentes</Link>
          <Link href="/settings/payout">Cuenta de cobro</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
