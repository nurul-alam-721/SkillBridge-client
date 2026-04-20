import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconCls: string;
  loading: boolean;
}

export function StatsCard({ label, value, sub, icon: Icon, iconCls, loading }: StatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconCls}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-3.5 w-36 rounded" />
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
      )}
    </div>
  );
}
