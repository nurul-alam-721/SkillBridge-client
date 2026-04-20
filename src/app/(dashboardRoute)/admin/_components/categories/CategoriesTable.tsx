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
  ChevronLeft,
  ChevronRight,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


// ── Sort Icon ─────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")
    return <ArrowUp className="ml-1.5 h-3 w-3 shrink-0 text-foreground" />;
  if (direction === "desc")
    return <ArrowDown className="ml-1.5 h-3 w-3 shrink-0 text-foreground" />;
  return (
    <ArrowUpDown className="ml-1.5 h-3 w-3 shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" />
  );
}

// ── Skeleton Rows ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow
          key={i}
          className="border-border/40"
          style={{ opacity: 1 - i * 0.12 }}
        >
          <TableCell className="py-3.5 pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <Skeleton className="h-3.5 w-28 rounded-full" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-52 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-12 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-20 rounded-full" />
          </TableCell>
          <TableCell className="pr-6">
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
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
          className="group flex items-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        // Generate a deterministic pastel background from name
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
          <div className="flex items-center gap-3 pl-2">
            <span
              className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}
            >
              {initial}
            </span>
            <span className="font-semibold text-sm tracking-tight">
              {row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => (
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Description
        </span>
      ),
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
          className="group flex items-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Tutors
          <SortIcon direction={column.getIsSorted()} />
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
          className="group flex items-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Created
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <time className="text-xs text-muted-foreground/70 tabular-nums font-medium">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </time>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg opacity-0 group-hover/row:opacity-100 transition-all hover:bg-accent"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg opacity-0 group-hover/row:opacity-100 transition-all text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}

// ── Pagination Button ─────────────────────────────────────────────────────

function PageBtn({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-8 min-w-[2rem] px-2 rounded-lg text-xs font-medium transition-all
        ${
          active
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }
        disabled:opacity-30 disabled:pointer-events-none`}
    >
      {children}
    </button>
  );
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

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const getPageNumbers = () => {
    const delta = 2;
    const pages: (number | "…")[] = [];
    const rangeStart = Math.max(0, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    if (rangeStart > 0) {
      pages.push(0);
      if (rangeStart > 1) pages.push("…");
    }
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) {
      if (rangeEnd < totalPages - 2) pages.push("…");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {!loading && categories.length > 0 && (
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
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-border/50 hover:bg-transparent"
              >
                {hg.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className={`py-3 bg-muted/30 ${i === 0 ? "pl-6" : ""} ${
                      i === hg.headers.length - 1 ? "pr-6 text-right" : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={columns.length}
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        No categories yet
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        Create one to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group/row border-border/40 hover:bg-muted/25 transition-colors cursor-default"
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 ${i === 0 ? "pl-4" : ""} ${
                        i === row.getVisibleCells().length - 1 ? "pr-4" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground/60">
            Page {currentPage + 1} of {totalPages}
          </p>

          <div className="flex items-center gap-1">
            <PageBtn
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </PageBtn>

            {getPageNumbers().map((p, i) =>
              p === "…" ? (
                <span
                  key={`e-${i}`}
                  className="h-8 w-6 flex items-center justify-center text-xs text-muted-foreground/40 select-none"
                >
                  ···
                </span>
              ) : (
                <PageBtn
                  key={p}
                  active={p === currentPage}
                  onClick={() => table.setPageIndex(p as number)}
                >
                  {(p as number) + 1}
                </PageBtn>
              ),
            )}

            <PageBtn
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}