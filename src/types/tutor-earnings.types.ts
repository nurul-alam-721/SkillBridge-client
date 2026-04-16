export type TutorPaymentStatus = "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";

export interface Student {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorPayment {
  id: string;
  bookingId: string;
  studentId: string;
  amount: number;
  currency: string;
  status: TutorPaymentStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  student: Student; 
  booking: Booking;
  tutorEarning?: number;
}