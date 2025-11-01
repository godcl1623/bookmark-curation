import { ChevronRight, Folder } from "lucide-react";
import { type ComponentProps, useState } from "react";

import Button from "@/shared/components/atoms/button.tsx";
import { DUMMY_FOLDERS } from "@/shared/consts";
import type { BasicComponentProps } from "@/shared/types";

export default function DirectoryTree() {
  const [selectedFolder, changeSelectedFolder] = useDirectory();
  console.log(selectedFolder);

  return (
    <aside className={"flex w-[15%] flex-col gap-5 bg-stone-50/50 p-5"}>
      <DefaultFilterButton>All</DefaultFilterButton>
      <DefaultFilterButton>Favorites</DefaultFilterButton>
      <nav>
        <ul className={"flex flex-col gap-2"}>
          {DUMMY_FOLDERS.slice(1).map((folder, index) => (
            <li key={`${folder}_${index}`}>
              <DirectoryButton
                isOpen={selectedFolder.includes(folder)}
                onClick={changeSelectedFolder(folder)}
              >
                {folder}
              </DirectoryButton>
              {selectedFolder.includes(folder) && (
                <ul>
                  {DUMMY_SUB_DIRECTORY.map((subFolder, subIndex) => (
                    <li key={`${folder}_${subFolder}_${subIndex}`}>
                      {subFolder}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

const DUMMY_SUB_DIRECTORY = ["Sub 1", "Sub 2", "Sub 3"];

const useDirectory = () => {
  const [selectedFolder, setSelectedFolder] = useState<string[]>([]);

  const changeSelectedFolder = (folder: string) => () => {
    if (selectedFolder.includes(folder))
      setSelectedFolder((prev) => prev.filter((opened) => opened !== folder));
    else setSelectedFolder((prev) => [...prev, folder]);
  };

  return [selectedFolder, changeSelectedFolder] as const;
};

function DefaultFilterButton({ children }: BasicComponentProps) {
  return (
    <Button size={"sm"} variant={"outline"} className={"text-sm font-bold"}>
      {children}
    </Button>
  );
}

interface DirectoryButtonProps {
  isOpen?: boolean;
}

function DirectoryButton({
  isOpen = false,
  children,
  onClick,
}: DirectoryButtonProps & ComponentProps<"button">) {
  return (
    <Button
      variant={"ghost"}
      className={"w-full justify-between px-2 text-sm"}
      onClick={onClick}
    >
      <div className={"flex items-center gap-2 px-2"}>
        <Folder />
        {children}
      </div>
      <ChevronRight className={isOpen ? "rotate-90" : ""} />
    </Button>
  );
}
