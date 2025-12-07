import type { Bookmark } from "@linkvault/shared";
import { ExternalLink, Link, Star } from "lucide-react";

import FolderTag from "@/features/bookmarks/BookmarkList/components/BookmarkCard/FolderTag.tsx";
import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";

export default function BasicDetailView({
  title,
  domain,
  description,
  parent,
  url,
  tags,
}: Bookmark) {
  return (
    <>
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
    </>
  );
}
