import { useEffect } from "react";

import Button from "@/shared/components/atoms/button";
import Skeleton from "@/shared/components/molecules/Skeleton";
import { useDirectoriesData as useDirectoriesData2 } from "@/shared/hooks/_useDirectoriesData";
import useAuth from "@/shared/hooks/useAuth.ts";
import type { BasicComponentProps } from "@/shared/types";

import useDirectoriesData from "../../../shared/hooks/useDirectoriesData";
import DirectoryList from "./components/DirectoryList";

export default function DirectoryTree() {
  const { loadedDirectory, folders, bookmarks } = useFlatDirectory();
  const { user } = useAuth();

  return (
    <aside
      className={
        "flex w-[15%] min-w-[200px] flex-col gap-5 overflow-y-auto bg-white p-5"
      }
    >
      {loadedDirectory?.isLoading ? (
        <Skeleton height={35} />
      ) : (
        user != null && (
          <div
            className={
              "rounded-lg bg-blue-400 py-1.5 text-center text-sm font-bold text-white"
            }
          >
            {user?.email}
          </div>
        )
      )}
      <DefaultFilterButton>All</DefaultFilterButton>
      <DefaultFilterButton>Favorites</DefaultFilterButton>
      <nav>
        {loadedDirectory?.isLoading ? (
          Array.from({ length: 3 }, (_, k) => k).map((value) => (
            <Skeleton
              key={`skeleton-${value}`}
              height={40}
              className={"mb-2"}
            />
          ))
        ) : (
          <DirectoryList
            currentDir={"/"}
            directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
          />
        )}
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

const useFlatDirectory = () => {
  // TODO: useDirectoriesData2로 대체
  const loadedDirectory = useDirectoriesData("/");
  const foo = useDirectoriesData2();
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  // TODO: 임시 effect 삭제
  useEffect(() => {
    console.log(foo);
  }, [foo]);

  return { loadedDirectory, folders, bookmarks };
};
