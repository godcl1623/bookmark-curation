import type { Folder as FolderType } from "@linkvault/shared";

import DirectoryButton from "@/features/bookmarks/DirectoryTree/components/DirectoryButton";
import DirectoryList from "@/features/bookmarks/DirectoryTree/components/DirectoryList";
import useDirectoriesData from "@/features/bookmarks/DirectoryTree/hooks/useDirectoriesData";
import useGlobalStore from "@/stores/global";

interface DirectoryListItemProps extends FolderType {
  parentId?: string | null;
}

export default function DirectoryListItem({
  type,
  parent_id,
  data_id,
  title,
  parentId,
}: DirectoryListItemProps) {
  const isOpen = useGlobalStore((state) => state.openIds.has(data_id));
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  const loadedDirectory = useDirectoriesData(data_id);

  if (!loadedDirectory) return null;
  const isLoading = loadedDirectory?.isLoading ?? false;
  const isError = loadedDirectory?.isError ?? false;
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  const handleClick = () => {
    if (type === "folder") {
      toggleOpen(data_id);
    }
  };

  return (
    <>
      <DirectoryButton
        isOpen={isOpen}
        dataType={type}
        parentId={`${parentId ? `${parentId}/` : ""}${parent_id}`}
        onClick={handleClick}
      >
        {title}
      </DirectoryButton>
      {isOpen && !isLoading && !isError && (
        <DirectoryList
          directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
          parentId={`${parentId ? `${parentId}/` : ""}${parent_id}`}
        />
      )}
    </>
  );
}
