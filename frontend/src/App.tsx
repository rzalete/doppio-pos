import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./stores/auth";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Menu from "./pages/admin/Menu";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";

function App() {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={accessToken ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><Categories /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><Menu /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><Orders /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><Users /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute requiredRole="cashier">
              <div className="text-cream-50 p-8">POS coming soon</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;