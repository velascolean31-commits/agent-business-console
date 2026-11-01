// Registro modular de integraciones. Para añadir una plataforma nueva basta con
// añadir una entrada aquí e implementar su adaptador en /integrations/<id>.ts (Fase 2+).
// Nada de esto está conectado todavía: `implemented: false` significa que no existe
// flujo OAuth real, así que la UI mostrará siempre «No conectado».

export interface IntegrationCapabilities {
  publish: boolean | "unknown";
  readAnalytics: boolean | "unknown";
  readRevenue: boolean | "unknown";
  configurePayout: boolean | "unknown";
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  agents: string[];
  authMethod: "oauth2" | "api_key" | "manual";
  implemented: boolean;
  requiredEnv: string[];
  capabilities: IntegrationCapabilities;
  humanSteps: string[]; // pasos que siempre requieren al usuario
  notes: string;
}

const UNKNOWN: IntegrationCapabilities = {
  publish: "unknown",
  readAnalytics: "unknown",
  readRevenue: "unknown",
  configurePayout: "unknown",
};

export const INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: "youtube",
    name: "YouTube",
    agents: ["alpha"],
    authMethod: "oauth2",
    implemented: true,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "APP_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    // Fase 2: solo autorización y lectura del canal. Publicar y métricas se verifican en fases 3 y 4.
    capabilities: { publish: false, readAnalytics: "unknown", readRevenue: "unknown", configurePayout: false },
    humanSteps: [
      "Crear o elegir el canal con tu cuenta de Google",
      "Aceptar los permisos en la pantalla de consentimiento de Google",
      "Cumplir los requisitos del Programa de Partners de YouTube y activar la monetización",
      "Configurar el cobro en AdSense (los pagos no se redirigen por API)",
    ],
    notes: "La capacidad real de publicar y leer ingresos se verificará en la Fase 2 con la API oficial.",
  },
  {
    id: "gumroad",
    name: "Plataforma de venta (por elegir)",
    agents: ["bravo"],
    authMethod: "oauth2",
    implemented: false,
    requiredEnv: [],
    capabilities: UNKNOWN,
    humanSteps: ["Elegir plataforma compatible", "Completar su verificación y cobro oficial"],
    notes: "Pendiente de decidir plataforma antes de implementar.",
  },
  {
    id: "search-console",
    name: "Analítica y Search Console",
    agents: ["charlie"],
    authMethod: "oauth2",
    implemented: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
    capabilities: UNKNOWN,
    humanSteps: ["Verificar la propiedad del sitio", "Autorizar acceso de solo lectura"],
    notes: "Solo medición; no publica contenido.",
  },
  {
    id: "higgsfield",
    name: "Higgsfield (vídeo con IA)",
    agents: ["echo"],
    authMethod: "api_key",
    implemented: false,
    requiredEnv: ["HIGGSFIELD_API_KEY_ID", "HIGGSFIELD_API_KEY_SECRET"],
    capabilities: { publish: false, readAnalytics: false, readRevenue: false, configurePayout: false },
    humanSteps: [
      "Crear la cuenta de API en console.higgsfield.ai y recargar saldo",
      "Aprobar cada generación que supere el presupuesto configurado",
    ],
    notes: "Se paga por segundo generado. Cada vídeo debe ser una escena distinta (política de YouTube sobre contenido repetitivo) y marcarse como generado con IA.",
  },
  {
    id: "hosting",
    name: "Hosting y dominios",
    agents: ["delta"],
    authMethod: "manual",
    implemented: false,
    requiredEnv: [],
    capabilities: UNKNOWN,
    humanSteps: ["Cualquier compra de dominio o servicio requiere tu aprobación"],
    notes: "Las compras nunca se ejecutan sin aprobación explícita.",
  },
];

export function missingEnv(def: IntegrationDefinition): string[] {
  return def.requiredEnv.filter((k) => !process.env[k]);
}

export function explainNotConnected(def: IntegrationDefinition): string {
  if (!def.implemented) return "El adaptador de esta integración aún no está implementado (Fase 2).";
  const miss = missingEnv(def);
  if (miss.length) return `Faltan variables de entorno del servidor: ${miss.join(", ")}.`;
  return "Falta completar la autorización OAuth.";
}
