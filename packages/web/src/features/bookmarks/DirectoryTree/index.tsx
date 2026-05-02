import type { Bookmark, Directory, Folder } from "@linkvault/shared";
import { useMemo } from "react";

import Button from "@/shared/components/atoms/button";
import Skeleton from "@/shared/components/molecules/Skeleton";
import { useDirectoriesData as useDirectoriesData2 } from "@/shared/hooks/_useDirectoriesData";
import useAuth from "@/shared/hooks/useAuth.ts";
import type { BasicComponentProps } from "@/shared/types";

import DirectoryList from "./components/DirectoryList";

export default function DirectoryTree() {
  const { flattenedDirectory, isLoading } = useFlatDirectory();
  const { user } = useAuth();

  return (
    <aside
      className={
        "flex w-[15%] min-w-[200px] flex-col gap-5 overflow-y-auto bg-white p-5"
      }
    >
      {user == null ? (
        <Skeleton height={32} />
      ) : (
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
        {flattenedDirectory.length === 0 ? (
          Array.from({ length: 3 }, (_, k) => k).map((value) => (
            <Skeleton
              key={`skeleton-${value}`}
              height={40}
              className={"mb-2"}
            />
          ))
        ) : (
          <DirectoryList
            directoryList={flattenedDirectory}
            isTotalLoading={isLoading}
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
  const { data: directories, isLoading } = useDirectoriesData2();
  const flattenedDirectory = useMemo(() => {
    const validDirectories = directories.filter(
      (directory) => directory != null
    );
    if (validDirectories.length === 0) return [];

    const rootDir = validDirectories.find(
      (directory) => directory.breadcrumbs.length === 0
    );
    if (rootDir == null) return [];

    const directoryByFolderId = new Map(
      validDirectories
        .filter((directory) => directory.folder != null)
        .map((directory) => [directory.folder.id, directory])
    );

    const result: (Folder | Bookmark)[] = [];

    const traverse = (directory: Directory) => {
      const level = directory.breadcrumbs.length;
      for (const folder of directory.folders) {
        result.push({ ...folder, position: level });
        const childDir = directoryByFolderId.get(folder.id);
        if (childDir != null) traverse(childDir);
      }
      for (const bookmark of directory.bookmarks) {
        result.push({ ...bookmark, position: level });
      }
    };

    traverse(rootDir);
    return result;
  }, [directories]);

  return { flattenedDirectory, isLoading };
};
