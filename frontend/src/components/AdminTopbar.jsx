import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiClipboard,
  FiClock,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiSearch,
  FiSettings,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiX
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoBeta from "../assets/beta.png";
import { useAuth } from "../context/AuthContext";
import { getUserDisplayName, getUserPhotoUrl } from "../utils/userUtils";
import "./AdminTopbar.css";

const adminNavMenus = [
  { name: "Dashboard", path: "/admin", icon: <FiGrid /> },
  { name: "Kelola Area", path: "/admin/area", icon: <FiMapPin /> },
  { name: "Kelola Shift", path: "/admin/shift", icon: <FiClock /> },
  { name: "Kelola OB", path: "/admin/ob", icon: <FiUsers /> },
  { name: "Kelola User", path: "/admin/users", icon: <FiUserCheck /> },
  { name: "Kelola Tugas", path: "/admin/tugas", icon: <FiClipboard /> },
  { name: "Laporan", path: "/admin/laporan", icon: <FiFileText /> },
  { name: "Pengaturan", path: "/admin/setting", icon: <FiSettings /> },
];

export default function AdminTopbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  searchDisabled = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);

  const wrapperRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const photoUrl = getUserPhotoUrl(user);
  const displayName = getUserDisplayName(user, "Admin");
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Admin";

  const handleLogout = () => {
    setIsNavDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Close dropdowns on route change
  useEffect(() => {
    setIsNavDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsNavDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    }
    
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsNavDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="admin-topbar-wrapper" ref={wrapperRef}>
      {/* Backdrop overlay for mobile dropdown */}
      {isNavDropdownOpen && (
        <div 
          className="admin-nav-backdrop" 
          onClick={() => setIsNavDropdownOpen(false)} 
          aria-hidden="true" 
        />
      )}

      <header className="admin-topbar">
        {/* Left Side: Logo BETA */}
        <Link 
          to="/admin" 
          className="admin-mobile-brand" 
          onClick={() => setIsNavDropdownOpen(false)}
          title="Dashboard Admin BETA"
        >
          <img src={logoBeta} alt="BETA Logo" className="admin-brand-logo" />
          <span className="admin-badge-pill">Admin</span>
        </Link>

        {/* Desktop Search Box (Hidden on Mobile/Tablet) */}
        <div className={`admin-search-box desktop-search ${searchDisabled ? 'disabled' : ''}`}>
          <FiSearch />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            disabled={searchDisabled || !onSearchChange}
          />
        </div>

        {/* Desktop Profile Box (Hidden on Mobile/Tablet) */}
        <div className="admin-topbar-right">
          <div
            className="admin-user-box"
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            title="Menu Akun Admin"
          >
            <img src={photoUrl} alt="Avatar" className="admin-avatar" />
            <div className="admin-user-info">
              <span className="admin-user-name">{displayName}</span>
              <span className="admin-user-role">{displayRole}</span>
            </div>
            <FiChevronDown className={`admin-user-dropdown-arrow ${isProfileDropdownOpen ? "open" : ""}`} />
          </div>

          {/* Desktop Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="admin-profile-dropdown" ref={profileDropdownRef}>
              <div className="admin-profile-dropdown-header">
                <h5>{displayName}</h5>
                <p>{user?.email || "admin@beta.com"}</p>
              </div>
              <div className="admin-profile-dropdown-menu">
                <button
                  type="button"
                  className="admin-profile-dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <FiUser /> Profil Saya
                </button>
                <button
                  type="button"
                  className="admin-profile-dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    navigate("/admin/setting");
                  }}
                >
                  <FiSettings /> Pengaturan
                </button>
                <button
                  type="button"
                  className="admin-profile-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side on Mobile/Tablet: Search Icon + Dropdown Menu Button */}
        <div className="admin-mobile-actions">
          {/* Mobile Search Toggle Button */}
          {!searchDisabled && onSearchChange && (
            <button
              type="button"
              className="admin-mobile-icon-btn"
              onClick={() => setIsSearchVisibleMobile((prev) => !prev)}
              aria-label="Toggle Pencarian"
              title="Cari"
            >
              <FiSearch />
            </button>
          )}

          {/* Mobile Navbar Dropdown Button */}
          <button
            type="button"
            className={`admin-mobile-menu-btn ${isNavDropdownOpen ? "active" : ""}`}
            onClick={() => {
              setIsNavDropdownOpen((prev) => !prev);
              setIsProfileDropdownOpen(false);
            }}
            aria-label="Menu Navigasi Admin"
            aria-expanded={isNavDropdownOpen}
          >
            {isNavDropdownOpen ? <FiX /> : <FiMenu />}
            <span>Menu</span>
            <FiChevronDown className={`menu-chevron ${isNavDropdownOpen ? "open" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Search Input Row (Expands below header row) */}
      {isSearchVisibleMobile && !searchDisabled && (
        <div className="admin-mobile-search-row">
          <div className="admin-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(event) => onSearchChange?.(event.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Navbar Dropdown Menu */}
      {isNavDropdownOpen && (
        <nav className="admin-nav-dropdown-menu" aria-label="Navigasi Menu Admin">
          {/* Header with Admin Info */}
          <div className="admin-dropdown-user-card">
            <div className="admin-dropdown-user-left">
              <img src={photoUrl} alt="Avatar" className="admin-dropdown-avatar" />
              <div>
                <h4 className="admin-dropdown-name">{displayName}</h4>
                <p className="admin-dropdown-role">Administrator BETA</p>
              </div>
            </div>
            <button 
              type="button" 
              className="admin-dropdown-close-btn"
              onClick={() => setIsNavDropdownOpen(false)}
              aria-label="Tutup Menu"
            >
              <FiX />
            </button>
          </div>

          {/* Menu Links */}
          <p className="admin-dropdown-section-title">Menu Navigasi Admin</p>
          <div className="admin-dropdown-links-grid">
            {adminNavMenus.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`admin-dropdown-link-item ${isActive ? "active" : ""}`}
                  onClick={() => setIsNavDropdownOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="admin-dropdown-footer-actions">
            <Link
              to="/profile"
              className="admin-dropdown-action-btn"
              onClick={() => setIsNavDropdownOpen(false)}
            >
              <FiUser /> Profil
            </Link>
            <button
              type="button"
              className="admin-dropdown-action-btn logout"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
