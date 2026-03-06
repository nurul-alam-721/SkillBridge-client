import { format } from "date-fns";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { AvailabilitySlot } from "@/services/tutor.service";
import { cn } from "@/lib/utils";

interface AvailabilitySlotsProps {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  myBookedSlotIds?: Set<string>;  
  onSelect: (slot: AvailabilitySlot) => void;
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
  const available = slots.filter((s) => !s.isBooked);

  if (available.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No available slots at the moment.
      </p>
    );
  }

  const grouped = groupByDate(available);

  return (
    <div className="space-y-5">
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, daySlots]) => (
          <div key={day}>
            {/* Date header */}
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium">
                {format(new Date(day), "EEEE, MMM d, yyyy")}
              </p>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
                {daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}
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
              {daySlots
                .sort((a, b) =>
                  new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                )
                .map((slot) => {
                  const alreadyBooked = myBookedSlotIds.has(slot.id);
                  const isSelected   = selectedSlotId === slot.id;

                  return (
                    <ToggleGroupItem
                      key={slot.id}
                      value={slot.id}
                      disabled={alreadyBooked}
                      className={cn(
                        "relative flex flex-col h-auto px-4 py-3 gap-1 rounded-xl border transition-colors",
                        isSelected && !alreadyBooked &&
                          "border-primary bg-primary text-primary-foreground",
                        alreadyBooked &&
                          "border-amber-300 bg-amber-50 text-amber-700 opacity-80 cursor-not-allowed dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                        !isSelected && !alreadyBooked &&
                          "hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      {alreadyBooked && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
                          <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}

                      <Clock className="h-3.5 w-3.5 opacity-70" />
                      <span className="text-xs font-medium">
                        {format(new Date(slot.startTime), "h:mm a")}
                      </span>
                      <span className="text-xs opacity-70">
                        {format(new Date(slot.endTime), "h:mm a")}
                      </span>

                      {alreadyBooked && (
                        <span className="text-[10px] font-semibold mt-0.5">Booked</span>
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