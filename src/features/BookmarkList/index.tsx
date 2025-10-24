import { EllipsisVertical, Share2, Star } from "lucide-react";
import type { MouseEvent } from "react";

import BlankFallback from "@/features/BookmarkList/components/BlankFallback";
import Button from "@/shared/components/atoms/button";
import TagItem from "@/shared/components/molecules/TagItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/organisms/card";
import type { BasicComponentProps } from "@/shared/types";

export default function BookmarkList() {
  const dummyList = ["foo"];

  return (
    <main className={"w-[85%] bg-blue-50/75 p-5"}>
      {dummyList.length === 0 && <BlankFallback />}
      <div>
        <Card
          className={
            "h-[calc(50vh-64px)] w-[320px] cursor-pointer gap-0 p-0 hover:shadow-md active:[&:not(:has(button:active))]:brightness-90"
          }
        >
          <div className={"h-1/2 w-full rounded-t-xl bg-neutral-100"} />
          <CardContent className={"h-1/2 px-5 py-3"}>
            <header className={"py-2"}>
              <CardTitle className={"line-clamp-1 text-left"}>
                Test Title
              </CardTitle>
            </header>
            <CardDescription className={"line-clamp-2 h-10"}>
              Test Description
            </CardDescription>
            <ul className={"my-3 line-clamp-1 flex h-5 gap-2"}>
              <li>
                <TagItem tag={"foo"} size={"sm"} />
              </li>
              <li>
                <TagItem tag={"bar"} size={"sm"} />
              </li>
              <li>
                <TagItem tag={"doh"} size={"sm"} />
              </li>
            </ul>
            <div
              className={
                "flex-center-between border-t border-neutral-200 p-1 pb-0"
              }
            >
              <div className={"flex gap-2"}>
                <OptionButton>
                  <Star />
                </OptionButton>
                <OptionButton>
                  <Share2 />
                </OptionButton>
              </div>
              <OptionButton>
                <EllipsisVertical />
              </OptionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function OptionButton({ children }: BasicComponentProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

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
