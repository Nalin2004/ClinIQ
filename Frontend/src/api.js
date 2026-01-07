import axios from "axios";

const api = axios.create({
  baseURL: "https://cliniq-1-tex8.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cliniq_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
