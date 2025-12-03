import type { Bookmark } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import {
  Calendar,
  CalendarCog,
  Edit,
  ExternalLink,
  Link,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import TagItem from "@/shared/components/molecules/TagItem";
import {
  CardAction,
  CardDescription,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import deleteBookmark from "@/shared/services/bookmarks/delete-bookmark";
import type { BasicComponentProps } from "@/shared/types";

import FolderTag from "../BookmarkCard/FolderTag";

export default function BookmarkDetail({
  reject,
  resolve,
  title,
  domain,
  description,
  parent,
  url,
  created_at,
  updated_at,
  tags,
  data_id,
  refetch,
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
          <header className={"flex-center-between"}>
            <h2 className={"line-clamp-1 text-2xl text-black"}>{title}</h2>
            <div className={"flex-center gap-2"}>
              <FolderTag>{parent?.title}</FolderTag>
              <Button size={"icon-sm"} variant={"ghost"}>
                <Star className={"size-6"} />
              </Button>
            </div>
          </header>
          <div className={"flex-col-center-center gap-2"}>
            <p className={"flex-center w-full gap-2"}>
              <Link className={"size-4"} />
              <span className={"mb-1"}>{domain}</span>
            </p>
            <a
              href={url}
              rel={"noreferrer noopener"}
              className={
                "flex-center-center w-full gap-2 rounded-md bg-blue-500 py-2 text-white hover:brightness-95 active:brightness-90"
              }
            >
              <ExternalLink className={"size-5"} />
              Open Link
            </a>
          </div>
          <div>
            <h3 className={"text-base"}>Description</h3>
            <p className={"text-sm"}>{description}</p>
          </div>
          <div>
            <h3
              className={
                "before:contents-[''] mb-2 text-base before:mr-2 before:border-2 before:border-blue-400"
              }
            >
              Tags
            </h3>
            <ul className={"flex-center gap-2"}>
              {tags.map((tag) => (
                <li key={`detail_tag_${tag.id}`}>
                  <TagItem tag={tag.name} />
                </li>
              ))}
            </ul>
          </div>
          <div
            className={
              "flex-center-between border-t border-neutral-200 px-5 pt-5"
            }
          >
            <div className={"flex-center gap-2"}>
              <div className={"rounded-lg bg-neutral-100 p-2"}>
                <Calendar />
              </div>
              <div>
                <h3 className={"text-xs font-semibold"}>Created:</h3>
                <p className={"text-lg font-bold text-black"}>
                  {created_at.split("T")[0]}
                </p>
              </div>
            </div>
            <div className={"flex-center gap-2"}>
              <div className={"rounded-lg bg-neutral-100 p-2"}>
                <CalendarCog />
              </div>
              <div>
                <h3 className={"text-xs font-semibold"}>Modified:</h3>
                <p className={"text-lg font-bold text-black"}>
                  {updated_at.split("T")[0]}
                </p>
              </div>
            </div>
          </div>
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
