export type LeadStatus = "demo_ready" | "contacted" | "interested" | "client" | "paused" | "lost";
export type LeadCategory = "peluqueria" | "restaurante" | "clinica" | "taller" | "tienda" | "otro";

export interface Lead {
  id: string;
  business_name: string;
  category: LeadCategory;
  city: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  opening_hours: string | null;
  current_website: string | null;
  notes: string | null;
  slug: string;
  status: LeadStatus;
  contacted_at: string | null;
  became_client_at: string | null;
  created_at: string;
}

export const LEAD_FIELDS =
  "id,business_name,category,city,phone,email,address,opening_hours,current_website,notes,slug,status,contacted_at,became_client_at,created_at";

export const STATUS_TEXT: Record<LeadStatus, string> = {
  demo_ready: "Web de muestra lista",
  contacted: "Contactado",
  interested: "Interesado",
  client: "Cliente (pagando)",
  paused: "Pausado (suscripción cancelada)",
  lost: "Descartado",
};

export const CATEGORIES: Record<LeadCategory, { label: string; tagline: string; cta: string; examples: string[] }> = {
  peluqueria: {
    label: "Peluquería y estética",
    tagline: "Pide tu cita en un minuto",
    cta: "Pedir cita",
    examples: ["Corte", "Color", "Peinado", "Tratamientos"],
  },
  restaurante: {
    label: "Restaurante y bar",
    tagline: "Reserva tu mesa sin llamar",
    cta: "Reservar mesa",
    examples: ["Menú del día", "Carta", "Grupos", "Para llevar"],
  },
  clinica: {
    label: "Clínica y salud",
    tagline: "Solicita tu cita cuando te venga bien",
    cta: "Solicitar cita",
    examples: ["Primera consulta", "Revisión", "Urgencias", "Tratamientos"],
  },
  taller: {
    label: "Taller",
    tagline: "Pide cita para tu vehículo",
    cta: "Pedir cita",
    examples: ["Revisión", "Neumáticos", "Frenos", "Pre-ITV"],
  },
  tienda: {
    label: "Tienda",
    tagline: "Consúltanos lo que necesites",
    cta: "Hacer una consulta",
    examples: ["Novedades", "Encargos", "Regalos", "Recogida en tienda"],
  },
  otro: {
    label: "Negocio local",
    tagline: "Contacta con nosotros fácilmente",
    cta: "Contactar",
    examples: ["Servicios", "Presupuestos", "Atención personalizada"],
  },
};

export function slugify(name: string, city: string): string {
  const base = `${name}-${city}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export function planPrice(): string | null {
  const p = process.env.PLAN_PRICE_EUR;
  return p && /^\d+([.,]\d{1,2})?$/.test(p) ? p : null;
}

export function siteUrl(slug: string): string {
  return `${process.env.APP_URL ?? ""}/s/${slug}`;
}

// Mensaje de primer contacto. Sin promesas ni datos inventados: describe lo que hay y cómo activarlo.
export function outreachMessage(lead: Pick<Lead, "business_name" | "slug">): string {
  const sender = process.env.SENDER_NAME || "[tu nombre]";
  const price = planPrice();
  return [
    `Hola, soy ${sender}. Hago webs para negocios de la zona y he preparado una de muestra para ${lead.business_name}:`,
    siteUrl(lead.slug),
    "",
    "Tiene botón de llamada y WhatsApp, horario, ubicación y un formulario para que os pidan cita o reserva.",
    price
      ? `Si os gusta, se activa desde la propia página por ${price} €/mes, sin permanencia. Si no os interesa, decídmelo y la borro.`
      : "Si os gusta, os cuento cómo activarla. Si no os interesa, decídmelo y la borro.",
  ].join("\n");
}

export function whatsappLink(phone: string | null, text: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 9) digits = `34${digits}`;
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
