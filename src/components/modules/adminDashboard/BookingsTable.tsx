import { format } from "date-fns";
import { Hourglass, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBooking, BookingStatus } from "@/services/admin.service";

const STATUS_CONFIG: Record<BookingStatus, { label: string; Icon: React.ElementType; cls: string }> = {
  PENDING:   { label: "Pending",   Icon: Hourglass,   cls: "text-amber-600 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:ring-amber-800" },
  CONFIRMED: { label: "Confirmed", Icon: Clock,        cls: "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800" },
  COMPLETED: { label: "Completed", Icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800" },
  CANCELLED: { label: "Cancelled", Icon: XCircle,      cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800" },
};

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-border/40">
          <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Skeleton className="h-7 w-7 rounded-full" /><Skeleton className="h-3.5 w-28 rounded" /></div></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-24 rounded" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-20 rounded" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-28 rounded" /></td>
          <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-24 rounded" /></td>
        </tr>
      ))}
    </>
  );
}

export function BookingsTable({
  bookings,
  loading,
}: {
  bookings: AdminBooking[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Student</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tutor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Session</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Booked On</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton />
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Student */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={b.student.image ?? undefined} />
                        <AvatarFallback className="text-xs font-bold bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                          {(b.student.name ?? "S").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate leading-snug">{b.student.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.student.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tutor */}
                  <td className="px-4 py-3">
                    <p className="font-medium truncate">{b.tutorProfile.user.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.tutorProfile.user.email ?? "—"}</p>
                  </td>

                  {/* Subject + rate */}
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.tutorProfile.category.name}</p>
                    <p className="text-xs text-muted-foreground">৳{b.tutorProfile.hourlyRate}/hr</p>
                  </td>

                  {/* Session time */}
                  <td className="px-4 py-3 tabular-nums">
                    <p className="font-medium">{format(new Date(b.slot.startTime), "MMM d, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(b.slot.startTime), "h:mm a")} → {format(new Date(b.slot.endTime), "h:mm a")}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={b.status} />
                  </td>

                  {/* Booked on */}
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                    {format(new Date(b.createdAt), "MMM d, yyyy")}
                    <br />
                    {format(new Date(b.createdAt), "h:mm a")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}