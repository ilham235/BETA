import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { areaAPI } from "../service/api";
import "./KelolaArea.css";

import {
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export default function KelolaArea() {
  const { user } = useAuth();

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({ nama: "", deskripsi: "", status: "aktif" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArea();
  }, []);

  const fetchArea = async () => {
    try {
      setLoading(true);
      const res = await areaAPI.getAll();

      if (res.data.success) {
        setAreas(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data?")) return;

    try {
      await areaAPI.delete(id);
      fetchArea();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = (area = null) => {
    if (area) {
      setEditingArea(area);
      setFormData({ nama: area.nama, deskripsi: area.deskripsi || "", status: area.status });
    } else {
      setEditingArea(null);
      setFormData({ nama: "", deskripsi: "", status: "aktif" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArea(null);
    setFormData({ nama: "", deskripsi: "", status: "aktif" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert("Nama area harus diisi");
      return;
    }

    try {
      setSaving(true);
      if (editingArea) {
        await areaAPI.update(editingArea.id_area, formData);
      } else {
        await areaAPI.create(formData);
      }
      handleCloseModal();
      fetchArea();
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const filteredArea = areas.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kelola-area-page">
      <AdminSidebar />

      <main className="kelola-area-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Cari area..."
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
              <h1>Kelola Area</h1>
              <p>Manajemen data area kebersihan</p>
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
                  <th>Deskripsi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      Loading...
                    </td>
                  </tr>
                ) : filteredArea.length > 0 ? (
                  filteredArea.map((item) => (
                    <tr key={item.id_area}>
                      <td>{item.nama}</td>
                      <td>{item.deskripsi}</td>

                      <td>
                        <span
                          className={`status ${
                            item.status === "aktif"
                              ? "aktif"
                              : "nonaktif"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="aksi">
                        <FiEdit2 className="edit" onClick={() => handleOpenModal(item)} />
                        <FiTrash2
                          className="delete"
                          onClick={() => handleDelete(item.id_area)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty">
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
              <h2>{editingArea ? "Edit Area" : "Tambah Area"}</h2>
              <FiX className="close-btn" onClick={handleCloseModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Area</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Masukkan nama area"
                  required
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Masukkan deskripsi area"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit" className="btn-save" disabled={saving}>
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