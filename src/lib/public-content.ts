// Contenido de las páginas públicas propias: herramientas (modelo 3) y guías (modelo 5).

export interface ToolInfo {
  slug: "calculadora-iva" | "calculadora-margen" | "enlace-whatsapp";
  title: string;
  description: string;
  notes: string[];
}

export const TOOLS: ToolInfo[] = [
  {
    slug: "calculadora-iva",
    title: "Calculadora de IVA",
    description: "Añade o quita el IVA de un importe y obtén la base, la cuota y el total.",
    notes: [
      "Con IVA: total = base × (1 + tipo). Sin IVA: base = total ÷ (1 + tipo).",
      "Tipos de IVA en la Península y Baleares: 21 % general, 10 % reducido y 4 % superreducido. En Canarias se aplica el IGIC, y en Ceuta y Melilla el IPSI, con tipos distintos.",
      "El tipo que corresponde depende del producto o servicio. Si tienes dudas, consulta con tu gestoría.",
    ],
  },
  {
    slug: "calculadora-margen",
    title: "Calculadora de precio y margen",
    description: "Calcula a qué precio vender para obtener el margen que quieres.",
    notes: [
      "Margen sobre el precio: precio = coste ÷ (1 − margen). Con un coste de 70 € y un margen del 30 %, el precio es 100 €.",
      "No es lo mismo margen que recargo: subir un 30 % sobre el coste (91 €) deja un margen del 23 %, no del 30 %.",
      "El resultado es sin IVA. Usa la calculadora de IVA para obtener el precio final.",
    ],
  },
  {
    slug: "enlace-whatsapp",
    title: "Generador de enlace de WhatsApp",
    description: "Crea un enlace para que tus clientes te escriban por WhatsApp con un clic, sin guardar tu número.",
    notes: [
      "El enlace tiene la forma https://wa.me/ seguido del número con prefijo de país, sin el signo + ni espacios.",
      "Puedes ponerlo en tu web, en tu perfil de Instagram, en la firma del correo o en un código QR.",
      "El mensaje es opcional: aparece ya escrito para que el cliente solo tenga que enviarlo.",
    ],
  },
];

export interface Guide {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
  links: { href: string; label: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "boton-whatsapp-en-tu-web",
    title: "Cómo poner un botón de WhatsApp en la web de tu negocio",
    description: "Qué es un enlace de WhatsApp, cómo se crea y dónde conviene colocarlo.",
    sections: [
      {
        heading: "Qué es un enlace de WhatsApp",
        paragraphs: [
          "Es una dirección que abre una conversación contigo directamente, sin que la otra persona tenga que guardar tu número. Tiene la forma https://wa.me/ seguido de tu teléfono con el prefijo del país (34 para España), sin el signo + ni espacios.",
          "Se le puede añadir un mensaje ya escrito, por ejemplo «Hola, quería pedir cita». Así el cliente solo tiene que pulsar enviar.",
        ],
      },
      {
        heading: "Dónde ponerlo",
        paragraphs: [
          "En la parte de arriba de tu web, junto al teléfono, y otra vez al final. En el móvil es donde más se usa, así que comprueba que el botón se ve sin tener que desplazarse.",
          "También sirve fuera de la web: en la biografía de Instagram, en la ficha de tu negocio en Google, en la firma del correo o impreso como código QR en el mostrador.",
        ],
      },
      {
        heading: "Qué número usar",
        paragraphs: [
          "Si puedes, usa un número del negocio y no el personal. La aplicación WhatsApp Business es gratuita y permite poner el horario, la dirección y una respuesta automática fuera de horas.",
        ],
      },
    ],
    links: [
      { href: "/herramientas/enlace-whatsapp", label: "Crear mi enlace de WhatsApp" },
      { href: "/webs", label: "Tener una web con el botón ya puesto" },
    ],
  },
  {
    slug: "que-debe-tener-la-web-de-un-negocio-local",
    title: "Qué debe tener la web de un negocio local",
    description: "Lista corta de lo imprescindible para que una web sirva para conseguir clientes.",
    sections: [
      {
        heading: "Lo que busca quien entra",
        paragraphs: [
          "Casi siempre son cuatro cosas: qué haces, dónde estás, cuándo abres y cómo contactar. Si alguna no se encuentra en unos segundos, la visita se pierde.",
        ],
      },
      {
        heading: "Lista de comprobación",
        paragraphs: [
          "1. Nombre del negocio y a qué se dedica, en la primera pantalla.",
          "2. Teléfono que se pueda pulsar para llamar, y botón de WhatsApp.",
          "3. Horario actualizado, incluidos festivos y vacaciones.",
          "4. Dirección con enlace al mapa.",
          "5. Una forma de pedir cita o reserva sin tener que llamar.",
          "6. Que se lea bien en el móvil, sin ampliar la pantalla.",
          "7. Aviso legal y política de privacidad si recoges datos en un formulario.",
        ],
      },
      {
        heading: "Lo que puede esperar",
        paragraphs: [
          "Un blog, animaciones o decenas de páginas no son necesarios para empezar. Es mejor una página sencilla y al día que una web grande con el horario del año pasado.",
        ],
      },
    ],
    links: [{ href: "/webs", label: "Ver cómo quedaría la web de tu negocio" }],
  },
  {
    slug: "calcular-precio-con-iva-y-margen",
    title: "Cómo calcular el precio de un servicio con margen e IVA",
    description: "La diferencia entre margen y recargo, y el orden correcto para llegar al precio final.",
    sections: [
      {
        heading: "Primero el coste",
        paragraphs: [
          "Suma lo que te cuesta prestar el servicio o comprar el producto, sin IVA: materiales, tiempo y la parte de gastos fijos que le corresponda.",
        ],
      },
      {
        heading: "Margen no es lo mismo que recargo",
        paragraphs: [
          "El recargo se calcula sobre el coste; el margen, sobre el precio de venta. Si algo te cuesta 70 € y le sumas un 30 %, lo vendes a 91 € y tu margen real es del 23 %.",
          "Para que el margen sea del 30 %, la cuenta es precio = coste ÷ (1 − 0,30), es decir, 100 €.",
        ],
      },
      {
        heading: "El IVA va al final",
        paragraphs: [
          "Al precio sin IVA se le añade el tipo que corresponda. En la Península y Baleares los tipos son el 21 % general, el 10 % reducido y el 4 % superreducido. El IVA que cobras no es ingreso tuyo: se liquida con Hacienda.",
          "Qué tipo se aplica a tu actividad depende de la normativa; confírmalo con tu gestoría.",
        ],
      },
    ],
    links: [
      { href: "/herramientas/calculadora-margen", label: "Calculadora de precio y margen" },
      { href: "/herramientas/calculadora-iva", label: "Calculadora de IVA" },
    ],
  },
];

