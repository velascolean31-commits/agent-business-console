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
