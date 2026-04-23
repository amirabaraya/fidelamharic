"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <Button
      className={className}
      variant="secondary"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut size={18} /> Log out
    </Button>
  );
}
