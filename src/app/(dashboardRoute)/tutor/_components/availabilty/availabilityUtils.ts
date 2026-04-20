"use client";

export const TIME_PRESETS = [
  { label: "9–10 AM", start: "09:00", end: "10:00" },
  { label: "10–11 AM", start: "10:00", end: "11:00" },
  { label: "11–12 PM", start: "11:00", end: "12:00" },
  { label: "12–1 PM", start: "12:00", end: "13:00" },
  { label: "1–2 PM", start: "13:00", end: "14:00" },
  { label: "2–3 PM", start: "14:00", end: "15:00" },
  { label: "3–4 PM", start: "15:00", end: "16:00" },
];

export function getValidationError(
  date: string,
  start: string,
  end: string,
): string | null {
  if (!date || !start || !end) return null;

  const now = new Date();
  const startDt = new Date(`${date}T${start}`);
  const endDt = new Date(`${date}T${end}`);

  if (startDt <= now) return "Start time must be in the future.";
  if (endDt <= startDt) return "End time must be after start time.";

  const hours = (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60);
  if (hours < 1) return "Slot must be at least 1 hour.";

  const [startH] = start.split(":").map(Number);
  const [endH] = end.split(":").map(Number);
  if ((startH as number) < 9 || (endH as number) > 16)
    return "Slots must be between 09:00 am and 04:00 pm.";

  return null;
}
