import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PenugasanOB from "./pages/PenugasanOB"; // Import halaman baru

const isLogin = () => {
  return localStorage.getItem("Login") === "true";
};

const ProtectedRoute = ({ children }) => {
  return isLogin() ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Routes>
      {/* Halaman Login */}
      <Route path="/" element={<Login />} />

      {/* Halaman Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Halaman Penugasan OB */}
      <Route
        path="/penugasan"
        element={
          <ProtectedRoute>
            <PenugasanOB />
          </ProtectedRoute>
        }
      />

      {/* Halaman Kosong (Placeholder) */}
      <Route
        path="/pengawasan"
        element={
          <ProtectedRoute>
            <div style={{ padding: "20px" }}>Halaman Pengawasan (Belum Dibuat)</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan"
        element={
          <ProtectedRoute>
            <div style={{ padding: "20px" }}>Halaman Laporan (Belum Dibuat)</div>
          </ProtectedRoute>
        }
      />

      {/* Redirect jika path tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}