import type { Bookmark, Folder } from "@linkvault/shared";

import DirectoryListItem from "@/features/bookmarks/DirectoryTree/components/DirectoryListItem";

interface DirectoryListProps {
  directoryList: (Folder | Bookmark)[];
  isTotalLoading?: boolean;
}

export default function DirectoryList({
  directoryList,
  isTotalLoading = false,
}: DirectoryListProps) {
  return (
    <ul className={"flex flex-col gap-2"} aria-label={"directory_list"}>
      {directoryList.map((directory) => (
        <li key={directory.data_id}>
          <DirectoryListItem isTotalLoading={isTotalLoading} {...directory} />
        </li>
      ))}
    </ul>
  );
}
