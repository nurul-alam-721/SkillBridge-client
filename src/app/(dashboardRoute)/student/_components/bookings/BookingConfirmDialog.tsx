"use client";
import { AvailabilitySlot, TutorProfile } from "@/types";

import { format, differenceInHours } from "date-fns";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
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
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm your booking
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Please review your session details. Confirmation will take you to payment.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-2 space-y-6">
          {/* Tutor Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={tutor.user.image ?? undefined} />
              <AvatarFallback className="font-semibold text-primary">
                {(tutor.user.name ?? "T").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{tutor.user.name}</p>
              <p className="text-sm text-muted-foreground">{tutor.category.name}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Date</p>
                  <p className="text-sm font-medium">{format(startDt, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Time</p>
                  <p className="text-sm font-medium">
                    {format(startDt, "h:mm a")} - {format(endDt, "h:mm a")} 
                    <span className="text-muted-foreground ml-1">({hours}h)</span>
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center whitespace-nowrap">
              <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
              <span className="text-lg font-bold">BDT {total}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
             Payment is required immediately after confirmation to secure this slot.
          </p>
        </div>

        <div className="px-6 py-4 bg-muted/30 flex justify-end gap-3 border-t">
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={onCancel}
            disabled={confirming}
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg min-w-[120px]"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Confirm & Pay"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
