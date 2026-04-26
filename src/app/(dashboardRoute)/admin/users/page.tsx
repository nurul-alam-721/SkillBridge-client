"use client";
import { AdminUser, UserRole, UserStatus } from "@/types";

import { useEffect, useState, useMemo, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { SearchX } from "lucide-react";
import { UsersTable } from "../_components/users/UsersTable";
import { UsersFilter } from "../_components/users/UsersFilter";


function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    if (e.response?.data?.message) return e.response.data.message;
  }
  return "Something went wrong. Please try again.";
}


 export function UserTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
              <div className="h-3 w-36 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-14 bg-muted animate-pulse rounded-full" />
            <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}


export function UserEmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 gap-3">
      <SearchX className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">No users found</p>
      <p className="text-xs text-muted-foreground">
        No users match your current filters.
      </p>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users,      setUsers]      = useState<AdminUser[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [role,   setRole]   = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setUsers(await adminService.getAllUsers());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = useCallback(async (id: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
    try {
      await adminService.updateUserStatus(id, newStatus);
      toast.success(newStatus === "BANNED" ? "User banned successfully!" : "User unbanned successfully!");
    } catch (err) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: currentStatus } : u));
      toast.error(getErrorMessage(err));
    }
  }, []);

  const filtered = useMemo(() => users.filter((u) => {
    if (role   !== "ALL" && u.role   !== role)   return false;
    if (status !== "ALL" && u.status !== status) return false;
    const q = search.toLowerCase();
    if (q && !u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    return true;
  }), [users, role, status, search]);

  return (
    <div className="space-y-5 px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage students, tutors and admins
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
          onClick={() => load(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <UsersFilter
        search={search}   onSearchChange={setSearch}
        role={role}       onRoleChange={setRole}
        status={status}   onStatusChange={setStatus}
        total={users.length}
        filtered={filtered.length}
      />

      <UsersTable
        users={filtered}
        loading={loading}
        onToggle={handleToggle}
      />
    </div>
  );
}