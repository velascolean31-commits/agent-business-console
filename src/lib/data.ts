import { getSupabase } from "./supabase-server";
import { INTEGRATIONS } from "./integrations/registry";
import type { Connection, Totals } from "./types";

export const EMPTY_TOTALS: Totals = {
  revenueConfirmed: 0,
  revenueEstimated: 0,
  pendingSettlement: 0,
  paidOut: 0,
  expenses: 0,
  fees: 0,
  refunds: 0,
  net: 0,
  hasData: false,
};

// Devuelve las conexiones guardadas; las plataformas del registro sin fila se muestran
// como «No conectado». Nunca se inventan estados.
export async function loadConnections(): Promise<{ connections: Connection[]; dbReady: boolean }> {
  const sb = await getSupabase();
  let rows: Connection[] = [];
  let dbReady = false;
  if (sb) {
    const { data, error } = await sb.from("platform_connections").select("*");
    if (!error && data) {
      rows = data as Connection[];
      dbReady = true;
    }
  }
  const byPlatform = new Map(rows.map((r) => [r.platform, r]));
  const connections = INTEGRATIONS.map(
    (def): Connection =>
      byPlatform.get(def.id) ?? {
        id: def.id,
        platform: def.id,
        display_name: def.name,
        status: "disconnected",
        status_detail: null,
        scopes_granted: [],
        last_sync_at: null,
        expires_at: null,
      }
  );
  return { connections, dbReady };
}

// Totales calculados SOLO desde registros reales y evitando mezclar datos demo.
export async function loadTotals(): Promise<Totals> {
  const sb = await getSupabase();
  if (!sb) return EMPTY_TOTALS;

  const [rev, exp, pay] = await Promise.all([
    sb.from("revenue_records").select("amount,fee,status,origin").neq("origin", "demo"),
    sb.from("expense_records").select("amount"),
    sb.from("payout_transactions").select("amount,status,provider_confirmed_at"),
  ]);
  if (rev.error || exp.error || pay.error) return EMPTY_TOTALS;

  const t = { ...EMPTY_TOTALS };
  for (const r of rev.data ?? []) {
    const amt = Number(r.amount);
    t.fees += Number(r.fee);
    if (r.status === "estimated") t.revenueEstimated += amt;
    else if (r.status === "confirmed") t.revenueConfirmed += amt;
    else if (r.status === "pending_settlement") {
      t.revenueConfirmed += amt;
      t.pendingSettlement += amt;
    } else if (r.status === "paid") t.revenueConfirmed += amt;
    else if (r.status === "refunded" || r.status === "chargeback") t.refunds += Math.abs(amt);
  }
  for (const e of exp.data ?? []) t.expenses += Number(e.amount);
  for (const p of pay.data ?? [])
    if (p.status === "paid" && p.provider_confirmed_at) t.paidOut += Number(p.amount);

  t.net = t.revenueConfirmed - t.fees - t.refunds - t.expenses;
  t.hasData = (rev.data?.length ?? 0) + (exp.data?.length ?? 0) + (pay.data?.length ?? 0) > 0;
  return t;
}

export const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
