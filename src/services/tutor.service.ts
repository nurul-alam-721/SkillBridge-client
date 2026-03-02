import { api } from "@/lib/axios";


export type Role = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";


export interface TutorUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
}

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
}

export interface ReviewStudent {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Review {
  id: string;
  rating: string;
  comment: string | null;
  studentId: string;
  tutorProfileId: string;
  createdAt: string;
  student?: ReviewStudent;
}

export interface BookingStudent {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

export interface TutorBooking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  slot: AvailabilitySlot;
  student: BookingStudent;
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
  user: TutorUser;
  category: Category;
  availability?: AvailabilitySlot[];
  reviews?: Review[];
  bookings?: TutorBooking[];
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


export interface TutorsQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
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
  // Public
  async getAll(query?: TutorsQuery): Promise<TutorsResponse> {
    const { data } = await api.get("/api/tutors", { params: query });
    return data;
  },

  async getById(id: string): Promise<TutorProfile> {
    const { data } = await api.get(`/api/tutors/${id}`);
    return data.data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get("/api/categories");
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  async getMyStats(): Promise<TutorStatsResponse> {
    const { data } = await api.get("/api/tutors/me/stats");
    return data.data;
  },

  async updateProfile(payload: UpdateTutorProfilePayload): Promise<TutorProfile> {
    const { data } = await api.put("/api/tutors/me", payload);
    return data.data;
  },

  async getMyAvailability(): Promise<AvailabilitySlot[]> {
    const { data } = await api.get("/api/tutor/availability");
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  async createAvailabilitySlot(payload: CreateAvailabilityPayload): Promise<AvailabilitySlot> {
    const { data } = await api.post("/api/tutor/availability", payload);
    return data.data;
  },

  async deleteAvailabilitySlot(slotId: string): Promise<void> {
    await api.delete(`/api/tutor/availability/${slotId}`);
  },
};