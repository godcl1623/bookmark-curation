import type { Folder as FolderType } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { Folder, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/shared/components/atoms/button";
import deleteFolder from "@/shared/services/folders/delete-folder";
import type { BasicComponentProps } from "@/shared/types";

export default function FolderListItem({
  title,
  color,
  _count,
  data_id,
  refetch,
}: FolderType & { refetch?: () => void }) {
  return (
    <section
      className={"flex-center gap-4 rounded-lg border border-neutral-200 p-4"}
    >
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
        <FunctionButton color={"black"}>
          <Pencil />
        </FunctionButton>
        <FunctionButton onClick={handleDelete(data_id, refetch)}>
          <Trash2 />
        </FunctionButton>
      </div>
    </section>
  );
}

const handleDelete = (data_id: string, callback?: () => void) => async () => {
  try {
    const result = (await deleteFolder(data_id)) as AxiosResponse;
    if (result.status === 200) {
      toast.success(`폴더를 성공적으로 삭제했습니다.`);
      callback?.();
    }
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`폴더를 삭제하지 못했습니다(${error.status})`);
    } else if (error instanceof Error) {
      toast.error(`폴더를 삭제하지 못했습니다(${error.name})`);
    }
    console.error("### Failed to delete folder: ", error);
  }
};

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
