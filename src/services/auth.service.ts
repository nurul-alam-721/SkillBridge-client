import { apiClient } from "@/lib/axios";
import { SessionResponse, User } from "@/types";

export const authService = {
  async getSession(): Promise<SessionResponse | null> {
    try {
      const { data } = await apiClient.get("/api/me");
      if (data?.success && data?.data) {
        return { user: data.data as User };
      }
      return null;
    } catch {
      return null;
    }
  },
};