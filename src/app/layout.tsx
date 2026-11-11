import "./globals.css";
import { Nav } from "@/components/Nav";
import type { ReactNode } from "react";

export const metadata = {
  title: "Consola de negocios de agentes",
  ...(process.env.APP_URL ? { metadataBase: new URL(process.env.APP_URL) } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
