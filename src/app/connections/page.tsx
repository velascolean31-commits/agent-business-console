import { loadConnections } from "@/lib/data";
import { INTEGRATIONS, explainNotConnected, missingEnv } from "@/lib/integrations/registry";
import { STATUS_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Connections({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { connections } = await loadConnections();

  return (
    <>
      <h1>Connections &amp; Accounts</h1>
      {ok && <div className="notice real">Hecho: {ok === "youtube" ? "YouTube conectado" : ok === "revoked" ? "acceso revocado" : "sincronizado"}.</div>}
      {error && <div className="notice bad">Error: {error}</div>}
      <p className="sub">
        Las conexiones se hacen solo mediante OAuth u otros mecanismos oficiales. Si una plataforma exige
        verificación de identidad, aceptación de condiciones o confirmación por correo, lo harás tú.
      </p>

      <table>
        <thead>
          <tr><th>Plataforma</th><th>Agente</th><th>Estado</th><th>Permisos</th><th>Última sincronización</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {connections.map((c) => {
            const def = INTEGRATIONS.find((d) => d.id === c.platform)!;
            const connected = c.status === "connected";
            return (
              <tr key={c.id}>
                <td>
                  <strong>{c.display_name}</strong>
                  <div className="muted">{def.notes}</div>
                </td>
                <td>{def.agents.join(", ")}</td>
                <td className={connected ? "real" : "bad"}>
                  {STATUS_LABEL[c.status]}
                  {!connected && <div className="muted">{c.status_detail ?? explainNotConnected(def)}</div>}
                </td>
                <td>{c.scopes_granted.length ? c.scopes_granted.join(", ") : <span className="muted">Ninguno</span>}</td>
                <td>{c.last_sync_at ? new Date(c.last_sync_at).toLocaleString("es-ES") : <span className="muted">Nunca</span>}</td>
                <td>
                  {def.id === "youtube" && missingEnv(def).length === 0 ? (
                    connected ? (
                      <>
                        <form method="post" action="/api/sync/youtube" style={{ marginBottom: 6 }}>
                          <button style={{ cursor: "pointer", color: "var(--text)" }}>Sincronizar</button>
                        </form>
                        <form method="post" action="/api/connect/youtube/revoke">
                          <button style={{ cursor: "pointer", color: "var(--bad)" }}>Revocar acceso</button>
                        </form>
                      </>
                    ) : (
                      <a href="/api/connect/youtube/start">
                        {c.status === "disconnected" ? "Conectar" : "Reconectar"}
                      </a>
                    )
                  ) : (
                    <button disabled title="Integración no disponible o sin configurar">Conectar</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Pasos que siempre requieren intervención humana</h2>
      {INTEGRATIONS.map((d) => (
        <div className="card" key={d.id} style={{ marginBottom: 10 }}>
          <strong>{d.name}</strong>
          <ul>{d.humanSteps.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      ))}

      <h2>Reglas aplicadas</h2>
      <div className="notice">
        Conexión caducada o con error ⇒ se detienen las tareas que dependen de ella. Una cuenta solo se comparte
        entre agentes si sus condiciones de uso lo permiten. Toda revocación queda en el historial de auditoría.
      </div>
    </>
  );
}
