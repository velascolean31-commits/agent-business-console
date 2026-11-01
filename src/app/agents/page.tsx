import { AGENTS } from "@/lib/agents";
import { EMPTY_TOTALS, eur } from "@/lib/data";

export default function Agents() {
  return (
    <>
      <h1>Fichas de agentes</h1>
      <p className="sub">Presupuesto, costes e ingresos aparecen cuando existan registros reales.</p>

      {AGENTS.map((a) => (
        <section className="card" id={a.key} key={a.key} style={{ marginBottom: 14 }}>
          <h2 style={{ marginTop: 0 }}>{a.name} — {a.role}</h2>
          <table>
            <tbody>
              <tr><th>Modelo de negocio</th><td>{a.businessModel}</td></tr>
              <tr><th>Plataformas</th><td>{a.platforms.join(", ") || "—"}</td></tr>
              <tr><th>Cuentas conectadas</th><td className="muted">Ninguna</td></tr>
              <tr><th>Herramientas</th><td>{a.tools.join(", ")}</td></tr>
              <tr><th>Permisos concedidos</th><td className="muted">Ninguno</td></tr>
              <tr><th>Presupuesto disponible</th><td className="muted">Sin configurar (gasto bloqueado)</td></tr>
              <tr><th>Costes acumulados</th><td>{eur(EMPTY_TOTALS.expenses)}</td></tr>
              <tr><th>Ingresos acumulados</th><td className="muted">Sin datos</td></tr>
              <tr><th>Beneficio neto</th><td className="muted">Sin datos</td></tr>
              <tr><th>Tareas pendientes</th><td className="muted">Ninguna</td></tr>
              <tr><th>Errores y bloqueos</th><td className="muted">Ninguno</td></tr>
              <tr><th>Estado de monetización</th><td className="muted">Desconocido</td></tr>
              <tr><th>Próxima acción</th><td>{a.nextAction}</td></tr>
            </tbody>
          </table>
          <p style={{ marginBottom: 0 }}><button disabled title="Disponible en fases posteriores">Detener agente</button></p>
        </section>
      ))}
    </>
  );
}
