import { BookingStatus } from "./common.types";
import { TutorProfile, AvailabilitySlot } from "./tutor.types";

export interface BookingReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  studentId?: string;
  tutorProfileId?: string;
  bookingId?: string | null;
}

export interface Booking {
  id: string;
  studentId?: string;
  tutorProfileId?: string;
  slotId?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  tutorProfile?: TutorProfile | any;
  slot?: AvailabilitySlot | any;
  review?: BookingReview | null;
  student?: any;
}

export interface CreateBookingPayload {
  tutorProfileId: string;
  slotId: string;
}
