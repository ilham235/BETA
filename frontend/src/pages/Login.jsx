import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("Login", "true");
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <img src={logo} alt="logo" className="logo" />

        <h2 className="bps">BADAN PUSAT STATISTIK</h2>
        <h2 className="bps">KOTA SUKABUMI</h2>

        <h1 className="title">BETA</h1>
        <p className="subtitle">Bersih dan Tertata</p>

        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <div className="remember-container">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Ingat saya</label>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="forgot">
          Lupa Password? <span>Hubungi Admin</span>
        </p>

      </div>
    </div>
  );
}