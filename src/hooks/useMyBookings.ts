import { useState, useEffect, useCallback } from "react";
import { bookingService, Booking } from "@/services/booking.service";

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upcoming = bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status));
  const past     = bookings.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.status));

  return { bookings, upcoming, past, loading, refresh: load };
}