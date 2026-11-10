import "server-only";
import { getAdmin } from "@/lib/supabase-admin";

// La app tiene un único propietario (ALLOWED_EMAIL). Las altas públicas se guardan a su nombre.
let cached: string | null = null;

export async function ownerId(): Promise<string | null> {
  if (cached) return cached;
  const email = process.env.ALLOWED_EMAIL?.toLowerCase();
  if (!email || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await getAdmin().auth.admin.listUsers({ page: 1, perPage: 200 });
  cached = data?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
  return cached;
}

// Datos del responsable legal. Sin ellos no se admiten altas públicas (no se recogen datos sin responsable identificado).
export interface LegalIdentity {
  name: string;
  nif: string;
  address: string;
  email: string;
}

export function legalIdentity(): LegalIdentity | null {
  const { LEGAL_NAME: name, LEGAL_NIF: nif, LEGAL_ADDRESS: address, LEGAL_EMAIL: email } = process.env;
  return name && nif && address && email ? { name, nif, address, email } : null;
}
