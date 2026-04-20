import { PaymentStatus } from "./common.types";
import { Booking } from "./booking.types";
import { User } from "./user.types";

export interface Payment {
  id: string;
  bookingId?: string;
  studentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt?: string;
  student?: User | any;
  booking?: Booking | any;
  tutorEarning?: number;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
}

export interface PaymentStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  pendingValue: number;
  activeTutors: number;
  totalPayments: number;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  payment: Payment;
}

export interface ConfirmPaymentPayload {
  bookingId: string;
  paymentIntentId?: string;
}
