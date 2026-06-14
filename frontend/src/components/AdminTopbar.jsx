import { FiChevronDown, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import poto from "../assets/poto.jpg";
import { useAuth } from "../context/AuthContext";
import { API_ORIGIN } from "../service/api";

export default function AdminTopbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari",
  searchDisabled = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const photoUrl = user?.foto ? `${API_ORIGIN}${user.foto}` : poto;
  const displayName = user?.nama_lengkap || user?.username || "Admin";
  const displayRole = user?.role || "Admin";

  return (
    <header className="topbar">
      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue ?? ""}
          onChange={(event) => onSearchChange?.(event.target.value)}
          disabled={searchDisabled || !onSearchChange}
        />
      </div>

      <div
        className="user-box"
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        {user?.foto ? (
          <img src={photoUrl} alt="avatar" className="avatar" />
        ) : (
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
        )}
        <div>
          <h4>{displayName}</h4>
          <p>{displayRole}</p>
        </div>
        <FiChevronDown />
      </div>
    </header>
  );
}
