"use client";

import { useMemo } from "react";
import { DollarSign, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Payment, PaymentStats } from "@/types";

interface AdminPaymentStatCardsProps {
  payments: Payment[];
  loading: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconCls,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconCls: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg shrink-0 ${iconCls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        {loading ? (
          <div className="h-7 w-24 bg-muted animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        )}
        {sub && !loading && (
          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function AdminPaymentStatCards({ payments, loading }: AdminPaymentStatCardsProps) {
  const stats: PaymentStats = useMemo(() => {
    const completed    = payments.filter((p) => p.status === "COMPLETED");
    const pending      = payments.filter((p) => p.status === "PENDING");
    const totalRevenue = completed.reduce((sum, p) => sum + p.amount, 0);
    const pendingValue = pending.reduce((sum, p) => sum + p.amount, 0);
    const activeTutors = new Set(payments.map((p) => p.booking.tutorProfile.userId)).size;

    return {
      totalRevenue,
      completedCount: completed.length,
      pendingCount:   pending.length,
      pendingValue,
      activeTutors,
      totalPayments:  payments.length,
    };
  }, [payments]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={DollarSign}
        label="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        sub={`${stats.completedCount} completed transactions`}
        iconCls="bg-emerald-500/10 text-emerald-500"
        loading={loading}
      />
      <StatCard
        icon={CheckCircle2}
        label="Completed Payments"
        value={String(stats.completedCount)}
        sub={`of ${stats.totalPayments} total`}
        iconCls="bg-blue-500/10 text-blue-500"
        loading={loading}
      />
      <StatCard
        icon={Clock}
        label="Pending Value"
        value={`$${stats.pendingValue.toLocaleString()}`}
        sub={`${stats.pendingCount} pending payments`}
        iconCls="bg-amber-500/10 text-amber-500"
        loading={loading}
      />
      <StatCard
        icon={TrendingUp}
        label="Active Tutors"
        value={String(stats.activeTutors)}
        sub="with at least one booking"
        iconCls="bg-violet-500/10 text-violet-500"
        loading={loading}
      />
    </div>
  );
}