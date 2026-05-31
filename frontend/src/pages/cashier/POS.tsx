import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts } from "../../api/products";
import { getCategories } from "../../api/categories";
import { createOrder, payOrder } from "../../api/orders";
import { useCartStore } from "../../stores/cart";
import { formatCurrency } from "../../lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import type { Product } from "../../types";

type PaymentMethod = "cash" | "qris";

export default function POS() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { items, note, addItem, removeItem, updateQuantity, setNote, clearCart } = useCartStore();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const filteredProducts = selectedCategory
    ? products?.filter((p) => p.category_id === selectedCategory && p.is_available)
    : products?.filter((p) => p.is_available);

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  const orderMutation = useMutation({
    mutationFn: async () => {
      const order = await createOrder({
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        note: note || undefined,
      });
      await payOrder(order.id, paymentMethod);
      return order;
    },
    onSuccess: () => {
      clearCart();
      setShowPayment(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    },
  });

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Left — Menu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Category filter */}
        <div className="px-6 py-4 border-b border-gold-500/10 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              !selectedCategory
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "text-muted hover:text-cream-50 hover:bg-white/5"
            }`}
          >
            All
          </button>
          {categories?.filter((c) => c.is_active).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "text-muted hover:text-cream-50 hover:bg-white/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addItem(product)} />
            ))}
            {filteredProducts?.length === 0 && (
              <div className="col-span-full text-center text-muted py-12">
                No products available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right — Cart */}
      <div className="w-80 glass border-l border-gold-500/10 flex flex-col">
        <div className="p-5 border-b border-gold-500/10 flex items-center gap-2">
          <ShoppingBag size={18} className="text-gold-500" />
          <h2 className="text-cream-50 font-semibold">Order</h2>
          {items.length > 0 && (
            <span className="ml-auto text-xs bg-gold-500/20 text-gold-400 border border-gold-500/30 px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted text-sm py-12">
              Add items from the menu
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="glass rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-cream-50 text-sm font-medium leading-tight">{item.product.name}</p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gold-400 text-sm">
                    {formatCurrency(parseFloat(item.product.price) * item.quantity)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 text-cream-50 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-cream-50 text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 text-cream-50 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Note + checkout */}
        <div className="p-4 border-t border-gold-500/10 space-y-3">
          <input
            className="input-glass text-sm"
            placeholder="Order note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <span className="text-muted text-sm">Total</span>
            <span className="text-cream-50 font-bold text-lg">{formatCurrency(total)}</span>
          </div>
          <button
            className="btn-gold w-full"
            disabled={items.length === 0}
            onClick={() => setShowPayment(true)}
          >
            Charge
          </button>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-cream-50 font-semibold">Payment</h3>
              <button onClick={() => setShowPayment(false)} className="text-muted hover:text-cream-50">
                <X size={18} />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-muted text-sm">Total Amount</p>
              <p className="text-cream-50 text-4xl font-bold mt-1">{formatCurrency(total)}</p>
            </div>

            <div className="space-y-2 mb-5">
              <p className="text-cream-200 text-sm font-medium">Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {(["cash", "qris"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      paymentMethod === method
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                        : "glass text-muted hover:text-cream-50"
                    }`}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-gold w-full"
              onClick={() => orderMutation.mutate()}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {orderSuccess && (
        <div className="fixed bottom-6 right-6 glass rounded-xl px-5 py-3 border border-green-500/30 z-50">
          <p className="text-green-400 font-medium text-sm">✓ Order completed successfully</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="glass glass-hover rounded-2xl p-4 text-left w-full transition-all active:scale-95"
    >
      <div className="w-full aspect-square rounded-xl bg-brown-800 flex items-center justify-center mb-3 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">☕</span>
        )}
      </div>
      <p className="text-cream-50 font-medium text-sm leading-tight">{product.name}</p>
      {product.category && (
        <p className="text-muted text-xs mt-0.5">{product.category.name}</p>
      )}
      <p className="text-gold-400 font-semibold text-sm mt-2">{formatCurrency(product.price)}</p>
    </button>
  );
}