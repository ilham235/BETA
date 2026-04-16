import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import poto from "../assets/poto.jpg";
import Penilaian from "./penilaian";
import "./Pengawasan.css";
import {
  FiSearch, FiChevronDown, FiStar, FiInfo
} from "react-icons/fi";

const dataTugas = [
  { id: 1, area: "Lantai 1 - Kantor", tugas: "Sapu Lantai", shift: "Pagi", petugas: "Ahmad Suryadi", status: "Belum" },
  { id: 2, area: "Lantai 1 - Toilet", tugas: "Kuras dan Sikat Toilet", shift: "Siang", petugas: "Ahmad Suryadi", status: "Belum" },
  { id: 3, area: "Lantai 2 - Ruang Rapat", tugas: "Buang Sampah", shift: "Siang", petugas: "Ahmad Suryadi", status: "Belum" },
  { id: 4, area: "Lantai 2 - Ruang Rapat", tugas: "Sapu Lantai", shift: "Pagi", petugas: "Udin Mujadi", status: "Selesai" },
  { id: 5, area: "Lantai 2 - Ruang Rapat", tugas: "Pel Lantai", shift: "Pagi", petugas: "Udin Mujadi", status: "Selesai" },
  { id: 6, area: "Lantai 2 - Ruang Rapat", tugas: "Lap/Rapikan Meja dan Kursi", shift: "Pagi", petugas: "Udin Mujadi", status: "Selesai" },
];

export default function Pengawasan() {
  const [search, setSearch] = useState("");
  const [modalNilai, setModalNilai] = useState(null); // Menyimpan data item yang akan dinilai
  const [modalDetail, setModalDetail] = useState(null);

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
                {filtered.map((item) => (
                  <tr key={item.id}>
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
                ))}
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