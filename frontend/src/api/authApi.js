import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/auth", 
});


authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;
