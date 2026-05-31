import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { login, getMe } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const tokens = await login(email, password);
      localStorage.setItem("access_token", tokens.access_token);
      const user = await getMe();
      setAuth(user, tokens.access_token, tokens.refresh_token);
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500 opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-300 opacity-5 blur-3xl" />
      </div>

      <div className="glass rounded-3xl p-10 w-full max-w-md mx-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-300 mb-4">
            <span className="text-2xl">☕</span>
          </div>
          <h1 className="text-3xl font-bold text-cream-50">Doppio POS</h1>
          <p className="text-muted mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream-200 mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="input-glass"
              placeholder="you@doppio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream-200 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="input-glass"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            className="btn-gold w-full mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          Doppio POS © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}