import { apiClient } from "@/lib/axios";
import { UserRole, UserStatus } from "@/types/types";

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
}

export const userService = {
  async getMe(): Promise<CurrentUser> {
    const { data } = await apiClient.get("/api/me");
    return data.data;
  },

  async updateMyProfile(payload: UpdateProfilePayload): Promise<CurrentUser> {
    const { data } = await apiClient.put("/api/users/me", payload);
    return data.data;
  },

  async updateStatus(userId: string, status: UserStatus): Promise<CurrentUser> {
    const { data } = await apiClient.patch(`/api/users/${userId}`, { status });
    return data.data;
  },
};