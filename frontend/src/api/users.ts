import api from "./client";
import type { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users/");
  return data;
};

export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> => {
  const { data } = await api.post("/users/", payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    password: string;
    is_active: boolean;
  }>
): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};