import type { Folder as FolderTypes } from "@linkvault/shared";
import { Folder, Pencil, Trash2 } from "lucide-react";

import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";
import useGlobalStore from "@/stores/global.ts";

interface FolderMetaInfoProps {
  changeEditMode: () => void;
  handleDelete: () => void;
}

export default function FolderMetaInfo({
  color,
  title,
  _count,
  changeEditMode,
  handleDelete,
}: FolderMetaInfoProps & FolderTypes) {
  const isMobile = useGlobalStore((state) => state.isMobile);

  return (
    <>
      <div
        className={"rounded-sm p-1 text-white md:rounded-lg md:p-2"}
        style={{ backgroundColor: color }}
      >
        <Folder className={isMobile ? "size-5" : "size-6"} />
      </div>
      <div className={"flex-1 flex-col"}>
        <h2 className={cn("line-clamp-1", isMobile ? "text-base" : "")}>
          {title}
        </h2>
        <p className={"text-xs text-neutral-500 md:text-sm"}>
          북마크 {_count.bookmarks}개
        </p>
      </div>
      <div className={"flex-center gap-2"}>
        <FunctionButton color={"black"} onClick={changeEditMode}>
          <Pencil />
        </FunctionButton>
        <FunctionButton onClick={handleDelete}>
          <Trash2 />
        </FunctionButton>
      </div>
    </>
  );
}

function FunctionButton({
  children,
  color,
  onClick,
}: BasicComponentProps & { color?: "black" | "red"; onClick?: () => void }) {
  const buttonColor = color === "black" ? "text-black" : "text-red-500";

  return (
    <Button
      variant={"ghost"}
      size={"icon-sm"}
      className={buttonColor}
      onClick={onClick ? onClick : () => null}
    >
      {children}
    </Button>
  );
}
