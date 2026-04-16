"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/services/category.service";


function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUp    className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc") return <ArrowDown  className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-40" />;
}


function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-3.5 w-32 rounded" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-48 rounded" /></TableCell>
          <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-24 rounded" /></TableCell>
          <TableCell><div className="flex gap-2"><Skeleton className="h-8 w-8 rounded-xl" /><Skeleton className="h-8 w-8 rounded-xl" /></div></TableCell>
        </TableRow>
      ))}
    </>
  );
}


function buildColumns(
  onEdit:   (c: Category) => void,
  onDelete: (c: Category) => void,
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: () => <span className="text-xs font-semibold uppercase tracking-wide">Description</span>,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.description ?? <span className="italic opacity-50">No description</span>}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "tutors",
      accessorFn: (row) => row._count.tutors,
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tutors <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-muted text-muted-foreground ring-1 ring-border">
          {row.original._count.tutors}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-xs font-semibold uppercase tracking-wide">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-xl"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}

// ── Table ─────────────────────────────────────────────────────────────────

export function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onEdit:   (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);

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
                  No categories yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
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

      {/* Google-style pagination */}
      {!loading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-8 w-8 rounded-xl"
              onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {(() => {
              const current = table.getState().pagination.pageIndex;
              const total   = table.getPageCount();
              const delta   = 2;
              const pages: (number | "…")[] = [];
              const rangeStart = Math.max(0, current - delta);
              const rangeEnd   = Math.min(total - 1, current + delta);
              if (rangeStart > 0) { pages.push(0); if (rangeStart > 1) pages.push("…"); }
              for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
              if (rangeEnd < total - 1) { if (rangeEnd < total - 2) pages.push("…"); pages.push(total - 1); }
              return pages.map((p, i) =>
                p === "…" ? (
                  <span key={`e-${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none">…</span>
                ) : (
                  <Button key={p} variant={p === current ? "default" : "outline"} size="icon"
                    className="h-8 w-8 rounded-xl text-xs" onClick={() => table.setPageIndex(p)}>
                    {(p as number) + 1}
                  </Button>
                )
              );
            })()}

            <Button
              variant="outline" size="icon" className="h-8 w-8 rounded-xl"
              onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}