import {
  Calendar,
  CalendarCog,
  Edit,
  ExternalLink,
  Link,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import TagItem from "@/shared/components/molecules/TagItem";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

import FolderTag from "../BookmarkCard/FolderTag";

export default function BookmarkDetail({ reject }: DefaultModalChildrenProps) {
  return (
    <ModalLayout reject={reject}>
      <Card className={"screen-center h-[85vh] w-1/3 gap-0 p-0"}>
        <CardHeader className={"flex-center-between p-5"}>
          <h1 className={"text-lg font-semibold"}>Bookmark Details</h1>
          <Button variant={"ghost"} size={"icon-sm"} onClick={reject}>
            <X className={"size-6"} />
          </Button>
        </CardHeader>
        <CardContent className={"h-full overflow-y-auto p-0"}>
          <div className={"h-1/2 w-full bg-neutral-100"} />
          <CardDescription className={"flex flex-col gap-5 p-5"}>
            <header className={"flex-center-between"}>
              <h2 className={"line-clamp-1 text-2xl text-black"}>Test Title</h2>
              <div className={"flex-center gap-2"}>
                <FolderTag>Folder 1</FolderTag>
                <Button size={"icon-sm"} variant={"ghost"}>
                  <Star className={"size-6"} />
                </Button>
              </div>
            </header>
            <div className={"flex-col-center-center gap-2"}>
              <p className={"flex-center w-full gap-2"}>
                <Link className={"size-4"} />
                <span className={"mb-1"}>google.com</span>
              </p>
              <a
                href={"https://www.google.com"}
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
              <p className={"text-sm"}>Test Description</p>
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
                <li>
                  <TagItem tag={"foo"} />
                </li>
                <li>
                  <TagItem tag={"bar"} />
                </li>
                <li>
                  <TagItem tag={"doh"} />
                </li>
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
                  <p className={"text-lg font-bold text-black"}>2025-10-20</p>
                </div>
              </div>
              <div className={"flex-center gap-2"}>
                <div className={"rounded-lg bg-neutral-100 p-2"}>
                  <CalendarCog />
                </div>
                <div>
                  <h3 className={"text-xs font-semibold"}>Modified:</h3>
                  <p className={"text-lg font-bold text-black"}>2025-10-25</p>
                </div>
              </div>
            </div>
          </CardDescription>
        </CardContent>
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
          <ActionButton style={"cancel"}>
            <Trash2 />
            Delete
          </ActionButton>
        </CardAction>
      </Card>
    </ModalLayout>
  );
}

interface ActionButtonProps extends BasicComponentProps {
  style?: "primary" | "secondary" | "cancel";
}

function ActionButton({ children, style = "secondary" }: ActionButtonProps) {
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
    >
      {children}
    </Button>
  );
}
