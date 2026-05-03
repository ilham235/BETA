import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { shiftAPI } from "../service/api";
import "./KelolaShift.css";

import {
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export default function KelolaShift() {
  const { user } = useAuth();

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama_shift: "",
    jam_mulai: "",
    jam_selesai: "",
  });

  useEffect(() => {
    fetchShift();
  }, []);

  const fetchShift = async () => {
    try {
      setLoading(true);
      const res = await shiftAPI.getAll();

      if (res.data.success) {
        setShifts(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus shift?")) return;

    try {
      await shiftAPI.delete(id);
      fetchShift();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = (shift = null) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        nama_shift: shift.nama_shift,
        jam_mulai: shift.jam_mulai,
        jam_selesai: shift.jam_selesai,
      });
    } else {
      setEditingShift(null);
      setFormData({
        nama_shift: "",
        jam_mulai: "",
        jam_selesai: "",
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_shift || !formData.jam_mulai || !formData.jam_selesai) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      setSaving(true);

      if (editingShift) {
        await shiftAPI.update(editingShift.id_shift, formData);
      } else {
        await shiftAPI.create(formData);
      }

      handleCloseModal();
      fetchShift();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="kelola-shift-page">
      <AdminSidebar />

      <main className="kelola-shift-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="Cari..." />
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
              <h1>Kelola Shift</h1>
              <p>Kelola data shift kerja</p>
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
                  <th>No</th>
                  <th>Nama Shift</th>
                  <th>Jam Mulai</th>
                  <th>Jam Selesai</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Loading...
                    </td>
                  </tr>
                ) : shifts.length > 0 ? (
                  shifts.map((item, index) => (
                    <tr key={item.id_shift}>
                      <td>{index + 1}</td>
                      <td>{item.nama_shift}</td>
                      <td>{item.jam_mulai}</td>
                      <td>{item.jam_selesai}</td>

                      <td className="aksi">
                        <FiEdit2 onClick={() => handleOpenModal(item)} />
                        <FiTrash2 onClick={() => handleDelete(item.id_shift)} />
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
              <h2>{editingShift ? "Edit Shift" : "Tambah Shift"}</h2>
              <FiX onClick={handleCloseModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nama Shift"
                value={formData.nama_shift}
                onChange={(e) =>
                  setFormData({ ...formData, nama_shift: e.target.value })
                }
              />

              <input
                type="time"
                value={formData.jam_mulai}
                onChange={(e) =>
                  setFormData({ ...formData, jam_mulai: e.target.value })
                }
              />

              <input
                type="time"
                value={formData.jam_selesai}
                onChange={(e) =>
                  setFormData({ ...formData, jam_selesai: e.target.value })
                }
              />

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