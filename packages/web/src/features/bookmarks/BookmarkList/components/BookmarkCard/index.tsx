import type { Bookmark } from "@linkvault/shared";
import { EllipsisVertical, Share2, Star } from "lucide-react";
import type { MouseEvent } from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import handleFavorite from "@/features/bookmarks/BookmarkList/utils";
import Button from "@/shared/components/atoms/button";
import TagItem from "@/shared/components/molecules/TagItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

import BookmarkDetail from "../BookmarkDetail";
import FolderTag from "./FolderTag";

interface BookmarkCardProps {
  isCard?: boolean;
  refetch?: () => void;
}

interface BookmarkCommonProps extends BasicComponentProps {
  isLoading?: boolean;
}

export default function BookmarkCard({
  isCard = true,
  title,
  domain,
  parent,
  tags,
  refetch,
  ...props
}: Bookmark & BookmarkCardProps) {
  const { openModal } = useModal();
  const isLoading = false;

  const handleClickCard = () => {
    // FIXME: 타입 문제 수정
    openModal(BookmarkDetail, {
      title,
      domain,
      parent,
      tags,
      refetch,
      ...props,
    } as any);
  };

  return (
    <Card
      className={cn(
        STYLES.container.common,
        isCard ? STYLES.container.card : STYLES.container.list
      )}
      onClick={handleClickCard}
    >
      <div
        className={cn(
          STYLES.thumbnail.common,
          isCard ? STYLES.thumbnail.card : STYLES.thumbnail.list
        )}
      />
      <CardContent className={"h-1/2 px-5 py-3"}>
        <BookmarkHeader isLoading={isLoading}>
          <BookmarkTitle isLoading={isLoading}>{title}</BookmarkTitle>
          <FolderTag>{parent?.title}</FolderTag>
        </BookmarkHeader>
        <BookmarkDescription isLoading={isLoading}>
          {domain}
        </BookmarkDescription>
        <div className={isCard ? STYLES.metadata.card : STYLES.metadata.list}>
          <BookmarkTags isLoading={isLoading}>
            {tags.map((tag) => (
              <li key={`card_tag_${tag.id}`}>
                <TagItem tag={tag.name} size={"sm"} />
              </li>
            ))}
          </BookmarkTags>
          <div
            className={cn(
              STYLES.options.common,
              isCard ? STYLES.options.card : STYLES.options.list
            )}
          >
            <div className={"flex gap-2"}>
              <OptionButton
                isLoading={isLoading}
                onClick={handleFavorite(
                  props.data_id,
                  props.is_favorite,
                  refetch
                )}
              >
                <Star
                  className={
                    props.is_favorite ? "fill-yellow-400 text-yellow-400" : ""
                  }
                />
              </OptionButton>
              <OptionButton isLoading={isLoading}>
                <Share2 />
              </OptionButton>
            </div>
            <OptionButton isLoading={isLoading}>
              <EllipsisVertical />
            </OptionButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const STYLES = {
  container: {
    common:
      "cursor-pointer gap-0 p-0 hover:shadow-md hover:brightness-95 active:[&:not(:has(button:active))]:brightness-90",
    card: "w-[300px] h-[338px] md:h-[360px] md:w-[320px]",
    list: "grid w-full grid-cols-[max-content_1fr] rounded-xl bg-white p-1 md:p-2 shadow-sm",
  },
  thumbnail: {
    common: "bg-neutral-100 rounded-t-xl",
    card: "h-1/2 w-full",
    list: "aspect-video h-full rounded-b-xl",
  },
  metadata: {
    card: "",
    list: "flex-center-between",
  },
  options: {
    common: "flex items-center p-0.5 md:p-1 pb-0",
    card: "justify-between border-t border-neutral-200",
    list: "flex-1 justify-end gap-1 md:gap-2",
  },
};

interface LoadingComponentProps {
  size?: "sm" | "fill";
}

function LoadingComponent({ size = "fill" }: LoadingComponentProps) {
  return (
    <div
      className={cn("bg-neutral-100", size === "fill" ? "size-full" : "size-8")}
    />
  );
}

function BookmarkHeader({ isLoading = true, children }: BookmarkCommonProps) {
  return (
    <header className={"flex-center-between h-8 py-2"}>
      {isLoading ? <LoadingComponent /> : children}
    </header>
  );
}

function BookmarkTitle({ isLoading = true, children }: BookmarkCommonProps) {
  return (
    <CardTitle className={"line-clamp-1 text-left"}>
      {isLoading ? <LoadingComponent /> : <h2>{children}</h2>}
    </CardTitle>
  );
}

function BookmarkDescription({
  isLoading = true,
  children,
}: BookmarkCommonProps) {
  return (
    <CardDescription className={"line-clamp-2 h-10"}>
      {isLoading ? <LoadingComponent /> : children}
    </CardDescription>
  );
}

function BookmarkTags({ isLoading = true, children }: BookmarkCommonProps) {
  return (
    <ul className={"my-3 line-clamp-1 flex h-5 gap-2"}>
      {isLoading ? <LoadingComponent /> : children}
    </ul>
  );
}

function OptionButton({
  isLoading = true,
  children,
  onClick,
}: BookmarkCommonProps & { onClick?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onClick?.();
  };

  if (isLoading) return <LoadingComponent size={"sm"} />;

  return (
    <Button
      size={"icon-sm"}
      variant={"ghost"}
      className={"text-neutral-400"}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
