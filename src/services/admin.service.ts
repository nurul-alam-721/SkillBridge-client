import { api } from "@/lib/axios";

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
export type UserStatus    = "ACTIVE" | "BANNED";
export type UserRole      = "STUDENT" | "TUTOR" | "ADMIN";

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

const getStats = async (): Promise<AdminStats> => {
  const res = await api.get("/api/admin/stats");
  return res.data.data;
};

const getAllBookings = async (): Promise<AdminBooking[]> => {
  const res = await api.get("/api/admin/bookings");
  return res.data.data;
};

const getAllUsers = async (): Promise<AdminUser[]> => {
  const res = await api.get("/api/admin/users");
  return res.data.data;
};

const updateUserStatus = async (id: string, status: UserStatus): Promise<AdminUser> => {
  const res = await api.patch(`/api/admin/users/${id}/status`, { status });
  return res.data.data;
};

export const adminService = { getStats, getAllBookings, getAllUsers, updateUserStatus };