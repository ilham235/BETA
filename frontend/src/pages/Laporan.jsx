import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import poto from "../assets/poto.jpg";
import "./Laporan.css";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  FiSearch, 
  FiChevronDown, 
  FiPrinter, 
  FiDownload,
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart, 
  FiClipboard,
  FiCalendar
} from "react-icons/fi";

const riwayatTugas = [
  { tanggal: "1 Feb 26", area: "Lantai 1 - Kantor", tugas: "Sapu Lantai", petugas: "Ahmad Suryadi", shift: "Pagi", status: "Selesai" },
  { tanggal: "2 Feb 26", area: "Lantai 1 - Toilet", tugas: "Kuras dan Sikat Toilet", petugas: "Ahmad Suryadi", shift: "Siang", status: "Selesai" },
  { tanggal: "3 Feb 26", area: "Lantai 2 - Ruang Rapat", tugas: "Buang Sampah", petugas: "Ahmad Suryadi", shift: "Siang", status: "Selesai" },
  { tanggal: "4 Feb 26", area: "Lantai 2 - Ruang Rapat", tugas: "Sapu Lantai", petugas: "Udin Mujadi", shift: "Pagi", status: "Selesai" },
  { tanggal: "5 Feb 26", area: "Lantai 2 - Ruang Rapat", tugas: "Pel Lantai", petugas: "Udin Mujadi", shift: "Pagi", status: "Selesai" },
  { tanggal: "6 Feb 26", area: "Lantai 2 - Ruang Rapat", tugas: "Lap/Rapikan Meja dan Kursi", petugas: "Udin Mujadi", shift: "Pagi", status: "Belum" },
];

const trendData = [
  { hari: "1 Feb", Selesai: 3, Total: 4 },
  { hari: "2 Feb", Selesai: 2, Total: 3 },
  { hari: "3 Feb", Selesai: 4, Total: 4 },
  { hari: "4 Feb", Selesai: 1, Total: 3 },
  { hari: "5 Feb", Selesai: 3, Total: 4 },
  { hari: "6 Feb", Selesai: 2, Total: 4 },
  { hari: "7 Feb", Selesai: 4, Total: 4 },
];

const performaArea = [
  { area: "Kantor", Selesai: 3, Total: 3 },
  { area: "Toilet", Selesai: 2, Total: 3 },
  { area: "Rapat", Selesai: 3, Total: 3 },
  { area: "Halaman", Selesai: 2, Total: 3 },
  { area: "Lobby", Selesai: 3, Total: 3 },
];

const distribusiData = [
  { name: "Selesai", value: 12, color: "#0a8f3c" },
  { name: "Belum Selesai", value: 2, color: "#ef4444" },
];

export default function Laporan() {
  const [search, setSearch] = useState("");

  const filtered = riwayatTugas.filter((item) =>
    item.tugas.toLowerCase().includes(search.toLowerCase()) ||
    item.area.toLowerCase().includes(search.toLowerCase()) ||
    item.petugas.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="laporan-header">
            <div className="header-text">
              <h1>Laporan Kebersihan</h1>
              <p>Monitor dan analisis performa tugas kebersihan</p>
            </div>
            <div className="laporan-actions">
              <button className="btn-cetak"><FiPrinter /> Cetak PDF</button>
              <button className="btn-unduh"><FiDownload /> Unduh Excel</button>
            </div>
          </div>

          <div className="filter-card">
            <div className="filter-title">
              <div className="icon-box"><FiCalendar /></div> Filter Laporan
            </div>
            <div className="filter-grid">
              <div className="filter-item">
                <label>Tanggal Mulai</label>
                <div className="filter-select">
                  <span>1 Februari 2026</span>
                  <FiChevronDown />
                </div>
              </div>
              <div className="filter-item">
                <label>Tanggal Selesai</label>
                <div className="filter-select">
                  <span>7 Februari 2026</span>
                  <FiChevronDown />
                </div>
              </div>
              <div className="filter-item">
                <label>Filter Area</label>
                <div className="filter-select">
                  <span>Semua Area</span>
                  <FiChevronDown />
                </div>
              </div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>Riwayat Tugas</h3>
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
                  <th>Tanggal</th>
                  <th>Area</th>
                  <th>Tugas</th>
                  <th>Petugas</th>
                  <th>Shift</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i}>
                    <td>{item.tanggal}</td>
                    <td>{item.area}</td>
                    <td>{item.tugas}</td>
                    <td>{item.petugas}</td>
                    <td>{item.shift}</td>
                    <td>
                      <span className={`status-badge ${item.status === "Selesai" ? "selesai" : "belum"}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="icon-box"><FiTrendingUp /></div>
                <h3>Trend Tugas Harian</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <XAxis dataKey="hari" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Selesai" stroke="#0a8f3c" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div className="icon-box"><FiBarChart2 /></div>
                <h3>Performa Per Area</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={performaArea}>
                  <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Selesai" fill="#0a8f3c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div className="icon-box"><FiPieChart /></div>
                <h3>Distribusi Penyelesaian</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={distribusiData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {distribusiData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card ringkasan-card">
              <div className="chart-card-header">
                <div className="icon-box"><FiClipboard /></div>
                <h3>Ringkasan Periode</h3>
              </div>
              <div className="ringkasan-list">
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Periode Laporan</span>
                  <span className="ringkasan-value green">1 Feb – 7 Feb 2026</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Total Tugas Selesai</span>
                  <span className="ringkasan-value green">12 tugas</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Total Tugas Belum Selesai</span>
                  <span className="ringkasan-value green">2 tugas</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Rata-rata Harian</span>
                  <span className="ringkasan-value green">2 tugas/hari</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}