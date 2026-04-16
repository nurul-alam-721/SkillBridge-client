import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookingStatus } from "@/services/admin.service";
import { AdminBooking } from "@/services/admin.service";

const STATUSES: { value: BookingStatus | "ALL"; label: string }[] = [
  { value: "ALL",       label: "All" },
  { value: "PENDING",   label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface BookingsFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: BookingStatus | "ALL";
  onStatusChange: (v: BookingStatus | "ALL") => void;
  bookings: AdminBooking[];
  loading: boolean;
  total: number;
}

export function BookingsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  bookings,
  loading,
}: BookingsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search student or tutor…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 rounded-xl text-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUSES.map(({ value, label }) => {
          const count =
            value === "ALL"
              ? bookings.length
              : bookings.filter((b) => b.status === value).length;
          const isActive = status === value;

          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
              }`}
            >
              {label}
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
    </div>
  );
}