import type { Metadata } from "next";
import Link from "next/link";
import { legalIdentity } from "@/lib/owner";
import { planPrice, trialDays } from "@/lib/leads";
import { SITE_CSS } from "@/lib/site-css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Aviso legal, condiciones y privacidad" };

// BORRADOR: plantilla orientativa. Debe revisarla un profesional antes de admitir clientes.
export default function Legal() {
  const id = legalIdentity();
  const price = planPrice();
  const trial = trialDays();

  return (
    <div className="site">
      <style>{SITE_CSS}</style>
      <header className="hero">
        <p className="kicker">Información legal</p>
        <h1>Aviso legal, condiciones y privacidad</h1>
      </header>

      {!id ? (
        <section>
          <p>Esta página se completará con los datos del titular del servicio antes de abrir las altas.</p>
        </section>
      ) : (
        <>
          <section>
            <h2>Titular</h2>
            <p>{id.name} · NIF {id.nif} · {id.address} · {id.email}</p>
          </section>
          <section>
            <h2>Servicio y precio</h2>
            <p>
              Creación y alojamiento de una página web para negocios, con formulario de citas.
              {trial > 0 && <> Incluye {trial} días de prueba gratuita.</>}
              {price && <> Después, {price} € al mes, impuestos según corresponda.</>} El cobro lo gestiona Stripe.
              No hay permanencia: la suscripción se puede cancelar en cualquier momento escribiendo a {id.email}, y la
              web se desactiva al terminar el periodo pagado.
            </p>
          </section>
          <section>
            <h2>Datos personales</h2>
            <p>
              Responsable: {id.name}. Se tratan los datos de contacto del negocio para crear y gestionar su web y la
              suscripción, y las solicitudes de cita que reciben los negocios clientes, para hacérselas llegar. No se
              usan para otros fines ni se venden. Proveedores: Supabase (base de datos), Stripe (pagos) y el alojamiento
              web. Puedes pedir acceso, rectificación o borrado en {id.email}, y reclamar ante la Agencia Española de
              Protección de Datos.
            </p>
          </section>
          <section>
            <h2>Webs de muestra</h2>
            <p>
              Las webs de muestra sin activar pueden eliminarse. Si aparece una web de muestra de tu negocio y no la
              quieres, escribe a {id.email} y se borra.
            </p>
          </section>
        </>
      )}
      <footer><Link href="/webs">Volver</Link></footer>
    </div>
  );
}
