import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../service/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek token saat mount dan restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      // Simpan ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login gagal";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal menyimpan profil";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const response = await authAPI.uploadPhoto(file);
      console.log("📸 Upload response:", response.data);
      const updatedUser = response.data.user;
      console.log("📸 Updated user:", updatedUser);

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal upload foto";
      console.error("❌ Upload error:", err);
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateProfile,
    uploadPhoto,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
};
