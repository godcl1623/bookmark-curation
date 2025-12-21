import type { Bookmark, Folder as FolderType } from "@linkvault/shared";
import { useLocation } from "react-router";

import BlankFallback from "@/features/bookmarks/BookmarkList/components/BlankFallback";
import BookmarkCard from "@/features/bookmarks/BookmarkList/components/BookmarkCard";
import FolderButton from "@/features/bookmarks/BookmarkList/components/FolderButton";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global";

export default function ExplorerView() {
  const currentView = useGlobalStore((state) => state.currentView);
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoriesData(pathname ?? "/");

  const { folders, bookmarks } = loadedDirectory?.data ?? {};
  const isListView = currentView === "list";

  return (
    <>
      {folders?.length === 0 && bookmarks?.length === 0 ? (
        <BlankFallback />
      ) : (
        <>
          {folders && folders.length > 0 && (
            <article className={STYLES.container}>
              <ul className={"flex-center flex-wrap gap-2 md:gap-4"}>
                {folders?.map((folder: FolderType) => (
                  <li key={`dir_button_${folder.data_id}`}>
                    <FolderButton {...folder} />
                  </li>
                ))}
              </ul>
            </article>
          )}
          {bookmarks && bookmarks.length > 0 && (
            <article
              className={cn(
                STYLES.container,
                "w-full",
                folders?.length > 0 && "mt-3 md:mt-6"
              )}
            >
              <ul
                className={cn(
                  "flex-center flex-wrap gap-2 md:gap-4",
                  isListView && "flex-col"
                )}
              >
                {bookmarks?.map((bookmark: Bookmark) => (
                  <li
                    key={`bookmark_button_${bookmark.data_id}`}
                    className={isListView ? "w-full" : ""}
                  >
                    <BookmarkCard
                      {...bookmark}
                      refetch={loadedDirectory?.refetch}
                      isCard={currentView === "card"}
                    />
                  </li>
                ))}
              </ul>
            </article>
          )}
        </>
      )}
    </>
  );
}

const STYLES = {
  container: "p-2.5 md:p-5",
};
