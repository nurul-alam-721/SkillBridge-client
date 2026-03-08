import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookingStatus } from "@/services/admin.service";

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
  total: number;
  filtered: number;
}

export function BookingsFilter({
  search, onSearchChange,
  status, onStatusChange,
  total, filtered,
}: BookingsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              status === value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <span className="ml-auto text-xs text-muted-foreground shrink-0">
        {filtered} of {total}
      </span>
    </div>
  );
}