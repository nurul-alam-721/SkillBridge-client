"use client";
import { CurrentUser, Booking, BookingReview } from "@/types";

import { useState } from "react";
import Link from "next/link";
import { format, differenceInHours } from "date-fns";
import {
  BookOpen, CalendarDays, Clock, Hourglass,
  CheckCircle2, XCircle, Star, CreditCard, Eye, Trash2,
  ArrowUpRight, Loader2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LeaveReviewDialog } from "@/app/(dashboardRoute)/student/_components/bookings/LeaveReviewDialog";
import { ViewReviewDialog } from "@/app/(dashboardRoute)/student/_components/bookings/ViewReviewDialog";
import { PaymentDialog } from "@/app/(dashboardRoute)/student/_components/bookings/PaymentDialog";
import { authClient } from "@/lib/auth-client";


import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ── Status config ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Hourglass,
    cls: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    cls: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/40 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    cls: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800",
    dot: "bg-rose-400",
  },
} as const;

/* ── BookingCard ─────────────────────────────────────────────────────────── */

export interface BookingCardProps {
  booking: Booking;
  currentUser: CurrentUser | null;
  onReviewed: () => void;
  patchReview: (id: string, review: BookingReview | null) => void;
  onCancel: (id: string) => Promise<void>;
}

export function BookingCard({
  booking,
  currentUser,
  onReviewed,
  patchReview,
  onCancel,
}: BookingCardProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewReviewOpen, setViewReviewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role;

  const cfg = STATUS_CONFIG[booking.status];
  const Icon = cfg.icon;
  const startDt = new Date(booking.slot.startTime);
  const endDt = new Date(booking.slot.endTime);
  const hours = differenceInHours(endDt, startDt);
  const tutorName = booking.tutorProfile.user?.name ?? "Unknown Tutor";
  const canReview =
    !booking.review &&
    (booking.status === "COMPLETED" || booking.status === "CONFIRMED");

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(booking.id);
      toast.success("Booking cancelled.");
    } catch {
      toast.error("Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-border hover:shadow-md transition-all duration-300">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 p-5 pb-4">
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 ring-2 ring-border/30 group-hover:ring-primary/20 transition-all">
              <AvatarImage src={booking.tutorProfile.user?.image ?? undefined} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {tutorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {booking.status === "CONFIRMED" && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-500 ring-2 ring-card" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold truncate leading-snug group-hover:text-primary transition-colors">
              {tutorName}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {booking.tutorProfile.category?.name ?? "—"}
            </p>
          </div>

          {/* Status pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border shrink-0",
              cfg.cls,
            )}
          >
            <Icon className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        {/* ── Info grid ── */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Date */}
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays className="h-3 w-3 text-muted-foreground/60" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Date
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                {format(startDt, "MMM d, yyyy")}
              </p>
            </div>

            {/* Time */}
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground/60" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Time
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground/90 tabular-nums">
                {format(startDt, "h:mm a")} – {format(endDt, "h:mm a")}
              </p>
            </div>

            {/* Session cost */}
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <CreditCard className="h-3 w-3 text-muted-foreground/60" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Session
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                ৳{booking.tutorProfile.hourlyRate}/hr
                <span className="text-muted-foreground font-normal ml-1">
                  · {hours}h
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Review badge ── */}
        {booking.review && (
          <div className="px-5 pb-3">
            <button
              onClick={() => setViewReviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium
                bg-amber-50 text-amber-700 border border-amber-200
                dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800
                hover:bg-amber-100 transition-colors"
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {Number(booking.review.rating ?? 0).toFixed(1)} · Your Review
            </button>
          </div>
        )}

        {/* ── Actions footer ── */}
        <div className="flex items-center gap-2 flex-wrap px-5 py-3.5 border-t border-border/40 bg-muted/20">
          {/* Pay */}
          {booking.status === "PENDING" && userRole === "STUDENT" && (
            <Button
              size="sm"
              className="h-9 rounded-xl text-xs gap-1.5 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={() => setPaymentOpen(true)}
            >
              <CreditCard className="h-3.5 w-3.5" />
              Pay Now
            </Button>
          )}

          {/* Leave review */}
          {canReview && (
            <Button
              variant="outline" size="sm"
              className="h-9 rounded-xl text-xs gap-1.5 flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400"
              onClick={() => setReviewOpen(true)}
            >
              <Star className="h-3 w-3" />
              Leave Review
            </Button>
          )}

          {/* View review */}
          {booking.review && (
            <Button
              variant="outline" size="sm"
              className="h-9 rounded-xl text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400"
              onClick={() => setViewReviewOpen(true)}
            >
              <Eye className="h-3.5 w-3.5" />
              My Review
            </Button>
          )}

          {/* Tutor link */}
          {booking.status !== "CANCELLED" && (
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5">
              <Link href={`/tutors/${booking.tutorProfile.id}`}>
                <User className="h-3.5 w-3.5" />
                Tutor
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          )}

          <div className="flex-1" />

          {/* Cancel */}
          {booking.status === "PENDING" && userRole === "STUDENT" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost" size="sm" disabled={cancelling}
                  className="h-9 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  {cancelling
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2 className="h-3.5 w-3.5" />}
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your booking with <strong>{tutorName}</strong> on{" "}
                    <strong>{format(startDt, "MMM d, yyyy")}</strong> is still unpaid.
                    Cancelling will free the slot for others.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep booking</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Book again */}
          {booking.status === "CANCELLED" && (
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5 text-muted-foreground">
              <Link href={`/tutors/${booking.tutorProfile.id}`}>
                Book Again
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>

        {/* ── Timestamp ── */}
        <div className="px-5 py-2 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground/60">
            Booked {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <LeaveReviewDialog
        open={reviewOpen}
        booking={booking}
        onClose={() => setReviewOpen(false)}
        onSubmitted={(review) => {
          setReviewOpen(false);
          patchReview(booking.id, review);
          onReviewed();
        }}
      />

      {booking.review && (
        <ViewReviewDialog
          open={viewReviewOpen}
          booking={booking}
          review={booking.review}
          onClose={() => setViewReviewOpen(false)}
          onUpdated={(review) => patchReview(booking.id, review)}
          onDeleted={() => {
            setViewReviewOpen(false);
            patchReview(booking.id, null);
            onReviewed();
          }}
        />
      )}

      <PaymentDialog
        open={paymentOpen}
        booking={booking}
        user={currentUser}
        onClose={() => setPaymentOpen(false)}
        onSuccess={() => {
          setPaymentOpen(false);
          onReviewed();
        }}
      />
    </>
  );
}

/* ── Empty state (shared) ───────────────────────────────────────────────── */

export function BookingEmptyState({
  message,
  showAction,
}: {
  message: string;
  showAction?: boolean;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Your sessions will appear here once booked.
        </p>
      </div>
      {showAction && (
        <Button asChild size="sm" className="rounded-xl mt-1">
          <Link href="/tutors">Browse Tutors</Link>
        </Button>
      )}
    </div>
  );
}