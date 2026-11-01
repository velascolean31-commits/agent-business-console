import Link from "next/link";
import { loadConnections, loadTotals } from "@/lib/data";
import { AGENTS } from "@/lib/agents";
import { Stat } from "@/components/Stat";
import { supabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [t, { connections, dbReady }] = await Promise.all([loadTotals(), loadConnections()]);
  const attention = connections.filter((c) => c.status !== "connected");

  return (
    <>
      <h1>Panel del negocio</h1>
      <p className="sub">
        Solo se muestran cifras registradas en la base de datos. Sin integraciones, todo aparece como «Sin datos».
      </p>

      {!supabaseConfigured() && (
        <div className="notice">
          Supabase no está configurado. Copia <code>.env.example</code> a <code>.env.local</code> y aplica la
          migración <code>supabase/migrations/0001_business_module.sql</code>.
        </div>
      )}
      {supabaseConfigured() && !dbReady && (
        <div className="notice">No se pudo leer la base de datos (¿migración aplicada y sesión iniciada?).</div>
      )}

      <h2>Finanzas</h2>
      <div className="grid">
        <Stat label="Ingresos confirmados" value={t.revenueConfirmed} origin="real" hasData={t.hasData} />
        <Stat label="Pagos recibidos" value={t.paidOut} origin="real" hasData={t.hasData} />
        <Stat label="Gastos totales" value={t.expenses} origin="real" hasData={t.hasData} />
        <Stat label="Beneficio neto" value={t.net} origin="real" hasData={t.hasData} />
        <Stat label="Pendiente de cobro" value={t.pendingSettlement} origin="real" hasData={t.hasData} />
        <Stat label="Ingresos estimados" value={t.revenueEstimated} origin="estimated" hasData={t.hasData} />
      </div>

      <h2>Conexiones que requieren atención ({attention.length})</h2>
      <table>
        <tbody>
          {attention.map((c) => (
            <tr key={c.id}>
              <td>{c.display_name}</td>
              <td className="bad">No conectado</td>
              <td><Link href="/connections">Ver qué falta</Link></td>
            </tr>
          ))}
          {attention.length === 0 && (
            <tr><td className="muted">Todas las conexiones están activas.</td></tr>
          )}
        </tbody>
      </table>

      <h2>Rendimiento por agente</h2>
      <table>
        <thead><tr><th>Agente</th><th>Modelo de negocio</th><th>Ingresos</th><th>Estado</th></tr></thead>
        <tbody>
          {AGENTS.map((a) => (
            <tr key={a.key}>
              <td><Link href={`/agents#${a.key}`}>{a.name}</Link> — {a.role}</td>
              <td>{a.businessModel}</td>
              <td className="muted">Sin datos</td>
              <td className="muted">Sin integraciones activas</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Tareas bloqueadas por permisos o verificaciones</h2>
      <div className="notice">Sin datos. Aparecerán aquí cuando un agente cree una solicitud de aprobación.</div>

      <h2>Negocios que ganan o pierden dinero</h2>
      <div className="notice">Sin datos suficientes para evaluarlo.</div>
    </>
  );
}
