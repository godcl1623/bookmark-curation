import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";

import useDirectoriesData from "../../../shared/hooks/useDirectoriesData";
import DirectoryList from "./components/DirectoryList";

export default function DirectoryTree() {
  const loadedDirectory = useDirectoriesData("/");
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <aside
      className={"flex w-[15%] flex-col gap-5 overflow-y-auto bg-white p-5"}
    >
      <DefaultFilterButton>All</DefaultFilterButton>
      <DefaultFilterButton>Favorites</DefaultFilterButton>
      <nav>
        <DirectoryList
          currentDir={"/"}
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
