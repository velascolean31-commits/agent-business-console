import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, planPrice, trialDays } from "@/lib/leads";
import { legalIdentity } from "@/lib/owner";
import { SITE_CSS } from "@/lib/site-css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Web con citas para tu negocio, lista en un minuto",
  description: "Crea la web de tu negocio con botón de WhatsApp, horario, mapa y formulario de citas.",
};

const ERRORS: Record<string, string> = {
  datos: "Revisa el nombre del negocio, la ciudad y el sector.",
  correo: "Indica un correo válido para poder gestionar tu web.",
  condiciones: "Tienes que aceptar las condiciones y la política de privacidad.",
  existe: "Ya existe una web para ese negocio en esa ciudad.",
  limite: "Hemos alcanzado el máximo de altas por hoy. Vuelve a intentarlo mañana.",
  guardar: "No se pudo crear la web. Inténtalo de nuevo.",
  "no-disponible": "El alta en línea todavía no está disponible.",
};

export default async function Webs({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const price = planPrice();
  const trial = trialDays();
  const open = Boolean(legalIdentity());

  return (
    <div className="site">
      <style>{SITE_CSS}</style>
      <header className="hero">
        <p className="kicker">Para peluquerías, bares, clínicas, talleres y tiendas</p>
        <h1>La web de tu negocio, lista en un minuto</h1>
        <p className="tag">
          Escribe el nombre de tu negocio y verás tu web hecha al momento. Si te gusta, la activas tú mismo.
        </p>
        <div className="actions">
          <a href="#crear" className="btn">Crear mi web</a>
        </div>
      </header>

      <section>
        <h2>Qué incluye</h2>
        <ul className="chips">
          <li>Botón de llamada y WhatsApp</li>
          <li>Horario y mapa</li>
          <li>Formulario de citas o reservas</li>
          <li>Se ve bien en el móvil</li>
        </ul>
      </section>

      <section className="two">
        <div>
          <h2>Precio</h2>
          <p>
            {trial > 0 && <>Primeros {trial} días gratis. </>}
            {price ? <>Después, {price} € al mes. </> : null}
            Sin permanencia: cancelas cuando quieras y no se cobra más.
          </p>
        </div>
        <div>
          <h2>Cómo funciona</h2>
          <p>1. Rellenas el formulario. 2. Ves tu web de muestra. 3. La activas con tarjeta en una página de pago segura (Stripe).</p>
        </div>
      </section>

      <section id="crear">
        <h2>Crear mi web</h2>
        {error && <div className="flash warn" role="alert">{ERRORS[error] ?? "No se pudo completar el alta."}</div>}
        {!open ? (
          <p>El alta en línea estará disponible muy pronto.</p>
        ) : (
          <form method="post" action="/api/signup" className="form">
            <input name="business_name" placeholder="Nombre del negocio *" required minLength={2} maxLength={120} />
            <input name="city" placeholder="Ciudad o barrio *" required minLength={2} maxLength={80} />
            <select name="category" defaultValue="otro" aria-label="Sector">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>
            <input name="email" type="email" placeholder="Tu correo *" required maxLength={120} />
            <input name="phone" placeholder="Teléfono del negocio" maxLength={30} />
            <input name="address" placeholder="Dirección" maxLength={160} />
            <input name="opening_hours" placeholder="Horario (ej. L–V 9:00–20:00)" maxLength={160} />
            <input name="web" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
            <label className="legal">
              <input type="checkbox" name="acepto" required /> Acepto las{" "}
              <Link href="/legal">condiciones y la política de privacidad</Link>.
            </label>
            <button className="btn">Ver mi web</button>
          </form>
        )}
      </section>

      <footer>
        <Link href="/herramientas">Herramientas gratuitas</Link> · <Link href="/guias">Guías</Link> ·{" "}
        <Link href="/legal">Aviso legal y privacidad</Link>
      </footer>
    </div>
  );
}
