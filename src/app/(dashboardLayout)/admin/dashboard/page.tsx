"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, BadgeDollarSign, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminClientService, AdminStats } from "@/services/admin.service";
import { PlatformStats } from "@/components/modules/adminDashboard/PlatformStats";
import { RecentActivity } from "@/components/modules/adminDashboard/RecentActivity";
import { Bookings } from "@/components/modules/adminDashboard/Bookings";
import { StatsCard } from "@/components/modules/adminDashboard/StatsCard";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    if (e.response?.data?.message) return e.response.data.message;
  }
  return "Failed to load stats. Please try again.";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await adminClientService.getStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform overview and recent activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
          onClick={() => load(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          sub={`${stats?.totalStudents ?? 0} students · ${stats?.totalTutors ?? 0} tutors`}
          icon={Users}
          iconCls="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          loading={loading}
        />
        <StatsCard
          label="Total Bookings"
          value={stats?.totalBookings ?? 0}
          sub={`${stats?.pendingBookings ?? 0} pending right now`}
          icon={BookOpen}
          iconCls="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
          loading={loading}
        />
        <StatsCard
          label="Revenue (BDT)"
          value={stats ? `৳${stats.totalRevenue.toLocaleString()}` : "৳0"}
          sub="From completed sessions"
          icon={BadgeDollarSign}
          iconCls="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          loading={loading}
        />
        <StatsCard
          label="Categories"
          value={stats?.totalCategories ?? 0}
          sub="Subject categories"
          icon={Tag}
          iconCls="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Bookings stats={stats} loading={loading} />
        <PlatformStats stats={stats} loading={loading} />
      </div>

      {/* Recent activity */}
      <RecentActivity
        bookings={stats?.recentActivity ?? []}
        loading={loading}
      />
    </div>
  );
}
