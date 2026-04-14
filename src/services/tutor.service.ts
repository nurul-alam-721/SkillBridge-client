import { apiClient } from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  tutorProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  totalBookings: number;
  maxCapacity: number;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface TutorBooking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  slot: AvailabilitySlot;
  student: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

export interface Review {
  id: string;
  rating: string;
  comment: string | null;
  studentId: string;
  tutorProfileId: string;
  createdAt: string;
  student?: { id: string; name: string | null; image: string | null };
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number;
  experience: number;
  categoryId: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    phone: string | null;
  };
  category: Category;
  availability?: AvailabilitySlot[];
  reviews?: Review[];
  bookings?: TutorBooking[];
}

export interface TutorsQuery {
  search?: string;
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  minExperience?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TutorsResponse {
  tutors: TutorProfile[];
  pagination: {
    totalTutors: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TutorStats {
  totalSessions: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  totalEarnings: number;
  availableSlots: number;
  rating: number;
  totalReviews: number;
}

export interface TutorStatsResponse {
  stats: TutorStats;
  tutorProfile: TutorProfile;
  recentBookings: TutorBooking[];
  recentReviews: Review[];
}

export interface UpdateTutorProfilePayload {
  bio?: string;
  hourlyRate?: number;
  experience?: number;
  categoryId?: string;
}

export interface CreateAvailabilityPayload {
  date: string;
  startTime: string;
  endTime: string;
}

export const tutorService = {
  async getAll(query?: TutorsQuery): Promise<TutorsResponse> {
    const { data } = await apiClient.get("/api/tutors", { params: query });
    if (data.tutors)
      return { tutors: data.tutors, pagination: data.pagination };
    if (data.data?.tutors) return data.data;
    return data;
  },

  async getById(id: string): Promise<TutorProfile> {
    const { data } = await apiClient.get(`/api/tutors/${id}`);
    return data.data ?? data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get("/api/categories");
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  async getMyProfile(): Promise<TutorProfile | null> {
    const { data } = await apiClient.get("/api/tutors/me");
    return data.data ?? null;
  },

  async createProfile(
    payload: UpdateTutorProfilePayload,
  ): Promise<TutorProfile> {
    const { data } = await apiClient.post(
      "/api/tutors/create-profile",
      payload,
    );
    return data.data ?? data;
  },

  async updateProfile(
    payload: UpdateTutorProfilePayload,
  ): Promise<TutorProfile> {
    const { data } = await apiClient.put("/api/tutors/me", payload);
    return data.data ?? data;
  },

  async getMyStats(): Promise<TutorStatsResponse> {
    const { data } = await apiClient.get("/api/tutors/me/stats");
    return data.data ?? data;
  },

  async getMyAvailability(): Promise<AvailabilitySlot[]> {
    const { data } = await apiClient.get("/api/tutor/availability");
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  async createAvailabilitySlot(
    payload: CreateAvailabilityPayload,
  ): Promise<AvailabilitySlot> {
    try {
      const { data } = await apiClient.post("/api/tutor/availability", payload);
      return data.data ?? data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const data = error.response.data as { message?: string };
        throw new Error(
          data.message || "A slot in this time period already exists.",
        );
      }
      throw new Error("A slot in this time period already exists.");
    }
  },

  async deleteAvailabilitySlot(slotId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/tutor/availability/${slotId}`);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const data = error.response.data as { message?: string };
        throw new Error(
          data.message || "Cannot delete this slot — it has an active booking.",
        );
      }
      throw new Error("Cannot delete this slot — it has an active booking.");
    }
  },

  async updateAvailabilitySlot(
    slotId: string,
    payload: Partial<CreateAvailabilityPayload & { maxCapacity: number }>,
  ): Promise<AvailabilitySlot> {
    try {
      const { data } = await apiClient.patch(
        `/api/availability-slots/${slotId}`,
        payload,
      );
      return data.data ?? data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const data = error.response.data as { message?: string };
        throw new Error(
          data.message || "Failed to update slot. Check for overlaps.",
        );
      }
      throw new Error("Failed to update slot. Check for overlaps.");
    }
  },
};
