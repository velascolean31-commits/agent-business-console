# Cinco modelos de negocio automatizables

Criterio de selección: el cliente llega y compra solo, la entrega es automática y no hace falta dinero por
adelantado. **Ninguno garantiza ingresos**; lo automatizable es la producción y el cobro, no la demanda.

| # | Modelo | Agentes | Cómo cobra | Qué queda automatizado | Estado real (10/11/2026) |
|---|---|---|---|---|---|
| 1 | **Webs autoservicio** para negocios locales | Forge, Ledger | Suscripción mensual (Stripe) con prueba gratuita | Alta, creación de la web, cobro, activación, pausa al cancelar | Código hecho y compilando. Falta: migración, Stripe, datos legales, despliegue |
| 2 | **Productos digitales** (plantillas) | Bravo | Venta única en una tienda de productos digitales | Entrega y cobro (los hace la plataforma) | 3 plantillas Excel hechas y verificadas (`products/`). Falta: cuenta de la tienda |
| 3 | **Microherramientas web** | Delta | Anuncios y versión de pago | Todo salvo elegir qué construir | 3 herramientas hechas (`/herramientas`). Falta: despliegue y red de anuncios |
| 4 | **Diseños bajo demanda** | Atlas | Margen por venta; fabrica y envía la plataforma | Producción, envío y cobro | 4 diseños hechos (`products/disenos`). Falta: cuenta de la plataforma |
| 5 | **Guías y afiliación** | Charlie | Comisiones y tráfico hacia 1–4 | Redacción y publicación programada | 3 guías hechas (`/guias`). Falta: despliegue; sin afiliación todavía |

Dropshipping queda fuera mientras no haya un presupuesto de anuncios que se pueda perder.

## Qué significa «sin intervención»
- **Una vez, al principio (lo hace el usuario):** crear las cuentas, verificar identidad, aceptar condiciones,
  datos de cobro y alta fiscal. Ningún agente puede hacerlo por él.
- **Después:** las ventas, cobros y entregas ocurren solas. Los agentes trabajan en tareas programadas
  (producir plantillas, guías o herramientas) y dejan constancia en GitHub y en la auditoría.
- **Siempre con aprobación:** cualquier gasto y cualquier cambio de método de cobro.

## Orden de trabajo
1. Poner en producción el modelo 1 (es el único con código hecho).
2. Modelo 2: primer lote de 5 plantillas.
3. Modelo 3 sobre el mismo despliegue; modelo 5 para darles tráfico.
4. Modelo 4 cuando exista la cuenta.
Sargento compara resultados reales a los 60 días y propone dónde seguir.
