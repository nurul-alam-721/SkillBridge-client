"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SortingState } from "@tanstack/react-table";
import { Receipt } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { Payment, PaymentStatus } from "@/types";
import { PaymentStatCards }  from "../../_components/payment-history/PaymentStatCards";
import { PaymentFilterTabs } from "../../_components/payment-history/PaymentFilterTabs";
import { PaymentTable }      from "../../_components/payment-history/PaymentTable";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments]         = useState<Payment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [sorting, setSorting]           = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  useEffect(() => {
    paymentService
      .getMyPayments()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleView = (bookingId: string) => {
    const booking = payments.find((p) => p.bookingId === bookingId);
    if (booking) {
      router.push(`/tutors/${booking.booking.tutorProfile.id}`);
    }
  };

  const filteredPayments = useMemo(
    () =>
      activeFilter === "ALL"
        ? payments
        : payments.filter((p) => p.status === activeFilter),
    [payments, activeFilter]
  );

  const handleFilterChange = (filter: PaymentStatus | "ALL") => {
    setActiveFilter(filter);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2.5">
          <Receipt className=" h-6 w-6 text-muted-foreground" />
          Payment History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all your session payments and booking statuses.
        </p>
      </div>

      <PaymentStatCards payments={payments} loading={loading} />

      <PaymentFilterTabs
        payments={payments}
        loading={loading}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <PaymentTable
        payments={filteredPayments}
        loading={loading}
        activeFilter={activeFilter}
        onResetFilter={() => setActiveFilter("ALL")}
        sorting={sorting}
        onSortingChange={setSorting}
        onView={handleView}
      />
    </div>
  );
}