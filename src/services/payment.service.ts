  import { apiClient } from "@/lib/axios";
import { Payment } from "@/types";
  export interface CreatePaymentIntentResponse {
    clientSecret: string;
    payment: Payment;
  }

  export interface ConfirmPaymentPayload {
    bookingId: string;
    paymentIntentId?: string;
  }

  export const paymentService = {
    async createPaymentIntent(bookingId: string): Promise<CreatePaymentIntentResponse> {
      const { data } = await apiClient.post("/api/payments/create-intent", { bookingId });
      return data.data;
    },

    async confirmPayment(payload: ConfirmPaymentPayload): Promise<Payment> {
      const { data } = await apiClient.post("/api/payments/confirm", payload);
      return data.data;
    },

    async getMyPayments(): Promise<Payment[]> {
      const { data } = await apiClient.get("/api/payments/me");
      return data.data;
    },

    async getTutorEarnings(): Promise<Payment[]> {
      const { data } = await apiClient.get("/api/payments/me");
      return data.data;
    },

    async getAllPayments(): Promise<Payment[]> {
      const { data } = await apiClient.get("/api/payments");
      return data.data;
    },
  };