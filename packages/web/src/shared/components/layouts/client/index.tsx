import { useLocation } from "react-router";

import AddBookmarkButton from "@/features/bookmarks/BookmarkList/components/BlankFallback/AddBookmarkButton";
import { useDirectoryData } from "@/shared/hooks/useDirectoryData";
import type { BasicComponentProps } from "@/shared/types";

export default function ClientViewLayout({ children }: BasicComponentProps) {
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoryData(pathname ?? "/");

  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <div
      className={"relative flex h-[calc(100vh-44px)] md:h-[calc(100vh-64px)]"}
    >
      {children}

      {(folders?.length > 0 || bookmarks?.length > 0) && (
        <div className={"absolute right-5 bottom-5"}>
          <AddBookmarkButton />
        </div>
      )}
    </div>
  );
}
