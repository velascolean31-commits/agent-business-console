import Link from "next/link";
import { CATEGORIES, trialDays, type LeadCategory } from "@/lib/leads";
import { legalIdentity } from "@/lib/owner";

const ERRORS: Record<string, string> = {
  datos: "Revisa el nombre del negocio y la ciudad.",
  correo: "Indica un correo válido para poder gestionar tu web.",
  condiciones: "Tienes que aceptar las condiciones y la política de privacidad.",
  existe: "Ya existe una web para ese negocio en esa ciudad.",
  limite: "Hemos alcanzado el máximo de altas por hoy. Vuelve a intentarlo mañana.",
  guardar: "No se pudo crear la web. Inténtalo de nuevo.",
  "no-disponible": "El alta en línea todavía no está disponible.",
};

// Alta mínima: tres datos y el correo. Lo demás es opcional y se puede añadir después.
export function SignupForm({ error, category, origin }: { error?: string; category?: LeadCategory; origin?: string }) {
  const open = Boolean(legalIdentity());
  const trial = trialDays();

  return (
    <section id="crear">
      <h2>Mira cómo quedaría tu web</h2>
      {error && <div className="flash warn" role="alert">{ERRORS[error] ?? "No se pudo completar el alta."}</div>}
      {!open ? (
        <p>El alta en línea estará disponible muy pronto.</p>
      ) : (
        <form method="post" action="/api/signup" className="form">
          <input name="business_name" placeholder="Nombre del negocio" required minLength={2} maxLength={120} autoComplete="organization" />
          <input name="city" placeholder="Ciudad o barrio" required minLength={2} maxLength={80} />
          {category ? (
            <input type="hidden" name="category" value={category} />
          ) : (
            <select name="category" defaultValue="otro" aria-label="Tipo de negocio">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>
          )}
          <input name="email" type="email" placeholder="Tu correo" required maxLength={120} autoComplete="email" />
          <details>
            <summary>Añadir móvil, dirección y horario (opcional)</summary>
            <div className="form">
              <input name="phone" inputMode="tel" placeholder="Móvil del negocio (recibe las citas por WhatsApp)" maxLength={30} />
              <input name="address" placeholder="Dirección" maxLength={160} />
              <input name="opening_hours" placeholder="Horario (ej. L–V 9:00–20:00)" maxLength={160} />
            </div>
          </details>
          {origin && <input type="hidden" name="origen" value={origin} />}
          <input name="web" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          <label className="legal">
            <input type="checkbox" name="acepto" required /> Acepto las{" "}
            <Link href="/legal">condiciones y la política de privacidad</Link>.
          </label>
          <button className="btn">Ver mi web gratis</button>
          <p className="micro">
            Menos de un minuto. Sin tarjeta para verla{trial > 0 ? `; si la activas, los primeros ${trial} días son gratis` : ""}.
          </p>
        </form>
      )}
    </section>
  );
}
