import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Pengawasan from "./pages/Pengawasan";
import PenugasanOB from "./pages/PenugasanOB";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/penugasan" element={<ProtectedRoute><PenugasanOB /></ProtectedRoute>} />
      <Route path="/pengawasan" element={<ProtectedRoute><Pengawasan /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Laporan/></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}