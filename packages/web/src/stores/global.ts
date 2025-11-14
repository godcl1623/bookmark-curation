import { create } from "zustand";

interface GlobalStore {
  openIds: Set<string>;
  slugToId: Record<string, string>;
}

interface GlobalActions {
  toggleOpen: (id: string) => void;
  updateSlugToId: (tables: Record<string, string>[]) => void;
}

const useGlobalStore = create<GlobalStore & GlobalActions>((set, get) => ({
  openIds: new Set(),
  slugToId: {},
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
}));

export default useGlobalStore;
