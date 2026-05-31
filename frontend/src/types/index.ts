export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "cashier";
    is_active: boolean;
    created_at: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
  }
  
  export interface Product {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: string;
    image_url: string | null;
    is_available: boolean;
    created_at: string;
    category: { id: string; name: string } | null;
  }
  
  export interface OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    product_price: string;
    quantity: number;
    subtotal: string;
  }
  
  export interface Order {
    id: string;
    user_id: string;
    status: "pending" | "paid" | "cancelled";
    payment_method: "cash" | "qris" | null;
    total_amount: string;
    note: string | null;
    created_at: string;
    cashier: { id: string; name: string };
    items: OrderItem[];
  }
  
  export interface DashboardSummary {
    today_revenue: string;
    today_order_count: number;
    total_revenue: string;
    total_order_count: number;
    top_products: {
      product_id: string;
      product_name: string;
      total_quantity: number;
      total_revenue: string;
    }[];
  }
  
  export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }