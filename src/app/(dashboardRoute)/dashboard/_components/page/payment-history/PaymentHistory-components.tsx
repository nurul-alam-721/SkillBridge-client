"use client";


import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { BookingStatus, Payment, PaymentStatus } from "@/types/payment-history.types";


const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3 w-3" />,
    cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800",
  },
  PENDING: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    cls: "text-amber-700 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800",
  },
  FAILED: {
    label: "Failed",
    icon: <XCircle className="h-3 w-3" />,
    cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800",
  },
  REFUNDED: {
    label: "Refunded",
    icon: <ArrowUpDown className="h-3 w-3" />,
    cls: "text-violet-700 bg-violet-50 ring-1 ring-violet-200 dark:text-violet-400 dark:bg-violet-900/30 dark:ring-violet-800",
  },
};

const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; cls: string }
> = {
  PENDING: {
    label: "Pending",
    cls: "text-amber-700 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "text-sky-700 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800",
  },
  COMPLETED: {
    label: "Completed",
    cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "text-slate-500 bg-slate-100 ring-1 ring-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:ring-slate-700",
  },
};

// ── Badges ────────────────────────────────────────────────────────────────────

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const cfg = BOOKING_STATUS_CONFIG[status] ?? BOOKING_STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ── Sort icon ─────────────────────────────────────────────────────────────────

export function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ArrowUp className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc") return <ArrowDown className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-40" />;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function PaymentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-24 rounded" /></TableCell>
          <TableCell><Skeleton className="h-8 w-16 rounded-xl" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────

export function buildPaymentColumns(
  onView: (bookingId: string) => void
): ColumnDef<Payment>[] {
  return [
    {
      id: "tutor",
      accessorFn: (row) => row.booking.tutorProfile.user.name,
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tutor <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const tutor = row.original.booking.tutorProfile.user;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={tutor.image ?? undefined} />
              <AvatarFallback className="bg-sky-100 text-sky-600 text-xs font-bold dark:bg-sky-900/30 dark:text-sky-400">
                {tutor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate leading-snug text-sm">{tutor.name}</p>
              <p className="text-xs text-muted-foreground truncate">{tutor.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "amount",
      accessorFn: (row) => row.amount,
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums text-sm">
          ৳ {row.original.amount.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      id: "bookingStatus",
      accessorFn: (row) => row.booking.status,
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <BookingStatusBadge status={row.original.booking.status} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "action",
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wide">Details</span>
      ),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-xl gap-1.5 text-xs border-border/60 hover:border-border"
          onClick={() => onView(row.original.bookingId)}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View
        </Button>
      ),
      enableSorting: false,
    },
  ];
}