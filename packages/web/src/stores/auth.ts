import { create } from "zustand";

interface AuthStore {
  accessToken: string | null;
}

interface AuthAction {
  setAccessToken: (accessToken: string | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthStore & AuthAction>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null }),
}));

export default useAuthStore;
