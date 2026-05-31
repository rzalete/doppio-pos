import api from "./client";
import type { Order } from "../types";

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders/");
  return data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const createOrder = async (payload: {
  items: { product_id: string; quantity: number }[];
  note?: string;
}): Promise<Order> => {
  const { data } = await api.post("/orders/", payload);
  return data;
};

export const payOrder = async (id: string, payment_method: string): Promise<Order> => {
  const { data } = await api.patch(`/orders/${id}/pay`, { payment_method });
  return data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const { data } = await api.patch(`/orders/${id}/cancel`);
  return data;
};