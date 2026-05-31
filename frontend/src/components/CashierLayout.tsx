import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { LogOut } from "lucide-react";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-brown-950">
      {/* Topbar */}
      <header className="glass border-b border-gold-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
            <span className="text-sm">☕</span>
          </div>
          <div>
            <h1 className="text-cream-50 font-bold leading-none">Doppio POS</h1>
            <p className="text-muted text-xs mt-0.5">Cashier</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cream-200 text-sm">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-2 text-sm py-2 px-3"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}