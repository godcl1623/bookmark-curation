import { useState } from "react";

import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import { DUMMY_FOLDERS } from "@/shared/consts";
import { cn } from "@/shared/lib/utils";

export default function SelectFolder() {
  const { isOpen, toggleDropdown, selectedFolder, setFolder } =
    useSelect(DUMMY_FOLDERS);

  return (
    <div className={"relative flex flex-1"}>
      {isOpen && (
        <ul
          className={
            "absolute bottom-0 left-5 z-50 flex max-h-[208px] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-neutral-50 p-2 text-neutral-500 shadow-xl"
          }
        >
          {DUMMY_FOLDERS.map((folder, index) => (
            <li key={folder}>
              <Button
                variant={"outline"}
                className={cn("w-full", STYLES.buttonHeight)}
                onClick={setFolder(index)}
              >
                {folder}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button
        variant={"ghost"}
        className={cn(COMMON_STYLES.input, "flex justify-start")}
        onClick={toggleDropdown}
      >
        {selectedFolder}
      </Button>
    </div>
  );
}

const STYLES = {
  buttonHeight: "h-8",
};

const useSelect = (folderList: string[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(folderList[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const setFolder = (index: number) => () => {
    setSelectedFolder(folderList[index]);
    setIsOpen(false);
  };

  return { isOpen, toggleDropdown, selectedFolder, setFolder };
};
