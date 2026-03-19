"use client";

import { format, differenceInHours } from "date-fns";
import { CalendarDays, Clock, DollarSign, User, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AvailabilitySlot, TutorProfile } from "@/services/tutor.service";

interface BookingConfirmDialogProps {
  open: boolean;
  tutor: TutorProfile;
  slot: AvailabilitySlot;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  confirming: boolean;
}

export function BookingConfirmDialog({
  open,
  tutor,
  slot,
  onConfirm,
  onCancel,
  confirming,
}: BookingConfirmDialogProps) {
  const startDt = new Date(slot.startTime);
  const endDt = new Date(slot.endTime);
  const hours = differenceInHours(endDt, startDt);
  const total = tutor.hourlyRate * hours;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !confirming && onCancel()}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="bg-primary px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground text-lg font-bold">
              Confirm Booking
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/70 text-sm mt-0.5">
              Review your session details before confirming.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Tutor info */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/40">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={tutor.user.image ?? undefined} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {(tutor.user.name ?? "T").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {tutor.user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {tutor.category.name}
              </p>
            </div>
          </div>

          {/* Session details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  Date
                </p>
                <p className="text-sm font-semibold">
                  {format(startDt, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  Time
                </p>
                <p className="text-sm font-semibold tabular-nums">
                  {format(startDt, "h:mm a")} → {format(endDt, "h:mm a")}
                  <span className="text-xs font-normal text-muted-foreground ml-1.5">
                    ({hours}h session)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  Rate
                </p>
                <p className="text-sm font-semibold">৳{tutor.hourlyRate}/hr</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Estimated total
              </span>
            </div>
            <span className="text-base font-bold">৳{total}</span>
          </div>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            You won&apos;t be charged until the session is confirmed by the
            tutor.
          </p>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onCancel}
              disabled={confirming}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl gap-2"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {confirming ? "Booking…" : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
