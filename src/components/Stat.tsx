import type { DataOrigin } from "@/lib/types";
import { OriginBadge } from "./OriginBadge";
import { eur } from "@/lib/data";

export function Stat({
  label,
  value,
  origin,
  hasData,
}: {
  label: string;
  value: number;
  origin: DataOrigin;
  hasData: boolean;
}) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{hasData ? eur(value) : "Sin datos"}</div>
      <OriginBadge origin={origin} />
    </div>
  );
}
