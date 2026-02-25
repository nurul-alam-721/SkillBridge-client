export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
};