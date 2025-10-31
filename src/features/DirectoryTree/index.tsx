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
                isOpen={selectedFolder === folder}
                onClick={changeSelectedFolder(folder)}
              >
                {folder}
              </DirectoryButton>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

const useDirectory = () => {
  const [selectedFolder, setSelectedFolder] = useState(DUMMY_FOLDERS[0]);

  const changeSelectedFolder = (folder: string) => () => {
    if (selectedFolder === folder) setSelectedFolder(DUMMY_FOLDERS[0]);
    else setSelectedFolder(folder);
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
