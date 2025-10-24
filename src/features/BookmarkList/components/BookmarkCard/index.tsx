import { EllipsisVertical, Share2, Star } from "lucide-react";
import type { MouseEvent } from "react";

import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/organisms/card.tsx";
import { cn } from "@/shared/lib/utils.ts";
import type { BasicComponentProps } from "@/shared/types";

interface BookmarkCommonProps extends BasicComponentProps {
  isLoading?: boolean;
}

export default function BookmarkCard() {
  const isLoading = false;

  return (
    <Card
      className={
        "h-[360px] w-[320px] cursor-pointer gap-0 p-0 hover:shadow-md active:[&:not(:has(button:active))]:brightness-90"
      }
    >
      <div className={"h-1/2 w-full rounded-t-xl bg-neutral-100"} />
      <CardContent className={"h-1/2 px-5 py-3"}>
        <BookmarkTitle isLoading={isLoading}>Test Title</BookmarkTitle>
        <BookmarkDescription isLoading={isLoading}>
          Test Description
        </BookmarkDescription>
        <BookmarkTags isLoading={isLoading}>
          {DUMMY_TAG_LIST.map((tag, index) => (
            <li key={`tag-${index}`}>
              <TagItem tag={tag} size={"sm"} />
            </li>
          ))}
        </BookmarkTags>
        <div
          className={"flex-center-between border-t border-neutral-200 p-1 pb-0"}
        >
          <div className={"flex gap-2"}>
            <OptionButton isLoading={isLoading}>
              <Star />
            </OptionButton>
            <OptionButton isLoading={isLoading}>
              <Share2 />
            </OptionButton>
          </div>
          <OptionButton isLoading={isLoading}>
            <EllipsisVertical />
          </OptionButton>
        </div>
      </CardContent>
    </Card>
  );
}

const DUMMY_TAG_LIST = ["foo", "bar", "doh"];

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

function BookmarkTitle({ isLoading = true, children }: BookmarkCommonProps) {
  return (
    <CardTitle className={"line-clamp-1 h-8 py-2 text-left"}>
      {isLoading ? <LoadingComponent /> : children}
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

function OptionButton({ isLoading = true, children }: BookmarkCommonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
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
