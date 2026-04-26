import { BookingStatus } from "./common.types";
import { User } from "./user.types";
import { Booking } from "./booking.types";

export interface RecentBooking {
  id: string;
  status: BookingStatus;
  createdAt: string;
  student: { name: string | null; image: string | null };
  tutorProfile: {
    hourlyRate: number;
    user: { name: string | null; image: string | null; email: string | null };
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

export interface AdminBooking extends Booking {}
export interface AdminUser extends User {}
export interface TutorUser extends User {}
export interface PaymentBooking extends Booking {}
