import {api} from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { tutors: number };
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

const getAll = async (): Promise<Category[]> => {
  const res = await api.get("/api/categories");
  return res.data.data;
};

const getById = async (id: string): Promise<Category> => {
  const res = await api.get(`/api/categories/${id}`);
  return res.data.data;
};

const create = async (payload: CategoryPayload): Promise<Category> => {
  const res = await api.post("/api/categories", payload);
  return res.data.data;
};

const update = async (id: string, payload: CategoryPayload): Promise<Category> => {
  const res = await api.put(`/api/categories/${id}`, payload);
  return res.data.data;
};

const remove = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}`);
};

export const categoryService = { getAll, getById, create, update, remove };