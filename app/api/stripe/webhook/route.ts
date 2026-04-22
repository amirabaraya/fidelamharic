import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }

  await prisma.paymentEvent.upsert({
    where: { stripeEventId: event.id },
    update: {},
    create: {
      stripeEventId: event.id,
      type: event.type,
      payload: event as unknown as object
    }
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;

    if (email && session.customer && session.subscription) {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: session.customer_details?.name ?? email.split("@")[0]
        }
      });

      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          status: "active",
          plan: session.metadata?.planId ?? "paid",
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: String(session.subscription)
        },
        create: {
          userId: user.id,
          status: "active",
          plan: session.metadata?.planId ?? "paid",
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: String(session.subscription)
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}
