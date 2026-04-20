import { apiClient } from "@/lib/axios";
import { Category, CategoryPayload } from "@/types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await apiClient.get("/api/categories");
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Category> => {
    const res = await apiClient.get(`/api/categories/${id}`);
    return res.data.data;
  },

  create: async (payload: CategoryPayload): Promise<Category> => {
    const res = await apiClient.post("/api/categories", payload);
    return res.data.data;
  },

  update: async (id: string, payload: CategoryPayload): Promise<Category> => {
    const res = await apiClient.put(`/api/categories/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};