import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../service/api";
import "./DashboardAdmin.css";

import {
  FiArrowUpRight,
  FiChevronDown,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";

export default function DashboardAdmin() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalArea: 0,
    totalUser: 0,
    totalTugas: 0,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);

        const response = await adminAPI.getDashboardStats();

        if (response.data.success) {
          const { data } = response.data;

          setStats({
            totalArea: data.total_area || 0,
            totalUser: data.total_user || 0,
            totalTugas: data.total_tugas || 0,
          });

          setActivities(data.recent_activities || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();

    if (s === "selesai") return "done";
    if (s === "sedang berlangsung") return "progress";
    return "waiting";
  };

  return (
    <div className="dashboard-admin-page">
      <AdminSidebar className="admin-sidebar" />

      <main className="dashboard-admin-main">
        {/* TOPBAR */}
        <header className="dashboard-topbar">
          <div className="dashboard-search">
            <FiSearch />
            <input type="text" placeholder="Cari..." />
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {user?.nama_lengkap?.charAt(0) || "A"}
            </div>

            <div>
              <h4>{user?.nama_lengkap || "Admin User"}</h4>
              <p>Admin</p>
            </div>

            <FiChevronDown />
          </div>
        </header>

        {/* CONTENT */}
        <section className="dashboard-content">
          <div className="dashboard-title">
            <h1>Dashboard Admin</h1>
            <p>Selamat datang di sistem monitoring kebersihan BETA</p>
          </div>

          {/* CARD */}
          <div className="dashboard-cards">
            <div
              className="dashboard-card green"
              onClick={() => navigate("/kelola-area")}
            >
              <div className="card-top">
                <span>Total Area</span>
                <div className="card-arrow white-circle">
                  <FiArrowUpRight />
                </div>
              </div>

              <h2>{loading ? "..." : stats.totalArea}</h2>
              <p className="koneng">Area</p>
              <p className="tiny">+1 bulan ini</p>
            </div>

            <div
              className="dashboard-card white"
              onClick={() => navigate("/kelola-user")}
            >
              <div className="card-top">
                <span>Total User</span>
                <div className="card-arrow border-circle">
                  <FiArrowUpRight />
                </div>
              </div>

              <h2>{loading ? "..." : stats.totalUser}</h2>
              <p className="small">User</p>
            </div>

            <div
              className="dashboard-card white"
              onClick={() => navigate("/kelola-tugas")}
            >
              <div className="card-top">
                <span>Total Tugas</span>
                <div className="card-arrow border-circle">
                  <FiArrowUpRight />
                </div>
              </div>

              <h2>{loading ? "..." : stats.totalTugas}</h2>
              <p className="small">Tugas</p>
              <p className="tiny">+10 hari ini</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="dashboard-table-box">
            <h3>Aktivitas Terbaru</h3>

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Aksi</th>
                  <th>Area</th>
                  <th>Waktu</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {activities.length > 0 ? (
                  activities.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="user-row">
                          <span className="mini-avatar">
                            {item.nama?.charAt(0)}
                          </span>
                          {item.nama}
                        </div>
                      </td>

                      <td>{item.aksi}</td>
                      <td>{item.area}</td>
                      <td>{item.waktu}</td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status === "Selesai" && (
                            <FiCheckCircle size={14} />
                          )}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      Tidak ada aktivitas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}