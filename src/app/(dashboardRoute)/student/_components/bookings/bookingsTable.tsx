"use client";
import { Booking, BookingStatus, BookingReview } from "@/types";

import { useState } from "react";
import { format } from "date-fns";
import { Star, Clock, Calendar, SearchX } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { LeaveReviewDialog } from "./LeaveReviewDialog";
import { ViewReviewDialog } from "./ViewReviewDialog";
import { DataTablePagination } from "@/components/layout/DataTablePagination";

// ── Status badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ── Avatar Cell ───────────────────────────────────────────────────────────

function AvatarCell({ name, image, email }: { name: string; image: string | null; email?: string | null }) {
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
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
      </div>
    </div>
  );
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

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ArrowUp className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

// ── Main Table Component ──────────────────────────────────────────────────

export function BookingsTable({
  bookings,
  onReviewed,
  patchReview,
}: {
  bookings: Booking[];
  onReviewed?: () => void;
  patchReview?: (bookingId: string, review: BookingReview | null) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [viewReview, setViewReview] = useState<{ booking: Booking; review: BookingReview } | null>(null);

  const columns: ColumnDef<Booking>[] = [
    {
      id: "tutor",
      accessorFn: (row) => row.tutorProfile.user?.name ?? "",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tutor <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.tutorProfile.user?.name ?? "—"}
          image={row.original.tutorProfile.user?.image}
          email={row.original.tutorProfile.category?.name}
        />
      ),
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
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
               <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
               {format(new Date(b.slot.startTime), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
               <Clock className="h-3.5 w-3.5" />
               {format(new Date(b.slot.startTime), "h:mm a")} → {format(new Date(b.slot.endTime), "h:mm a")}
            </div>
          </div>
        );
      },
    },
    {
      id: "rate",
      accessorFn: (row) => row.tutorProfile.hourlyRate,
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rate <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums">
          ৳{row.original.tutorProfile.hourlyRate}/hr
        </span>
      ),
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
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const booking = row.original;
        if (booking.review) {
          return (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30 shadow-sm"
              onClick={() => setViewReview({ booking, review: booking.review! })}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              View Review
            </Button>
          );
        }

        if (booking.status === "COMPLETED" || booking.status === "CONFIRMED") {
          return (
            <Button
              variant="outline"
              size="sm"
              className={`h-8 rounded-xl text-xs gap-1.5 shadow-sm transition-all ${
                booking.status === "COMPLETED"
                  ? "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  : "border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
              }`}
              onClick={() => setReviewBooking(booking)}
            >
              <Star className={`h-3.5 w-3.5 ${
                booking.status === "COMPLETED" ? "fill-amber-400 text-amber-400" : "fill-sky-400 text-sky-400"
              }`} />
              Review
            </Button>
          );
        }

        return null;
      },
    }
  ];

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
                  <td colSpan={columns.length} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                       <SearchX className="h-10 w-10 text-muted-foreground/30" />
                       <p className="text-sm font-medium text-muted-foreground">No bookings found</p>
                    </div>
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

      <DataTablePagination table={table} totalLabel="bookings" />

      {reviewBooking && (
        <LeaveReviewDialog
          open={!!reviewBooking}
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmitted={(review) => {
            patchReview?.(reviewBooking.id, review);
            setReviewBooking(null);
            onReviewed?.();
          }}
        />
      )}

      {viewReview && (
        <ViewReviewDialog
          open={!!viewReview}
          booking={viewReview.booking}
          review={viewReview.review}
          onClose={() => setViewReview(null)}
          onUpdated={(updated) => {
            patchReview?.(viewReview.booking.id, updated);
            setViewReview({ ...viewReview, review: updated });
          }}
          onDeleted={() => {
            patchReview?.(viewReview.booking.id, null);
            setViewReview(null);
            onReviewed?.();
          }}
        />
      )}
    </div>
  );
}
