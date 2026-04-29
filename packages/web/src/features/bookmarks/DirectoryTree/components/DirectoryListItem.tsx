import type { Folder as FolderType } from "@linkvault/shared";

import { useModal } from "@/app/providers/ModalProvider/context";
import BookmarkDetail from "@/features/bookmarks/BookmarkList/components/BookmarkDetail";
import DirectoryButton from "@/features/bookmarks/DirectoryTree/components/DirectoryButton";
import DirectoryList from "@/features/bookmarks/DirectoryTree/components/DirectoryList";
import Skeleton from "@/shared/components/molecules/Skeleton";
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
  // TODO: 삭제 대상
  const isOpen = useGlobalStore((state) => state.openIds.has(data_id));
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  // TODO: 바뀔 로직
  const _toggleOpen = useGlobalStore((state) => state._toggleOpen);
  const loadedDirectory = useDirectoriesData(encodeURI(targetUrl), isOpen);
  const { openModal } = useModal();

  if (!loadedDirectory) return null;
  const isLoading = loadedDirectory?.isLoading ?? false;
  const isError = loadedDirectory?.isError ?? false;
  const { folders, bookmarks } = loadedDirectory?.data ?? {};
  const hierarchy = targetUrl == null ? 0 : targetUrl.split("/").length - 1;

  const handleClick = () => {
    if (type === "folder") {
      toggleOpen(data_id);
      _toggleOpen(data_id, targetUrl);
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
        hierarchy={hierarchy}
      >
        {title}
      </DirectoryButton>
      {isOpen && !isLoading && !isError && (
        <DirectoryList
          directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
          currentDir={targetUrl}
        />
      )}
      {isLoading && (
        <Skeleton
          height={40}
          indent={hierarchy + 1}
          className={"mt-0.5 mb-2"}
        />
      )}
    </>
  );
}
