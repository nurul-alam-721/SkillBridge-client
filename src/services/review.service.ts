import { api } from "@/lib/axios";

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

const create = async (payload: CreateReviewPayload): Promise<Review> => {
  const res = await api.post("/api/reviews", payload);
  return res.data.data;
};

export const reviewService = { create };
