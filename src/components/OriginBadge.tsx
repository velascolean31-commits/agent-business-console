import type { DataOrigin } from "@/lib/types";

const TEXT: Record<DataOrigin, string> = {
  real: "Real",
  estimated: "Estimado",
  demo: "Demostración",
};

export function OriginBadge({ origin }: { origin: DataOrigin }) {
  return <span className={`badge ${origin === "estimated" ? "est" : origin}`}>{TEXT[origin]}</span>;
}
