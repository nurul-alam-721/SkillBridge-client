export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  studentId: string;
  tutorProfileId: string;
  bookingId?: string | null;
  createdAt: string;
  student?: { id: string; name: string | null; image: string | null };
}

export interface CreateReviewPayload {
  tutorProfileId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}
