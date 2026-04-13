import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PenugasanOB from "./pages/PenugasanOB";
import Pengawasan from "./pages/Pengawasan";
import Laporan from "./pages/Laporan";

const isLogin = () => {
  return localStorage.getItem("Login") === "true";
};

const ProtectedRoute = ({ children }) => {
  return isLogin() ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/penugasan" element={<ProtectedRoute><PenugasanOB /></ProtectedRoute>} />
      <Route path="/pengawasan" element={<ProtectedRoute><Pengawasan /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Laporan/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}