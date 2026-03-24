import { createServerApi, apiClient } from "@/lib/axios";

export interface RecentBooking {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  student: { name: string | null; image: string | null };
  tutorProfile: {
    hourlyRate: number;
    user: { name: string | null };
    category: { name: string };
  };
  slot: { startTime: string; endTime: string };
}

export interface AdminStats {
  totalStudents: number;
  totalTutors: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCategories: number;
  totalRevenue: number;
  recentActivity: RecentBooking[];
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type UserStatus = "ACTIVE" | "BANNED";
export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export interface AdminBooking {
  id: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  student: { id: string; name: string | null; email: string | null; image: string | null };
  tutorProfile: {
    user: { name: string | null; email: string | null };
    category: { name: string };
    hourlyRate: number;
  };
  slot: { startTime: string; endTime: string };
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const api = await createServerApi();
    const res = await api.get("/api/admin/stats");
    return res.data.data ?? res.data;
  },

  getAllBookings: async (): Promise<AdminBooking[]> => {
    const api = await createServerApi();
    const res = await api.get("/api/admin/bookings");
    return res.data.data ?? res.data;
  },

  getAllUsers: async (): Promise<AdminUser[]> => {
    const api = await createServerApi();
    const res = await api.get("/api/admin/users");
    return res.data.data ?? res.data;
  },

  updateUserStatus: async (id: string, status: UserStatus): Promise<AdminUser> => {
    const api = await createServerApi();
    const res = await api.patch(`/api/admin/users/${id}/status`, { status });
    return res.data.data ?? res.data;
  },
};

export const adminClientService = {
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