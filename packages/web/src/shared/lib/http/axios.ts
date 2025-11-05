import { default as axios, type InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 30 * 1000,
});

instance.interceptors.request.use((config) => {
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (param?: unknown) => unknown;
  reject: (param?: unknown) => unknown;
  config: InternalAxiosRequestConfig<unknown>;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else {
      if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
      resolve(instance(config));
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // const { data } = await axios.get("/auth/refresh");
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