// Páginas por sector (modelo 1). Cada una tiene contenido propio: no son la misma página con el nombre cambiado.
export interface Sector {
  slug: string;
  category: "peluqueria" | "restaurante" | "clinica" | "taller" | "tienda";
  name: string;
  title: string;
  intro: string;
  problems: string[];
  includes: string[];
}

export const SECTORS: Sector[] = [
  {
    slug: "peluquerias",
    category: "peluqueria",
    name: "Peluquerías y centros de estética",
    title: "Web para peluquerías con petición de cita",
    intro: "Que te pidan cita por WhatsApp desde tu web, sin interrumpirte mientras atiendes.",
    problems: [
      "El teléfono suena cuando tienes las manos ocupadas y la llamada se pierde.",
      "Quien te busca en Google solo encuentra una ficha con el horario sin actualizar.",
      "Las citas por mensajes de Instagram se mezclan con todo lo demás.",
    ],
    includes: [
      "Botón «Pedir cita» que te escribe por WhatsApp con el día y la hora que quiere el cliente",
      "Lista de servicios: corte, color, peinado, tratamientos",
      "Horario y mapa para llegar",
      "Botón de llamada para quien prefiere hablar",
    ],
  },
  {
    slug: "restaurantes",
    category: "restaurante",
    name: "Bares y restaurantes",
    title: "Web para bares y restaurantes con reservas",
    intro: "Una página con tu horario, cómo llegar y un botón para reservar mesa por WhatsApp.",
    problems: [
      "En el servicio de comidas nadie puede coger el teléfono para apuntar reservas.",
      "La gente quiere saber si abres hoy y a qué hora cierra la cocina.",
      "Los grupos preguntan lo mismo cada vez: menú, sitio y cómo reservar.",
    ],
    includes: [
      "Botón «Reservar mesa» que te llega por WhatsApp con el día, la hora y cuántos son",
      "Horario visible en la primera pantalla",
      "Mapa y dirección",
      "Apartados para menú del día, carta, grupos y para llevar",
    ],
  },
  {
    slug: "clinicas",
    category: "clinica",
    name: "Clínicas y consultas",
    title: "Web para clínicas y consultas con solicitud de cita",
    intro: "Una página clara para que los pacientes sepan dónde estás, cuándo atiendes y cómo pedir cita.",
    problems: [
      "Recepción dedica buena parte de la mañana a dar el horario y la dirección por teléfono.",
      "Los pacientes nuevos no saben cómo pedir la primera cita.",
      "Fuera del horario de consulta no hay forma de dejar una solicitud.",
    ],
    includes: [
      "Botón «Solicitar cita» por WhatsApp, también fuera de horario",
      "Horario de consulta y teléfono",
      "Dirección con mapa",
      "El formulario solo pide nombre y preferencia de día: no recoge datos de salud",
    ],
  },
  {
    slug: "talleres",
    category: "taller",
    name: "Talleres",
    title: "Web para talleres con petición de cita",
    intro: "Que te pidan cita para el coche sin tener que parar a coger el teléfono.",
    problems: [
      "Debajo de un coche no se puede contestar llamadas.",
      "El cliente quiere saber si puedes darle hora esta semana y cómo llegar.",
      "Muchos te buscan por el móvil cuando ya tienen la avería.",
    ],
    includes: [
      "Botón «Pedir cita» por WhatsApp con el día que le viene bien al cliente",
      "Servicios habituales: revisión, neumáticos, frenos, pre-ITV",
      "Horario y mapa",
      "Botón de llamada directa desde el móvil",
    ],
  },
  {
    slug: "tiendas",
    category: "tienda",
    name: "Tiendas de barrio",
    title: "Web para tiendas de barrio",
    intro: "Una página con tu horario, dónde estás y un botón para que te pregunten por WhatsApp.",
    problems: [
      "Quien busca tu tienda quiere saber si estás abierto antes de acercarse.",
      "Los encargos se piden por teléfono y a veces se pierden.",
      "No necesitas una tienda en línea, pero sí aparecer cuando te buscan.",
    ],
    includes: [
      "Botón para consultas y encargos por WhatsApp",
      "Horario, también el de sábados",
      "Mapa y dirección",
      "Apartados para novedades, encargos y recogida en tienda",
    ],
  },
];
