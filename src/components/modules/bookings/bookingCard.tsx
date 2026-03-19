"use client";

import { useState } from "react";
import { format, differenceInHours } from "date-fns";
import {
  CalendarDays, Clock, ArrowUpRight,
  Hourglass, CheckCircle2, XCircle, Star, BookOpen, Eye,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Booking, BookingStatus, BookingReview } from "@/services/booking.service";
import { LeaveReviewDialog } from "./LeaveReviewDialog";
import { ViewReviewDialog } from "./ViewReviewDialog";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ElementType; pill: string; glow: string; bar: string }
> = {
  PENDING: {
    label: "Pending",
    icon:  Hourglass,
    pill:  "text-amber-600 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800",
    glow:  "from-amber-500/5 to-transparent",
    bar:   "bg-gradient-to-r from-amber-400 to-amber-300",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon:  CheckCircle2,
    pill:  "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800",
    glow:  "from-sky-500/5 to-transparent",
    bar:   "bg-gradient-to-r from-sky-500 to-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    icon:  CheckCircle2,
    pill:  "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800",
    glow:  "from-emerald-500/5 to-transparent",
    bar:   "bg-gradient-to-r from-emerald-500 to-teal-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon:  XCircle,
    pill:  "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800",
    glow:  "from-rose-500/5 to-transparent",
    bar:   "bg-gradient-to-r from-rose-500 to-pink-400",
  },
};

export function BookingCard({
  booking,
  onReviewed,
  patchReview,
}: {
  booking:      Booking;
  onReviewed?:  () => void;
  patchReview?: (bookingId: string, review: BookingReview | null) => void;
}) {
  const [reviewOpen,     setReviewOpen]     = useState(false);
  const [viewReviewOpen, setViewReviewOpen] = useState(false);

  const cfg     = STATUS_CONFIG[booking.status];
  const Icon    = cfg.icon;
  const startDt = new Date(booking.slot.startTime);
  const endDt   = new Date(booking.slot.endTime);
  const hours   = differenceInHours(endDt, startDt);

  const canReview = !booking.review &&
    (booking.status === "COMPLETED" || booking.status === "CONFIRMED");

  return (
    <>
      <div className="relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">

        {/* Gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.glow} pointer-events-none`} />

        {/* Top status bar */}
        <div className={`h-[3px] w-full ${cfg.bar}`} />

        <div className="relative p-5 flex flex-col gap-4">

          {/* Row 1: Tutor + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 ring-2 ring-border/50">
                  <AvatarImage src={booking.tutorProfile.user?.image ?? undefined} />
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    {(booking.tutorProfile.user?.name ?? "T").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {booking.status === "CONFIRMED" && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-500 ring-2 ring-card" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug truncate">
                  {booking.tutorProfile.user?.name ?? "Unknown Tutor"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {booking.tutorProfile.category?.name ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.pill}`}>
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              {/* Review badge */}
              {booking.review && (
                <button
                  onClick={() => setViewReviewOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  {parseFloat(booking.review.rating).toFixed(1)} · Reviewed
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Date + time */}
          <div className="rounded-xl bg-muted/50 dark:bg-muted/30 border border-border/40 px-4 py-3 space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span className="font-medium text-foreground/80">
                {format(startDt, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                <span className="font-medium text-foreground/80 tabular-nums">
                  {format(startDt, "h:mm a")}
                  <span className="mx-1.5 text-muted-foreground/50">→</span>
                  {format(endDt, "h:mm a")}
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground bg-background rounded-md px-1.5 py-0.5 border border-border/50">
                {hours}h session
              </span>
            </div>
          </div>

          {/* Row 3: Rate + actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Rate</span>
              <span className="text-base font-bold leading-tight">
                BDT {booking.tutorProfile.hourlyRate}
                <span className="text-xs font-normal text-muted-foreground ml-0.5">/hr</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Already reviewed — show review + link to all reviews */}
              {booking.review && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                    onClick={() => setViewReviewOpen(true)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    My Review
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl text-xs gap-1.5"
                  >
                    <Link href={`/tutors/${booking.tutorProfile.id}?tab=reviews`}>
                      All Reviews <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </>
              )}

              {/* Leave review */}
              {canReview && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  onClick={() => setReviewOpen(true)}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  Leave Review
                </Button>
              )}

              {/* View tutor / View details */}
              {!booking.review && booking.status !== "CANCELLED" && (
                <Button
                  asChild
                  size="sm"
                  className="h-8 rounded-xl text-xs gap-1.5"
                  variant={booking.status === "COMPLETED" ? "outline" : "default"}
                >
                  <Link href={`/tutors/${booking.tutorProfile.id}`}>
                    {booking.status === "COMPLETED" ? (
                      <>View Tutor <ArrowUpRight className="h-3.5 w-3.5" /></>
                    ) : (
                      <><BookOpen className="h-3.5 w-3.5" /> View Details</>
                    )}
                  </Link>
                </Button>
              )}

              {booking.status === "CANCELLED" && !booking.review && (
                <Button asChild variant="outline" size="sm" className="h-8 rounded-xl text-xs gap-1.5 text-muted-foreground">
                  <Link href={`/tutors/${booking.tutorProfile.id}`}>
                    Book Again <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-[10px] text-muted-foreground/60 -mt-1">
            Booked {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* Leave Review */}
      <LeaveReviewDialog
        open={reviewOpen}
        booking={booking}
        onClose={() => setReviewOpen(false)}
        onSubmitted={(review) => {
          setReviewOpen(false);
          patchReview?.(booking.id, review); 
          onReviewed?.();
        }}
      />

      {booking.review && (
        <ViewReviewDialog
          open={viewReviewOpen}
          booking={booking}
          review={booking.review}
          onClose={() => setViewReviewOpen(false)}
          onUpdated={(review) => patchReview?.(booking.id, review)}
          onDeleted={() => {
            setViewReviewOpen(false);
            patchReview?.(booking.id, null);
            onReviewed?.();
          }}
        />
      )}
    </>
  );
}