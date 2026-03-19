"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star } from "lucide-react";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Booking, BookingStatus, BookingReview } from "@/services/booking.service";
import { LeaveReviewDialog } from "./LeaveReviewDialog";
import { ViewReviewDialog } from "./ViewReviewDialog";
import { DataPagination } from "@/app/utils/DataPagination";

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "text-amber-700 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "text-sky-700 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800",
  },
  COMPLETED: {
    label: "Completed",
    className: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "text-rose-700 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800",
  },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

export function BookingsTable({
  bookings,
  onReviewed,
  patchReview,
}: {
  bookings:     Booking[];
  onReviewed?:  () => void;
  patchReview?: (bookingId: string, review: BookingReview | null) => void;
}) {
  const [page,          setPage]          = useState(1);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [viewReview,    setViewReview]    = useState<{ booking: Booking; review: BookingReview } | null>(null);

  const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
  const paginated  = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No bookings yet. Browse tutors to get started.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.tutorProfile.user?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.tutorProfile.category?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.slot.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {format(new Date(booking.slot.startTime), "h:mm a")}
                          {" – "}
                          {format(new Date(booking.slot.endTime), "h:mm a")}
                        </TableCell>
                        <TableCell>BDT {booking.tutorProfile.hourlyRate}/hr</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {booking.review ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-lg text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                              onClick={() => setViewReview({ booking, review: booking.review! })}
                            >
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              View Review
                            </Button>
                          ) : (booking.status === "COMPLETED" || booking.status === "CONFIRMED") ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 rounded-lg text-xs gap-1.5 ${
                                booking.status === "COMPLETED"
                                  ? "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                  : "border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
                              }`}
                              onClick={() => setReviewBooking(booking)}
                            >
                              <Star className={`h-3 w-3 ${
                                booking.status === "COMPLETED"
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-sky-400 text-sky-400"
                              }`} />
                              Review
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <DataPagination
                  page={page}
                  totalPages={totalPages}
                  onPage={(p) => setPage(p)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
    </>
  );
}