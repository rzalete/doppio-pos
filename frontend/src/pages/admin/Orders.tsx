import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../api/orders";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useState } from "react";
import type { Order } from "../../types";
import { X } from "lucide-react";

const statusStyle: Record<string, string> = {
  paid: "bg-green-500/10 text-green-400 border border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function Orders() {
  const [selected, setSelected] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cream-50">Orders</h2>
        <p className="text-muted text-sm mt-1">View all orders across all cashiers.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gold-500">Loading...</div>
        ) : orders?.length === 0 ? (
          <div className="p-8 text-center text-muted">No orders yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Order ID</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Cashier</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Total</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Payment</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Status</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Date</th>
                <th className="text-right px-6 py-4 text-muted text-sm font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gold-500/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-cream-200 text-xs font-mono">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cream-50 text-sm">{order.cashier.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gold-400 font-medium">{formatCurrency(order.total_amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cream-200 text-sm capitalize">{order.payment_method || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusStyle[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted text-sm">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelected(order)}
                      className="text-gold-400 text-sm hover:text-gold-300 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-cream-50 font-semibold">Order Detail</h3>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-cream-50">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Order ID</span>
                <span className="text-cream-200 font-mono">#{selected.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Cashier</span>
                <span className="text-cream-50">{selected.cashier.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Status</span>
                <span className={`px-2 py-0.5 rounded text-xs ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Payment</span>
                <span className="text-cream-200 capitalize">{selected.payment_method || "-"}</span>
              </div>
              {selected.note && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Note</span>
                  <span className="text-cream-200">{selected.note}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gold-500/10 pt-4 space-y-2">
              {selected.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-cream-200">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="text-gold-400">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gold-500/10 mt-4 pt-4 flex justify-between">
              <span className="text-cream-50 font-semibold">Total</span>
              <span className="text-gold-400 font-bold">{formatCurrency(selected.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}