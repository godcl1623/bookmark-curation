import type { Tag } from "@linkvault/shared";
import { Hash, Pencil, Trash2 } from "lucide-react";

import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";

interface TagMetaInfoProps {
  changeEditMode: () => void;
  handleDelete: () => void;
}

export default function TagMetaInfo({
  name,
  _count,
  changeEditMode,
  handleDelete,
}: TagMetaInfoProps & Tag) {
  return (
    <>
      <div className={"rounded-lg bg-blue-100 p-2 text-blue-500"}>
        <Hash />
      </div>
      <div className={"flex-1 flex-col"}>
        <h2>{name}</h2>
        <p className={"text-sm text-neutral-500"}>
          북마크 {_count.bookmark_tags}개
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
