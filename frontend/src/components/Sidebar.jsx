import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoBeta from "../assets/beta.png";
import { 
  FiLayout, FiUsers, FiFileText, FiSettings, 
  FiHelpCircle, FiLogOut 
} from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Login");
    navigate("/");
  };

  return (
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
        
        <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <FiLayout /> Dashboard
        </Link>
        
        <Link to="/penugasan" className={`menu-item ${location.pathname === '/penugasan' ? 'active' : ''}`}>
          <FiUsers /> Penugasan OB
        </Link>
        
        <Link to="/pengawasan" className={`menu-item ${location.pathname === '/pengawasan' ? 'active' : ''}`}>
          <FiFileText /> Pengawasan
        </Link>
        
        <Link to="/laporan" className={`menu-item ${location.pathname === '/laporan' ? 'active' : ''}`}>
          <FiFileText /> Laporan
        </Link>

        <p className="menu-label" style={{ marginTop: "30px" }}>UMUM</p>
        
        <div className="menu-item"><FiSettings /> Pengaturan</div>
        <div className="menu-item"><FiHelpCircle /> Bantuan</div>
        <div className="menu-item logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </div>
      </nav>
    </aside>
  );
}