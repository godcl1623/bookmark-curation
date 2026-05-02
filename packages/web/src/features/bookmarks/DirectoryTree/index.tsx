import type { Bookmark, Folder } from "@linkvault/shared/types";
import { useEffect, useMemo } from "react";

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
  const { folders, bookmarks } = loadedDirectory?.data ?? {};
  const { data: directories } = useDirectoriesData2();
  const flattendDirectory = useMemo(() => {
    return directories
      .filter((directory) => directory != null)
      .map((directory) => {
        const level = directory.breadcrumbs.length;
        return {
          ...directory,
          bookmarks: directory.bookmarks.map((bookmark) => ({
            ...bookmark,
            position: level,
          })),
          folders: directory.folders.map((folder) => ({
            ...folder,
            position: level,
          })),
        };
      })
      .reduce(
        (results, currentDirectory, currentIndex) => {
          const upperFolders = results.filter(
            (result) => result.type === "folder"
          );
          const upperBookmarks = results.filter(
            (result) => result.type === "bookmark"
          );
          const folderChunks = upperFolders
            .map((folder) => {
              const subFolders = currentDirectory.folders.filter(
                (subFolder) => subFolder.parent_id === folder.id
              );
              const subBookmarks = currentDirectory.bookmarks.filter(
                (subBookmark) => subBookmark.folder_id === folder.id
              );
              return [folder, ...subFolders, ...subBookmarks];
            })
            .flat();
          return currentIndex === 0
            ? [...currentDirectory.folders, ...currentDirectory.bookmarks]
            : [...folderChunks, ...upperBookmarks];
        },
        [] as (Folder | Bookmark)[]
      );
  }, [directories]);

  // TODO: 임시 effect 삭제
  useEffect(() => {
    console.log(flattendDirectory);
  }, [flattendDirectory]);

  return { loadedDirectory, folders, bookmarks };
};
