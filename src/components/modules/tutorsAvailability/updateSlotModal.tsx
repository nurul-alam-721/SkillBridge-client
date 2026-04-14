"use client";

import { useState, useEffect } from "react";
import { Loader2, CalendarClock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AvailabilitySlot, CreateAvailabilityPayload } from "@/services/tutor.service";
import { TIME_PRESETS, getValidationError } from "./availabilityUtils";

interface UpdateSlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: AvailabilitySlot | null;
  saving: boolean;
  onUpdate: (slotId: string, payload: Partial<CreateAvailabilityPayload & { maxCapacity: number }>) => Promise<boolean>;
}

export function UpdateSlotModal({
  open,
  onOpenChange,
  slot,
  saving,
  onUpdate,
}: UpdateSlotModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(1);

  useEffect(() => {
    if (slot && open) {
      setDate(new Date(slot.date).toISOString().split("T")[0]!);
      
      const formatValue = (iso: string) => {
          const d = new Date(iso);
          return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      };

      setStartTime(formatValue(slot.startTime));
      setEndTime(formatValue(slot.endTime));
      setMaxCapacity(slot.maxCapacity ?? 1);
    }
  }, [slot, open]);

  const today = new Date().toISOString().split("T")[0]!;
  const clientError = getValidationError(date, startTime, endTime);
  const isValid = date && startTime && endTime && !clientError;

  const applyPreset = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleUpdate = async () => {
    if (!slot || !isValid) return;
    const ok = await onUpdate(slot.id, { date, startTime, endTime, maxCapacity });
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <CalendarClock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Update Slot</DialogTitle>
              <DialogDescription className="text-xs">
                Modify your availability period or capacity.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Available between 09:00 AM – 04:00 PM.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Date</Label>
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Quick Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {TIME_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.start, p.end)}
                  className={`rounded-lg border px-2 py-1 text-[10px] font-medium transition-colors hover:border-primary hover:text-primary 
                    ${startTime === p.start && endTime === p.end ? "border-primary bg-primary/5 text-primary" : "text-muted-foreground"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Max Capacity (Students)</Label>
            <Input
              type="number"
              min={1}
              value={maxCapacity || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setMaxCapacity(isNaN(val) ? 0 : val);
              }}
              className="h-10 rounded-xl"
            />
          </div>

          {clientError && (
            <p className="text-xs text-destructive font-medium px-1 italic">
              * {clientError}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl flex-1">
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!isValid || saving} className="rounded-xl flex-1">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
