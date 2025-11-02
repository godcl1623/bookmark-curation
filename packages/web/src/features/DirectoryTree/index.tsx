import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, useMemo, useState } from "react";

import Button from "../../shared/components/atoms/button.tsx";
import { DIRECTORY } from "../../shared/consts";
import { cn } from "../../shared/lib/utils.ts";
import type { BasicComponentProps } from "../../shared/types";
import type { Bookmark, BookmarkType } from "../../shared/types/bookmark.ts";

export default function DirectoryTree() {
    return (
        <aside
            className={
                "flex w-[15%] flex-col gap-5 overflow-y-auto bg-stone-50/50 p-5"
            }
        >
            <DefaultFilterButton>All</DefaultFilterButton>
            <DefaultFilterButton>Favorites</DefaultFilterButton>
            <nav>
                <DirectoryList directoryList={DIRECTORY}/>
            </nav>
        </aside>
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

function DefaultFilterButton({ children }: BasicComponentProps) {
    return (
        <Button size={"sm"} variant={"outline"} className={"text-sm font-bold"}>
            {children}
        </Button>
    );
}

interface DirectoryButtonProps {
    isOpen?: boolean;
    dataType?: BookmarkType;
    parent?: string | null;
}

function DirectoryButton({
    isOpen = false,
    dataType = "bookmark",
    parent = null,
    children,
    onClick,
}: DirectoryButtonProps & ComponentProps<"button">) {
    const icon = useMemo(
        () => (dataType === "bookmark" ? <File/> : <Folder/>),
        [dataType],
    );
    const hierarchy = parent == null ? 0 : parent.split("/").length;

    return (
        <Button
            variant={"ghost"}
            className={cn(
                "w-full pr-2 text-sm",
                dataType === "folder" ? "justify-between" : "justify-start",
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
                <ChevronRight className={isOpen ? "rotate-90" : ""}/>
            )}
        </Button>
    );
}

interface DirectoryListProps {
    directoryList: Bookmark[];
}

function DirectoryList({ directoryList }: DirectoryListProps) {
    const [selectedFolder, changeSelectedFolder] = useDirectory();

    return (
        <ul className={"flex flex-col gap-2"}>
            {/* FIXME: 루트에 파일이 올 수도 있도록 수정 */}
            {directoryList?.map((folder) => {
                const isOpen = selectedFolder.includes(folder.id);

                return (
                    <li key={folder.id}>
                        <DirectoryButton
                            isOpen={isOpen}
                            dataType={folder.type}
                            parent={folder.parent}
                            onClick={
                                folder.type === "folder"
                                    ? changeSelectedFolder(folder.id)
                                    : () => null
                            }
                        >
                            {folder.name}
                        </DirectoryButton>
                        {isOpen && <DirectoryList directoryList={folder.children ?? []}/>}
                    </li>
                );
            })}
        </ul>
    );
}
