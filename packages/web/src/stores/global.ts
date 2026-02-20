import { create } from "zustand";

interface GlobalStore {
  openIds: Set<string>;
  slugToId: Record<string, string>;
  currentView: "card" | "list";
  isMobile: boolean;
  isTablet: boolean;
}

interface GlobalActions {
  toggleOpen: (id: string) => void;
  updateSlugToId: (tables: Record<string, string>[]) => void;
  setCurrentView: (view: "card" | "list") => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  __resetStore: () => void;
}

const useGlobalStore = create<GlobalStore & GlobalActions>((set, get) => ({
  openIds: new Set(),
  slugToId: {},
  currentView: "card",
  isMobile: false,
  isTablet: false,
  toggleOpen: (id) => {
    if (get().openIds.has(id)) {
      return set((state) => {
        const newSet = new Set(state.openIds);
        newSet.delete(id);
        return { openIds: newSet };
      });
    } else {
      return set((state) => {
        const newSet = new Set(state.openIds);
        newSet.add(id);
        return { openIds: newSet };
      });
    }
  },
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
      openIds: new Set(),
      slugToId: {},
      currentView: "card",
      isMobile: false,
      isTablet: false,
    }),
}));

export default useGlobalStore;
