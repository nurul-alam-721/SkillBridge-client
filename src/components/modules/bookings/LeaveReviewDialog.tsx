"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { reviewService } from "@/services/review.service";
import { Booking, BookingReview } from "@/services/booking.service";

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {active > 0 && (
          <span className="ml-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            {LABELS[active]}
          </span>
        )}
      </div>
    </div>
  );
}

export function LeaveReviewDialog({
  open,
  booking,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onSubmitted: (review: BookingReview) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tutorName = booking.tutorProfile.user?.name ?? "the tutor";
  const category = booking.tutorProfile.category?.name ?? "";

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const review = await reviewService.create({
        tutorProfileId: booking.tutorProfile.id,
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Review submitted — thank you!");
      onSubmitted(review);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Failed to submit review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience to help other students.
          </DialogDescription>
        </DialogHeader>

        {/* Tutor info */}
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 border border-border/50 px-4 py-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={booking.tutorProfile.user?.image ?? undefined} />
            <AvatarFallback className="text-sm font-bold">
              {tutorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{tutorName}</p>
            {category && (
              <p className="text-xs text-muted-foreground">{category}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Star rating */}
          <div className="space-y-1.5">
            <Label>
              Rating <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={rating}
              onChange={(v) => {
                setRating(v);
                setError(null);
              }}
              disabled={busy}
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="review-comment">
              Comment{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="review-comment"
              placeholder={`How was your session with ${tutorName}?`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="rounded-xl resize-none"
              disabled={busy}
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl gap-2"
            onClick={handleSubmit}
            disabled={busy || rating === 0}
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
