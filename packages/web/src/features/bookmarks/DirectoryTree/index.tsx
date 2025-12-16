import Button from "@/shared/components/atoms/button";
import useAuth from "@/shared/hooks/useAuth.ts";
import type { BasicComponentProps } from "@/shared/types";

import useDirectoriesData from "../../../shared/hooks/useDirectoriesData";
import DirectoryList from "./components/DirectoryList";

export default function DirectoryTree() {
  const loadedDirectory = useDirectoriesData("/");
  const { folders, bookmarks } = loadedDirectory?.data ?? {};
  const { user } = useAuth();

  return (
    <aside
      className={
        "flex w-[15%] min-w-[200px] flex-col gap-5 overflow-y-auto bg-white p-5"
      }
    >
      {user != null && (
        <div
          className={
            "rounded-lg bg-blue-400 py-1.5 text-center text-sm font-bold text-white"
          }
        >
          {user?.email}
        </div>
      )}
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
