import { useNavigate } from "react-router-dom";
import React from "react";
import "./Dashboard.css";

// 1. IMPORT gambar logo di sini (Pastikan file beta.png ada di folder src/assets)
import logoBeta from "../assets/beta.png";

import { 
  FiLayout, FiUsers, FiFileText, FiSettings, 
  FiHelpCircle, FiLogOut, FiSearch, FiPlus, FiChevronRight, FiArrowUpRight
} from "react-icons/fi";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <img 
            src={logoBeta} 
            alt="BETA - Bersih dan Tertata" 
            className="logo-full-img" 
          />
        </div>

        <nav className="menu">
          <p className="menu-label">MENU</p>
          <div className="menu-item active"><FiLayout /> Dashboard</div>
          <div className="menu-item"><FiUsers /> Penugasan OB</div>
          <div className="menu-item"><FiFileText /> Pengawasan</div>
          <div className="menu-item"><FiFileText /> Laporan</div>

          <p className="menu-label" style={{ marginTop: "30px" }}>UMUM</p>
          <div className="menu-item"><FiSettings /> Pengaturan</div>
          <div className="menu-item"><FiHelpCircle /> Bantuan</div>
          <div className="menu-item logout"><FiLogOut /> Logout</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Cari..." />
          </div>
          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">Wowo</p>
              <p className="user-role">Pengawas</p>
            </div>
            <img src="https://via.placeholder.com/40" alt="avatar" className="avatar" />
          </div>
        </header>

        <section className="content-inner">
          <div className="header-title">
            <h1>Dashboard Pengawas</h1>
            <p>Monitoring dan pengawasan tugas kebersihan</p>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            {/* Kartu 1 - Hijau */}
            <div className="stat-card green">
              <div className="stat-header">
                <p>Tugas Hari Ini</p>
                <div className="stat-icon-circle"><FiArrowUpRight /></div>
              </div>
              <h2>8</h2>
              <div className="stat-footer">
                <p className="footer-main">Tugas Hari Ini</p>
                <p className="footer-sub">+4 dari kemarin</p>
              </div>
            </div>

            {/* Kartu 2 - Putih */}
            <div className="stat-card white">
              <div className="stat-header">
                <p>Area Tercover</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <h2>2</h2>
              <div className="stat-footer">
                <p className="footer-main">Area dcheck</p>
                <p className="footer-sub">Tersisa 3</p>
              </div>
            </div>

            {/* Kartu 3 - Putih */}
            <div className="stat-card white">
              <div className="stat-header">
                <p>Tugas Selesai</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <h2>4</h2>
              <div className="stat-footer">
                <p className="footer-main">Tugas diselesaikan</p>
                <p className="footer-sub">Tersisa 4</p>
              </div>
            </div>

            {/* Kartu 4 - Progres */}
            <div className="stat-card white">
              <div className="stat-header">
                <p>Progres Monitoring</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <div className="progress-container">
                <div className="semi-circle">
                  <span className="percentage">100%</span>
                </div>
                <div className="progress-legend">
                  <span><i className="dot sudah"></i> Sudah</span>
                  <span><i className="dot belum"></i> Belum</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            {/* TABLE SECTION */}
           <div className="table-container">
              {/* HEADER TABEL */}
              <div className="table-header">
                <div className="header-left">
                  <h3>Tugas Hari Ini</h3>
                  <p className="table-date">Senin, 01 Februari 2026</p>
                </div>
                <div className="table-actions">
                  <div className="small-search">
                    <FiSearch />
                    <input type="text" placeholder="Cari tugas, area, atau petugas" />
                  </div>
                  <button className="btn-monitoring">
                    <FiLayout /> Monitoring
                  </button>
                  <button className="btn-add">
                    <FiPlus /> Tambah Tugas
                  </button>
                </div>
              </div>

              {/* TABEL DATA */}
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Tugas</th>
                    <th>Shift</th>
                    <th>Petugas</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lantai 2 - Ruang Rapat</td>
                    <td>Sapu Lantai</td>
                    <td>Pagi</td>
                    <td>Udin Mujadi</td>
                    <td><span className="status selesai">Selesai</span></td>
                  </tr>
                  <tr>
                    <td>Lantai 2 - Ruang Rapat</td>
                    <td>Pel Lantai</td>
                    <td>Pagi</td>
                    <td>Udin Mujadi</td>
                    <td><span className="status selesai">Selesai</span></td>
                  </tr>
                  <tr>
                    <td>Lantai 2 - Ruang Rapat</td>
                    <td>Lap/Rapikan Meja dan Kursi</td>
                    <td>Pagi</td>
                    <td>Udin Mujadi</td>
                    <td><span className="status selesai">Selesai</span></td>
                  </tr>
                  <tr>
                    <td>Lantai 1 - Kantor</td>
                    <td>Sapu Lantai</td>
                    <td>Pagi</td>
                    <td>Ahmad Suryadi</td>
                    <td><span className="status belum">Belum</span></td>
                  </tr>
                  <tr>
                    <td>Lantai 1 - Toilet</td>
                    <td>Kuras dan Sikat Toilet</td>
                    <td>Siang</td>
                    <td>Ahmad Suryadi</td>
                    <td><span className="status belum">Belum</span></td>
                  </tr>
                </tbody>
              </table>
              
              <div className="see-more">
                Lihat Selengkapnya <FiChevronRight />
              </div>
            </div>

            {/* RIGHT WIDGETS */}
            <div className="widgets">
              {/* WIDGET SHIFT */}
              <div className="shift-card">
                <div className="card-header">
                  <h3>Shift</h3>
                  <div className="icon-arrow-circle"><FiArrowUpRight /></div>
                </div>
                
                <div className="shift-list">
                  <div className="shift-item">
                    <span className="shift-icon">🌅</span>
                    <div className="shift-info">
                      <p className="shift-name">Shift Pagi</p>
                      <p className="shift-timer">00:20:00 Sisa</p>
                    </div>
                  </div>
                  
                  <div className="shift-item disabled">
                    <span className="shift-icon">☀️</span>
                    <div className="shift-info">
                      <p className="shift-name">Shift Siang</p>
                      <p className="shift-timer">00:00:00 Sisa</p>
                    </div>
                  </div>
                  
                  <div className="shift-item disabled">
                    <span className="shift-icon">🌇</span>
                    <div className="shift-info">
                      <p className="shift-name">Shift Sore</p>
                      <p className="shift-timer">00:00:00 Sisa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET BUAT LAPORAN */}
              <div className="report-card">
                <div className="card-header">
                  <h3>Buat <br /> Laporan</h3>
                  <div className="icon-arrow-circle white"><FiArrowUpRight /></div>
                </div>
                <button className="btn-export">Ekspor Laporan</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}