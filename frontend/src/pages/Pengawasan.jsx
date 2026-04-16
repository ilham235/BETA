import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiInfo,
  FiSearch,
  FiStar
} from "react-icons/fi";
import poto from "../assets/poto.jpg";
import Sidebar from "../components/Sidebar";
import { penugasanAPI } from "../service/api";
import "./Pengawasan.css";
import Penilaian from "./penilaian";

export default function Pengawasan() {
  const [search, setSearch] = useState("");
  const [modalNilai, setModalNilai] = useState(null); // Menyimpan data item yang akan dinilai
  const [modalDetail, setModalDetail] = useState(null);
  const [dataTugas, setDataTugas] = useState([]);
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

    // Tentukan status input tugas
    const isComplete = [item.detail_pekerjaan, item.shift, item.nama_ob].every(
      (field) => field && String(field).trim() !== ""
    );
    const statusInput = isComplete ? "Lengkap" : "Belum";

    // Untuk Pengawasan, status penyelesaian awalnya "Belum"
    const status = "Belum";

    return {
      id_penugasan: item.id_penugasan,
      area: item.nama_ruangan ? `${item.nama_ruangan} - Lantai ${item.lantai}` : "-",
      tugas: tugas,
      shift: shift,
      petugas: petugas,
      status: status,
      statusInput: statusInput,
      tanggalAwal: new Date(item.tanggal_awal),
      tanggalAkhir: new Date(item.tanggal_akhir),
      deskripsi: item.deskripsi || ""
    };
  };

  // Fetch data dari database
  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        setLoading(true);
        const response = await penugasanAPI.getAll();
        
        // Transform data dari database ke format yang sesuai dengan UI
        const transformedData = (response.data.data || []).map(transformItem);

        // Filter: hanya yang statusInput "Lengkap" dan tanggal hari ini berada dalam periode
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const filteredData = transformedData.filter((item) => {
          const start = new Date(item.tanggalAwal);
          const end = new Date(item.tanggalAkhir);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          return item.statusInput === "Lengkap" && now >= start && now <= end;
        });

        setDataTugas(filteredData);
        setError(null);
      } catch (err) {
        console.error("Error fetching penugasan:", err);
        setError("Gagal memuat data pengawasan");
      } finally {
        setLoading(false);
      }
    };

    fetchPenugasan();
  }, []);

  const filtered = dataTugas.filter((item) =>
    item.tugas.toLowerCase().includes(search.toLowerCase()) ||
    item.area.toLowerCase().includes(search.toLowerCase()) ||
    item.petugas.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });

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
            <FiChevronDown className="dropdown-icon" />
          </div>
        </header>

        <section className="content-inner">
          <div className="page-header">
            <div className="header-text">
              <h1>Pengawasan Tugas</h1>
              <p>Pantau progres pengerjaan dan berikan penilaian</p>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <div className="header-left">
                <h3>Tugas Hari Ini</h3>
                <p className="table-date">{today}</p>
              </div>
              <div className="small-search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Cari tugas, area, atau petugas"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Tugas</th>
                  <th>Shift</th>
                  <th>Petugas</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Loading data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                      {error}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Tidak ada data pengawasan
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id_penugasan}>
                      <td>{item.area}</td>
                      <td>{item.tugas}</td>
                      <td>{item.shift}</td>
                      <td>{item.petugas}</td>
                      <td>
                        <span className={`status-badge ${item.status === "Selesai" ? "selesai" : "belum"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.status === "Belum" ? (
                          <button className="btn-nilai" onClick={() => setModalNilai(item)}>
                            <FiStar /> Nilai
                          </button>
                        ) : (
                          <button className="btn-detail" onClick={() => setModalDetail(item)}>
                            <FiInfo /> Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Nilai Menggunakan File Terpisah */}
      {modalNilai && (
        <Penilaian
          data={modalNilai} 
          onClose={() => setModalNilai(null)} 
        />
      )}

      {/* Modal Detail (Tetap inline karena tidak diminta ubah) */}
      {modalDetail && (
        <div className="modal-overlay" onClick={() => setModalDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="icon-main-bg-detail"><FiInfo /></div>
              <h2 className="modal-title">Detail Tugas</h2>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Area</span>
                <span className="detail-value">{modalDetail.area}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tugas</span>
                <span className="detail-value">{modalDetail.tugas}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Shift</span>
                <span className="detail-value">{modalDetail.shift}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Petugas</span>
                <span className="detail-value">{modalDetail.petugas}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${modalDetail.status === "Selesai" ? "selesai" : "belum"}`}>
                  {modalDetail.status}
                </span>
              </div>
            </div>

            <div className="modal-footer-btns">
              <button className="btn-modal-simpan" onClick={() => setModalDetail(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}