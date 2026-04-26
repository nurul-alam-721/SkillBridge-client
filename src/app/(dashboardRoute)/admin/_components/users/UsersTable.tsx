"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldBan, ShieldCheck, SearchX } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import { UserAvatarCell } from "./UserAvaterCell";
import { AdminUser, UserStatus, UserRole } from "@/types";
import { UserToggleButton } from "./UserToggleButton";
import { DataTablePagination } from "@/components/layout/DataTablePagination";

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ArrowUp className="h-3 w-3" />;
  if (direction === "desc") return <ArrowDown className="h-3 w-3" />;
  return <ArrowUpDown className="h-3 w-3 opacity-40" />;
}

interface Props {
  users: AdminUser[];
  loading: boolean;
  onToggle: (id: string, currentStatus: UserStatus) => Promise<void>;
}

const ROLE_CONFIG: Record<UserRole, { label: string; cls: string }> = {
  STUDENT: { label: "Student", cls: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  TUTOR: { label: "Tutor", cls: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  ADMIN: { label: "Admin", cls: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const { label, cls } = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
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

export function StatusBadge({ status }: { status: UserStatus }) {
  const active = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${active
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          : "bg-red-500/10 text-red-600 border-red-500/20"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {active ? "Active" : "Banned"}
    </span>
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

export function UsersTable({ users, loading, onToggle }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<AdminUser>[] = [
    {
      id: "user",
      accessorFn: (row) => row.name ?? "",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <UserAvatarCell
          name={row.original.name}
          email={row.original.email}
          image={row.original.image}
          role={row.original.role}
        />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
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
          className="flex items-center gap-1 hover:text-foreground transition-colors"
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
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="tabular-nums">
          <p className="text-sm text-foreground">
            {format(new Date(row.original.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <UserToggleButton user={row.original} onToggle={onToggle} />
      ),
    },
  ];

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

  if (loading) return <UserTableSkeleton />;
  if (users.length === 0) return <UserEmptyState />;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border bg-muted/40">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${row.original.status === "BANNED" ? "bg-rose-50/30 dark:bg-rose-900/5" : ""
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DataTablePagination table={table} totalLabel="users" />
    </div>
  );
}