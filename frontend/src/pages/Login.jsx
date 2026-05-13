import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [remember, setRemember] = useState(false);

  // Load remembered username on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberUsername");
    const storedRemember = localStorage.getItem("rememberMe") === "true";
    
    if (storedUsername && storedRemember) {
      setUsername(storedUsername);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validasi input
    if (!username || !password) {
      setLocalError("Username dan password harus diisi");
      return;
    }

    try {
      const result = await login(username, password);
      
      // Handle remember me functionality
      if (remember) {
        localStorage.setItem("rememberUsername", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberUsername");
        localStorage.removeItem("rememberMe");
      }
      
      // Arahkan berdasarkan role user
      if (result.user && result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || "Login gagal. Silahkan coba lagi.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="logo" className="logo" />

        <h2 className="bps">BADAN PUSAT STATISTIK</h2>
        <h2 className="bps">KOTA SUKABUMI</h2>

        <h1 className="title">BETA</h1>
        <p className="subtitle">Bersih dan Tertata</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <div className="remember-container">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="remember">Ingat saya</label>
          </div>

          {displayError && (
            <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
              ❌ {displayError}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="forgot">
          Lupa Password? <span>Hubungi Admin</span>
        </p>
      </div>
    </div>
  );
}