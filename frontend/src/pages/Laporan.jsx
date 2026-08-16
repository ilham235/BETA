import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiCalendar,
    FiClipboard,
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
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { areaAPI, penugasanAPI } from "../service/api";
import "./Laporan.css";

// Map numeric/keyword nilai to human-readable label
const getKeteranganNilai = (nilai) => {
  if (!nilai) return "-";
  switch (nilai) {
    case "green":
    case "hijau":
      return "Sangat Bersih";
    case "yellow":
    case "kuning":
      return "Cukup Bersih";
    case "red":
    case "merah":
      return "Kurang Bersih";
    default:
      return String(nilai);
  }
};

// Map nilai to CSS class for badge
const getKeteranganClass = (nilai) => {
  if (!nilai) return "belum";
  switch (nilai) {
    case "green":
    case "hijau":
      return "selesai";
    case "yellow":
    case "kuning":
      return "warning";
    case "red":
    case "merah":
      return "belum";
    default:
      return "belum";
  }
};

// Generate A4 PDF from the displayed table data only
const generatePDF = (data = []) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const startY = 20;

  doc.setFontSize(16);
  doc.text('Form Penilaian BETA', pageWidth / 2, startY, { align: 'center' });

  const head = [["Tanggal", "Area", "Tugas", "Petugas", "Keterangan"]];
  const body = data.map(item => [
    item.tanggal || '-',
    item.area || '-',
    item.tugas || '-',
    item.petugas || '-',
    // if status text is stored under 'status' or fallback to keterangan
    (item.status || item.keterangan || '-')
  ]);

  // Dynamic column widths based on content length
  const availableWidth = pageWidth - margin * 2;
  const colsCount = head[0].length;
  const allRows = [head[0], ...body];
  const maxLens = Array(colsCount).fill(1);
  allRows.forEach(row => {
    row.forEach((cell, idx) => {
      const len = String(cell || '').length;
      if (len > maxLens[idx]) maxLens[idx] = len;
    });
  });
  const totalLen = maxLens.reduce((s, v) => s + v, 0) || colsCount;
  const minWidths = [25, 40, 60, 40, 30];
  const colWidths = maxLens.map((l, i) => Math.max(minWidths[i] || 20, Math.round((l / totalLen) * availableWidth)));
  let sumWidths = colWidths.reduce((s, v) => s + v, 0);
  if (sumWidths > availableWidth) {
    const scale = availableWidth / sumWidths;
    for (let i = 0; i < colWidths.length; i++) colWidths[i] = Math.floor(colWidths[i] * scale);
    sumWidths = colWidths.reduce((s, v) => s + v, 0);
    let rem = availableWidth - sumWidths;
    let idx = 0;
    while (rem > 0) {
      colWidths[idx % colWidths.length] += 1;
      rem--;
      idx++;
    }
  }
  const columnStyles = {};
  colWidths.forEach((w, i) => { columnStyles[i] = { cellWidth: w }; });

  autoTable(doc, {
    head,
    body,
    startY: startY + 8,
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: [240,240,240], textColor: 20 },
    theme: 'grid',
    columnStyles
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 250;
  // Signature block aligned to right
  const sigX = pageWidth - margin - 60;
  doc.setFontSize(11);
  doc.text('Mengetahui,', sigX, finalY);
  doc.text('( ________________________ )', sigX, finalY + 25);

  const fileName = `laporan_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

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
  
  // Filter states
  const [filterTanggalMulai, setFilterTanggalMulai] = useState(() => {
    // load dari localStorage, jika tidak ada gunakan kosong
    const saved = localStorage.getItem('laporan_filterTanggalMulai');
    return saved || "";
  });
  const [filterTanggalSelesai, setFilterTanggalSelesai] = useState(() => {
    const saved = localStorage.getItem('laporan_filterTanggalSelesai');
    return saved || "";
  });
  const [filterArea, setFilterArea] = useState(() => {
    const saved = localStorage.getItem('laporan_filterArea');
    return saved || "";
  });
  const [filteredData, setFilteredData] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const normalizeDateToLocalString = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateWithinRange = (itemDate, start, end) => {
    const itemDateString = normalizeDateToLocalString(itemDate);
    if (!itemDateString) return false;
    return itemDateString >= start && itemDateString <= end;
  };

  // Fetch list area dari database saat component mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await areaAPI.getAll();
        if (response.data.success && response.data.data) {
          // Convert area data ke format yang sesuai untuk dropdown
          const areaList = response.data.data.map(area => {
            // Sesuaikan dengan format yang digunakan di laporan (nama_ruangan - Lantai)
            const lantai = area.lantai || area.lantai_id || "1";
            return `${area.nama_ruangan || area.nama} - Lantai ${lantai}`;
          });
          setAllAreas(areaList);
        }
      } catch (err) {
        console.error("Error fetching areas:", err);
        // Tetap lanjut meskipun fetch area gagal, akan diisi dari laporan data
      }
    };

    fetchAreas();
  }, []); // Run once on mount

  // Fetch laporan data
  useEffect(() => {
    const fetchLaporanData = async () => {
      try {
        setLoading(true);
        let response;
        if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
          response = await penugasanAPI.getLaporan({
            tanggal_awal: filterTanggalMulai,
            tanggal_akhir: filterTanggalSelesai
          });
        } else if (filterTanggalMulai && filterTanggalMulai.trim() !== "" && 
                   (!filterTanggalSelesai || filterTanggalSelesai.trim() === "")) {
          response = await penugasanAPI.getLaporan(filterTanggalMulai);
        } else if (filterTanggalSelesai && filterTanggalSelesai.trim() !== "" && 
                   (!filterTanggalMulai || filterTanggalMulai.trim() === "")) {
          response = await penugasanAPI.getLaporan(filterTanggalSelesai);
        } else if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai === filterTanggalSelesai && 
                   filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
          response = await penugasanAPI.getLaporan(filterTanggalMulai);
        } else {
          response = await penugasanAPI.getLaporan();
        }
        const laporanList = response.data.data || [];

        const transformedData = laporanList.map((item) => {
          const tanggalFormatted = new Date(item.tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
          });
          const tugasText = item.detail_pekerjaan || item.deskripsi_penugasan || "-";
          
          return {
            id_laporan: item.id_laporan,
            tanggal: tanggalFormatted,
            tanggalRaw: new Date(item.tanggal),
            area: item.nama_ruangan ? `${item.nama_ruangan} - Lantai ${item.lantai}` : "-",
            tugas: tugasText,
            // Prefer OB name from laporan (nama_ob) as Petugas; fallback to person_assigned
            petugas: item.nama_ob || item.person_assigned || "-",
            status_kehadiran: item.status_kehadiran,
            nilai: item.nilai,
            // Use `status` from DB when available; fallback to attendance-based label
            status: item.status || (item.status_kehadiran === "hadir" ? "Hadir" : "Tidak Hadir")
          };
        });

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

        // Gabungkan area dari API dengan area yang ada di laporan data
        const uniqueLaporanAreas = [...new Set(transformedData.map(item => item.area).filter(a => a !== "-"))];
        const combinedAreas = [...new Set([...allAreas, ...uniqueLaporanAreas])].sort();
        setAllAreas(combinedAreas);

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

    // Filter by tanggal mulai dan tanggal selesai untuk jangkauan tanggal
    if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
      filtered = filtered.filter(item => 
        isDateWithinRange(item.tanggalRaw, filterTanggalMulai, filterTanggalSelesai)
      );
    }

    // Filter by area
    if (filterArea) {
      filtered = filtered.filter(item => item.area === filterArea);
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

  // Simpan filter ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('laporan_filterTanggalMulai', filterTanggalMulai || "");
  }, [filterTanggalMulai]);

  useEffect(() => {
    localStorage.setItem('laporan_filterTanggalSelesai', filterTanggalSelesai || "");
  }, [filterTanggalSelesai]);

  useEffect(() => {
    localStorage.setItem('laporan_filterArea', filterArea || "");
  }, [filterArea]);

  // Hitung ulang analytics ketika filtered data berubah (termasuk search)
  useEffect(() => {
    const filtered = riwayatTugas.filter((item) => {
      // Terapkan filter tanggal untuk jangkauan tanggal
      let matchesDate = true;
      if (filterTanggalMulai && filterTanggalSelesai && filterTanggalMulai.trim() !== "" && filterTanggalSelesai.trim() !== "") {
        matchesDate = isDateWithinRange(item.tanggalRaw, filterTanggalMulai, filterTanggalSelesai);
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
      <div className="laporan-page">
        <AdminSidebar />
        <main className="laporan-main">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>⏳ Memuat data laporan...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="laporan-page">
      <AdminSidebar />

      <main className="laporan-main">
        <AdminTopbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari laporan..."
        />

        <section className="content">
          <div className="header">
            <div>
              <h1>Laporan Kebersihan</h1>
              <p>Monitor dan analisis performa tugas kebersihan</p>
            </div>

            <button
              type="button"
              className="btn-cetak"
              onClick={() => generatePDF(filteredData)}
              title="Export Laporan ke PDF"
            >
              <FiPrinter /> Cetak PDF
            </button>
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
                  className="filter-date-input"
                  value={filterTanggalMulai}
                  onChange={(e) => setFilterTanggalMulai(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <label>Tanggal Selesai</label>
                <input
                  type="date"
                  className="filter-date-input"
                  value={filterTanggalSelesai}
                  onChange={(e) => setFilterTanggalSelesai(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <label>Filter Area</label>
                <select
                  className="filter-select-input"
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
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

          <div className="laporan-table-card table-card">
            <div className="laporan-table-header table-header">
              <h3>Riwayat Tugas</h3>
              <div className="laporan-table-search small-search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Cari tugas, area, atau petugas"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="laporan-table-scroll table-scroll-container">
              <table className="laporan-table custom-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Area</th>
                    <th>Tugas</th>
                    <th>Petugas</th>
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
                        <td>
                          <span className={`status-badge ${item.nilai ? getKeteranganClass(item.nilai) : (item.status_kehadiran === "hadir" ? "selesai" : "belum")}`}>
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
