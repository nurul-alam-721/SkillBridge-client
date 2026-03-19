"use client";

import { format, differenceInHours } from "date-fns";
import { Star, CalendarDays, Clock, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingReview } from "@/services/booking.service";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Poor",      color: "text-rose-500"   },
  2: { label: "Fair",      color: "text-orange-500" },
  3: { label: "Good",      color: "text-yellow-500" },
  4: { label: "Very Good", color: "text-lime-500"   },
  5: { label: "Excellent", color: "text-emerald-500"},
};

function StarDisplay({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-6 w-6 transition-colors",
              s <= rounded
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/20"
            )}
          />
        ))}
      </div>
      <span className="text-lg font-bold text-amber-500 tabular-nums leading-none">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function ViewReviewDialog({
  open,
  booking,
  review,
  onClose,
}: {
  open:    boolean;
  booking: Booking;
  review:  BookingReview;
  onClose: () => void;
}) {
  const rating    = parseFloat(review.rating);
  const tutorName = booking.tutorProfile.user?.name ?? "Tutor";
  const category  = booking.tutorProfile.category?.name ?? "";
  const startDt   = new Date(booking.slot.startTime);
  const endDt     = new Date(booking.slot.endTime);
  const hours     = differenceInHours(endDt, startDt);
  const ratingMeta = RATING_LABELS[Math.round(rating)];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden gap-0">

        {/* ── Amber header ── */}
        <div className="relative bg-linear-to-br from-amber-500 to-amber-400 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">
              Your Review
            </DialogTitle>
            <DialogDescription className="text-amber-100/80 text-xs mt-0.5">
              Submitted {format(new Date(review.createdAt), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-100/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">

          {/* ── Tutor card ── */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border/30">
              <AvatarImage src={booking.tutorProfile.user?.image ?? undefined} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {tutorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{tutorName}</p>
              {category && (
                <Badge variant="secondary" className="mt-0.5 text-[10px] px-1.5 h-4">
                  {category}
                </Badge>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-sm font-bold">৳{booking.tutorProfile.hourlyRate}/hr</p>
            </div>
          </div>

          {/* ── Session info ── */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Date</p>
                <p className="text-xs font-medium">
                  {format(startDt, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Duration</p>
                <p className="text-xs font-medium">
                  {format(startDt, "h:mm a")} · {hours}h
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Rating ── */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Your Rating
            </p>
            <StarDisplay rating={rating} />
            {ratingMeta && (
              <p className={`text-sm font-semibold ${ratingMeta.color}`}>
                {ratingMeta.label}
              </p>
            )}
          </div>

          {/* ── Comment ── */}
          {review.comment ? (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Your Comment
                </p>
                <blockquote className="relative pl-4 border-l-2 border-amber-300 dark:border-amber-700">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {review.comment}
                  </p>
                </blockquote>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic text-center py-1">
              No comment was added to this review.
            </p>
          )}

        
          <Button
            variant="outline"
            className="w-full rounded-xl mt-1"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}