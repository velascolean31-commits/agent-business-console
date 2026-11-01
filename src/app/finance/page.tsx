import { loadTotals } from "@/lib/data";
import { INTEGRATIONS } from "@/lib/integrations/registry";
import { Stat } from "@/components/Stat";

export const dynamic = "force-dynamic";

export default async function Finance() {
  const t = await loadTotals();
  const d = t.hasData;

  return (
    <>
      <h1>Finance &amp; Payouts</h1>
      <p className="sub">
        Un pago solo se cuenta como recibido con confirmación del proveedor. Los impuestos son estimaciones, no
        asesoramiento fiscal.
      </p>

      <div className="grid">
        <Stat label="Ingresos estimados" value={t.revenueEstimated} origin="estimated" hasData={d} />
        <Stat label="Ingresos confirmados" value={t.revenueConfirmed} origin="real" hasData={d} />
        <Stat label="Pendiente de liquidación" value={t.pendingSettlement} origin="real" hasData={d} />
        <Stat label="Pagado efectivamente" value={t.paidOut} origin="real" hasData={d} />
        <Stat label="Gastos" value={t.expenses} origin="real" hasData={d} />
        <Stat label="Comisiones" value={t.fees} origin="real" hasData={d} />
        <Stat label="Reembolsos y contracargos" value={t.refunds} origin="real" hasData={d} />
        <Stat label="Beneficio neto" value={t.net} origin="real" hasData={d} />
      </div>

      <h2>Por plataforma</h2>
      <table>
        <thead>
          <tr><th>Plataforma</th><th>Perfil monetizado</th><th>Elegibilidad</th><th>Método de cobro</th><th>Umbral mínimo</th><th>Último pago</th><th>Próximo pago</th></tr>
        </thead>
        <tbody>
          {INTEGRATIONS.filter((i) => i.agents.some((a) => a !== "sargento")).map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td className="muted">No conectado</td>
              <td className="muted">Desconocida</td>
              <td className="muted">Sin configurar</td>
              <td className="muted">—</td>
              <td className="muted">Sin pagos</td>
              <td className="muted">Sin estimación fiable</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Historial de liquidaciones</h2>
      <div className="notice">Sin liquidaciones registradas.</div>

      <h2>Discrepancias entre estimado y pagado</h2>
      <div className="notice">Sin datos que comparar.</div>

      <h2>Impuestos (estimación)</h2>
      <div className="notice">
        Se calculará una estimación cuando existan ingresos reales. No sustituye a un asesor fiscal.
      </div>
    </>
  );
}
