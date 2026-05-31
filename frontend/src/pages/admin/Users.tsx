import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";
import { Plus, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useAuthStore } from "../../stores/auth";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

const emptyForm: UserForm = { name: "", email: "", password: "", role: "cashier" };

export default function Users() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: () => createUser(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateUser(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cream-50">Users</h2>
          <p className="text-muted text-sm mt-1">Manage cashier and admin accounts.</p>
        </div>
        <button
          className="btn-gold flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-cream-50 font-semibold">New User</h3>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="text-muted hover:text-cream-50">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Name</label>
              <input
                className="input-glass"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Email</label>
              <input
                className="input-glass"
                placeholder="user@doppio.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Password</label>
              <input
                className="input-glass"
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-cream-200 mb-1.5">Role</label>
              <select
                className="input-glass"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              className="btn-gold"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
            >
              Create User
            </button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gold-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Name</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Email</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Role</th>
                <th className="text-left px-6 py-4 text-muted text-sm font-medium">Status</th>
                <th className="text-right px-6 py-4 text-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-gold-500/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cream-50 font-medium">{user.name}</span>
                      {user.id === currentUser?.id && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20">you</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cream-200 text-sm">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      user.is_active
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.id !== currentUser?.id && (
                        <>
                          <button
                            onClick={() => toggleMutation.mutate({ id: user.id, is_active: !user.is_active })}
                            className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center hover:bg-gold-500/20 transition-colors"
                          >
                            {user.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(user.id)}
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