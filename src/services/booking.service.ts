import { api } from "@/lib/axios";
import { TutorProfile, AvailabilitySlot } from "./tutor.service";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  tutorProfile: TutorProfile;
  slot: AvailabilitySlot;
}

export interface CreateBookingPayload {
  tutorProfileId: string;
  slotId: string;
}

export const bookingService = {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await api.post("/api/bookings", payload);
    return data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get("/api/bookings/me");
    return data.data;
  },

  async getById(id: string): Promise<Booking> {
    const { data } = await api.get(`/api/bookings/${id}`);
    return data.data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data } = await api.put(`/api/bookings/${id}/status`, { status });
    return data.data;
  },
};