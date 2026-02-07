import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshing = false;
let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.data?.message === "TOKEN_EXPIRED" &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;
        refreshPromise = api.post("/auth/refresh").finally(() => {
          refreshing = false;
        });
      }

      try {
        await refreshPromise;
        return api(original);
      } catch {
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
