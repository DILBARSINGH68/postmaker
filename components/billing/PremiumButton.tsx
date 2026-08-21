"use client";

import { Crown } from "lucide-react";

type Props = {
  compact?: boolean;
  className?: string;
};

export default function PremiumButton({ compact = false, className = "" }: Props) {
  const href = process.env.NEXT_PUBLIC_PREMIUM_CHECKOUT_URL || "/pricing";
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-200 bg-white/95 font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        compact ? "h-9 w-9 p-0" : "px-3 py-2 text-xs md:px-4 md:text-sm"
      } ${className}`}
      title="Upgrade to Kriyavo Premium"
      aria-label="Upgrade to Kriyavo Premium"
    >
      <Crown className="h-4 w-4 text-amber-500" strokeWidth={2} />
      {!compact && <span>Try Premium</span>}
    </a>
  );
}
