import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan token ke request jika ada
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  getMe: () => apiClient.get("/auth/me"),
  getUsers: () => apiClient.get("/auth/users"),
};

export const penugasanAPI = {
  getAll: () => apiClient.get("/penugasan"),
  create: (data) => apiClient.post("/penugasan", data),
  update: (id, data) => apiClient.put(`/penugasan/${id}`, data),
  delete: (id) => apiClient.delete(`/penugasan/${id}`),
  getOB: () => apiClient.get("/penugasan/ob/all"),
  getRuangan: () => apiClient.get("/penugasan/ruangan/all"),
  createLaporan: (data) => apiClient.post("/penugasan/laporan", data),
  getLaporan: (tanggal) => apiClient.get("/penugasan/laporan/all", {
    params: tanggal ? { tanggal } : {}
  }),
  getLaporanByPenugasan: (id_penugasan, tanggal) => apiClient.get(`/penugasan/laporan/${id_penugasan}`, {
    params: tanggal ? { tanggal } : {}
  }),
  updateLaporan: (id_laporan, data) => apiClient.put(`/penugasan/laporan/${id_laporan}`, data),
};

export default apiClient;
