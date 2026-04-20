import { Category } from "./category.types";
import { Review } from "./review.types";

export interface AvailabilitySlot {
  id: string;
  tutorProfileId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  totalBookings: number;
  maxCapacity: number;
}

export interface TutorProfile {
  id: string;
  userId?: string;
  bio?: string | null;
  hourlyRate: number;
  experience: number;
  categoryId?: string;
  rating?: number;
  totalReviews?: number;
  user: any; // User type or subset
  category?: Category | any;
  availability?: AvailabilitySlot[];
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
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
  recentBookings: any[];
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
export interface TutorBooking {
  id: string;
  studentId?: string;
  tutorProfileId?: string;
  slotId?: string;
  status: any;
  createdAt: string;
  updatedAt?: string;
  tutorProfile?: TutorProfile | any;
  slot?: AvailabilitySlot | any;
  review?: any | null;
  student?: any;
}
