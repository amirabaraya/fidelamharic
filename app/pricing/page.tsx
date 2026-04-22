import { CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { CheckoutButton } from "@/components/checkout-button";
import { Button, Card, SectionHeading } from "@/components/ui";
import { pricingPlans } from "@/lib/plans";

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main className="px-4 pb-20 pt-32 md:pt-40">
        <SectionHeading
          eyebrow="Plans"
          title="Choose how you want to learn Amharic."
          description="Start free, then unlock the full FidelAmharic curriculum, pronunciation practice, spaced repetition, and advanced reading tracks."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={plan.id === "monthly" ? "border-saffron shadow-gold" : ""}>
              <plan.icon className="text-leaf dark:text-saffron" size={32} />
              <h2 className="mt-5 font-display text-4xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{plan.description}</p>
              <p className="mt-6">
                <span className="font-display text-6xl font-bold">{plan.price}</span>
                <span className="ml-2 text-sm font-bold text-charcoal/58 dark:text-cream/58">/{plan.interval}</span>
              </p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 size={17} className="text-leaf dark:text-saffron" />
                    {feature}
                  </p>
                ))}
              </div>
              {plan.href ? (
                <Button href={plan.href} className="mt-7 w-full">
                  {plan.cta}
                </Button>
              ) : (
                <CheckoutButton planId={plan.id} className="mt-7 w-full">
                  {plan.cta}
                </CheckoutButton>
              )}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
