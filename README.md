# Consola de negocios de agentes — Fases 1 y 2

Fase 1: interfaz, base de datos y estados. Fase 2: login por enlace de correo y conexión OAuth con YouTube
(solo lectura). **El flujo OAuth está implementado pero NO probado contra Google ni Supabase reales.**

## Configuración (lo que tienes que aportar tú)

1. Supabase: proyecto nuevo → ejecuta `0001_business_module.sql` y `0002_secrets.sql` en el SQL Editor.
   En Authentication → Providers deja solo «Email» y desactiva los registros públicos.
2. Google Cloud: crea un proyecto, activa «YouTube Data API v3» y «YouTube Analytics API», configura la pantalla
   de consentimiento y crea un cliente OAuth «Aplicación web» con la URI de redirección
   `${APP_URL}/api/connect/youtube/callback`.
3. Rellena `.env.local` (ver `.env.example`). `SUPABASE_SERVICE_ROLE_KEY` y `GOOGLE_OAUTH_CLIENT_SECRET` solo en servidor.
4. Entra con tu correo y pulsa «Conectar» en Connections & Accounts.

## Arrancar

1. Crea un proyecto en Supabase y aplica `supabase/migrations/0001_business_module.sql`.
2. Copia `.env.example` a `.env.local` y rellena las variables.
3. `npm install && npm run dev`

## Qué hace de verdad en la Fase 1

- Esquema con las 12 entidades pedidas (más `businesses`), restricciones únicas contra duplicados
  (`unique (platform, external_id)` en ingresos y contenido), RLS por propietario y auditoría de solo anexado.
- Los secretos nunca están en tablas: solo `secret_ref`, y esas columnas se revocan al rol `authenticated`.
- Un pago solo puede quedar en `paid` si tiene `provider_confirmed_at` (restricción CHECK).
- Un gasto que supere el presupuesto del negocio se rechaza con un trigger.
- Panel, Connections & Accounts, Finance & Payouts, fichas de agentes y cuenta de cobro.
- Sin datos: se muestra «Sin datos» o «No conectado», nunca cifras inventadas.

## Qué NO hace todavía

| Elemento | Estado |
|---|---|
| OAuth con otras plataformas | No implementado |
| Conectar / Sincronizar / Revocar YouTube | Implementado, sin probar con cuentas reales |
| Detener agente | Desactivado |
| Publicación, lectura de métricas e ingresos | No disponible (Fase 3 y 4; la Fase 2 solo pide permisos de lectura) |
| Aprobaciones de gasto desde la interfaz | Solo esquema |
| Impuestos estimados | Solo marcador de posición |

## Añadir una integración

Añade una entrada en `src/lib/integrations/registry.ts` (capacidades, variables necesarias, pasos humanos) e
implementa su adaptador en `src/lib/integrations/<id>.ts`. Hasta que `implemented` sea `true` y exista el flujo
OAuth, la interfaz muestra «No conectado» y explica qué falta.

## Siguiente paso

Probar el flujo completo con tus cuentas y, si funciona, Fase 3: flujo de producción y publicación del Agente Alpha con revisión humana.
