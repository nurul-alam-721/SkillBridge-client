"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, differenceInHours } from "date-fns";
import {
  BookOpen, RefreshCw, CalendarDays, Clock, Hourglass,
  CheckCircle2, XCircle, Star, CreditCard, Eye, Trash2,
  ArrowUpRight, Loader2, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMyBookings } from "@/hooks/useMyBookings";
import { LeaveReviewDialog } from "@/components/modules/bookings/LeaveReviewDialog";
import { ViewReviewDialog } from "@/components/modules/bookings/ViewReviewDialog";
import { PaymentDialog } from "@/components/modules/bookings/PaymentDialog";
import { authClient } from "@/lib/auth-client";
import { Booking, BookingReview } from "@/services/booking.service";
import { userService, CurrentUser } from "@/services/user.service"; // 👈
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ── Status config ── */
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending", icon: Hourglass,
    cls: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800",
  },
  CONFIRMED: {
    label: "Confirmed", icon: CheckCircle2,
    cls: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/40 dark:border-sky-800",
  },
  COMPLETED: {
    label: "Completed", icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled", icon: XCircle,
    cls: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800",
  },
} as const;

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ message, showAction }: { message: string; showAction?: boolean }) {
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

function BookingCard({
  booking,
  currentUser,
  onReviewed,
  patchReview,
  onCancel,
}: {
  booking: Booking;
  currentUser: CurrentUser | null;
  onReviewed: () => void;
  patchReview: (id: string, review: BookingReview | null) => void;
  onCancel: (id: string) => Promise<void>;
}) {
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
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border shrink-0",
            cfg.cls,
          )}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays className="h-3 w-3 text-muted-foreground/70" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Date</span>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                {format(startDt, "MMM d, yyyy")}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground/70" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Time</span>
              </div>
              <p className="text-xs font-semibold text-foreground/90 tabular-nums">
                {format(startDt, "h:mm a")} – {format(endDt, "h:mm a")}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-2.5 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <CreditCard className="h-3 w-3 text-muted-foreground/70" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Session</span>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                ৳{booking.tutorProfile.hourlyRate}/hr
                <span className="text-muted-foreground font-normal ml-1">· {hours}h</span>
              </p>
            </div>
          </div>
        </div>

        {booking.review && (
          <div className="px-5 pb-3">
            <button
              onClick={() => setViewReviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100 transition-colors"
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {parseFloat(booking.review.rating).toFixed(1)} · Your Review
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-5 py-3.5 border-t border-border/40 bg-muted/20">
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
          {booking.status === "PENDING" && userRole === "STUDENT" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost" size="sm" disabled={cancelling}
                  className="h-9 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
          {booking.status === "CANCELLED" && (
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5 text-muted-foreground">
              <Link href={`/tutors/${booking.tutorProfile.id}`}>
                Book Again
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>

        <div className="px-5 py-2 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground/60">
            Booked {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

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
      {/* 👇 user prop now wired with real currentUser */}
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

function BookingGrid({
  bookings, loading, emptyMessage, showEmptyAction,
  currentUser, onReviewed, patchReview, onCancel,
}: {
  bookings: Booking[];
  loading: boolean;
  emptyMessage: string;
  showEmptyAction?: boolean;
  currentUser: CurrentUser | null; // 👈 added
  onReviewed: () => void;
  patchReview: (id: string, review: BookingReview | null) => void;
  onCancel: (id: string) => Promise<void>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
      ) : bookings.length === 0 ? (
        <EmptyState message={emptyMessage} showAction={showEmptyAction} />
      ) : (
        bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            currentUser={currentUser} // 👈 passed down
            onReviewed={onReviewed}
            patchReview={patchReview}
            onCancel={onCancel}
          />
        ))
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { bookings, upcoming, past, loading, refresh, patchReview, cancelBooking } = useMyBookings();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null); // 👈

  // 👇 fetch real user once on mount
  useEffect(() => {
    userService.getMe().then(setCurrentUser).catch(console.error);
  }, []);

  const reviewed = bookings.filter((b) => !!b.review);
  const unreviewed = bookings.filter(
    (b) => !b.review && (b.status === "COMPLETED" || b.status === "CONFIRMED"),
  );

  return (
    <div className="flex flex-col gap-5 py-4 md:py-6">
      <div className="px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">My Bookings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading
              ? "Loading..."
              : `${bookings.length} total · ${upcoming.length} upcoming · ${reviewed.length} reviewed`}
          </p>
        </div>
        <Button
          variant="outline" size="sm"
          className="rounded-xl gap-1.5 text-xs"
          onClick={refresh} disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-5">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcoming.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{upcoming.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past
              {past.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{past.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews
              {reviewed.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{reviewed.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="all">
              All
              {bookings.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{bookings.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0 space-y-4">
            <div>
              <h2 className="text-base font-semibold">Upcoming Sessions</h2>
              <p className="text-sm text-muted-foreground">Pending and confirmed sessions</p>
            </div>
            <BookingGrid bookings={upcoming} loading={loading} emptyMessage="No upcoming sessions"
              showEmptyAction currentUser={currentUser} onReviewed={refresh} patchReview={patchReview} onCancel={cancelBooking} />
          </TabsContent>

          <TabsContent value="past" className="mt-0 space-y-4">
            <div>
              <h2 className="text-base font-semibold">Past Sessions</h2>
              <p className="text-sm text-muted-foreground">Completed and cancelled sessions</p>
            </div>
            <BookingGrid bookings={past} loading={loading} emptyMessage="No past sessions yet"
              currentUser={currentUser} onReviewed={refresh} patchReview={patchReview} onCancel={cancelBooking} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 space-y-5">
            <div>
              <h2 className="text-base font-semibold">My Reviews</h2>
              <p className="text-sm text-muted-foreground">
                {reviewed.length} review{reviewed.length !== 1 ? "s" : ""} submitted
                {unreviewed.length > 0 && ` · ${unreviewed.length} pending`}
              </p>
            </div>
            {unreviewed.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Awaiting your review
                </p>
                <BookingGrid bookings={unreviewed} loading={false} emptyMessage=""
                  currentUser={currentUser} onReviewed={refresh} patchReview={patchReview} onCancel={cancelBooking} />
              </div>
            )}
            {reviewed.length > 0 && (
              <div className="space-y-3">
                {unreviewed.length > 0 && (
                  <>
                    <Separator />
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Submitted reviews
                    </p>
                  </>
                )}
                <BookingGrid bookings={reviewed} loading={false} emptyMessage=""
                  currentUser={currentUser} onReviewed={refresh} patchReview={patchReview} onCancel={cancelBooking} />
              </div>
            )}
            {reviewed.length === 0 && unreviewed.length === 0 && !loading && (
              <EmptyState message="No reviews yet" />
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-0 space-y-4">
            <div>
              <h2 className="text-base font-semibold">All Bookings</h2>
              <p className="text-sm text-muted-foreground">Complete booking history</p>
            </div>
            <BookingGrid bookings={bookings} loading={loading} emptyMessage="No bookings yet"
              showEmptyAction currentUser={currentUser} onReviewed={refresh} patchReview={patchReview} onCancel={cancelBooking} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}