"use client";

import { useEffect, useMemo, useState } from "react";
import { SortingState, Updater } from "@tanstack/react-table";
import { Wallet } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { Payment, PaymentStatus } from "@/types";
import { EarningStatCards } from "../../_components/earnings/EarningStatCards";
import { EarningFilterTabs } from "../../_components/earnings/EarningFilterTabs";
import { EarningTable } from "../../_components/earnings/EarningTable";


export default function TutorEarningPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  useEffect(() => {
    paymentService
      .getTutorEarnings()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  const filteredPayments = useMemo(
    () =>
      activeFilter === "ALL"
        ? payments
        : payments.filter((p) => p.status === activeFilter),
    [payments, activeFilter]
  );

  const handleSortingChange = (updater: Updater<SortingState>) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2.5">
          <Wallet className="h-6 w-6 text-muted-foreground" />
          My Earnings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View payments received from your students and track session earnings.
        </p>
      </div>

      <EarningStatCards payments={payments} loading={loading} />

      <EarningFilterTabs
        payments={payments}
        loading={loading}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <EarningTable
        payments={filteredPayments}
        loading={loading}
        activeFilter={activeFilter}
        onResetFilter={() => setActiveFilter("ALL")}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}