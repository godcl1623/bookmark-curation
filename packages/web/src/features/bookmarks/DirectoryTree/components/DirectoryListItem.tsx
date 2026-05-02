import type { Bookmark, Folder } from "@linkvault/shared";
import { useMemo } from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types.ts";
import BookmarkDetail from "@/features/bookmarks/BookmarkList/components/BookmarkDetail";
import DirectoryButton from "@/features/bookmarks/DirectoryTree/components/DirectoryButton";
import Skeleton from "@/shared/components/molecules/Skeleton.tsx";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData.ts";
import useGlobalStore from "@/stores/global";

type DirectoryListItemProps = (Bookmark | Folder) & {
  isTotalLoading?: boolean;
};

export default function DirectoryListItem({
  type,
  data_id,
  title,
  isTotalLoading = false,
  color,
  ...props
}: DirectoryListItemProps) {
  const parentId = type === "folder" ? props.parent_id : props.folder_id;
  const toggleOpen = useGlobalStore((state) => state._toggleOpen);
  const openPaths = useGlobalStore((state) => state.openPaths);

  const isOpen = useMemo(
    () =>
      type === "folder" ? Object.hasOwn(openPaths, String(props.id)) : false,
    [openPaths, props.id, type]
  );
  const isLastCalled = useMemo(
    () =>
      type === "folder" && Object.keys(openPaths).pop() === String(props.id),
    [openPaths, props.id, type]
  );
  const targetUrl = useMemo(() => {
    const defaultUrl = `/${title}`;
    if (parentId == null) return defaultUrl;
    else {
      const parentUrl = openPaths[String(parentId)];
      return parentUrl ? `${parentUrl}${defaultUrl}` : defaultUrl;
    }
  }, [title, openPaths, parentId]);

  const loadedDirectory = useDirectoriesData(encodeURI(targetUrl), isOpen);
  const { openModal } = useModal();

  const isLoading = loadedDirectory?.isLoading ?? false;

  const handleClick = () => {
    if (type === "folder") {
      toggleOpen(String(props.id), targetUrl);
    } else {
      openModal(BookmarkDetail, {
        data_id,
        title,
        color,
        ...props,
      } as Bookmark & DefaultModalChildrenProps);
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
        hierarchy={props.position}
      >
        {title}
      </DirectoryButton>
      {isLastCalled && (isTotalLoading || isLoading) && (
        <Skeleton
          height={40}
          indent={props.position + 1}
          className={"mt-0.5 mb-2"}
        />
      )}
    </>
  );
}
