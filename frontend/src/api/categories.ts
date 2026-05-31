import api from "./client";
import type { Category } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories/");
  return data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const { data } = await api.post("/categories/", { name });
  return data;
};

export const updateCategory = async (id: string, payload: { name?: string; is_active?: boolean }): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};