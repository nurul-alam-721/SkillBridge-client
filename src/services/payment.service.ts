import { apiClient } from "@/lib/axios";
import { Booking } from "./booking.service";

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  payment: any;
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

  async confirmPayment(payload: ConfirmPaymentPayload): Promise<any> {
    const { data } = await apiClient.post("/api/payments/confirm", payload);
    return data.data;
  },

  async getMyPayments(): Promise<any[]> {
    const { data } = await apiClient.get("/api/payments/me");
    return data.data;
  },
};
