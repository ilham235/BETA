import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import "./KelolaUser.css";

import {
    FiChevronDown,
    FiEdit2,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiX,
} from "react-icons/fi";

// Data mock untuk KelolaUser (tanpa backend)
const MOCK_USERS = [
  { id_user: 1, nama_lengkap: "Admin Sistem", email: "admin@test.com", role: "Admin", status: "Aktif" },
  { id_user: 2, nama_lengkap: "Supervisor Satu", email: "supervisor1@test.com", role: "Supervisor", status: "Aktif" },
  { id_user: 3, nama_lengkap: "Supervisor Dua", email: "supervisor2@test.com", role: "Supervisor", status: "Aktif" },
  { id_user: 4, nama_lengkap: "Supervisor Tiga", email: "supervisor3@test.com", role: "Supervisor", status: "Nonaktif" },
];

export default function KelolaUser() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    role: "supervisor",
    status: "aktif",
  });

  useEffect(() => {

    setUsers(MOCK_USERS);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Yakin hapus user?")) return;
    setUsers(users.filter(u => u.id_user !== id));
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nama_lengkap: "",
        email: "",
        role: "supervisor",
        status: "aktif",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nama_lengkap || !formData.email) {
      alert("Nama & email wajib diisi");
      return;
    }

    setSaving(true);

    if (editingUser) {
      // Edit user
      setUsers(users.map(u => 
        u.id_user === editingUser.id_user ? { ...u, ...formData } : u
      ));
    } else {
      // Tambah user baru
      const newUser = {
        ...formData,
        id_user: Date.now(),
      };
      setUsers([...users, newUser]);
    }
    
    handleCloseModal();
    setSaving(false);
  };

  const filteredUser = users.filter((u) =>
    u.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kelola-user-page">
      <AdminSidebar />

      <main className="kelola-user-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="user-box">
            <div className="avatar">
              {user?.nama_lengkap?.charAt(0) || "A"}
            </div>
            <div>
              <h4>{user?.nama_lengkap}</h4>
              <p>Admin</p>
            </div>
            <FiChevronDown />
          </div>
        </header>

        {/* CONTENT */}
        <section className="content">
          <div className="header">
            <div>
              <h1>Kelola User</h1>
              <p>Manajemen data pengguna sistem</p>
            </div>

            <button className="btn-add" onClick={() => handleOpenModal()}>
              <FiPlus /> Tambah Data
            </button>
          </div>

          {/* TABLE */}
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty">Loading...</td>
                  </tr>
                ) : filteredUser.length > 0 ? (
                  filteredUser.map((item) => (
                    <tr key={item.id_user}>
                      <td>
                        <div className="user-row">
                          <div className="mini-avatar">
                            {item.nama_lengkap.charAt(0)}
                          </div>
                          {item.nama_lengkap}
                        </div>
                      </td>

                      <td>{item.email}</td>

                      <td>
                        <span className={`role ${item.role}`}>
                          {item.role}
                        </span>
                      </td>

                      <td>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="aksi">
                        <FiEdit2 
                          onClick={() => handleOpenModal(item)} 
                          style={{ color: "#3b82f6", cursor: "pointer" }}
                        />
                        <FiTrash2 
                          onClick={() => handleDelete(item.id_user)} 
                          style={{ color: "#ef4444", cursor: "pointer", marginLeft: "12px" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? "Edit User" : "Tambah User"}</h2>
              <FiX onClick={handleCloseModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Nama Lengkap"
                value={formData.nama_lengkap}
                onChange={(e) =>
                  setFormData({ ...formData, nama_lengkap: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}