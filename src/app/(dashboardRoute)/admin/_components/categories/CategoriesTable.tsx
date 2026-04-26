"use client";
import { Category } from "@/types";

import { useState } from "react";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Tag,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/layout/DataTablePagination";


// ── Sort Icon ─────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")
    return <ArrowUp className="h-3 w-3" />;
  if (direction === "desc")
    return <ArrowDown className="h-3 w-3" />;
  return (
    <ArrowUpDown className="h-3 w-3 opacity-40" />
  );
}

// ── Skeleton Rows ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
              <div className="h-3 w-52 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-12 bg-muted animate-pulse rounded-full" />
            <div className="h-3.5 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-16 bg-muted animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Column Builders ───────────────────────────────────────────────────────

function buildColumns(
  onEdit: (c: Category) => void,
  onDelete: (c: Category) => void,
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const colors = [
          "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
          "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
          "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
          "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
          "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
          "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        ];
        const idx =
          row.original.name
            .split("")
            .reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
        const colorClass = colors[idx];
        const initial = row.original.name[0]?.toUpperCase() ?? "?";

        return (
          <div className="flex items-center gap-3">
            <span
              className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}
            >
              {initial}
            </span>
            <span className="font-semibold text-sm tracking-tight text-foreground truncate">
              {row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground leading-relaxed line-clamp-1 max-w-xs">
          {row.original.description ?? (
            <span className="italic opacity-35">No description</span>
          )}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "tutors",
      accessorFn: (row) => row._count?.tutors ?? 0,
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Tutors <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const count = row.original._count?.tutors ?? 0;
        return (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span
              className={`text-sm font-semibold tabular-nums ${
                count === 0
                  ? "text-muted-foreground/40"
                  : "text-foreground"
              }`}
            >
              {count}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Created <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <time className="text-sm text-muted-foreground tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </time>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-accent"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}


// ── Main Table ────────────────────────────────────────────────────────────

export function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const columns = buildColumns(onEdit, onDelete);

  const table = useReactTable({
    data: categories,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span>
              <span className="font-semibold text-foreground">
                {categories.length}
              </span>{" "}
              categor{categories.length !== 1 ? "ies" : "y"}
            </span>
          </div>
          <div className="h-3.5 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              <span className="font-semibold text-foreground">
                {categories.reduce((a, c) => a + (c._count?.tutors ?? 0), 0)}
              </span>{" "}
              total tutors
            </span>
          </div>
        </div>
      )}

      {/* Table card */}
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
              {table.getRowModel().rows.length === 0 ? (
                 <tr>
                  <td colSpan={columns.length} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Tag className="h-8 w-8 text-muted-foreground/30" />
                       <p className="text-sm font-medium text-muted-foreground">No categories found</p>
                    </div>
                  </td>
                 </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DataTablePagination table={table} totalLabel="categories" />
    </div>
  );
}