import { useState } from "react";
import { PieChart } from 'react-minimal-pie-chart';
import { useNavigate } from "react-router-dom";
import logoBeta from "../assets/beta.png";
import iconPagi from "../assets/pagi.png";
import poto from "../assets/poto.jpg";
import iconSiang from "../assets/siang.png";
import iconSore from "../assets/sore.png";
import "./Dashboard.css";
import TambahTugas from "./TambahTugas";

import {
  FiArrowUpRight, FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiHelpCircle,
  FiLayout,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUsers
} from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = () => {
    navigate("/");
  };

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
          <div className="menu-item logout" onClick={handleLogout}><FiLogOut /> Logout</div>
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
            {/* Foto Profil */}
            <img src={poto} alt="avatar" className="avatar" />
            
            {/* Nama dan Role */}
            <div className="user-info">
              <p className="user-name">Wowo</p>
              <p className="user-role">Pengawas</p>
            </div>

            {/* Ikon Panah Bawah */}
            <FiChevronDown className="dropdown-icon" />
          </div>
        </header>

        {/* KOTAK KONTEN UTAMA (#F6F6F6) */}
        <section className="content-inner">
          <div className="header-title">
            <h1>Dashboard Pengawas</h1>
            <p>Monitoring dan pengawasan tugas kebersihan</p>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
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

            <div className="stat-card white progres-card-container">
              <div className="stat-header">
                <p>Progres Monitoring</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <div className="gauge-wrapper">
                <PieChart
                  data={[{ value: 100, color: '#edf2f7' }]}
                  lineWidth={25}
                  startAngle={180}
                  lengthAngle={180}
                  rounded
                  className="gauge-bg"
                />
                <PieChart
                  data={[{ value: 80, color: '#0a8f3c' }]} 
                  totalValue={100}
                  lineWidth={25}
                  startAngle={180}
                  lengthAngle={180}
                  rounded
                  animate
                  label={({ dataEntry }) => `${dataEntry.value}%`}
                  labelStyle={{ fontSize: '22px', fontWeight: 'bold', fill: '#2d3748' }}
                  labelPosition={0}
                  className="gauge-chart"
                />
              </div>
              <div className="progress-legend">
                <div className="legend-item"><i className="dot sudah"></i> Sudah</div>
                <div className="legend-item"><i className="dot belum"></i> Belum</div>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            {/* TABLE SECTION */}
            <div className="table-container">
              <div className="table-header">
                <div className="header-left">
                  <h3>Tugas Hari Ini</h3>
                  <p className="table-date">Senin, 01 Februari 2026</p>
                </div>
                <div className="table-actions">
                  <div className="small-search">
                    <FiSearch />
                    <input type="text" placeholder="Cari tugas..." />
                  </div>
                  <button className="btn-monitoring"><FiLayout /> Monitoring</button>
                  <button className="btn-add" onClick={()=> setIsModalOpen(true)}><FiPlus /> Tambah Tugas</button>
                </div>
              </div>

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
                    <td>Lantai 1 - Kantor</td>
                    <td>Sapu Lantai</td>
                    <td>Pagi</td>
                    <td>Ahmad Suryadi</td>
                    <td><span className="status belum">Belum</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="see-more">Lihat Selengkapnya <FiChevronRight /></div>
            </div>

            {/* RIGHT WIDGETS */}
            <div className="widgets">
              {/* SHIFT LENGKAP DENGAN IKON GAMBAR BARU */}
              <div className="shift-card">
                <div className="card-header">
                  <h3>Shift</h3>
                  <div className="icon-arrow-circle"><FiArrowUpRight /></div>
                </div>
                <div className="shift-list">
                  
                  {/* Pagi */}
                  <div className="shift-item">
                    {/* +++ GANTI EMOJI DENGAN IMG +++ */}
                    <img src={iconPagi} alt="Pagi" className="shift-img-icon" />
                    <div className="shift-info">
                      <p className="shift-name">Shift Pagi</p>
                      <p className="shift-timer">00:20:00 Sisa</p>
                    </div>
                  </div>

                  {/* Siang */}
                  <div className="shift-item disabled">
                    {/* +++ GANTI EMOJI DENGAN IMG +++ */}
                    <img src={iconSiang} alt="Siang" className="shift-img-icon" />
                    <div className="shift-info">
                      <p className="shift-name">Shift Siang</p>
                      <p className="shift-timer">00:00:00 Sisa</p>
                    </div>
                  </div>

                  {/* Sore */}
                  <div className="shift-item disabled">
                    {/* +++ GANTI EMOJI DENGAN IMG +++ */}
                    <img src={iconSore} alt="Sore" className="shift-img-icon" />
                    <div className="shift-info">
                      <p className="shift-name">Shift Sore</p>
                      <p className="shift-timer">00:00:00 Sisa</p>
                    </div>
                  </div>

                </div>
              </div>

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
      <TambahTugas 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} />
    </div>
  );
}