import { SearchIcon, TrendingUp, XIcon } from "lucide-react";
import { useMemo } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types.ts";
import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import useDebouncedInput from "@/shared/hooks/useDebouncedInput.ts";
import useTagsList from "@/shared/hooks/useTagsList.ts";
import { cn } from "@/shared/lib/utils";

export default function SearchModal({ reject }: DefaultModalChildrenProps) {
  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { data: tags } = useTagsList({ sort_by: "count", limit: 10 });

  const tagsList = useMemo(
    () =>
      tags
        ?.filter((tag) => tag._count.bookmark_tags > 0)
        .sort((prev, next) => {
          if (prev._count.bookmark_tags === next._count.bookmark_tags)
            return prev.name.localeCompare(next.name);
          return next._count.bookmark_tags - prev._count.bookmark_tags;
        }) ?? [],
    [tags]
  );

  return (
    <article className={"absolute inset-0 size-full bg-white"}>
      <XButton
        className={"absolute top-2.5 right-2.5 p-1.5"}
        onClick={reject}
        iconSize={"lg"}
      />
      <section className={"w-full p-5 shadow-md"}>
        <div
          className={
            "flex-center mx-auto max-w-1/2 gap-3 rounded-lg border border-neutral-300 px-4 py-2"
          }
        >
          <SearchIcon />
          <input
            value={inputValue}
            onChange={handleChange}
            className={"flex-1 outline-none"}
            placeholder={"Search..."}
          />
          {inputValue.length > 0 && (
            <XButton className={"p-1"} onClick={() => changeValue("")} />
          )}
        </div>
      </section>
      <section className={"mx-auto my-10 w-1/2"}>
        <header className={"flex-center mb-5 gap-2"}>
          <TrendingUp className={"text-neutral-400"} />
          <h2 className={"text-lg"}>Popular Tags</h2>
        </header>
        <ul className={"flex-center gap-2"}>
          {tagsList.map((tag) => (
            <li key={`search-tag-${tag.id}`}>
              <TagItem tag={tag.name} bookmarks={tag._count.bookmark_tags} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

interface XButtonProps {
  onClick?: () => void;
  className?: string;
  iconSize?: "sm" | "lg";
}

function XButton({ onClick, className = "", iconSize = "sm" }: XButtonProps) {
  const size = iconSize === "sm" ? "size-4" : "size-6";

  return (
    <Button
      variant={"ghost"}
      size={"custom"}
      className={cn("rounded-full", className)}
      onClick={onClick ?? (() => null)}
    >
      <XIcon className={size} />
    </Button>
  );
}
