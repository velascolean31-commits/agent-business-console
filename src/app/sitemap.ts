import type { MetadataRoute } from "next";
import { getAdmin } from "@/lib/supabase-admin";
import { GUIDES, SECTORS, TOOLS } from "@/lib/public-content";

export const dynamic = "force-dynamic";

// Solo páginas públicas e indexables. Las webs de muestra sin activar no se incluyen (llevan noindex).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL;
  if (!base) return [];

  const paths = [
    "/webs",
    ...SECTORS.map((s) => `/webs/${s.slug}`),
    "/herramientas",
    ...TOOLS.map((t) => `/herramientas/${t.slug}`),
    "/guias",
    ...GUIDES.map((g) => `/guias/${g.slug}`),
  ];

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data } = await getAdmin().from("leads").select("slug").eq("status", "client").limit(5000);
      for (const row of data ?? []) paths.push(`/s/${row.slug}`);
    } catch {
      // sin base de datos, el mapa del sitio lista solo las páginas fijas
    }
  }
  return paths.map((p) => ({ url: `${base}${p}` }));
}
