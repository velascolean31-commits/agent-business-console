export type ConnectionStatus =
  | "connected"
  | "pending_authorization"
  | "expired"
  | "error"
  | "disconnected";

export type DataOrigin = "real" | "estimated" | "demo";

export type AgentKey = "alpha" | "bravo" | "charlie" | "delta" | "echo" | "sargento";

export const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: "Conectada",
  pending_authorization: "Pendiente de autorización",
  expired: "Caducada",
  error: "Error",
  disconnected: "No conectado",
};

export interface Connection {
  id: string;
  platform: string;
  display_name: string;
  status: ConnectionStatus;
  status_detail: string | null;
  scopes_granted: string[];
  last_sync_at: string | null;
  expires_at: string | null;
}

export interface AgentProfile {
  key: AgentKey;
  name: string;
  role: string;
  businessModel: string;
  platforms: string[];
  tools: string[];
  nextAction: string;
}

export interface Totals {
  revenueConfirmed: number;
  revenueEstimated: number;
  pendingSettlement: number;
  paidOut: number;
  expenses: number;
  fees: number;
  refunds: number;
  net: number;
  hasData: boolean;
}
