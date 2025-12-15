import { useLocation } from "react-router";

import AddBookmarkButton from "@/features/bookmarks/BookmarkList/components/BlankFallback/AddBookmarkButton";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import type { BasicComponentProps } from "@/shared/types";

export default function ClientViewLayout({ children }: BasicComponentProps) {
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoriesData(pathname ?? "/");

  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <div className={"relative flex h-[calc(100vh-64px)]"}>
      {children}

      {(folders?.length > 0 || bookmarks?.length > 0) && (
        <div className={"absolute right-5 bottom-5"}>
          <AddBookmarkButton />
        </div>
      )}
    </div>
  );
}
