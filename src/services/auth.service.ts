import { api } from "@/lib/axios";
import { User } from "@/types/user";

export interface SessionResponse {
  user: User;
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post("/api/auth/login", payload);
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TUTOR";
  }) {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  },

  async getSession(): Promise<SessionResponse | null> {
    try {
      const { data } = await api.get("/api/auth/me");
      return data;
    } catch {
      return null;
    }
  },

  async logout() {
    await api.post("/auth/logout");
  },
};