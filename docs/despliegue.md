# Publicar la app en Vercel

1. Entra en https://vercel.com/new con «Continue with GitHub» y da acceso al repositorio `agent-business-console`.
2. Pulsa **Import** en ese repositorio. Framework: Next.js (lo detecta solo).
3. En **Environment Variables** añade estas (las marcadas como secretas las pegas tú; no las compartas):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxqghfquormsnmdmxpba.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clave pública (está en tu `.env.local`) |
| `ALLOWED_EMAIL` | tu correo de acceso |
| `APP_URL` | la dirección que te dé Vercel, sin barra final (se rellena tras el primer despliegue) |
| `PLAN_PRICE_EUR` | `39` (o el precio que decidas) |
| `TRIAL_DAYS` | `30` |
| `SENDER_NAME` | tu nombre |
| `LEGAL_NAME`, `LEGAL_NIF`, `LEGAL_ADDRESS`, `LEGAL_EMAIL` | datos del titular; sin los cuatro, el alta pública queda cerrada |
| `SUPABASE_SERVICE_ROLE_KEY` | **secreta** |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` | **secretas**, cuando exista la cuenta de Stripe |

4. **Deploy**. Después:
   - Pon la dirección definitiva en `APP_URL` y vuelve a desplegar.
   - En Supabase → Authentication → URL Configuration, añade esa dirección como «Site URL» y
     `<dirección>/auth/callback` como «Redirect URL», para que funcione el enlace de acceso.
   - En Stripe, crea el webhook hacia `<dirección>/api/stripe/webhook` con los eventos
     `checkout.session.completed`, `invoice.paid` y `customer.subscription.deleted`.

Sin las variables de acceso, el panel privado queda cerrado y solo se ven las páginas públicas.
