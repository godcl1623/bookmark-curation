import type { DataType, Folder as FolderType } from "@linkvault/shared";
import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, useMemo, useState } from "react";

import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";

import useDirectoriesData from "../hooks/useDirectoriesData";

interface DirectoryListProps {
  directoryList: FolderType[];
  parentId?: string | null;
}

export default function DirectoryList({
  directoryList,
  parentId,
}: DirectoryListProps) {
  const [selectedFolder, changeSelectedFolder] = useDirectory();
  const loadedDirectories = useDirectoriesData(selectedFolder);

  return (
    <ul className={"flex flex-col gap-2"}>
      {directoryList?.map((folder) => {
        const isOpen = selectedFolder.includes(folder.data_id);
        const loadedDirectory = loadedDirectories?.find(
          (directory) => directory?.data?.parent_id === folder.data_id
        );

        if (!loadedDirectories) return null;

        const isLoading = loadedDirectory?.isLoading ?? false;
        const isError = loadedDirectory?.isError ?? false;
        const { folders, bookmarks } = loadedDirectory?.data ?? {};

        return (
          <li key={folder.id}>
            <DirectoryButton
              isOpen={isOpen}
              dataType={folder.type}
              parentId={`${parentId ? `${parentId}/` : ""}${folder.parent_id}`}
              onClick={
                folder.type === "folder"
                  ? changeSelectedFolder(folder.data_id)
                  : () => null
              }
            >
              {folder.title}
            </DirectoryButton>
            {isOpen && !isLoading && !isError && (
              <DirectoryList
                directoryList={[...(folders ?? []), ...(bookmarks ?? [])]}
                parentId={folder.parent_id}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

const useDirectory = () => {
  const [selectedFolder, setSelectedFolder] = useState<string[]>([]);

  const changeSelectedFolder = (folderId: string) => () => {
    if (selectedFolder.includes(folderId))
      setSelectedFolder((prev) => prev.filter((opened) => opened !== folderId));
    else setSelectedFolder((prev) => [...prev, folderId]);
  };

  return [selectedFolder, changeSelectedFolder] as const;
};

interface DirectoryButtonProps {
  isOpen?: boolean;
  dataType?: DataType;
  parentId?: string | null;
}

function DirectoryButton({
  isOpen = false,
  dataType = "bookmark",
  parentId = null,
  children,
  onClick,
}: DirectoryButtonProps & ComponentProps<"button">) {
  const icon = useMemo(
    () => (dataType === "bookmark" ? <File /> : <Folder />),
    [dataType]
  );
  const hierarchy =
    parentId == null || parentId === "null" ? 0 : parentId.split("/").length;

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full pr-2 text-sm",
        dataType === "folder" ? "justify-between" : "justify-start"
      )}
      onClick={onClick}
      style={{
        paddingLeft: `${Math.max(8, hierarchy * 16 + 8)}px`,
      }}
    >
      <div className={"flex items-center gap-2 px-2"}>
        {icon}
        {children}
      </div>
      {dataType !== "bookmark" && (
        <ChevronRight className={isOpen ? "rotate-90" : ""} />
      )}
    </Button>
  );
}
