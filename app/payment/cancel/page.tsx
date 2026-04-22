import { MarketingNav } from "@/components/marketing-nav";
import { Button, Card } from "@/components/ui";

export default function PaymentCancelPage() {
  return (
    <>
      <MarketingNav />
      <main className="grid min-h-screen place-items-center px-4 py-28">
        <Card className="max-w-xl text-center">
          <h1 className="font-display text-5xl font-bold">Checkout canceled.</h1>
          <p className="mt-3 text-charcoal/68 dark:text-cream/68">
            No payment was taken. You can continue with the free plan or choose another option.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/pricing">View plans</Button>
            <Button href="/dashboard" variant="secondary">Use free plan</Button>
          </div>
        </Card>
      </main>
    </>
  );
}
