

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { Payment, PaymentStatus } from "@/types/payment-history.types";
import { buildPaymentColumns, PaymentTableSkeleton } from "./PaymentHistory-components";

export function PaymentTable({
  payments,
  loading,
  activeFilter,
  onResetFilter,
  sorting,
  onSortingChange,
  onView,
}: {
  payments: Payment[];
  loading: boolean;
  activeFilter: PaymentStatus | "ALL";
  onResetFilter: () => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onView: (bookingId: string) => void;
}) {
  const columns = buildPaymentColumns(onView);

  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages  = table.getPageCount();
  const delta = 2;
  const pages: (number | "…")[] = [];
  const rangeStart = Math.max(0, currentPage - delta);
  const rangeEnd   = Math.min(totalPages - 1, currentPage + delta);
  if (rangeStart > 0) { pages.push(0); if (rangeStart > 1) pages.push("…"); }
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < totalPages - 1) { if (rangeEnd < totalPages - 2) pages.push("…"); pages.push(totalPages - 1); }

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
              <PaymentTableSkeleton />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Receipt className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">No payments found</p>
                    {activeFilter !== "ALL" && (
                      <button
                        onClick={onResetFilter}
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    row.original.status === "PENDING"
                      ? "bg-amber-50/30 dark:bg-amber-900/5"
                      : row.original.status === "REFUNDED"
                        ? "bg-violet-50/20 dark:bg-violet-900/5"
                        : row.original.booking.status === "CANCELLED"
                          ? "opacity-55"
                          : undefined
                  }
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

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {payments.length} payment
            {payments.length !== 1 ? "s" : ""}
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
                  key={`ellipsis-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground select-none"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
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
      )}
    </div>
  );
}