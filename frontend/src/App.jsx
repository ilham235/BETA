import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import KelolaArea from "./pages/KelolaArea";
import KelolaUser from "./pages/KelolaUser";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Pengawasan from "./pages/Pengawasan";
import PenugasanOB from "./pages/PenugasanOB";

// Component untuk redirect berdasarkan role
function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><DashboardAdmin /></AdminRoute>} />
      <Route path="/admin/area" element={<AdminRoute><KelolaArea /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><KelolaUser /></AdminRoute>} />
      <Route path="/penugasan" element={<ProtectedRoute><PenugasanOB /></ProtectedRoute>} />
      <Route path="/pengawasan" element={<ProtectedRoute><Pengawasan /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Laporan/></ProtectedRoute>} />
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}