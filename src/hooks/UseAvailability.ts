"use client";

import { useState, useEffect, useCallback } from "react";
import {
  tutorService,
  AvailabilitySlot,
  CreateAvailabilityPayload,
} from "@/services/tutor.service";

export function useAvailability() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tutorService.getMyAvailability();
      setSlots(data);
    } catch {
      setError("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addSlot = async (payload: CreateAvailabilityPayload) => {
    setSaving(true);
    setError(null);
    try {
      const slot = await tutorService.createAvailabilitySlot(payload);
      setSlots((prev) => [...prev, slot]);
      return true;
    } catch {
      setError("Failed to add slot. Slot in this time period already exists.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeSlot = async (slotId: string) => {
    setError(null);
    try {
      await tutorService.deleteAvailabilitySlot(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch {
      setError("Failed to delete slot.");
    }
  };

  return { slots, loading, saving, error, addSlot, removeSlot, refresh: fetch };
}
