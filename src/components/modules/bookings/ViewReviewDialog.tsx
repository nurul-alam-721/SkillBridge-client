"use client";

import { useState } from "react";
import { format, differenceInHours } from "date-fns";
import {
  Star,
  CalendarDays,
  Clock,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { reviewService } from "@/services/review.service";
import { Booking, BookingReview } from "@/services/booking.service";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Poor", color: "text-rose-500" },
  2: { label: "Fair", color: "text-orange-500" },
  3: { label: "Good", color: "text-yellow-500" },
  4: { label: "Very Good", color: "text-lime-500" },
  5: { label: "Excellent", color: "text-emerald-500" },
};

function StarPicker({
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
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              s <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/20",
            )}
          />
        </button>
      ))}
      {active > 0 && (
        <span
          className={`ml-1.5 text-sm font-semibold ${RATING_LABELS[active]?.color}`}
        >
          {RATING_LABELS[active]?.label}
        </span>
      )}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-6 w-6",
              s <= rounded
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/20",
            )}
          />
        ))}
      </div>
      <span className="text-lg font-bold text-amber-500 tabular-nums">
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
  onUpdated,
  onDeleted,
}: {
  open: boolean;
  booking: Booking;
  review: BookingReview;
  onClose: () => void;
  onUpdated?: (review: BookingReview) => void;
  onDeleted?: () => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [editRating, setEditRating] = useState(parseFloat(review.rating));
  const [editComment, setEditComment] = useState(review.comment ?? "");
  const [busy, setBusy] = useState(false);

  const tutorName = booking.tutorProfile.user?.name ?? "Tutor";
  const category = booking.tutorProfile.category?.name ?? "";
  const startDt = new Date(booking.slot.startTime);
  const endDt = new Date(booking.slot.endTime);
  const hours = differenceInHours(endDt, startDt);
  const rating = parseFloat(review.rating);
  const ratingMeta = RATING_LABELS[Math.round(rating)];

  const handleUpdate = async () => {
    if (editRating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setBusy(true);
    try {
      const updated = await reviewService.update(review.id, {
        rating: editRating,
        comment: editComment.trim() || undefined,
      });
      toast.success("Review updated!");
      onUpdated?.({
        ...review,
        rating: String(updated.rating),
        comment: updated.comment,
      });
      setMode("view");
    } catch {
      toast.error("Failed to update review.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await reviewService.remove(review.id);
      toast.success("Review deleted.");
      onDeleted?.();
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setMode("view");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden gap-0">
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-br from-amber-500 to-amber-400 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">
              {mode === "edit"
                ? "Edit Review"
                : mode === "confirm-delete"
                  ? "Delete Review"
                  : "Your Review"}
            </DialogTitle>
            <DialogDescription className="text-amber-100/80 text-xs mt-0.5">
              {mode === "view" &&
                `Submitted ${format(new Date(review.createdAt), "MMMM d, yyyy")}`}
              {mode === "edit" && "Update your rating and comment"}
              {mode === "confirm-delete" && "This action cannot be undone"}
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleClose}
            disabled={busy}
            className="absolute top-4 right-4 text-amber-100/70 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* ── Tutor card ── */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border/30">
              <AvatarImage
                src={booking.tutorProfile.user?.image ?? undefined}
              />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {tutorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{tutorName}</p>
              {category && (
                <Badge
                  variant="secondary"
                  className="mt-0.5 text-[10px] px-1.5 h-4"
                >
                  {category}
                </Badge>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-sm font-bold">
                ৳{booking.tutorProfile.hourlyRate}/hr
              </p>
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

          {/* ── VIEW mode ── */}
          {mode === "view" && (
            <>
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

              {review.comment ? (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Your Comment
                    </p>
                    <blockquote className="pl-4 border-l-2 border-amber-300 dark:border-amber-700">
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {review.comment}
                      </p>
                    </blockquote>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic text-center py-1">
                  No comment added.
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl gap-1.5 text-xs"
                  onClick={() => {
                    setEditRating(rating);
                    setEditComment(review.comment ?? "");
                    setMode("edit");
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl gap-1.5 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
                  onClick={() => setMode("confirm-delete")}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </>
          )}

          {/* ── EDIT mode ── */}
          {mode === "edit" && (
            <>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Rating
                </p>
                <StarPicker
                  value={editRating}
                  onChange={setEditRating}
                  disabled={busy}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Comment{" "}
                  <span className="normal-case font-normal text-muted-foreground/60">
                    (optional)
                  </span>
                </p>
                <Textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Update your comment..."
                  rows={3}
                  className="rounded-xl resize-none text-sm"
                  disabled={busy}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-sm"
                  onClick={() => setMode("view")}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl gap-2 text-sm"
                  onClick={handleUpdate}
                  disabled={busy || editRating === 0}
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </>
          )}

          {/* ── CONFIRM DELETE mode ── */}
          {mode === "confirm-delete" && (
            <>
              <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-4 py-3 text-center space-y-1">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                  Delete this review?
                </p>
                <p className="text-xs text-rose-600/70 dark:text-rose-500/70">
                  Your rating will be removed from this tutor&apos;s profile.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-sm"
                  onClick={() => setMode("view")}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl gap-2 text-sm"
                  onClick={handleDelete}
                  disabled={busy}
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Yes, Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
