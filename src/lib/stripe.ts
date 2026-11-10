import "server-only";
import Stripe from "stripe";

export const STRIPE_ENV = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_ID"] as const;

export function missingStripeEnv(): string[] {
  return STRIPE_ENV.filter((k) => !process.env[k]);
}

let client: Stripe | null = null;
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Falta STRIPE_SECRET_KEY en el servidor");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}
