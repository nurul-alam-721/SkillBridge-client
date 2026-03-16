"use client";

import { useState } from "react";
import { Plus, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateAvailabilityPayload } from "@/services/tutor.service";

interface AddSlotFormProps {
  saving: boolean;
  error: string | null;
  onAdd: (payload: CreateAvailabilityPayload) => Promise<boolean>;
}

const TIME_PRESETS = [
  { label: "9–10 AM",  start: "09:00", end: "10:00" },
  { label: "10–11 AM", start: "10:00", end: "11:00" },
  { label: "11–12 PM", start: "11:00", end: "12:00" },
  { label: "12–1 PM",  start: "12:00", end: "13:00" },
  { label: "1–2 PM",   start: "13:00", end: "14:00" },
  { label: "2–3 PM",   start: "14:00", end: "15:00" },
  { label: "3–4 PM",   start: "15:00", end: "16:00" },
];

function getValidationError(date: string, start: string, end: string): string | null {
  if (!date || !start || !end) return null;

  const now = new Date();
  const startDt = new Date(`${date}T${start}`);
  const endDt   = new Date(`${date}T${end}`);

  if (startDt <= now)
    return "Start time must be in the future.";
  if (endDt <= startDt)
    return "End time must be after start time.";

  const hours = (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60);
  if (hours < 1)
    return "Slot must be at least 1 hour.";

  const [startH] = start.split(":").map(Number);
  const [endH]   = end.split(":").map(Number);
  if ((startH as number) < 9 || (endH as number) > 16)
    return "Slots must be between 09:00 and 16:00.";

  return null;
}

export function AddSlotForm({ saving, error, onAdd }: AddSlotFormProps) {
  const today = new Date().toISOString().split("T")[0] as string;

  const [date,      setDate]      = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime,   setEndTime]   = useState("");

  const clientError = getValidationError(date, startTime, endTime);
  const isValid     = date && startTime && endTime && !clientError;

  const applyPreset = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    const ok = await onAdd({ date, startTime, endTime });
    if (ok) {
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Add Slot</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              09:00 – 16:00 · minimum 1 hour
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Backend error */}
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Working hours notice */}
        <div className="flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Slots must be between <strong>09:00</strong> and <strong>16:00</strong>, at least <strong>1 hour</strong> long, and in the future.
          </p>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Date</Label>
          <Input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 rounded-xl text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Select Time Period</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {TIME_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.start, p.end)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium text-left transition-colors hover:border-primary hover:text-primary hover:bg-primary/5
                  ${startTime === p.start && endTime === p.end
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual time inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Start</Label>
            <Input
              type="time"
              min="09:00"
              max="15:00"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-9 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">End</Label>
            <Input
              type="time"
              min="10:00"
              max="16:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-9 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Client-side validation error */}
        {clientError && (
          <p className="text-xs text-destructive">{clientError}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className="w-full rounded-xl h-9 text-sm font-medium gap-2"
        >
          {saving
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding...</>
            : <><Plus className="h-3.5 w-3.5" /> Add Slot</>
          }
        </Button>
      </CardContent>
    </Card>
  );
}