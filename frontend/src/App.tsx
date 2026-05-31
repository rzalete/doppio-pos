import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./stores/auth";

function App() {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={accessToken ? "/pos" : "/login"} replace />}
        />
        <Route path="/login" element={<div className="text-cream-50 p-8">Login page coming soon</div>} />
        <Route path="/pos" element={<div className="text-cream-50 p-8">POS page coming soon</div>} />
        <Route path="/dashboard" element={<div className="text-cream-50 p-8">Dashboard coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;