"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Hourglass, Clock, CheckCircle2, XCircle, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminBooking, BookingStatus } from "@/services/admin.service";

// ── Status badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; Icon: React.ElementType; cls: string }> = {
  PENDING:   { label: "Pending",   Icon: Hourglass,   cls: "text-amber-600 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800" },
  CONFIRMED: { label: "Confirmed", Icon: Clock,        cls: "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800" },
  COMPLETED: { label: "Completed", Icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800" },
  CANCELLED: { label: "Cancelled", Icon: XCircle,      cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800" },
};

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ── Sort icon ─────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp    className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc") return <ArrowDown  className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-40" />;
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><div className="flex items-center gap-2.5"><Skeleton className="h-7 w-7 rounded-full shrink-0" /><div className="space-y-1.5"><Skeleton className="h-3.5 w-28 rounded" /><Skeleton className="h-3 w-32 rounded" /></div></div></TableCell>
          <TableCell><div className="space-y-1.5"><Skeleton className="h-3.5 w-24 rounded" /><Skeleton className="h-3 w-32 rounded" /></div></TableCell>
          <TableCell><div className="space-y-1.5"><Skeleton className="h-3.5 w-20 rounded" /><Skeleton className="h-3 w-16 rounded" /></div></TableCell>
          <TableCell><div className="space-y-1.5"><Skeleton className="h-3.5 w-24 rounded" /><Skeleton className="h-3 w-28 rounded" /></div></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><div className="space-y-1.5"><Skeleton className="h-3.5 w-20 rounded" /><Skeleton className="h-3 w-14 rounded" /></div></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Column definitions ────────────────────────────────────────────────────

const columns: ColumnDef<AdminBooking>[] = [
  {
    id: "student",
    accessorFn: (row) => row.student.name ?? "",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={b.student.image ?? undefined} />
            <AvatarFallback className="text-xs font-bold bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              {(b.student.name ?? "S").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate leading-snug">{b.student.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground truncate">{b.student.email ?? "—"}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "tutor",
    accessorFn: (row) => row.tutorProfile.user.name ?? "",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tutor <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div className="min-w-0">
          <p className="font-medium truncate">{b.tutorProfile.user.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground truncate">{b.tutorProfile.user.email ?? "—"}</p>
        </div>
      );
    },
  },
  {
    id: "subject",
    accessorFn: (row) => row.tutorProfile.category.name,
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div>
          <p className="font-medium">{b.tutorProfile.category.name}</p>
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
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Session <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div className="tabular-nums">
          <p className="font-medium">{format(new Date(b.slot.startTime), "MMM d, yyyy")}</p>
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
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
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
        className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Booked On <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground tabular-nums">
        <p>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</p>
        <p>{format(new Date(row.original.createdAt), "h:mm a")}</p>
      </div>
    ),
  },
];


export function BookingsTable({
  bookings,
  loading,
}: {
  bookings: AdminBooking[];
  loading: boolean;
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

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40 hover:bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
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
                  <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === current ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 rounded-xl text-xs"
                    onClick={() => table.setPageIndex(p)}
                  >
                    {p + 1}
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