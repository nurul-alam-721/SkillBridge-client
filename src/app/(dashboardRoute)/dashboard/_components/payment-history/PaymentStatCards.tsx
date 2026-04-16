import { TrendingUp, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Payment } from "@/types/payment-history.types";

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card px-5 py-4 flex items-center gap-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-xl font-bold tabular-nums text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function PaymentStatCards({
  payments,
  loading,
}: {
  payments: Payment[];
  loading: boolean;
}) {
  const completed = payments.filter((p) => p.status === "COMPLETED");
  const pending   = payments.filter((p) => p.status === "PENDING");
  const refunded  = payments.filter((p) => p.status === "REFUNDED");
  const totalSpent = completed.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="Total Spent"
        value={loading ? "—" : `৳ ${totalSpent.toLocaleString()}`}
        icon={<TrendingUp className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />}
        accent="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <StatCard
        label="Completed"
        value={loading ? "—" : completed.length}
        icon={<CheckCircle2 className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />}
        accent="bg-sky-50 dark:bg-sky-900/20"
      />
      <StatCard
        label="Pending"
        value={loading ? "—" : pending.length}
        icon={<Clock className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />}
        accent="bg-amber-50 dark:bg-amber-900/20"
      />
      <StatCard
        label="Refunded"
        value={loading ? "—" : refunded.length}
        icon={<RotateCcw className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />}
        accent="bg-violet-50 dark:bg-violet-900/20"
      />
    </div>
  );
}