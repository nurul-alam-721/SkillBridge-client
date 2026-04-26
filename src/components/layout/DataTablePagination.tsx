"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalLabel?: string;
  totalCount?: number;
}

export function DataTablePagination<TData>({
  table,
  totalLabel = "items",
  totalCount,
}: DataTablePaginationProps<TData>) {
  const current = table.getState().pagination.pageIndex;
  const total = table.getPageCount();
  const count = totalCount ?? table.getFilteredRowModel().rows.length;

  if (total <= 1) return null;

  /* build page buttons */
  const delta = 2;
  const pages: (number | "…")[] = [];
  const rangeStart = Math.max(0, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  if (rangeStart > 0) {
    pages.push(0);
    if (rangeStart > 1) pages.push("…");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) {
    if (rangeEnd < total - 2) pages.push("…");
    pages.push(total - 1);
  }

  return (
    <div className="flex items-center justify-between px-1 mt-4">
      <p className="text-xs text-muted-foreground">
        {count} {totalLabel}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-xl"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === current ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 rounded-xl text-xs"
              onClick={() => table.setPageIndex(p as number)}
            >
              {(p as number) + 1}
            </Button>
          )
        )}

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
  );
}
