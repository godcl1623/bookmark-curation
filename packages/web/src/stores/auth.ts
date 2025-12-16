import { create } from "zustand";

interface AuthStore {
  accessToken: string | null;
  isLoggedOut: boolean;
}

interface AuthAction {
  setAccessToken: (accessToken: string | null) => void;
  clearAuth: () => void;
  setIsLoggedOut: (flag: boolean) => void;
}

const useAuthStore = create<AuthStore & AuthAction>((set) => ({
  accessToken: null,
  isLoggedOut: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null }),
  setIsLoggedOut: (isLoggedOut) => set({ isLoggedOut }),
}));

export default useAuthStore;
