import { create } from "zustand";

interface GlobalStore {
  openPaths: Map<string, string>;
  slugToId: Record<string, string>;
  currentView: "card" | "list";
  isMobile: boolean;
  isTablet: boolean;
}

interface GlobalActions {
  toggleOpen: (id: string, dirPath: string) => void;
  updateSlugToId: (tables: Record<string, string>[]) => void;
  setCurrentView: (view: "card" | "list") => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  __resetStore: () => void;
}

const useGlobalStore = create<GlobalStore & GlobalActions>((set) => ({
  openPaths: new Map(),
  slugToId: {},
  currentView: "card",
  isMobile: false,
  isTablet: false,
  toggleOpen: (id, dirPath) =>
    set((state) => {
      const next = new Map(state.openPaths);
      if (next.get(id)) {
        next.forEach((value, key) => {
          if (value === dirPath || value.startsWith(dirPath + "/"))
            next.delete(key);
        });
      } else {
        next.set(id, dirPath);
      }
      return { openPaths: next };
    }),
  updateSlugToId: (tables) =>
    set((state) => ({
      slugToId: {
        ...state.slugToId,
        ...Object.fromEntries(
          tables.map((table) => [table.data_id, table.name])
        ),
      },
    })),
  setCurrentView: (view) => set({ currentView: view }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setIsTablet: (isTablet) => set({ isTablet }),
  __resetStore: () =>
    set({
      openPaths: new Map(),
      slugToId: {},
      currentView: "card",
      isMobile: false,
      isTablet: false,
    }),
}));

export default useGlobalStore;
