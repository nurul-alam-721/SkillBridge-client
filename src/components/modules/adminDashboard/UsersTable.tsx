"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ShieldBan, ShieldCheck, Loader2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUser, UserRole, UserStatus } from "@/services/admin.service";

// ── Role badge ────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; cls: string }> = {
  STUDENT: { label: "Student", cls: "text-violet-600 bg-violet-50 ring-1 ring-violet-200 dark:text-violet-400 dark:bg-violet-900/30 dark:ring-violet-800" },
  TUTOR:   { label: "Tutor",   cls: "text-sky-600 bg-sky-50 ring-1 ring-sky-200 dark:text-sky-400 dark:bg-sky-900/30 dark:ring-sky-800" },
  ADMIN:   { label: "Admin",   cls: "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800" },
};

function RoleBadge({ role }: { role: UserRole }) {
  const { label, cls } = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
  const active = status === "ACTIVE";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
      active
        ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:ring-emerald-800"
        : "text-rose-600 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:ring-rose-800"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
      {active ? "Active" : "Banned"}
    </span>
  );
}

// ── Sort icon ─────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp   className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc") return <ArrowDown  className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-40" />;
}

// ── Toggle button ─────────────────────────────────────────────────────────

function ToggleButton({
  user,
  onToggle,
}: {
  user: AdminUser;
  onToggle: (id: string, currentStatus: UserStatus) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const active = user.status === "ACTIVE";

  if (user.role === "ADMIN") return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 rounded-xl gap-1.5 text-xs ${
        active
          ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
      }`}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await onToggle(user.id, user.status);
        setBusy(false);
      }}
    >
      {busy
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : active
          ? <><ShieldBan    className="h-3.5 w-3.5" /> Ban</>
          : <><ShieldCheck  className="h-3.5 w-3.5" /> Unban</>
      }
    </Button>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-24 rounded" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20 rounded-xl" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Column definitions ────────────────────────────────────────────────────

function buildColumns(
  onToggle: (id: string, currentStatus: UserStatus) => Promise<void>
): ColumnDef<AdminUser>[] {
  return [
    {
      id: "user",
      accessorFn: (row) => row.name ?? "",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={u.image ?? undefined} />
              <AvatarFallback className={`text-xs font-bold ${
                u.role === "STUDENT" ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                : u.role === "TUTOR" ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                :                      "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
              }`}>
                {(u.name ?? "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate leading-snug">{u.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{u.email ?? "—"}</p>
              {u.phone && <p className="text-xs text-muted-foreground truncate">{u.phone}</p>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "action",
      header: () => <span className="text-xs font-semibold uppercase tracking-wide">Action</span>,
      cell: ({ row }) => <ToggleButton user={row.original} onToggle={onToggle} />,
      enableSorting: false,
    },
  ];
}

// ── Table ─────────────────────────────────────────────────────────────────

export function UsersTable({
  users,
  loading,
  onToggle,
}: {
  users: AdminUser[];
  loading: boolean;
  onToggle: (id: string, currentStatus: UserStatus) => Promise<void>;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = buildColumns(onToggle);

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40 hover:bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.original.status === "BANNED" ? "bg-rose-50/30 dark:bg-rose-900/5" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          {/* Result count */}
          <p className="text-xs text-muted-foreground">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page number buttons */}
            {(() => {
              const current    = table.getState().pagination.pageIndex;
              const total      = table.getPageCount();
              const delta      = 2; 
              const pages: (number | "…")[] = [];

              // Build raw range around current
              const rangeStart = Math.max(0, current - delta);
              const rangeEnd   = Math.min(total - 1, current + delta);

              if (rangeStart > 0) {
                pages.push(0);
                if (rangeStart > 1) pages.push("…");
              }
              for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
              if (rangeEnd < total - 1) {
                if (rangeEnd < total - 2) pages.push("…");
                pages.push(total - 1);
              }

              return pages.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === current ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 rounded-xl text-xs"
                    onClick={() => table.setPageIndex(p)}
                  >
                    {p + 1}
                  </Button>
                )
              );
            })()}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}