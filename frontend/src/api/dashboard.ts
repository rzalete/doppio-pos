import api from "./client";
import type { DashboardSummary } from "../types";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};