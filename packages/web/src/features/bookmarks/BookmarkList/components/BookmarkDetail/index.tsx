import type { Bookmark } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { Edit, Share2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import BasicDetailView from "@/features/bookmarks/BookmarkList/components/BookmarkDetail/BasicDetailView.tsx";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import {
  CardAction,
  CardDescription,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import deleteBookmark from "@/shared/services/bookmarks/delete-bookmark";
import type { BasicComponentProps } from "@/shared/types";

export default function BookmarkDetail({
  reject,
  resolve,
  data_id,
  refetch,
  ...props
}: DefaultModalChildrenProps & Bookmark & { refetch?: () => void }) {
  const deleteCallback = () => {
    refetch?.();
    resolve();
  };

  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        width={"w-1/3"}
        height={"h-[85vh]"}
        title={"Bookmark Details"}
        actionComponent={() => (
          <CardAction
            className={
              "grid w-full grid-cols-3 gap-2 border-t border-neutral-200 p-5"
            }
          >
            <ActionButton style={"primary"}>
              <Share2 />
              Share
            </ActionButton>
            <ActionButton>
              <Edit />
              Edit
            </ActionButton>
            <ActionButton
              style={"cancel"}
              onClick={handleDelete(data_id, deleteCallback)}
            >
              <Trash2 />
              Delete
            </ActionButton>
          </CardAction>
        )}
      >
        <div className={"h-1/2 w-full bg-neutral-100"} />
        <CardDescription className={"flex flex-col gap-5 p-5"}>
          <BasicDetailView data_id={data_id} {...props} />
        </CardDescription>
      </ModalTemplate>
    </ModalLayout>
  );
}

const handleDelete = (data_id: string, callback?: () => void) => async () => {
  try {
    const result = (await deleteBookmark(data_id)) as AxiosResponse;
    if (result.status === 200) {
      toast.success("북마크를 성공적으로 삭제했습니다.");
      callback?.();
    }
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`북마크를 삭제하지 못했습니다(${error.status})`);
    } else if (error instanceof Error) {
      toast.error(`북마크를 삭제하지 못했습니다(${error.name})`);
    }
    console.error(error);
  }
};

interface ActionButtonProps extends BasicComponentProps {
  style?: "primary" | "secondary" | "cancel";
  onClick?: () => void;
}

function ActionButton({
  children,
  style = "secondary",
  onClick = () => null,
}: ActionButtonProps) {
  const styles = {
    primary: "bg-blue-100 text-blue-500",
    secondary: "bg-neutral-200",
    cancel: "bg-red-100 text-red-500",
  };

  return (
    <Button
      size={"custom"}
      variant={"blank"}
      className={cn("w-full py-1.5 text-base", styles[style])}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
