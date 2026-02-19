import axios from "axios";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
}

export interface SessionResponse {
  user: AuthUser;
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await axios.post("/api/auth/login", payload, {
      withCredentials: true,
    });
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor";
  }) {
    const { data } = await axios.post("/api/auth/register", payload, {
      withCredentials: true,
    });
    return data;
  },

  async getSession(): Promise<SessionResponse | null> {
    try {
      const { data } = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      return data;
    } catch {
      return null;
    }
  },

  async logout() {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  },
};
