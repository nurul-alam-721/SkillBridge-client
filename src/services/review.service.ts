import { apiClient } from "@/lib/axios";

export interface CreateReviewPayload {
  tutorProfileId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  rating: string;
  comment: string | null;
  studentId: string;
  tutorProfileId: string;
  bookingId: string | null;
  createdAt: string;
}

export const reviewService = {
  create: async (payload: CreateReviewPayload): Promise<Review> => {
    const res = await apiClient.post("/api/reviews", payload);
    return res.data.data;
  },

  update: async (id: string, payload: { rating: number; comment?: string }): Promise<Review> => {
    const res = await apiClient.patch(`/api/reviews/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/reviews/${id}`);
  },
};