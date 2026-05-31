import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./stores/auth";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={accessToken ? "/pos" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/pos"
          element={
            <ProtectedRoute requiredRole="cashier">
              <div className="text-cream-50 p-8">POS page coming soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="text-cream-50 p-8">Dashboard coming soon</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;