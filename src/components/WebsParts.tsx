import Link from "next/link";
import { planPrice, trialDays } from "@/lib/leads";
import { SECTORS } from "@/lib/public-content";

// Precio y dudas frecuentes, compartidos por /webs y las páginas por sector.
// Solo se afirma lo que el producto hace hoy.
export function PriceAndFaq() {
  const price = planPrice();
  const trial = trialDays();
  return (
    <>
      <section>
        <h2>Precio</h2>
        <p>
          Ver tu web de muestra es gratis y no pide tarjeta.{" "}
          {trial > 0 && <>Si la activas, los primeros {trial} días no pagas nada. </>}
          {price && <>Después son {price} € al mes. </>}
          Sin permanencia: te das de baja cuando quieras.
        </p>
      </section>

      <section className="faq">
        <h2>Dudas frecuentes</h2>
        <h3>¿Tengo que pagar para verla?</h3>
        <p>No. Rellenas el formulario y ves tu web al momento. Solo se paga si decides activarla.</p>
        <h3>¿Cómo me llegan las citas?</h3>
        <p>
          Por WhatsApp, al móvil del negocio. El cliente rellena su nombre y el día que prefiere, y se abre un mensaje ya
          escrito para ti. Si no pones un móvil, la web muestra el botón de llamada.
        </p>
        <h3>¿Puedo usar mi propio dominio?</h3>
        <p>Todavía no. De momento la web se publica en una dirección nuestra que puedes compartir y poner en tus redes.</p>
        <h3>¿Qué pasa si me doy de baja?</h3>
        <p>La web se desactiva al terminar el periodo que tengas pagado y no se vuelve a cobrar.</p>
        <h3>¿Y si quiero cambiar algo de la web?</h3>
        <p>Escríbenos al correo del aviso legal y lo cambiamos.</p>
      </section>
    </>
  );
}

export function PublicFooter() {
  return (
    <footer>
      <Link href="/webs">Web para tu negocio</Link> · <Link href="/herramientas">Herramientas gratuitas</Link> ·{" "}
      <Link href="/guias">Guías</Link> · <Link href="/legal">Aviso legal y privacidad</Link>
    </footer>
  );
}

export function SectorLinks({ except }: { except?: string }) {
  return (
    <section>
      <h2>Por tipo de negocio</h2>
      <ul className="chips sectors">
        {SECTORS.filter((s) => s.slug !== except).map((s) => (
          <li key={s.slug}><Link href={`/webs/${s.slug}`}>{s.name}</Link></li>
        ))}
      </ul>
    </section>
  );
}

// Datos estructurados. Se escapa «<» porque algunos valores vienen de formularios públicos.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
