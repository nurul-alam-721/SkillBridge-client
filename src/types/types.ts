export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  image?: string;
};

