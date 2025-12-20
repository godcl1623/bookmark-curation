import type { Folder as FolderType } from "@linkvault/shared";

import DirectoryListItem from "@/features/bookmarks/DirectoryTree/components/DirectoryListItem";

interface DirectoryListProps {
  directoryList: FolderType[];
  currentDir?: string;
}

export default function DirectoryList({
  directoryList,
  currentDir = "/",
}: DirectoryListProps) {
  console.log(directoryList);
  return (
    <ul className={"flex flex-col gap-2"}>
      {directoryList?.map((folder) => {
        return (
          <li key={folder.data_id}>
            <DirectoryListItem currentDir={currentDir} {...folder} />
          </li>
        );
      })}
    </ul>
  );
}
