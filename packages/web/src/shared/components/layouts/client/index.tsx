import AddBookmarkButton from "@/features/bookmarks/BookmarkList/components/BlankFallback/AddBookmarkButton";
import { useDirectoryData } from "@/shared/hooks/useDirectoryData";
import { useDirectoryPath } from "@/shared/hooks/useDirectoryPath";
import type { BasicComponentProps } from "@/shared/types";

export default function ClientViewLayout({ children }: BasicComponentProps) {
  const dirPath = useDirectoryPath();
  const loadedDirectory = useDirectoryData(dirPath);

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
