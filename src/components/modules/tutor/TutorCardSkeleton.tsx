import { Skeleton } from "@/components/ui/skeleton";

export function TutorCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden p-6 gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <Skeleton className="h-[52px] w-[52px] rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 py-3 px-3.5 rounded-2xl bg-muted/40 border border-border/30">
        <Skeleton className="h-3.5 w-16 rounded" />
        <div className="h-3 w-px bg-border/60" />
        <Skeleton className="h-3.5 w-20 rounded" />
        <div className="ml-auto">
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-28 rounded" />
        <Skeleton className="h-3.5 w-24 rounded" />
      </div>

    </div>
  );
}