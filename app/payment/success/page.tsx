import { CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Button, Card } from "@/components/ui";

export default function PaymentSuccessPage() {
  return (
    <>
      <MarketingNav />
      <main className="grid min-h-screen place-items-center px-4 py-28">
        <Card className="max-w-xl text-center">
          <CheckCircle2 className="mx-auto text-leaf dark:text-saffron" size={48} />
          <h1 className="mt-5 font-display text-5xl font-bold">You are in.</h1>
          <p className="mt-3 text-charcoal/68 dark:text-cream/68">
            Stripe confirmed checkout. Your subscription status will update after the webhook finishes.
          </p>
          <Button href="/dashboard" className="mt-6">
            Continue learning
          </Button>
        </Card>
      </main>
    </>
  );
}
