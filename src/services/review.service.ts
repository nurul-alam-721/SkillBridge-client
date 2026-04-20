import { apiClient } from "@/lib/axios";
import { CreateReviewPayload, Review } from "@/types";

export const reviewService = {
  create: async (payload: CreateReviewPayload): Promise<Review> => {
    const res = await apiClient.post("/api/reviews", payload);
    return res.data.data;
  },

  update: async (id: string, payload: { rating: number; comment?: string }): Promise<Review> => {
    const res = await apiClient.put(`/api/reviews/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/reviews/${id}`);
  },
};