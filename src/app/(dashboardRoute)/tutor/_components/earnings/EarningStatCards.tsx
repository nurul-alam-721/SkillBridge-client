"use client";

import { DollarSign, CheckCircle2, Clock, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Payment } from "@/types";

interface Props {
  payments: Payment[];
  loading: boolean;
}

export function EarningStatCards({ payments, loading }: Props) {
  const completed = payments.filter((p) => p.status === "COMPLETED");
  const pending = payments.filter((p) => p.status === "PENDING");
  const refunded = payments.filter((p) => p.status === "REFUNDED");

  const totalEarned = completed.reduce((acc, p) => acc + Number(p.tutorEarning ?? p.amount), 0);
  const pendingAmount = pending.reduce((acc, p) => acc + Number(p.tutorEarning ?? p.amount), 0);

  const stats = [
    {
      label: "Total Earned",
      value: `৳${totalEarned.toFixed(2)}`,
      icon: DollarSign,
      description: `${completed.length} completed session${completed.length !== 1 ? "s" : ""}`,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Pending",
      value: `৳${pendingAmount.toFixed(2)}`,
      icon: Clock,
      description: `${pending.length} pending payment${pending.length !== 1 ? "s" : ""}`,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Completed Sessions",
      value: String(completed.length),
      icon: CheckCircle2,
      description: "Fully paid bookings",
      iconClass: "text-blue-500",
      bgClass: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Refunds",
      value: String(refunded.length),
      icon: RefreshCcw,
      description: "Refunded payments",
      iconClass: "text-rose-500",
      bgClass: "bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className={`p-1.5 rounded-md ${stat.bgClass}`}>
                  <Icon className={`h-4 w-4 ${stat.iconClass}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}