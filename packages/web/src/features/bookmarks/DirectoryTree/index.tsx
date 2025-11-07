import { useMemo } from "react";

import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";

import DirectoryList from "./components/DirectoryList";
import useDirectoriesData from "./hooks/useDirectoriesData";

export default function DirectoryTree() {
  const loadedDirectories = useDirectoriesData();
  const loadedDirectory = useMemo(
    () => loadedDirectories?.[0],
    [loadedDirectories]
  );
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <aside
      className={
        "flex w-[15%] flex-col gap-5 overflow-y-auto bg-stone-50/50 p-5"
      }
    >
      <DefaultFilterButton>All</DefaultFilterButton>
      <DefaultFilterButton>Favorites</DefaultFilterButton>
      <nav>
        <DirectoryList
          directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
        />
      </nav>
    </aside>
  );
}

function DefaultFilterButton({ children }: BasicComponentProps) {
  return (
    <Button size={"sm"} variant={"outline"} className={"text-sm font-bold"}>
      {children}
    </Button>
  );
}
