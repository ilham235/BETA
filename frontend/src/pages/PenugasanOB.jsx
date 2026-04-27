import { useEffect, useState } from "react";
import {
    FiChevronDown,
    FiEdit2,
    FiPlus,
    FiSearch,
    FiTrash2
} from "react-icons/fi";
import poto from "../assets/poto.jpg";
import Sidebar from "../components/Sidebar";
import { penugasanAPI } from "../service/api";
import Hapus from "./Delete";
import "./PenugasanOB.css";
import TambahTugas from "./TambahTugas";

export default function PenugasanOB() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [dataPenugasan, setDataPenugasan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function untuk transform data item
  const transformItem = (item) => {
    const tanggalAwal = new Date(item.tanggal_awal).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: '2-digit' 
    });
    const tanggalAkhir = new Date(item.tanggal_akhir).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: '2-digit' 
    });

    const tugas = item.detail_pekerjaan || "-";
    const shift = item.shift || "-";
    const petugas = item.nama_ob || "-";

    // Tentukan status: jika ada salah satu field yang kosong atau tidak diisi, tampilkan Belum
    const isComplete = [item.detail_pekerjaan, item.shift, item.nama_ob].every(
      (field) => field && String(field).trim() !== ""
    );
    const statusInput = isComplete ? "Lengkap" : "Belum";
    const status = statusInput;

    return {
      id_penugasan: item.id_penugasan,
      periode: `${tanggalAwal} - ${tanggalAkhir}`,
      area: item.nama_ruangan ? `${item.nama_ruangan} - Lantai ${item.lantai}` : "-",
      tugas: tugas,
      shift: shift,
      petugas: petugas,
      status: status,
      statusInput: statusInput,
      tanggalMulai: new Date(item.tanggal_awal),
      tanggalSelesai: new Date(item.tanggal_akhir),
      deskripsi: item.deskripsi || ""
    };
  };

  // Cek apakah penugasan masih aktif (tanggal akhir >= hari ini)
  const isPenugasanAktif = (tanggalSelesai) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(tanggalSelesai);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  };

  // Filter data - hanya tampilkan penugasan yang belum expired
  const activePenugasan = dataPenugasan.filter(item => isPenugasanAktif(item.tanggalSelesai));

  // Fetch data dari database
  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        setLoading(true);
        const response = await penugasanAPI.getAll();
        
        // Transform data dari database ke format yang sesuai dengan UI
        const transformedData = (response.data.data || []).map(transformItem);

        setDataPenugasan(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching penugasan:", err);
        setError("Gagal memuat data penugasan");
      } finally {
        setLoading(false);
      }
    };

    fetchPenugasan();
  }, []);

  const handleOpenAdd = () => {
    setSelectedTask(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Refresh data setelah simpan/edit - hanya update item yang diedit tanpa ubah urutan
  const handleSaveSuccess = async () => {
    try {
      // Fetch hanya data yang baru di-update (berdasarkan selectedTask ID)
      if (selectedTask && selectedTask.id_penugasan) {
        const response = await penugasanAPI.getAll();
        const updatedItem = (response.data.data || []).find(
          (item) => item.id_penugasan === selectedTask.id_penugasan
        );

        if (updatedItem) {
          // Update hanya item yang diedit dalam state
          const transformedUpdated = transformItem(updatedItem);
          setDataPenugasan((prevData) =>
            prevData.map((item) =>
              item.id_penugasan === selectedTask.id_penugasan
                ? transformedUpdated
                : item
            )
          );
        }
      } else {
        // Untuk penugasan baru, fetch semua data
        const response = await penugasanAPI.getAll();
        const transformedData = (response.data.data || []).map(transformItem);
        setDataPenugasan(transformedData);
      }
    } catch (err) {
      console.error("Error refreshing penugasan:", err);
    }
  };

  // Fungsi untuk membuka modal hapus
  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  // Refresh data setelah delete - hapus item dari state tanpa ubah urutan
  const handleDeleteSuccess = () => {
    if (selectedTask && selectedTask.id_penugasan) {
      // Hapus item dari state berdasarkan ID
      setDataPenugasan((prevData) =>
        prevData.filter((item) => item.id_penugasan !== selectedTask.id_penugasan)
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Cari" />
          </div>
          <div className="user-profile">
            <img src={poto} alt="avatar" className="avatar" />
            <div className="user-info">
              <p className="user-name">Wowo</p>
              <p className="user-role">Pengawas</p>
            </div>
            <FiChevronDown />
          </div>
        </header>

        <section className="content-inner">
          <div className="page-header">
            <div className="header-text">
              <h1>Penugasan OB</h1>
              <p>Lihat penugasan dan assign tugas</p>
            </div>
            <button className="btn-add-penugasan" onClick={handleOpenAdd}>
              <FiPlus /> Tambah Penugasan
            </button>
          </div>

          <div className="table-card">
            <div className="table-card-header">
              <h2>Daftar Penugasan</h2>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Area</th>
                  <th>Tugas</th>
                  <th>Shift</th>
                  <th>Petugas</th>
                  <th>Input Tugas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Loading data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                      {error}
                    </td>
                  </tr>
                ) : activePenugasan.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Tidak ada penugasan aktif. Silakan tambah penugasan baru.
                    </td>
                  </tr>
                ) : (
                  activePenugasan.map((item) => (
                    <tr key={item.id_penugasan}>
                      <td>{item.periode}</td>
                      <td>{item.area}</td>
                      <td>{item.tugas}</td>
                      <td>{item.shift}</td>
                      <td>{item.petugas}</td>
                      <td>
                        <span className={`badge ${item.status.toLowerCase() === 'lengkap' ? 'lengkap' : 'belum'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="action-btns">
                        <FiEdit2 className="edit-icon" onClick={() => handleOpenEdit(item)} style={{cursor: 'pointer'}} />
                        <FiTrash2 className="delete-icon" onClick={() => handleOpenDelete(item)} style={{cursor: 'pointer'}} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TambahTugas 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dataEdit={selectedTask}
        onSaveSuccess={handleSaveSuccess}
      />
      <Hapus 
        show={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={() => {
          setIsDeleteOpen(false);
          handleDeleteSuccess(); // Hapus item dari state setelah berhasil hapus
        }}
        selectedTask={selectedTask}
      />
    </div>
  );
}