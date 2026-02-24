import type { Folder as FolderType } from "@linkvault/shared";

import { useModal } from "@/app/providers/ModalProvider/context";
import BookmarkDetail from "@/features/bookmarks/BookmarkList/components/BookmarkDetail";
import DirectoryButton from "@/features/bookmarks/DirectoryTree/components/DirectoryButton";
import DirectoryList from "@/features/bookmarks/DirectoryTree/components/DirectoryList";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import useGlobalStore from "@/stores/global";

interface DirectoryListItemProps extends FolderType {
  currentDir?: string;
}

export default function DirectoryListItem({
  type,
  data_id,
  title,
  currentDir = "/",
  color,
  ...props
}: DirectoryListItemProps) {
  const targetUrl = currentDir === "/" ? `/${title}` : `${currentDir}/${title}`;
  const isOpen = useGlobalStore((state) => state.openIds.has(data_id));
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  const loadedDirectory = useDirectoriesData(encodeURI(targetUrl), isOpen);
  const { openModal } = useModal();

  if (!loadedDirectory) return null;
  const isLoading = loadedDirectory?.isLoading ?? false;
  const isError = loadedDirectory?.isError ?? false;
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  const handleClick = () => {
    if (type === "folder") {
      toggleOpen(data_id);
    } else {
      openModal(BookmarkDetail, {
        data_id,
        title,
        color,
        ...props,
      } as any);
    }
  };

  return (
    <>
      <DirectoryButton
        isOpen={isOpen}
        dataType={type}
        onClick={handleClick}
        url={targetUrl}
        color={color}
      >
        {title}
      </DirectoryButton>
      {isOpen && !isLoading && !isError && (
        <DirectoryList
          directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
          currentDir={targetUrl}
        />
      )}
    </>
  );
}
