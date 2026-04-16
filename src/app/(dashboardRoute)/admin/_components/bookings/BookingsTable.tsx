"use client";

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import Image from "next/image";
import {
  Hourglass, Clock, CheckCircle2, XCircle,
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AdminBooking, BookingStatus } from "@/services/admin.service";

/* ── Status badge ────────────────────────────────────────────── */

const STATUS_CONFIG: Record<BookingStatus, { label: string; Icon: React.ElementType; cls: string }> = {
  PENDING:   { label: "Pending",   Icon: Hourglass,    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20"       },
  CONFIRMED: { label: "Confirmed", Icon: Clock,        cls: "bg-sky-500/10 text-sky-600 border-sky-500/20"             },
  COMPLETED: { label: "Completed", Icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  CANCELLED: { label: "Cancelled", Icon: XCircle,      cls: "bg-red-500/10 text-red-600 border-red-500/20"             },
};

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ── Avatar cell ─────────────────────────────────────────────── */

function AvatarCell({
  name,
  email,
  image,
}: {
  name:   string | null;
  email:  string | null;
  image?: string | null;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {image ? (
        <Image
          src={image}
          alt={name ?? ""}
          width={32}
          height={32}
          className="rounded-full object-cover shrink-0 border border-border"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 border border-border text-xs font-bold text-violet-600 dark:text-violet-400">
          {(name ?? "?").charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name ?? "—"}</p>
        <p className="text-xs text-muted-foreground truncate">{email ?? "—"}</p>
      </div>
    </div>
  );
}

/* ── Sort icon ───────────────────────────────────────────────── */

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp   className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

/* ── Date helper ─────────────────────────────────────────────── */

function safeFormat(value: string | Date, fmt: string, fallback = "—"): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? format(date, fmt) : fallback;
}

/* ── Skeleton ────────────────────────────────────────────────── */

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Column definitions ──────────────────────────────────────── */

const columns: ColumnDef<AdminBooking>[] = [
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
      const { student } = row.original;
      return (
        <AvatarCell
          name={student.name}
          email={student.email}

        />
      );
    },
  },
  {
    id: "tutor",
    accessorFn: (row) => row.tutorProfile.user.name ?? "",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tutor <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const { user } = row.original.tutorProfile;
      return (
        <AvatarCell
          name={user.name}
          email={user.email}
          image={user.image}
        />
      );
    },
  },
  {
    id: "subject",
    accessorFn: (row) => row.tutorProfile.category.name,
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{b.tutorProfile.category.name}</p>
          <p className="text-xs text-muted-foreground">৳{b.tutorProfile.hourlyRate}/hr</p>
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
          <p className="text-sm font-medium text-foreground">
            {safeFormat(b.slot.startTime, "MMM d, yyyy")}
          </p>
          <p className="text-xs text-muted-foreground">
            {safeFormat(b.slot.startTime, "h:mm a")} → {safeFormat(b.slot.endTime, "h:mm a")}
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
    cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Booked On <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">
        <p className="text-sm text-foreground">
          {safeFormat(row.original.createdAt, "MMM d, yyyy")}
        </p>
        <p className="text-xs text-muted-foreground">
          {safeFormat(row.original.createdAt, "h:mm a")}
        </p>
      </div>
    ),
  },
];

/* ── Main export ─────────────────────────────────────────────── */

export function BookingsTable({
  bookings,
  loading,
}: {
  bookings: AdminBooking[];
  loading:  boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

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

  const current = table.getState().pagination.pageIndex;
  const total   = table.getPageCount();

  const delta = 2;
  const pages: (number | "…")[] = [];
  const rangeStart = Math.max(0, current - delta);
  const rangeEnd   = Math.min(total - 1, current + delta);
  if (rangeStart > 0) { pages.push(0); if (rangeStart > 1) pages.push("…"); }
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 1) { if (rangeEnd < total - 2) pages.push("…"); pages.push(total - 1); }

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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-8 w-8 rounded-xl"
              onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((p, i) =>
              p === "…" ? (
                <span key={`e-${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none">…</span>
              ) : (
                <Button
                  key={p}
                  variant={p === current ? "default" : "outline"}
                  size="icon" className="h-8 w-8 rounded-xl text-xs"
                  onClick={() => table.setPageIndex(p as number)}
                >
                  {(p as number) + 1}
                </Button>
              )
            )}

            <Button
              variant="outline" size="icon" className="h-8 w-8 rounded-xl"
              onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}