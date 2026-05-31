import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  Users,
  LogOut,
  Tag,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/menu", icon: Coffee, label: "Menu" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-brown-950">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-gold-500/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gold-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
              <span className="text-lg">☕</span>
            </div>
            <div>
              <h1 className="text-cream-50 font-bold text-lg leading-none">Doppio</h1>
              <p className="text-muted text-xs mt-0.5">POS System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                    : "text-muted hover:text-cream-50 hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-gold-500/10">
          <div className="glass rounded-xl p-3 mb-3">
            <p className="text-cream-50 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-muted text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}