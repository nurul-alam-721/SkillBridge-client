import { UserRole, UserStatus } from "./common.types";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  phone: string | null;
  image: string | null;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser extends User {}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
}
