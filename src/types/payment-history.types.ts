
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";

export interface TutorUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface TutorProfile {
  id: string;
  hourlyRate: number;
  experience: number;
  user: TutorUser;
}

export interface PaymentBooking {
  id: string;
  status: BookingStatus;
  tutorProfile: TutorProfile;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  booking: PaymentBooking;
}