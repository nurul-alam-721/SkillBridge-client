"use client";

import { CalendarClock, Plus, Trash2, Clock, CalendarDays, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAvailability } from "@/hooks/UseAvailability";
import { AddSlotForm } from "@/components/modules/tutorsAvailability/addSlotForm";
import { AvailabilitySlot } from "@/services/tutor.service";

function formatTime(value: string): string {
  if (value.includes("T")) {
    return new Date(value).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  const [h, m] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function SlotCard({ slot, onDelete }: { slot: AvailabilitySlot; onDelete: (id: string) => Promise<void> }) {
  const date = new Date(slot.date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum  = date.toLocaleDateString("en-US", { day: "numeric" });
  const month   = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-border/80 transition-colors">
      {/* Date bubble */}
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/8 ring-1 ring-primary/15">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{dayName}</span>
        <span className="text-base font-bold leading-none text-foreground">{dayNum}</span>
        <span className="text-[9px] text-muted-foreground">{month}</span>
      </div>

      {/* Time + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {slot.isBooked ? (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
              Booked
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Available
            </Badge>
          )}
          {slot.totalBookings > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {slot.totalBookings}/{slot.maxCapacity} booked
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slot?</AlertDialogTitle>
            <AlertDialogDescription>
              {slot.isBooked
                ? "This slot has an active booking. You must cancel the booking before deleting the slot."
                : `This will permanently remove the ${dayName} ${dayNum} ${month} slot (${formatTime(slot.startTime)} — ${formatTime(slot.endTime)}). This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {slot.isBooked && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3.5 py-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Cancel the student&apos;s booking first, then you can delete this slot.</span>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Keep slot</AlertDialogCancel>
            <AlertDialogAction
              disabled={slot.isBooked}
              onClick={() => onDelete(slot.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete slot
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AvailabilityPage() {
  const { slots, loading, saving, addSlot, removeSlot } = useAvailability();

  const upcoming = slots.filter((s) => new Date(s.date) >= new Date());
  const past     = slots.filter((s) => new Date(s.date) < new Date());

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <CalendarClock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Manage Availability</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add time slots when you&apos;re available to tutor students
            </p>
          </div>
        </div>
        <Separator className="mt-4" />
      </div>

      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Add slot form */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-border/60 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Add New Slot</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Set a date and time window</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <AddSlotForm saving={saving} onAdd={addSlot} />
              </CardContent>
            </Card>
          </div>

          {/* Slots list */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Upcoming */}
            <Card className="rounded-2xl border-border/60 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">Upcoming Slots</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {upcoming.length}
                  </Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {loading ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading slots…</span>
                  </div>
                ) : upcoming.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-3">
                      <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No upcoming slots</p>
                    <p className="text-xs text-muted-foreground mt-1">Add a slot using the form to get started.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {upcoming.map((slot) => (
                      <SlotCard key={slot.id} slot={slot} onDelete={removeSlot} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past slots — collapsed by default */}
            {past.length > 0 && (
              <Card className="rounded-2xl border-border/60 shadow-none opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold text-muted-foreground">Past Slots</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs tabular-nums text-muted-foreground">
                      {past.length}
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-2.5">
                    {past.slice(0, 3).map((slot) => (
                      <SlotCard key={slot.id} slot={slot} onDelete={removeSlot} />
                    ))}
                    {past.length > 3 && (
                      <p className="text-xs text-center text-muted-foreground pt-1">
                        +{past.length - 3} more past slots
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}