"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Updater,
  useReactTable,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Payment, PaymentStatus } from "@/types";
import { format } from "date-fns";

interface Props {
  payments: Payment[];
  loading: boolean;
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
  activeFilter: PaymentStatus | "ALL";
  onResetFilter: () => void;
}

const STATUS_BADGE: Record<PaymentStatus, { label: string; className: string }> = {
  COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" },
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" },
  FAILED: { label: "Failed", className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400" },
  REFUNDED: { label: "Refunded", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400" },
};

export function EarningTable({ payments, loading, sorting, onSortingChange }: Props) {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.student?.image ?? undefined} />
            <AvatarFallback>{row.original.student?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{row.original.student?.name ?? "Unknown"}</span>
        </div>
      ),
    },
    {
      accessorKey: "booking.status",
      header: "Booking Status",
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.booking?.status?.toLowerCase() ?? "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ getValue }) => <span className="text-sm">{format(new Date(getValue<string>()), "MMM d, yyyy")}</span>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Total</div>,
      cell: ({ getValue }) => <div className="text-right text-sm font-medium">${(getValue<number>() ?? 0).toFixed(2)}</div>,
    },
    {
      accessorKey: "status",
      header: "Payment",
      cell: ({ getValue }) => {
        const { label, className } = STATUS_BADGE[getValue<PaymentStatus>()] ?? { label: "Unknown", className: "" };
        return <Badge variant="outline" className={`font-medium border px-2.5 py-0.5 rounded-full text-xs ${className}`}>{label}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>{hg.headers.map((h) => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}>{columns.map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}</TableRow>) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}