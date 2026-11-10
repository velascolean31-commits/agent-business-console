# Agencia de webs con reservas para negocios locales

## Qué vende
Web propia con botón de llamada/WhatsApp, horario, ubicación y formulario de citas, por una **cuota mensual**
cobrada por Stripe. El dueño ve una web de muestra ya hecha con su nombre y la activa él mismo desde la página.

## Cómo fluye (sin intervención en el cobro)
1. **Scout**: se añade el negocio en «Leads y clientes» (manual por ahora).
2. **Forge**: se crea al instante su web en `/s/<slug>`.
3. **Herald**: mensaje preparado con el enlace; se envía por WhatsApp con un clic (lo envía el usuario).
4. **Ledger**: el dueño pulsa «Activar» → paga en Stripe → el webhook firmado marca «Cliente», registra cada
   mensualidad en `revenue_records` (sin duplicados) y pausa la web si cancela.

## Lo que hace falta para 10.000 €/mes (cuentas, no promesas)
| Precio mensual | Clientes necesarios |
|---|---|
| 59 € | 170 |
| 79 € | 127 |
| 99 € | 101 |

Supuestos **sin medir todavía** (se sustituirán por los datos reales del embudo): si 1 de cada 25 negocios
contactados acaba pagando, 127 clientes exigen contactar a unos 3.200 negocios. Es un objetivo de más de un año
para una persona; el primer hito realista es **10 clientes** para medir la conversión real y las bajas.

## Límites que el sistema respeta
- **Sin envíos masivos automáticos**: en España la LSSI restringe las comunicaciones comerciales no solicitadas.
  El sistema prepara cada mensaje y el usuario lo envía uno a uno.
- **Nada se marca como pagado** sin la firma verificada de Stripe.
- Los formularios de las webs de muestra **no guardan datos**; solo los de negocios ya clientes.
- Textos de ejemplo marcados como tales; el mensaje de contacto no contiene promesas ni datos inventados.

## Pendiente
- Desplegar en internet (ahora solo funciona en `localhost`).
- Cuenta de Stripe, precio mensual y webhook.
- Alta fiscal para facturar (autónomo o similar), aviso legal y política de privacidad en las webs.
- Aviso al negocio cuando llega una reserva (correo o WhatsApp) y panel propio para el cliente.
- Captación asistida (Google Places API) y dominio propio por cliente.
