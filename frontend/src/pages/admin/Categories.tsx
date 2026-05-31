import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: () => createCategory(newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateCategory(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cream-50">Categories</h2>
        <p className="text-muted text-sm mt-1">Manage your menu categories.</p>
      </div>

      {/* Add new */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-cream-50 font-medium mb-4">Add Category</h3>
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && newName && createMutation.mutate()}
          />
          <button
            className="btn-gold flex items-center gap-2"
            onClick={() => newName && createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gold-500">Loading...</div>
        ) : categories?.length === 0 ? (
          <div className="p-8 text-center text-muted">No categories yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Name</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Status</th>
                <th className="text-right px-6 py-4 text-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-b border-gold-500/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input
                        className="input-glass"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && updateMutation.mutate({ id: cat.id, name: editingName })}
                        autoFocus
                      />
                    ) : (
                      <span className="text-cream-50 font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleMutation.mutate({ id: cat.id, is_active: !cat.is_active })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        cat.is_active
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => updateMutation.mutate({ id: cat.id, name: editingName })}
                            className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                            className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center hover:bg-gold-500/20 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(cat.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
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