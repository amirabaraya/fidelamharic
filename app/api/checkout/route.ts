import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  planId: z.enum(["monthly", "annual"])
});

const stripePriceEnvByPlan = {
  monthly: "STRIPE_MONTHLY_PRICE_ID",
  annual: "STRIPE_ANNUAL_PRICE_ID"
} as const;

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a valid plan." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and price IDs in Vercel." },
      { status: 503 }
    );
  }

  const priceEnv = stripePriceEnvByPlan[parsed.data.planId];
  const priceId = process.env[priceEnv];
  if (!priceId) {
    return NextResponse.json({ error: `Missing ${priceEnv}.` }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteConfig.url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/payment/cancel`,
    metadata: {
      app: siteConfig.name,
      planId: parsed.data.planId
    }
  });

  return NextResponse.json({ url: session.url });
}
