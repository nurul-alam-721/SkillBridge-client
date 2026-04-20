import { apiClient } from "@/lib/axios";
import { CurrentUser, UpdateProfilePayload, UserStatus, UserRole } from "@/types";

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

  async updateMyRole(role: UserRole): Promise<CurrentUser> {
    const { data } = await apiClient.patch("/api/users/me/role", { role });
    return data.data;
  },
};