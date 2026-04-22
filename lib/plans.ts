import { Crown, GraduationCap, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PricingPlan = {
  id: "free" | "monthly" | "annual";
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  cta: string;
  href?: string;
  priceEnv?: "STRIPE_MONTHLY_PRICE_ID" | "STRIPE_ANNUAL_PRICE_ID";
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    interval: "forever",
    description: "Try the first Amharic foundations before upgrading.",
    features: ["First beginner unit", "Daily practice lab", "Basic flashcards", "Demo leaderboard"],
    icon: GraduationCap,
    cta: "Start free",
    href: "/signup"
  },
  {
    id: "monthly",
    name: "Fluent Monthly",
    price: "$9",
    interval: "month",
    description: "Full course access with review, voice practice, and progress tracking.",
    features: ["All beginner-to-advanced units", "Unlimited pronunciation practice", "Spaced repetition", "Badges and streak recovery"],
    icon: Sparkles,
    cta: "Subscribe monthly",
    priceEnv: "STRIPE_MONTHLY_PRICE_ID"
  },
  {
    id: "annual",
    name: "Fluent Annual",
    price: "$79",
    interval: "year",
    description: "Best value for committed learners and families.",
    features: ["Everything in Monthly", "Two months free", "Advanced reading track", "Priority content updates"],
    icon: Crown,
    cta: "Subscribe yearly",
    priceEnv: "STRIPE_ANNUAL_PRICE_ID"
  }
];
