export default function PayoutSettings() {
  return (
    <>
      <h1>Cuenta de cobro</h1>
      <p className="sub">
        El destino del dinero se configura con los procedimientos oficiales de cada plataforma o proveedor de pago.
        Esta aplicación no redirige fondos por API ni guarda datos bancarios completos.
      </p>

      <div className="card">
        <strong>Estado:</strong> <span className="muted">Sin métodos de cobro configurados.</span>
      </div>

      <h2>Qué tendrás que hacer tú</h2>
      <div className="card">
        <ul>
          <li>Elegir el titular de la cuenta que cobrará (nombre y datos fiscales deben coincidir con la verificación).</li>
          <li>Completar el alta y verificación en el flujo oficial de cada plataforma o proveedor de pago.</li>
          <li>Comprobar el umbral mínimo de pago y los plazos que indique cada plataforma.</li>
          <li>
            Si por edad o por las condiciones del proveedor no puedes abrir la cuenta, la solicitud debe hacerla un
            adulto responsable. La aplicación no evita estos requisitos.
          </li>
        </ul>
      </div>

      <h2>Cambios que requieren aprobación</h2>
      <div className="notice">
        Cambiar de beneficiario o método de cobro, retirar fondos o hacer transferencias siempre generará una
        solicitud de aprobación y quedará en el historial de auditoría.
      </div>
    </>
  );
}
