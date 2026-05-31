import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import { getCategories } from "../../api/categories";
import { formatCurrency } from "../../lib/utils";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Product } from "../../types";

interface ProductForm {
  category_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  is_available: boolean;
}

const emptyForm: ProductForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  image_url: "",
  is_available: true,
};

export default function Menu() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createProduct({
        ...form,
        price: parseFloat(form.price),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProduct(editingProduct!.id, {
        ...form,
        price: parseFloat(form.price),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      updateProduct(id, { is_available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      is_available: product.is_available,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cream-50">Menu</h2>
          <p className="text-muted text-sm mt-1">Manage your products.</p>
        </div>
        <button
          className="btn-gold flex items-center gap-2"
          onClick={() => { setShowForm(true); setEditingProduct(null); setForm(emptyForm); }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-cream-50 font-semibold">
              {editingProduct ? "Edit Product" : "New Product"}
            </h3>
            <button onClick={closeForm} className="text-muted hover:text-cream-50">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Name</label>
              <input
                className="input-glass"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Category</label>
              <select
                className="input-glass"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Select category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Price (IDR)</label>
              <input
                className="input-glass"
                placeholder="25000"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Image URL</label>
              <input
                className="input-glass"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-cream-200 mb-1.5">Description</label>
              <input
                className="input-glass"
                placeholder="Optional description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                className="w-4 h-4 accent-yellow-400"
              />
              <label htmlFor="is_available" className="text-cream-200 text-sm">Available</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              className="btn-gold"
              onClick={() => editingProduct ? updateMutation.mutate() : createMutation.mutate()}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
            <button className="btn-ghost" onClick={closeForm}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gold-500">Loading...</div>
        ) : products?.length === 0 ? (
          <div className="p-8 text-center text-muted">No products yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Product</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Category</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Price</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Status</th>
                <th className="text-right px-6 py-4 text-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-b border-gold-500/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-cream-50 font-medium">{product.name}</p>
                    {product.description && (
                      <p className="text-muted text-xs mt-0.5 truncate max-w-48">{product.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cream-200 text-sm">{product.category?.name || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gold-400 font-medium">{formatCurrency(product.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleMutation.mutate({ id: product.id, is_available: !product.is_available })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        product.is_available
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {product.is_available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center hover:bg-gold-500/20 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(product.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}