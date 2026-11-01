import { getSupabase } from "@/lib/supabase-server";

async function signIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const allowed = process.env.ALLOWED_EMAIL;
  if (!email || (allowed && email.toLowerCase() !== allowed.toLowerCase())) return;
  const sb = await getSupabase();
  await sb?.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.APP_URL}/auth/callback`, shouldCreateUser: true },
  });
}

export default function Login() {
  return (
    <>
      <h1>Iniciar sesión</h1>
      <p className="sub">Te enviaremos un enlace de acceso al correo. No se usan contraseñas.</p>
      <form action={signIn} className="card" style={{ maxWidth: 420 }}>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required style={{ width: "100%", margin: "6px 0 12px", padding: 8 }} />
        <button style={{ cursor: "pointer", color: "var(--text)" }}>Enviar enlace</button>
      </form>
    </>
  );
}
