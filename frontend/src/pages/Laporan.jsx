import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiCalendar,
    FiChevronDown,
    FiClipboard,
    FiDownload,
    FiPieChart,
    FiPrinter,
    FiSearch,
    FiTrendingUp
} from "react-icons/fi";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";
import poto from "../assets/poto.jpg";
import Sidebar from "../components/Sidebar";
import { penugasanAPI } from "../service/api";
import "./Laporan.css";

export default function Laporan() {
  const [search, setSearch] = useState("");
  const [riwayatTugas, setRiwayatTugas] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [performaArea, setPerformaArea] = useState([]);
  const [distribusiData, setDistribusiData] = useState([]);
  const [ringkasanData, setRingkasanData] = useState({
    periode: "",
    totalSelesai: 0,
    totalBelum: 0,
    rataRataHarian: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states - set default to today for mulai, empty for selesai
  const [filterTanggalMulai, setFilterTanggalMulai] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  });
  const [filterTanggalSelesai, setFilterTanggalSelesai] = useState(""); // Kosongkan default agar bisa filter tanggal mulai saja
  const [filterArea, setFilterArea] = useState(""); // "" = semua area
  const [filteredData, setFilteredData] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  // Fetch laporan data
  useEffect(() => {
    const fetchLaporanData = async () => {
      try {
        setLoading(true);
        // Jika ada filter tanggal, fetch dengan parameter tanggal
        let response;
        if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai !== filterTanggalSelesai && 
            filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
          // Jika ada range tanggal yang berbeda, fetch semua data dan filter client-side
          response = await penugasanAPI.getLaporan();
        } else if (filterTanggalMulai && filterTanggalMulai.trim() !== "" && 
                   (!filterTanggalSelesai || filterTanggalSelesai.trim() === "")) {
          // Jika hanya ada tanggal mulai (tanpa tanggal selesai), fetch data untuk tanggal mulai saja
          response = await penugasanAPI.getLaporan(filterTanggalMulai);
        } else if (filterTanggalSelesai && filterTanggalSelesai.trim() !== "" && 
                   (!filterTanggalMulai || filterTanggalMulai.trim() === "")) {
          // Jika hanya ada tanggal selesai (tanpa tanggal mulai), fetch data untuk tanggal selesai saja
          response = await penugasanAPI.getLaporan(filterTanggalSelesai);
        } else if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai === filterTanggalSelesai && 
                   filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
          // Jika tanggal mulai dan selesai sama, fetch data untuk tanggal tersebut
          response = await penugasanAPI.getLaporan(filterTanggalMulai);
        } else {
          // Jika tidak ada filter tanggal yang valid, fetch semua data
          response = await penugasanAPI.getLaporan();
        }
        const laporanList = response.data.data || [];

        // Transform data dari laporan ke format untuk ditampilkan
        const transformedData = laporanList.map((item) => {
          const tanggalFormatted = new Date(item.tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
          });
          
          return {
            id_laporan: item.id_laporan,
            tanggal: tanggalFormatted,
            tanggalRaw: new Date(item.tanggal),
            area: item.nama_ruangan ? `${item.nama_ruangan} - Lantai ${item.lantai}` : "-",
            tugas: item.detail_pekerjaan || item.deskripsi_penugasan || "-",
            petugas: item.person_assigned || item.nama_ob || "-",
            shift: item.shift || "-",
            status_kehadiran: item.status_kehadiran,
            nilai: item.nilai,
            status: item.status_kehadiran === "hadir" ? "Hadir" : "Tidak Hadir"
          };
        });

        // Sort by tanggal (newest first)
        transformedData.sort((a, b) => b.tanggalRaw - a.tanggalRaw);

        setRiwayatTugas(transformedData);

        // Calculate trend data (grouped by date) - berdasarkan nilai (hijau=selesai)
        const trendMap = {};
        transformedData.forEach((item) => {
          const hari = item.tanggal;
          if (!trendMap[hari]) {
            trendMap[hari] = { hari, Selesai: 0, Total: 0 };
          }
          trendMap[hari].Total++;
          if (item.nilai === "green") {
            trendMap[hari].Selesai++;
          }
        });
        setTrendData(Object.values(trendMap).slice(0, 7));

        // Calculate performa per area - berdasarkan nilai (hijau=selesai)
        const areaMap = {};
        transformedData.forEach((item) => {
          const areaName = item.area;
          if (!areaMap[areaName]) {
            areaMap[areaName] = { area: areaName, Selesai: 0, Total: 0 };
          }
          areaMap[areaName].Total++;
          if (item.nilai === "green") {
            areaMap[areaName].Selesai++;
          }
        });
        setPerformaArea(Object.values(areaMap));

        // Calculate distribusi
        const totalLaporan = transformedData.length;
        const totalSelesai = transformedData.filter(item => item.nilai === "green").length;
        const totalBelum = totalLaporan - totalSelesai;
        setDistribusiData([
          { name: "Selesai", value: totalSelesai, color: "#0a8f3c" },
          { name: "Belum Selesai", value: totalBelum, color: "#ef4444" }
        ]);

        // Calculate ringkasan
        const uniqueDates = new Set(transformedData.map(item => item.tanggal));
        const periodeTxt = transformedData.length > 0 
          ? `${transformedData[transformedData.length - 1].tanggal} – ${transformedData[0].tanggal}`
          : "-";
        const avgHarian = uniqueDates.size > 0 ? Math.round(totalSelesai / uniqueDates.size) : 0;

        setRingkasanData({
          periode: periodeTxt,
          totalSelesai: totalSelesai,
          totalBelum: totalBelum,
          rataRataHarian: avgHarian
        });

        // Set default filter: tanggal mulai = today, tanggal selesai = kosong (untuk filter tanggal mulai saja)
        // Extract unique areas
        const uniqueAreas = [...new Set(transformedData.map(item => item.area).filter(a => a !== "-"))];
        setAllAreas(uniqueAreas);

        setError(null);
      } catch (err) {
        console.error("Error fetching laporan:", err);
        setError("Gagal memuat data laporan");
      } finally {
        setLoading(false);
      }
    };

    fetchLaporanData();
  }, [filterTanggalMulai, filterTanggalSelesai]); // Refetch when date filters change

  // Fungsi untuk menghitung analytics berdasarkan data yang sudah difilter
  const calculateAnalytics = (filteredData) => {
    // Calculate trend data (grouped by date) - berdasarkan nilai (hijau=selesai)
    const trendMap = {};
    filteredData.forEach((item) => {
      const hari = item.tanggal;
      if (!trendMap[hari]) {
        trendMap[hari] = { hari, Selesai: 0, Total: 0 };
      }
      trendMap[hari].Total++;
      if (item.nilai === "green") {
        trendMap[hari].Selesai++;
      }
    });
    setTrendData(Object.values(trendMap).slice(0, 7));

    // Calculate performa per area - berdasarkan nilai (hijau=selesai)
    const areaMap = {};
    filteredData.forEach((item) => {
      const areaName = item.area;
      if (!areaMap[areaName]) {
        areaMap[areaName] = { area: areaName, Selesai: 0, Total: 0 };
      }
      areaMap[areaName].Total++;
      if (item.nilai === "green") {
        areaMap[areaName].Selesai++;
      }
    });
    setPerformaArea(Object.values(areaMap));

    // Calculate distribusi
    const totalLaporan = filteredData.length;
    const totalSelesai = filteredData.filter(item => item.nilai === "green").length;
    const totalBelum = totalLaporan - totalSelesai;
    setDistribusiData([
      { name: "Selesai", value: totalSelesai, color: "#0a8f3c" },
      { name: "Belum Selesai", value: totalBelum, color: "#ef4444" }
    ]);

    // Calculate ringkasan
    const uniqueDates = new Set(filteredData.map(item => item.tanggal));
    const periodeTxt = filteredData.length > 0 
      ? `${filteredData[filteredData.length - 1].tanggal} – ${filteredData[0].tanggal}`
      : "-";
    const avgHarian = uniqueDates.size > 0 ? Math.round(totalSelesai / uniqueDates.size) : 0;

    setRingkasanData({
      periode: periodeTxt,
      totalSelesai: totalSelesai,
      totalBelum: totalBelum,
      rataRataHarian: avgHarian
    });
  };

  // Apply filters setiap ada perubahan
  const applyFilters = () => {
    let filtered = riwayatTugas;

    // Filter by tanggal mulai (hanya untuk range tanggal yang valid dan berbeda)
    if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai !== filterTanggalSelesai && 
        filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
      const startDate = new Date(filterTanggalMulai);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => item.tanggalRaw >= startDate);
    }

    // Filter by tanggal selesai (hanya untuk range tanggal yang valid dan berbeda)
    if (filterTanggalSelesai && filterTanggalMulai && filterTanggalMulai !== filterTanggalSelesai &&
        filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
      const endDate = new Date(filterTanggalSelesai);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => item.tanggalRaw <= endDate);
    }

    // Filter by area
    if (filterArea) {
      filtered = filtered.filter(item => item.area === filterArea);
    }

    // Hitung analytics berdasarkan data yang sudah difilter (tanpa search)
    calculateAnalytics(filtered);
  };

  // Trigger filter apply when any filter changes
  useEffect(() => {
    applyFilters();
  }, [filterTanggalMulai, filterTanggalSelesai, filterArea, riwayatTugas]);

  // Hitung ulang analytics ketika filtered data berubah (termasuk search)
  useEffect(() => {
    const filtered = riwayatTugas.filter((item) => {
      // Terapkan filter tanggal (hanya untuk range tanggal yang valid dan berbeda)
      let matchesDate = true;
      if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai !== filterTanggalSelesai && 
          filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
        const startDate = new Date(filterTanggalMulai);
        matchesDate = item.tanggalRaw >= startDate;
      }
      if (filterTanggalSelesai && filterTanggalMulai && filterTanggalMulai !== filterTanggalSelesai && 
          filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "" && matchesDate) {
        const endDate = new Date(filterTanggalSelesai);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = item.tanggalRaw <= endDate;
      }

      // Terapkan filter area
      let matchesArea = !filterArea || item.area === filterArea;

      // Terapkan search
      const matchesSearch = 
        item.tugas.toLowerCase().includes(search.toLowerCase()) ||
        item.area.toLowerCase().includes(search.toLowerCase()) ||
        item.petugas.toLowerCase().includes(search.toLowerCase());

      return matchesDate && matchesArea && matchesSearch;
    });

    // Update filtered data dan hitung analytics
    setFilteredData(filtered);
    calculateAnalytics(filtered);
  }, [filterTanggalMulai, filterTanggalSelesai, filterArea, search, riwayatTugas]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>⏳ Memuat data laporan...</p>
          </div>
        </main>
      </div>
    );
  }

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
                <input
                  type="date"
                  value={filterTanggalMulai}
                  onChange={(e) => setFilterTanggalMulai(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div className="filter-item">
                <label>Tanggal Selesai</label>
                <input
                  type="date"
                  value={filterTanggalSelesai}
                  onChange={(e) => setFilterTanggalSelesai(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div className="filter-item">
                <label>Filter Area</label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Semua Area</option>
                  {allAreas.map((area, idx) => (
                    <option key={idx} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
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
            <div className="table-scroll-container">
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
                  {error ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#d32f2f" }}>
                        ❌ {error}
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                        Tidak ada data laporan
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, i) => (
                      <tr key={item.id_laporan || i}>
                        <td>{item.tanggal}</td>
                        <td>{item.area}</td>
                        <td>{item.tugas}</td>
                        <td>{item.petugas}</td>
                        <td>{item.shift}</td>
                        <td>
                          <span className={`status-badge ${item.status_kehadiran === "hadir" ? "selesai" : "belum"}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
              <ResponsiveContainer width="100%" height={260}>
                <PieChart margin={{ top: 30, right: 80, bottom: 30, left: 80 }}>
                  <Pie
                    data={distribusiData}
                    cx="40%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                    labelPosition="right"
                  >
                    {distribusiData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
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
                  <span className="ringkasan-value green">{ringkasanData.periode || "-"}</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Total Tugas Hadir</span>
                  <span className="ringkasan-value green">{ringkasanData.totalSelesai} tugas</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Total Tugas Tidak Hadir</span>
                  <span className="ringkasan-value green">{ringkasanData.totalBelum} tugas</span>
                </div>
                <div className="ringkasan-item">
                  <span className="ringkasan-label">Rata-rata Harian</span>
                  <span className="ringkasan-value green">{ringkasanData.rataRataHarian} tugas/hari</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}