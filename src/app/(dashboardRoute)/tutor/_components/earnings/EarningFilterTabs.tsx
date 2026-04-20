"use client";

import { cn } from "@/lib/utils";
import { Payment, PaymentStatus } from "@/types";

interface Props {
  payments: Payment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onFilterChange: (filter: PaymentStatus | "ALL") => void;
}

const FILTERS: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Failed", value: "FAILED" },
];

export function EarningFilterTabs({ payments, loading, activeFilter, onFilterChange }: Props) {
  const getCount = (filter: PaymentStatus | "ALL") =>
    filter === "ALL" ? payments.length : payments.filter((p) => p.status === filter).length;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {FILTERS.map((f) => {
        const count = getCount(f.value);
        const isActive = activeFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive
                  ? "bg-background/20 text-background"
                  : "bg-background text-muted-foreground"
              )}
            >
              {loading ? "—" : count}
            </span>
          </button>
        );
      })}
    </div>
  );
}