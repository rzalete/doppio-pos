import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../../api/dashboard";
import { formatCurrency } from "../../lib/utils";
import { TrendingUp, ShoppingBag, DollarSign, Award } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gold-500">Loading...</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(data?.today_revenue || 0),
      icon: DollarSign,
      sub: `${data?.today_order_count || 0} orders today`,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(data?.total_revenue || 0),
      icon: TrendingUp,
      sub: `${data?.total_order_count || 0} orders all time`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-cream-50">Dashboard</h2>
        <p className="text-muted text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="glass glass-hover rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm">{label}</p>
                <p className="text-cream-50 text-3xl font-bold mt-1">{value}</p>
                <p className="text-muted text-xs mt-1">{sub}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Icon size={22} className="text-gold-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top products */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award size={20} className="text-gold-500" />
          <h3 className="text-cream-50 font-semibold">Top Products</h3>
        </div>

        {data?.top_products.length === 0 ? (
          <p className="text-muted text-sm">No sales data yet.</p>
        ) : (
          <div className="space-y-3">
            {data?.top_products.map((product, index) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between py-3 border-b border-gold-500/10 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-cream-50 text-sm font-medium">{product.product_name}</p>
                    <p className="text-muted text-xs">{product.total_quantity} sold</p>
                  </div>
                </div>
                <p className="text-gold-400 font-semibold text-sm">
                  {formatCurrency(product.total_revenue)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}