"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SortingState } from "@tanstack/react-table";
import { CreditCard } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { Payment, PaymentStatus } from "@/types";
import { AdminPaymentStatCards } from "../_components/payments/PaymentStatCard";
import { AdminPaymentFilterTabs } from "../_components/payments/PaymentsFilterTables";
import { AdminPaymentTable } from "../_components/payments/AdminPaymentsTable";
export default function AdminPaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "ALL">(
    "ALL",
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  useEffect(() => {
    paymentService
      .getAllPayments()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPayments = useMemo(
    () =>
      activeFilter === "ALL"
        ? payments
        : payments.filter((p) => p.status === activeFilter),
    [payments, activeFilter],
  );

  const handleViewTutor = (tutorProfileId: string) => {
    router.push(`/admin/tutors/${tutorProfileId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
          Payments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor all platform transactions, booking payments, and revenue.
        </p>
      </div>

      {/* Stat cards */}
      <AdminPaymentStatCards payments={payments} loading={loading} />

      {/* Filter tabs */}
      <AdminPaymentFilterTabs
        payments={payments}
        loading={loading}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Table */}
      <AdminPaymentTable
        payments={filteredPayments}
        loading={loading}
        activeFilter={activeFilter}
        onResetFilter={() => setActiveFilter("ALL")}
        sorting={sorting}
        onSortingChange={setSorting}
        onViewTutor={handleViewTutor}
      />
    </div>
  );
}
