import { RecentBooking } from "@/types";
import { format } from "date-fns";
import {
  BookOpen,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    Icon: Hourglass,
    cls: "text-amber-600 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    Icon: Clock,
    cls: "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800",
  },
  COMPLETED: {
    label: "Completed",
    Icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled",
    Icon: XCircle,
    cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800",
  },
} as const;

function ActivityRow({ booking }: { booking: RecentBooking }) {
  const cfg = STATUS_CONFIG[booking.status];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={booking.student.image ?? undefined} />
        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
          {(booking.student.name ?? "S").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-snug">
          {booking.student.name ?? "Unknown Student"}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground truncate mt-0.5">
          <span>→</span>
          <Avatar className="h-4 w-4 shrink-0 border border-border">
            <AvatarImage src={booking.tutorProfile.user.image ?? undefined} />
            <AvatarFallback className="text-[8px] font-bold">
              {(booking.tutorProfile.user.name ?? "T").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">
            {booking.tutorProfile.user.name} &middot;{" "}
            {booking.tutorProfile.category.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}
        >
          <cfg.Icon className="h-2.5 w-2.5" />
          {cfg.label}
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {format(new Date(booking.createdAt), "MMM d, h:mm a")}
        </span>
      </div>
    </div>
  );
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-32 rounded" />
        <Skeleton className="h-3 w-44 rounded" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export function RecentActivity({
  bookings,
  loading,
}: {
  bookings: RecentBooking[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs">
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Recent Bookings</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs rounded-xl"
          asChild
        >
          <a href="/admin/bookings">
            View all <ArrowUpRight className="h-3 w-3" />
          </a>
        </Button>
      </div>

      <div className="px-5 pb-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ActivityRowSkeleton key={i} />
          ))
        ) : !bookings.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No bookings yet.
          </p>
        ) : (
          bookings.map((b) => <ActivityRow key={b.id} booking={b} />)
        )}
      </div>
    </div>
  );
}
