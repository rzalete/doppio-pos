import api from "./client";
import type { Product } from "../types";

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  const { data } = await api.get("/products/", {
    params: categoryId ? { category_id: categoryId } : {},
  });
  return data;
};

export const createProduct = async (payload: {
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}): Promise<Product> => {
  const { data } = await api.post("/products/", payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: Partial<{
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: boolean;
  }>
): Promise<Product> => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};