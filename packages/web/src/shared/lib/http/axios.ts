import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import axios, { type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

import useAuthStore from "@/stores/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002",
  withCredentials: true,
  timeout: 30 * 1000,
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(instance(config));
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 && 재시도 아닐 때 && refresh 엔드포인트가 아닐 때
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(SERVICE_ENDPOINTS.AUTH.REFRESH.path)
    ) {
      // 이미 refresh 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3002"}${SERVICE_ENDPOINTS.AUTH.REFRESH.path}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.access_token;

        // 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken);

        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // 리프레시도 실패하면 로그아웃
        toast.error("세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.");
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        setTimeout(() => window.location.replace("/login"), 1000);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
