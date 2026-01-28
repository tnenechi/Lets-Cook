import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "react-router";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshErr) {
        console.log("Refresh token failed", refreshErr);
        redirect("/");
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
