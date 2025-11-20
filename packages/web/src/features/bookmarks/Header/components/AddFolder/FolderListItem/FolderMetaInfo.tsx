import type { Folder as FolderTypes } from "@linkvault/shared";
import { Folder, Pencil, Trash2 } from "lucide-react";

import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";

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
  return (
    <>
      <div
        className={"rounded-lg p-2 text-white"}
        style={{ backgroundColor: color }}
      >
        <Folder />
      </div>
      <div className={"flex-1 flex-col"}>
        <h2>{title}</h2>
        <p className={"text-sm text-neutral-500"}>
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
