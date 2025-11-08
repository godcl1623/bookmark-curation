import type { Folder as FolderType } from "@linkvault/shared";

import DirectoryListItem from "@/features/bookmarks/DirectoryTree/components/DirectoryListItem";

interface DirectoryListProps {
  directoryList: FolderType[];
  parentId?: string | null;
}

export default function DirectoryList({
  directoryList,
  parentId,
}: DirectoryListProps) {
  return (
    <ul className={"flex flex-col gap-2"}>
      {directoryList?.map((folder) => {
        return (
          <li key={folder.data_id}>
            <DirectoryListItem parentId={parentId} {...folder} />
          </li>
        );
      })}
    </ul>
  );
}
