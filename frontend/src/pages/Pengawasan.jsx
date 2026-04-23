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
import Detail from "./Detail";
import "./Pengawasan.css";
import Penilaian from "./penilaian";

export default function Pengawasan() {
  const [search, setSearch] = useState("");
  const [modalNilai, setModalNilai] = useState(null); // Menyimpan data item yang akan dinilai
  const [modalDetail, setModalDetail] = useState(null);
  const [dataTugas, setDataTugas] = useState([]);
  const [laporanMap, setLaporanMap] = useState({}); // Map id_penugasan -> laporan data
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
        
        // Fetch penugasan data
        const penugasanResponse = await penugasanAPI.getAll();
        
        // Transform data dari database ke format yang sesuai dengan UI
        let transformedData = (penugasanResponse.data.data || []).map(transformItem);

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

        // Fetch semua laporan hanya untuk tanggal hari ini
        try {
          const todayString = new Date().toLocaleDateString('en-CA');
          const laporanResponse = await penugasanAPI.getLaporan(todayString);
          const laporanDataArray = laporanResponse.data.data || [];
          
          // Create map: id_penugasan -> laporan data
          const laporan = {};
          laporanDataArray.forEach(report => {
            laporan[report.id_penugasan] = report;
          });
          setLaporanMap(laporan);

          // Update status item berdasarkan laporan hari ini
          const updatedData = filteredData.map(item => ({
            ...item,
            status: laporan[item.id_penugasan] ? "Selesai" : ""
          }));
          
          setDataTugas(updatedData);
        } catch (laporanErr) {
          console.error("Error fetching laporan:", laporanErr);
          setDataTugas(filteredData);
        }

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
                      <td>{laporanMap[item.id_penugasan]?.person_assigned || item.petugas}</td>
                      <td>
                        {item.status === "Selesai" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="color-box-p" style={{
                              backgroundColor: 
                                laporanMap[item.id_penugasan]?.nilai === "green" ? "#28a745" :
                                laporanMap[item.id_penugasan]?.nilai === "yellow" ? "#ffeb3b" :
                                laporanMap[item.id_penugasan]?.nilai === "red" ? "#dc3545" : "#ccc"
                            }}></span>
                            <span style={{ fontSize: "13px", fontWeight: "500", color: "#4a4a4a" }}>
                              {laporanMap[item.id_penugasan]?.nilai === "green" ? "Baik" :
                               laporanMap[item.id_penugasan]?.nilai === "yellow" ? "Cukup" :
                               laporanMap[item.id_penugasan]?.nilai === "red" ? "Kurang" : "-"}
                            </span>
                          </div>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </td>
                      <td>
                        {item.status === "Selesai" ? (
                          <button className="btn-detail" onClick={() => setModalDetail(item)}>
                            <FiInfo /> Detail
                          </button>
                        ) : (
                          <button className="btn-nilai" onClick={() => setModalNilai(item)}>
                            <FiStar /> Nilai
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
          onClose={() => {
            setModalNilai(null);
            // Refresh data setelah simpan
            penugasanAPI.getLaporan().then(res => {
              const laporan = {};
              (res.data.data || []).forEach(report => {
                laporan[report.id_penugasan] = report;
              });
              setLaporanMap(laporan);
              // Refresh penugasan juga untuk update status
              penugasanAPI.getAllPenugasan().then(res => {
                const filtered = (res.data.data || []).filter(item => {
                  const tanggal = new Date(item.tanggal_awal);
                  return tanggal >= new Date() && tanggal.getHours() <= 18;
                });
                setDataTugas(filtered.map(transformItem));
              }).catch(err => console.error("Error refetching penugasan:", err));
            }).catch(err => console.error("Error refetching laporan:", err));
          }}
        />
      )}

      {/* Modal Detail Terpisah */}
      {modalDetail && (
        <Detail
          data={modalDetail}
          laporanData={laporanMap[modalDetail.id_penugasan]}
          onClose={() => setModalDetail(null)}
          onUpdateSuccess={() => {
            // Refresh data setelah update
            setModalDetail(null);
            // Re-fetch laporan
            penugasanAPI.getLaporan().then(res => {
              const laporan = {};
              (res.data.data || []).forEach(report => {
                laporan[report.id_penugasan] = report;
              });
              setLaporanMap(laporan);
            }).catch(err => console.error("Error refetching laporan:", err));
          }}
        />
      )}
    </div>
  );
}