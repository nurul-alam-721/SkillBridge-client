import { useState } from "react";
import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Review } from "@/services/tutor.service";
import { cn } from "@/lib/utils";
import { DataPagination } from "@/app/utils/DataPagination";

const PAGE_SIZE = 5;

function StarRating({ rating }: { rating: number }) {
  const val = parseFloat(String(rating));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.round(val) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          )}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-amber-500 tabular-nums">
        {val.toFixed(1)}
      </span>
    </div>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(1);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
          <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Be the first to leave a review after your session.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paginated  = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="space-y-1">
        {paginated.map((review, idx) => (
          <div
            key={review.id}
            className={cn(
              "group relative rounded-2xl p-4 transition-colors hover:bg-muted/40",
              idx !== paginated.length - 1 && "border-b border-border/40 pb-5 mb-1"
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-border/30">
                <AvatarImage src={review.student?.image ?? undefined} />
                <AvatarFallback className="text-xs font-bold bg-linear-to-br from-primary/20 to-primary/5 text-primary">
                  {(review.student?.name ?? "S").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {review.student?.name ?? "Student"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <StarRating rating={parseFloat(review.rating)} />
                </div>

                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataPagination
        page={page}
        totalPages={totalPages}
        onPage={(p) => { setPage(p); }}
      />
    </div>
  );
}