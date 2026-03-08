import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStats } from "@/services/admin.service";

function BookingBar({
  label, value, total, barCls, loading,
}: {
  label: string;
  value: number;
  total: number;
  barCls: string;
  loading: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-18 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        {loading
          ? <Skeleton className="h-full w-full rounded-full" />
          : <div className={`h-full rounded-full ${barCls} transition-all duration-700`} style={{ width: `${pct}%` }} />
        }
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums">
        {loading ? <Skeleton className="h-3.5 w-6 rounded ml-auto" /> : value}
      </span>
    </div>
  );
}

export function Bookings({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  const s = stats;
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Booking Breakdown</h2>
        {!loading && s && (
          <span className="ml-auto text-xs text-muted-foreground">{s.totalBookings} total</span>
        )}
      </div>
      <div className="space-y-3">
        <BookingBar label="Pending"   value={s?.pendingBookings   ?? 0} total={s?.totalBookings ?? 1} barCls="bg-amber-400"   loading={loading} />
        <BookingBar label="Confirmed" value={s?.confirmedBookings ?? 0} total={s?.totalBookings ?? 1} barCls="bg-sky-400"     loading={loading} />
        <BookingBar label="Completed" value={s?.completedBookings ?? 0} total={s?.totalBookings ?? 1} barCls="bg-emerald-500" loading={loading} />
        <BookingBar label="Cancelled" value={s?.cancelledBookings ?? 0} total={s?.totalBookings ?? 1} barCls="bg-rose-400"    loading={loading} />
      </div>
    </div>
  );
}