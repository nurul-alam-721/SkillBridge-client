import { format } from "date-fns";
import { CalendarDays, Clock, CheckCircle2, CalendarX } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { AvailabilitySlot } from "@/services/tutor.service";
import { cn } from "@/lib/utils";

interface AvailabilitySlotsProps {
  slots:           AvailabilitySlot[];
  selectedSlotId:  string | null;
  myBookedSlotIds?: Set<string>;
  onSelect:        (slot: AvailabilitySlot) => void;
}

function groupByDate(slots: AvailabilitySlot[]) {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const day = new Date(slot.startTime).toISOString().split("T")[0] ?? "";
    (acc[day] ??= []).push(slot);
    return acc;
  }, {});
}

export function AvailabilitySlots({
  slots,
  selectedSlotId,
  myBookedSlotIds = new Set(),
  onSelect,
}: AvailabilitySlotsProps) {
  const available = slots.filter((s) => {
    const isFull = (s.totalBookings ?? 0) >= (s.maxCapacity ?? 50);
    return !isFull || myBookedSlotIds.has(s.id);
  });

  if (available.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
          <CalendarX className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-semibold">No available slots</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check back later — new slots may open up soon.
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupByDate(available);

  return (
    <div className="space-y-6">
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, daySlots]) => (
          <div key={day}>
            {/* Date header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm font-semibold">
                {format(new Date(day + "T00:00:00"), "EEEE, MMM d, yyyy")}
              </p>
              <Badge
                variant="secondary"
                className="ml-auto text-[10px] px-1.5 h-4 font-medium"
              >
                {daySlots.length}
              </Badge>
            </div>

            <ToggleGroup
              type="single"
              value={selectedSlotId ?? ""}
              onValueChange={(val) => {
                const slot = daySlots.find((s) => s.id === val);
                if (slot && !myBookedSlotIds.has(slot.id)) onSelect(slot);
              }}
              className="flex flex-wrap gap-2 justify-start"
            >
              {[...daySlots]
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map((slot) => {
                  const alreadyBooked = myBookedSlotIds.has(slot.id);
                  const isSelected    = selectedSlotId === slot.id;
                  const capacity      = slot.maxCapacity   ?? 50;
                  const booked        = slot.totalBookings ?? 0;
                  const remaining     = capacity - booked;
                  const almostFull    = remaining <= 5 && remaining > 0;

                  return (
                    <ToggleGroupItem
                      key={slot.id}
                      value={slot.id}
                      disabled={alreadyBooked}
                      className={cn(
                        "relative flex flex-col h-auto w-[88px] px-3 py-2.5 gap-1 rounded-xl border text-left transition-all duration-200",
                        !isSelected && !alreadyBooked &&
                          "border-border/60 bg-background hover:border-primary/40 hover:bg-primary/4 hover:shadow-sm",
                        isSelected && !alreadyBooked &&
                          "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]",
                        alreadyBooked &&
                          "border-amber-200/60 bg-amber-50/40 text-amber-700 cursor-not-allowed dark:border-amber-700/40 dark:bg-amber-900/10 dark:text-amber-400"
                      )}
                    >
                      {alreadyBooked && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 shadow-sm">
                          <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}

                      <Clock className={cn(
                        "h-3.5 w-3.5 mb-0.5 shrink-0",
                        isSelected && !alreadyBooked ? "opacity-80" : "opacity-40"
                      )} />
                      <span className="text-xs font-bold tabular-nums leading-none">
                        {format(new Date(slot.startTime), "h:mm a")}
                      </span>
                      <span className={cn(
                        "text-[11px] leading-none tabular-nums",
                        isSelected && !alreadyBooked ? "opacity-70" : "text-muted-foreground"
                      )}>
                        {format(new Date(slot.endTime), "h:mm a")}
                      </span>

                      {!alreadyBooked && (
                        <span className={cn(
                          "text-[9px] font-semibold mt-0.5 leading-none",
                          isSelected
                            ? "opacity-70"
                            : almostFull
                            ? "text-rose-500 dark:text-rose-400"
                            : "text-muted-foreground/60"
                        )}>
                          {remaining} left
                        </span>
                      )}

                      {alreadyBooked && (
                        <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider opacity-70">
                          Booked
                        </span>
                      )}
                    </ToggleGroupItem>
                  );
                })}
            </ToggleGroup>
          </div>
        ))}
    </div>
  );
}