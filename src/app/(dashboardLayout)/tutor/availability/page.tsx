"use client";

import { CalendarClock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAvailability } from "@/hooks/UseAvailability";
import { AddSlotForm } from "@/components/modules/tutorsAvailability/addSlotForm";
import { SlotsList } from "@/components/modules/tutorsAvailability/slotList";


export default function AvailabilityPage() {
  const { slots, loading, saving, error, addSlot, removeSlot } = useAvailability();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

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
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

          <div className="lg:col-span-2">
            <AddSlotForm saving={saving} error={error} onAdd={addSlot} />
          </div>

          <div className="lg:col-span-3">
            <SlotsList slots={slots} loading={loading} onDelete={removeSlot} />
          </div>

        </div>
      </div>
    </div>
  );
}