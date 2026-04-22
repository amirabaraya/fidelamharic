"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CheckoutButton({
  planId,
  children,
  className
}: {
  planId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [status, setStatus] = useState("");

  async function startCheckout() {
    setStatus("Opening secure checkout...");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });

    const body = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!response.ok || !body?.url) {
      setStatus(body?.error ?? "Checkout is not configured yet.");
      return;
    }

    window.location.href = body.url;
  }

  return (
    <div>
      <Button onClick={startCheckout} className={className}>
        {children}
      </Button>
      {status ? <p className="mt-3 text-center text-sm font-bold text-leaf dark:text-saffron">{status}</p> : null}
    </div>
  );
}
