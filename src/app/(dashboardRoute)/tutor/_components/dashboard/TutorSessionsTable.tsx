"use client";
import { TutorBooking, BookingStatus } from "@/types";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Hourglass, Loader2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bookingService } from "@/services/booking.service";
import { DataTablePagination } from "@/components/layout/DataTablePagination";

// ── Status badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; Icon: React.ElementType; cls: string }> = {
  PENDING:   { label: "Pending",   Icon: Hourglass,   cls: "text-amber-600 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800" },
  CONFIRMED: { label: "Confirmed", Icon: Clock,        cls: "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800" },
  COMPLETED: { label: "Completed", Icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800" },
  CANCELLED: { label: "Cancelled", Icon: XCircle,      cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}


function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp   className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown  className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

function ArrowUp({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>;
}
function ArrowDown({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>;
}
function ArrowUpDown({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21 15-9-9-9 9"/><path d="m21 9-9 9-9-9"/></svg>;
}


function SessionActions({
  booking,
  onStatusChange,
}: {
  booking: TutorBooking;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>;
}) {
  const [busy, setBusy] = useState<BookingStatus | null>(null);

  const act = async (status: BookingStatus) => {
    setBusy(status);
    await onStatusChange(booking.id, status);
    setBusy(null);
  };

  if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
     return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {booking.status === "CONFIRMED" && (
        <Button
          size="sm"
          className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          disabled={!!busy}
          onClick={() => act("COMPLETED")}
        >
          {busy === "COMPLETED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          Complete
        </Button>
      )}

      <Button
        size="sm"
        variant="outline"
        className="h-8 rounded-lg gap-1.5 text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
        disabled={!!busy}
        onClick={() => act("CANCELLED")}
      >
        {busy === "CANCELLED" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Decline
      </Button>

      {booking.status === "PENDING" && (
        <span className="text-[12px] text-muted-foreground font-medium italic text-yellow-500 ml-1">
          Awaiting Payment
        </span>
      )}
    </div>
  );
}


function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
             <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-28 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-8 w-40 bg-muted animate-pulse rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}


function buildColumns(
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>,
): ColumnDef<TutorBooking>[] {
  return [
    {
      id: "student",
      accessorFn: (row) => row.student.name ?? "",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={b.student.image ?? undefined} />
              <AvatarFallback className="text-xs font-bold bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                {(b.student.name ?? "S").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{b.student.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{b.student.email ?? "—"}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "session",
      accessorFn: (row) => row.slot.startTime,
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Session <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="tabular-nums">
            <p className="text-sm font-medium text-foreground">{format(new Date(b.slot.startTime), "MMM d, yyyy")}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(b.slot.startTime), "h:mm a")} → {format(new Date(b.slot.endTime), "h:mm a")}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <SessionActions booking={row.original} onStatusChange={onStatusChange} />
      ),
    },
  ];
}


export function TutorSessionsTable({
  bookings,
  loading = false,
  onRefresh,
}: {
  bookings: TutorBooking[];
  loading?: boolean;
  onRefresh: () => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "session", desc: false },
  ]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateStatus(id, status);
      toast.success(
        status === "CONFIRMED" ? "Session confirmed"
        : status === "COMPLETED" ? "Session marked as complete"
        : "Session cancelled"
      );
      onRefresh();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Failed to update session");
    }
  };

  const columns = buildColumns(handleStatusChange);

  const table = useReactTable({
    data: bookings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) return <TableSkeleton />;

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
                  <td colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                    No sessions yet.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 transition-colors ${
                      row.original.status === "CANCELLED" ? "opacity-50" : "hover:bg-muted/30"
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

      <DataTablePagination table={table} totalLabel="sessions" />
    </div>
  );
}