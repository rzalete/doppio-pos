import api from "./client";
import type { TokenResponse, User } from "../types";

export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  return data;
};