# Consola de negocios de agentes — Fases 1 y 2

Fase 1: interfaz, base de datos y estados. Fase 2: login por enlace de correo y conexión OAuth con YouTube
(solo lectura). **Fase 2 probada con cuentas reales el 1/11/2026**: login por correo, conexión del canal de YouTube,
token guardado cifrado en Vault, permisos de Alpha y registro en auditoría.

## Configuración (lo que tienes que aportar tú)

1. Supabase: proyecto nuevo → ejecuta `0001_business_module.sql` y `0002_secrets.sql` en el SQL Editor.
   En Authentication → Providers deja solo «Email» y desactiva los registros públicos.
2. Google Cloud: crea un proyecto, activa «YouTube Data API v3» y «YouTube Analytics API», configura la pantalla
   de consentimiento y crea un cliente OAuth «Aplicación web» con la URI de redirección
   `${APP_URL}/api/connect/youtube/callback`.
3. Rellena `.env.local` (ver `.env.example`). `SUPABASE_SERVICE_ROLE_KEY` y `GOOGLE_OAUTH_CLIENT_SECRET` solo en servidor.
4. Entra con tu correo y pulsa «Conectar» en Connections & Accounts.

## Arrancar

**Windows, forma rápida:** doble clic en `arrancar.bat`. Descarga lo último, instala dependencias, arranca la app y abre el navegador.

**A mano:**

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
| Conectar YouTube | Probado con cuenta real |
| Sincronizar / Revocar YouTube | Implementado, pendiente de probar |
| Detener agente | Desactivado |
| Publicación, lectura de métricas e ingresos | No disponible (Fase 3 y 4; la Fase 2 solo pide permisos de lectura) |
| Aprobaciones de gasto desde la interfaz | Solo esquema |
| Impuestos estimados | Solo marcador de posición |

## Añadir una integración

Añade una entrada en `src/lib/integrations/registry.ts` (capacidades, variables necesarias, pasos humanos) e
implementa su adaptador en `src/lib/integrations/<id>.ts`. Hasta que `implemented` sea `true` y exista el flujo
OAuth, la interfaz muestra «No conectado» y explica qué falta.

## Siguiente paso

Fase 3: flujo de producción y publicación del Agente Alpha con revisión humana.

## Qué permite realmente la integración de YouTube (Fase 2)

| Acción | Estado |
|---|---|
| Leer datos del canal | Disponible (permiso `youtube.readonly`) |
| Leer estadísticas | Permiso concedido (`yt-analytics.readonly`); lectura de métricas en Fase 4 |
| Publicar vídeos | No disponible: requiere permiso de subida (Fase 3) |
| Leer ingresos | No disponible: requiere monetización activa y permiso adicional |
| Configurar cobro | No disponible por API: se hace en AdSense, manualmente |
| Requiere intervención humana | Login, pulsar «Permitir» en Google, monetización y cobro |

## Hoja de ruta (después de las fases 3 y 4)

1. **Subir la app a internet** con dominio https (necesario para usarla fuera de tu ordenador y para sacar
   la app de Google del modo de prueba).
2. **App instalable (PWA)** en móvil y ordenador, con icono propio y notificaciones.
3. **Aspecto de escuadrón**: cada agente con su tarjeta de personaje, rango, color y estado de misión.
   Sargento como comandante. Cada agente tendrá un hueco de imagen personalizable
   (`public/avatars/<agente>.png`) donde el usuario pone la imagen que quiera; si no hay imagen, se
   muestra un emblema por defecto.
4. **Asistente de avisos** conectado a `approval_requests`: notificaciones de la app, después bot de
   Telegram (aprobar o rechazar con botones) y, más adelante, WhatsApp Business (requiere verificación
   de Meta y plantillas) y llamadas de voz (servicio de pago).

## Decisiones de la Fase 3 (1/11/2026)

- **Alpha → clipping** de campañas de Whop Content Rewards, con el material oficial que da el creador.
  La campaña se elige junto al usuario. La inscripción y el envío a Whop serán manuales al principio.
- **Echo (agente nuevo) → vídeos relajantes con IA** (lluvia en la montaña, hoguera, olas) en un
  **canal de YouTube nuevo**, separado de @landroidote3960. Clip corto generado con Higgsfield y repetido
  sin cortes, con sonido de licencia libre. Siempre con presupuesto máximo, revisión humana y etiqueta de
  contenido generado con IA. Cada vídeo debe ser una escena distinta para no caer en «contenido repetitivo».
- **Titular de los cobros**: el usuario (mayor de edad).
- Migración `0003_agent_echo.sql`: añade `echo` a los agentes.
