"use client";

import { AdminPayment, PaymentStatus } from "@/types/admin-payments.types";

interface AdminPaymentFilterTabsProps {
  payments: AdminPayment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onFilterChange: (filter: PaymentStatus | "ALL") => void;
}

const FILTERS: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export function AdminPaymentFilterTabs({
  payments,
  loading,
  activeFilter,
  onFilterChange,
}: AdminPaymentFilterTabsProps) {
  const count = (filter: PaymentStatus | "ALL") =>
    filter === "ALL"
      ? payments.length
      : payments.filter((p) => p.status === filter).length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border
            ${
              activeFilter === value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
            }`}
        >
          {label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${
                activeFilter === value
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
          >
            {loading ? "—" : count(value)}
          </span>
        </button>
      ))}
    </div>
  );
}
