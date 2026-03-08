"use client";

import { useEffect, useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminService, AdminBooking, BookingStatus } from "@/services/admin.service";
import { BookingsFilter } from "@/components/modules/adminDashboard/BookingsFilter";
import { BookingsTable } from "@/components/modules/adminDashboard/BookingsTable";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    if (e.response?.data?.message) return e.response.data.message;
  }
  return "Failed to load bookings. Please try again.";
}

export default function AdminBookingsPage() {
  const [bookings,   setBookings]   = useState<AdminBooking[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState<BookingStatus | "ALL">("ALL");

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = status === "ALL" || b.status === status;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.student.name?.toLowerCase().includes(q) ||
        b.student.email?.toLowerCase().includes(q) ||
        b.tutorProfile.user.name?.toLowerCase().includes(q) ||
        b.tutorProfile.user.email?.toLowerCase().includes(q) ||
        b.tutorProfile.category.name.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, status, search]);

  return (
    <div className="space-y-5 px-4 py-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All platform bookings across students and tutors
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
          onClick={() => load(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <BookingsFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        total={bookings.length}
        filtered={filtered.length}
      />

      <BookingsTable bookings={filtered} loading={loading} />

    </div>
  );
}