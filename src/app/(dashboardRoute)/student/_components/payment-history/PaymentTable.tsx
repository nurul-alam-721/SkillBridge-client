"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Receipt,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Payment, PaymentStatus, BookingStatus } from "@/types";
import { DataTablePagination } from "@/components/layout/DataTablePagination";

// ── Sort icon ─────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp    className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown  className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

// ── Badges ────────────────────────────────────────────────────────────────

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; Icon: React.ElementType; cls: string }> = {
    COMPLETED: { label: "Completed", Icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    PENDING:   { label: "Pending",   Icon: Clock,        cls: "bg-amber-500/10  text-amber-600  border-amber-500/20"  },
    FAILED:    { label: "Failed",    Icon: XCircle,      cls: "bg-red-500/10    text-red-600    border-red-500/20"    },
    REFUNDED:  { label: "Refunded",  Icon: RotateCcw,    cls: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  };
  const { label, Icon, cls } = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    CONFIRMED: "bg-blue-500/10   text-blue-600   border-blue-500/20",
    PENDING:   "bg-amber-500/10  text-amber-600  border-amber-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CANCELLED: "bg-red-500/10    text-red-600    border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

// ── Avatar cell ───────────────────────────────────────────────────────────

function AvatarCell({ name, image }: { name: string; image: string | null }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {image ? (
         <div className="relative h-8 w-8 shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-full object-cover border border-border"
          />
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground border border-border">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <p className="text-sm font-medium text-foreground truncate">{name}</p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────

export function PaymentTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Column definitions ────────────────────────────────────────────────────

export function buildPaymentColumns(
  onView: (bookingId: string) => void
): ColumnDef<Payment>[] {
  return [
    {
      id: "tutor",
      accessorFn: (row) => row.booking.tutorProfile.user.name,
      header: "Tutor",
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.booking.tutorProfile.user.name}
          image={row.original.booking.tutorProfile.user.image}
        />
      ),
    },
    {
      id: "hourlyRate",
      header: "Rate",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-foreground">
            ৳{row.original.booking.tutorProfile.hourlyRate}/hr
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.booking.tutorProfile.experience} yr
            {row.original.booking.tutorProfile.experience !== 1 ? "s" : ""} exp
          </p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground">
            ৳{row.original.amount.toLocaleString()}
          </p>
          <p className="text-xs font-mono uppercase text-muted-foreground">
            {row.original.currency}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Payment",
      cell: ({ getValue }) => (
        <PaymentStatusBadge status={getValue() as PaymentStatus} />
      ),
    },
    {
      id: "bookingStatus",
      header: "Booking",
      cell: ({ row }) => (
        <BookingStatusBadge status={row.original.booking.status} />
      ),
    },
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return (
          <span title={id} className="font-mono text-xs text-muted-foreground">
            {id.slice(0, 22)}…
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {new Date(getValue() as string).toLocaleDateString("en-US", {
            year:  "numeric",
            month: "short",
            day:   "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => row.original.bookingId && onView(row.original.bookingId)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Tutor
        </button>
      ),
    },
  ];
}

// ── Table component ───────────────────────────────────────────────────────

export function PaymentTable({
  payments,
  loading,
  activeFilter,
  onResetFilter,
  sorting,
  onSortingChange,
  onView,
}: {
  payments: Payment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onResetFilter: () => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onView: (bookingId: string) => void;
}) {
  const columns = buildPaymentColumns(onView);

  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  if (loading) return <PaymentTableSkeleton />;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border bg-muted/40">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">No payments found</p>
                      {activeFilter !== "ALL" && (
                        <button
                          onClick={onResetFilter}
                          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 transition-colors ${
                      row.original.booking.status === "CANCELLED"
                        ? "opacity-55"
                        : row.original.status === "PENDING"
                          ? "bg-amber-50/30 dark:bg-amber-900/5 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                          : row.original.status === "REFUNDED"
                            ? "bg-violet-50/20 dark:bg-violet-900/5 hover:bg-violet-50/40 dark:hover:bg-violet-900/10"
                            : "hover:bg-muted/30"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DataTablePagination table={table} totalLabel="payments" />
    </div>
  );
}