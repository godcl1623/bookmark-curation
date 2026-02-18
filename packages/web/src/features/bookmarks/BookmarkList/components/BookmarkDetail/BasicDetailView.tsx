import type { Bookmark } from "@linkvault/shared";
import { ExternalLink, Link, Star } from "lucide-react";
import { useState } from "react";

import FolderTag from "@/features/bookmarks/BookmarkList/components/BookmarkCard/FolderTag.tsx";
import handleFavorite from "@/features/bookmarks/BookmarkList/utils";
import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global.ts";

export default function BasicDetailView({
  title,
  domain,
  description,
  folders,
  url,
  tags,
  data_id,
  is_favorite,
  refetch,
}: Bookmark & { refetch?: () => void }) {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [isFavorite, changeLocalFavorite] = useLocalFavoriteState(is_favorite);

  const handleClick = () => {
    changeLocalFavorite();
    refetch?.();
  };

  return (
    <>
      <header className={"flex-center-between"}>
        <h2 className={"line-clamp-1 text-lg text-black md:text-2xl"}>
          {title}
        </h2>
        <div className={"flex-center gap-1 md:gap-2"}>
          <FolderTag>{folders?.title}</FolderTag>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={handleFavorite(data_id, isFavorite, handleClick)}
            aria-label={"favorite"}
          >
            <Star
              className={cn(
                isMobile ? "size-5" : "size-6",
                isFavorite ? "fill-yellow-400 text-yellow-400" : ""
              )}
            />
          </Button>
        </div>
      </header>
      <div className={"flex-col-center-center gap-2"}>
        <p className={"flex-center w-full gap-2"} aria-label={"domain"}>
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
        <p className={"text-sm"} aria-label={"description"}>
          {description}
        </p>
      </div>
      <div>
        <h3
          className={
            "before:contents-[''] mb-2 text-base before:mr-2 before:border-2 before:border-blue-400"
          }
        >
          Tags
        </h3>
        <ul className={"flex-center gap-2"} aria-label={"tags"}>
          {tags.map((tag) => (
            <li key={`detail_tag_${tag.id}`}>
              <TagItem tag={tag.name} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const useLocalFavoriteState = (initialState: boolean) => {
  const [isFavorite, setIsFavorite] = useState(initialState);

  const changeLocalFavorite = () => setIsFavorite(!isFavorite);

  return [isFavorite, changeLocalFavorite] as const;
};
