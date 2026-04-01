"use client";

import { useState, useEffect, useCallback } from "react";
import { tutorService, AvailabilitySlot, CreateAvailabilityPayload } from "@/services/tutor.service";
import { toast } from "sonner";

export function useAvailability() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tutorService.getMyAvailability();
      setSlots(data);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load availability."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addSlot = async (payload: CreateAvailabilityPayload): Promise<boolean> => {
    setSaving(true);
    try {
      const slot = await tutorService.createAvailabilitySlot(payload);
      setSlots((prev) => [...prev, slot]);
      toast.success("Availability slot added successfully");
      return true;
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add slot. Slot in this time period may already exist."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeSlot = async (slotId: string): Promise<void> => {
    try {
      await tutorService.deleteAvailabilitySlot(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      toast.success("Slot deleted successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Cannot delete slot. Cancel the booking first."
      );
    }
  };

  return { slots, loading, saving, addSlot, removeSlot, refresh: fetch };
}