import { AdminStats } from "@/types";
import { TrendingUp, GraduationCap, Users, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PlatformStats({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  const s = stats;
  const completionRate =
    s && s.totalBookings > 0
      ? `${Math.round((s.completedBookings / s.totalBookings) * 100)}%`
      : "—";

  const rows = [
    {
      label: "Students",
      desc: "Registered learners",
      value: s?.totalStudents ?? 0,
      Icon: GraduationCap,
      cls: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    },
    {
      label: "Tutors",
      desc: "Verified educators",
      value: s?.totalTutors ?? 0,
      Icon: Users,
      cls: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    },
    {
      label: "Completion Rate",
      desc: "Completed / total bookings",
      value: completionRate,
      Icon: CheckCircle2,
      cls: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Platform Stats</h2>
      </div>

      <div className="divide-y divide-border/50">
        {rows.map(({ label, desc, value, Icon, cls }) => (
          <div key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${cls}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            {loading
              ? <Skeleton className="h-7 w-14 rounded" />
              : <p className="text-xl font-bold tabular-nums">{value}</p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
