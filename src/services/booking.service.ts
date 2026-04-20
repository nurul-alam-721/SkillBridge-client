import { apiClient } from "@/lib/axios";
import { CreateBookingPayload, Booking, BookingStatus } from "@/types";

export const bookingService = {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await apiClient.post("/api/bookings", payload);
    return data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data } = await apiClient.get("/api/bookings/me");
    return data.data;
  },

  async getById(id: string): Promise<Booking> {
    const { data } = await apiClient.get(`/api/bookings/${id}`);
    return data.data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data } = await apiClient.put(`/api/bookings/${id}/status`, { status });
    return data.data;
  },

  async cancelBooking(id: string): Promise<void> {
    await apiClient.delete(`/api/bookings/${id}`);
  },
};