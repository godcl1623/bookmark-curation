import type { Bookmark, Folder as FolderType } from "@linkvault/shared";

import Button from "@/shared/components/atoms/button";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";

import BlankFallback from "./components/BlankFallback";

export default function BookmarkList() {
  const loadedDirectory = useDirectoriesData("/", true);
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <main className={"h-[calc(100vh-64px)] w-[85%] bg-blue-50/75 p-5"}>
      {(!folders && !bookmarks) ||
        (folders?.length === 0 && bookmarks?.length === 0 && <BlankFallback />)}
      {folders && (
        <article>
          <h2>Folders</h2>
          <ul className={"flex-center gap-2"}>
            {folders.map((folder: FolderType) => (
              <li key={`dir_button_${folder.data_id}`}>
                <Button
                  size={"custom"}
                  variant={"ghost"}
                  className={"rounded-lg border border-blue-300/75 px-4 py-1"}
                >
                  {folder.title}
                </Button>
              </li>
            ))}
          </ul>
        </article>
      )}
      {bookmarks && (
        <article className={"mt-10"}>
          <h2>Bookmarks</h2>
          <ul className={"flex-center gap-2"}>
            {bookmarks.map((bookmark: Bookmark) => (
              <li key={`bookmark_button_${bookmark.data_id}`}>
                <Button
                  size={"custom"}
                  variant={"ghost"}
                  className={"rounded-lg border border-blue-300/75 px-4 py-1"}
                >
                  {bookmark.title}
                </Button>
              </li>
            ))}
          </ul>
        </article>
      )}
    </main>
  );
}
