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
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AdminPayment, PaymentStatus, BookingStatus } from "@/types/admin-payments.types";

interface AdminPaymentTableProps {
  payments: AdminPayment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onResetFilter: () => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onViewTutor: (tutorProfileId: string) => void;
}

/* ── Badge components ─────────────────────────────────────────── */

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; icon: React.ElementType; cls: string }> = {
    COMPLETED: {
      label: "Completed",
      icon:  CheckCircle2,
      cls:   "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    PENDING: {
      label: "Pending",
      icon:  Clock,
      cls:   "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    FAILED: {
      label: "Failed",
      icon:  XCircle,
      cls:   "bg-red-500/10 text-red-600 border-red-500/20",
    },
  };
  const { label, icon: Icon, cls } = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PENDING:   "bg-amber-500/10 text-amber-600 border-amber-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

function AvatarCell({ name, image }: { name: string; image: string | null }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {image ? (
        <Image
          src={image}
          alt={name}
          width={32}
          height={32}
          className="rounded-full object-cover shrink-0 border border-border"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground border border-border">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────── */

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────── */

function EmptyState({
  activeFilter,
  onResetFilter,
}: {
  activeFilter: PaymentStatus | "ALL";
  onResetFilter: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 gap-3">
      <SearchX className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">No payments found</p>
      <p className="text-xs text-muted-foreground">
        {activeFilter !== "ALL"
          ? `No ${activeFilter.toLowerCase()} payments match your filter.`
          : "No payment records are available yet."}
      </p>
      {activeFilter !== "ALL" && (
        <button
          onClick={onResetFilter}
          className="mt-1 text-xs text-primary hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

/* ── Sort icon ────────────────────────────────────────────────── */

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp    className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown  className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

/* ── Main table ───────────────────────────────────────────────── */

export function AdminPaymentTable({
  payments,
  loading,
  activeFilter,
  onResetFilter,
  sorting,
  onSortingChange,
  onViewTutor,
}: AdminPaymentTableProps) {
  const columns: ColumnDef<AdminPayment>[] = [
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.student.name}
          image={row.original.student.image}
        />
      ),
    },
    {
      id: "tutor",
      header: "Tutor",
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.booking.tutorProfile.user.name}
          image={row.original.booking.tutorProfile.user.image}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="font-semibold text-foreground">
          ${(getValue() as number).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ getValue }) => (
        <span className="text-xs font-mono uppercase text-muted-foreground">
          {getValue() as string}
        </span>
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
          Date
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString("en-US", {
          year:  "numeric",
          month: "short",
          day:   "numeric",
        }),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => onViewTutor(row.original.booking.tutorProfileId)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Tutor
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data:                payments,
    columns,
    state:               { sorting },
    onSortingChange,
    getCoreRowModel:     getCoreRowModel(),
    getSortedRowModel:   getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState:        { pagination: { pageSize: 10 } },
  });

  if (loading) return <TableSkeleton />;

  if (payments.length === 0) {
    return <EmptyState activeFilter={activeFilter} onResetFilter={onResetFilter} />;
  }

  return (
    <div className="space-y-3">
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
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination — mirrors BookingsTable */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {payments.length} payment{payments.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {(() => {
              const current = table.getState().pagination.pageIndex;
              const total   = table.getPageCount();
              const delta   = 2;
              const pages: (number | "…")[] = [];

              const rangeStart = Math.max(0, current - delta);
              const rangeEnd   = Math.min(total - 1, current + delta);

              if (rangeStart > 0) {
                pages.push(0);
                if (rangeStart > 1) pages.push("…");
              }
              for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
              if (rangeEnd < total - 1) {
                if (rangeEnd < total - 2) pages.push("…");
                pages.push(total - 1);
              }

              return pages.map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === current ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 rounded-xl text-xs"
                    onClick={() => table.setPageIndex(p as number)}
                  >
                    {(p as number) + 1}
                  </Button>
                )
              );
            })()}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}