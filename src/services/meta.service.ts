import { apiClient } from "@/lib/axios";
import { PlatformStats } from "@/types";

export const metaService = {
  getStats: async (): Promise<PlatformStats> => {
    const res = await apiClient.get("/api/meta/stats");
    return res.data.data;
  },
};
