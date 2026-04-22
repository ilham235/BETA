import { useEffect, useState } from "react";
import { PieChart } from 'react-minimal-pie-chart';
import iconPagi from "../assets/pagi.png";
import poto from "../assets/poto.jpg";
import iconSiang from "../assets/siang.png";
import iconSore from "../assets/sore.png";
import Sidebar from "../components/Sidebar"; // Import Sidebar baru
import { useAuth } from "../context/AuthContext";
import { penugasanAPI } from "../service/api";
import "./Dashboard.css";
import TambahTugas from "./TambahTugas";

import {
    FiArrowUpRight, FiChevronDown,
    FiChevronRight,
    FiLayout,
    FiPlus,
    FiSearch
} from "react-icons/fi";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [penugasanList, setPenugasanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    tugasHariIni: 0,
    areaTercover: 0,
    tugasSelesai: 0,
    progressPercentage: 0
  });

  const { user } = useAuth();

  // Fetch penugasan data
  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        setLoading(true);
        const response = await penugasanAPI.getAll();
        
        if (response.data.success) {
          const data = response.data.data || [];
          setPenugasanList(data);
          
          console.log("Data from API:", data);
          
          // Tugas yang belum selesai / aktif
          const tugasAktif = data.filter(item => 
            item.status !== 'selesai' && item.status !== 'Selesai'
          ).length;

          // Area tercover (jumlah ruangan unik)
          const areaTercover = new Set(data.filter(item => item.id_ruangan).map(item => item.id_ruangan)).size;

          // Tugas selesai
          const tugasSelesai = data.filter(item => item.status === 'selesai' || item.status === 'Selesai').length;

          // Progress percentage
          const progressPercentage = data.length > 0 
            ? Math.round((tugasSelesai / data.length) * 100)
            : 0;

          console.log("Stats:", { tugasAktif, areaTercover, tugasSelesai, progressPercentage });

          setStats({
            tugasHariIni: tugasAktif,
            areaTercover,
            tugasSelesai,
            progressPercentage
          });
        }
      } catch (err) {
        console.error("Error fetching penugasan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPenugasan();
  }, []);

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format status
  const getStatusClass = (status) => {
    if (!status) return 'belum';
    return status.toLowerCase() === 'selesai' ? 'selesai' : 'belum';
  };

  // Shift configuration
  const shifts = [
    { name: 'Pagi', start: '07:00', end: '10:30', icon: iconPagi },
    { name: 'Siang', start: '10:30', end: '14:00', icon: iconSiang },
    { name: 'Sore', start: '14:00', end: '17:00', icon: iconSore }
  ];

  // Helper function to get current shift and time remaining
  const getShiftStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Total minutes

    return shifts.map(shift => {
      const [startHour, startMinute] = shift.start.split(':').map(Number);
      const [endHour, endMinute] = shift.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      const isActive = currentTime >= startTime && currentTime < endTime;
      
      let timeRemaining = 0;
      if (isActive) {
        timeRemaining = endTime - currentTime; // Minutes remaining
      } else if (currentTime < startTime) {
        timeRemaining = startTime - currentTime; // Time until shift starts
      } else {
        timeRemaining = 0; // Shift already ended
      }

      // Convert minutes to HH:MM:SS format
      const hours = Math.floor(timeRemaining / 60);
      const minutes = timeRemaining % 60;
      const seconds = 0;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      return {
        ...shift,
        isActive,
        timeRemaining: formattedTime,
        isEnded: currentTime >= endTime
      };
    });
  };

  const [shiftStatus, setShiftStatus] = useState(getShiftStatus());

  // Update shift status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setShiftStatus(getShiftStatus());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Cukup panggil komponen Sidebar */}
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Cari..." />
          </div>
          <div className="user-profile">
            <img src={poto} alt="avatar" className="avatar" />
            <div className="user-info">
              <p className="user-name">{user?.nama_lengkap || user?.username || "User"}</p>
              <p className="user-role">{user?.role || "Pengawas"}</p>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </div>
        </header>

        <section className="content-inner">
          <div className="header-title">
            <h1>Dashboard Pengawas</h1>
            <p>Monitoring dan pengawasan tugas kebersihan</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-header">
                <p>Tugas Aktif</p>
                <div className="stat-icon-circle"><FiArrowUpRight /></div>
              </div>
              <h2>{stats.tugasHariIni}</h2>
              <div className="stat-footer">
                <p className="footer-main">Tugas Belum Selesai</p>
                <p className="footer-sub">Dari {penugasanList.length} Total Tugas</p>
              </div>
            </div>

            <div className="stat-card white">
              <div className="stat-header">
                <p>Area Tercover</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <h2>{stats.areaTercover}</h2>
              <div className="stat-footer">
                <p className="footer-main">Area dcheck</p>
                <p className="footer-sub">Total Area: {penugasanList.length > 0 ? penugasanList.length : '0'}</p>
              </div>
            </div>

            <div className="stat-card white">
              <div className="stat-header">
                <p>Tugas Selesai</p>
                <div className="stat-icon-circle border"><FiArrowUpRight /></div>
              </div>
              <h2>{stats.tugasSelesai}</h2>
              <div className="stat-footer">
                <p className="footer-main">Tugas diselesaikan</p>
                <p className="footer-sub">Tersisa {penugasanList.length - stats.tugasSelesai}</p>
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
                  data={[{ value: stats.progressPercentage, color: '#0a8f3c' }]}
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
            <div className="table-container">
              <div className="table-header">
                <div className="header-left">
                  <h3>Daftar Tugas</h3>
                  <p className="table-date">{formatDate(new Date())}</p>
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
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        Loading data...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                        Error: {error}
                      </td>
                    </tr>
                  ) : penugasanList.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        Tidak ada tugas
                      </td>
                    </tr>
                  ) : (
                    penugasanList.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td>{item.nama_ruangan || 'N/A'} - Lantai {item.lantai || 'N/A'}</td>
                        <td>{item.detail_pekerjaan || 'N/A'}</td>
                        <td>{item.shift || 'N/A'}</td>
                        <td>{item.nama_lengkap || item.username || 'N/A'}</td>
                        <td><span className={`status ${getStatusClass(item.status)}`}>{item.status || 'Belum'}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="see-more">Lihat Selengkapnya <FiChevronRight /></div>
            </div>

            <div className="widgets">
              <div className="shift-card">
                <div className="card-header">
                  <h3>Shift</h3>
                  <div className="icon-arrow-circle"><FiArrowUpRight /></div>
                </div>
                <div className="shift-list">
                  {shiftStatus.map((shift, index) => (
                    <div key={index} className={`shift-item ${shift.isEnded ? 'disabled' : ''} ${shift.isActive ? 'active' : ''}`}>
                      <img src={shift.icon} alt={shift.name} className="shift-img-icon" />
                      <div className="shift-info">
                        <p className="shift-name">Shift {shift.name}</p>
                        <p className="shift-time">{shift.start} - {shift.end}</p>
                        <p className="shift-timer">{shift.timeRemaining} {shift.isActive ? 'Sisa' : shift.isEnded ? 'Selesai' : 'Dimulai'}</p>
                      </div>
                    </div>
                  ))}
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

      <TambahTugas show={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}