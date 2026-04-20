"use client";
import { AvailabilitySlot } from "@/types";

import { useState } from "react";
import { format, isToday, isFuture, isPast } from "date-fns";
import { Trash2, Clock, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

interface SlotsListProps {
  slots: AvailabilitySlot[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function groupByDate(slots: AvailabilitySlot[]): Record<string, AvailabilitySlot[]> {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const dateKey = new Date(slot.startTime).toISOString().split("T")[0] ?? "";
    (acc[dateKey] ??= []).push(slot);
    return acc;
  }, {});
}

function SlotRow({ slot, onDelete }: { slot: AvailabilitySlot; onDelete: (id: string) => void }) {
  const [confirm, setConfirm] = useState(false);

  const startDt    = new Date(slot.startTime);
  const endDt      = new Date(slot.endTime);
  const isPastSlot = isPast(endDt);

  const timeRange  = `${format(startDt, "hh:mm a")} – ${format(endDt, "hh:mm a")}`;
  const dateLabel  = format(startDt, "MMM d, yyyy");

  return (
    <>
      <div className={cn(
        "flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl transition-colors",
        isPastSlot ? "opacity-50" : "hover:bg-muted/50"
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium tabular-nums">{timeRange}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {slot.isBooked ? (
            <Badge className="gap-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0">
              <CheckCircle2 className="h-3 w-3" /> Booked
            </Badge>
          ) : isPastSlot ? (
            <Badge variant="secondary" className="gap-1 text-xs border-0">
              <XCircle className="h-3 w-3" /> Expired
            </Badge>
          ) : (
            <Badge className="gap-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0">
              <CheckCircle2 className="h-3 w-3" /> Available
            </Badge>
          )}

          {!slot.isBooked && !isPastSlot && (
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirm(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slot?</AlertDialogTitle>
            <AlertDialogDescription>
              {dateLabel} · {timeRange}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { setConfirm(false); onDelete(slot.id); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function SlotsList({ slots, loading, onDelete }: SlotsListProps) {
  const sorted  = [...slots].sort((a, b) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  const grouped = groupByDate(sorted);
  const dates   = Object.keys(grouped).sort();

  const upcomingCount = slots.filter(
    (s) => !s.isBooked && isFuture(new Date(s.startTime))
  ).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Your Slots</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {loading ? "Loading..." : `${slots.length} total · ${upcomingCount} upcoming`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium">No slots added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first availability slot using the form
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dates.map((date, di) => {
              const dateSlots = grouped[date]!;
              const dateObj   = new Date(date);
              const isDateToday = isToday(dateObj);
              const isDatePast  = isPast(dateObj);

              return (
                <div key={date}>
                  {di > 0 && <Separator className="mb-4" />}

                  {/* Date header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <p className={cn(
                      "text-xs font-semibold",
                      isDateToday ? "text-primary" : isDatePast ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {isDateToday ? "Today" : format(dateObj, "EEEE, MMM d, yyyy")}
                    </p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
                      {dateSlots.length} slot{dateSlots.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Rows */}
                  <div className="space-y-0.5">
                    {dateSlots.map((slot) => (
                      <SlotRow key={slot.id} slot={slot} onDelete={onDelete} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}