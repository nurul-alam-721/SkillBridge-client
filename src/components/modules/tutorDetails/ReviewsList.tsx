import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Review } from "@/services/tutor.service";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rounded ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          )}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-amber-500 tabular-nums">
        {parseFloat(String(rating)).toFixed(1)}
      </span>
    </div>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Be the first to leave a review after your session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-3 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 ring-2 ring-border/40">
                <AvatarImage src={review.student?.image ?? undefined} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {(review.student?.name ?? "S").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {review.student?.name ?? "Student"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <StarRating rating={parseFloat(review.rating)} />
          </div>

          {review.comment && (
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
              `{review.comment}`
            </p>
          )}
        </div>
      ))}
    </div>
  );
}