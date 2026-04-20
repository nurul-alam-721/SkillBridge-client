import { apiClient } from "@/lib/axios";
import { AdminStats, AdminBooking, AdminUser, UserStatus } from "@/types";

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get("/api/admin/stats");
    return res.data.data ?? res.data;
  },

  getAllBookings: async (): Promise<AdminBooking[]> => {
    const res = await apiClient.get("/api/admin/bookings");
    return res.data.data ?? res.data;
  },

  getAllUsers: async (): Promise<AdminUser[]> => {
    const res = await apiClient.get("/api/admin/users");
    return res.data.data ?? res.data;
  },

  updateUserStatus: async (id: string, status: UserStatus): Promise<AdminUser> => {
    const res = await apiClient.patch(`/api/admin/users/${id}/status`, { status });
    return res.data.data ?? res.data;
  },
};