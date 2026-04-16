export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED";

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTutorProfile {
  id: string;
  userId: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: AdminUser;
}

export interface AdminBooking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  tutorProfile: AdminTutorProfile;
}

export interface AdminPayment {
  id: string;
  bookingId: string;
  studentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  student: AdminUser;
  booking: AdminBooking;
}

export interface AdminPaymentsResponse {
  success: boolean;
  message: string;
  data: AdminPayment[];
}

export interface AdminPaymentStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  pendingValue: number;
  activeTutors: number;
  totalPayments: number;
}