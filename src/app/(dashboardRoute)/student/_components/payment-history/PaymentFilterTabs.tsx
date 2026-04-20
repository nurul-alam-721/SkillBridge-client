import { Payment, PaymentStatus } from "@/types";


const FILTER_TABS: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "All",       value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending",   value: "PENDING" },
  { label: "Refunded",  value: "REFUNDED" },
  { label: "Failed",    value: "FAILED" },
];

export function PaymentFilterTabs({
  payments,
  loading,
  activeFilter,
  onFilterChange,
}: {
  payments: Payment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onFilterChange: (filter: PaymentStatus | "ALL") => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {FILTER_TABS.map((tab) => {
        const count =
          tab.value === "ALL"
            ? payments.length
            : payments.filter((p) => p.status === tab.value).length;
        const isActive = activeFilter === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
            }`}
          >
            {tab.label}
            {!loading && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}