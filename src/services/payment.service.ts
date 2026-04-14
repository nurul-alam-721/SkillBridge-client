import { apiClient } from "@/lib/axios";

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  payment: Payment;
}

export interface ConfirmPaymentPayload {
  bookingId: string;
  paymentIntentId?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentService = {
  async createPaymentIntent(bookingId: string): Promise<CreatePaymentIntentResponse> {
    const { data } = await apiClient.post("/api/payments/create-intent", { bookingId });
    return data.data as CreatePaymentIntentResponse;
  },

  async confirmPayment(payload: ConfirmPaymentPayload): Promise<Payment> {
    const { data } = await apiClient.post("/api/payments/confirm", payload);
    return data.data as Payment;
  },

  async getMyPayments(): Promise<Payment[]> {
    const { data } = await apiClient.get("/api/payments/me");
    return data.data as Payment[];
  },
};