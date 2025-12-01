import type { Bookmark, Folder as FolderType } from "@linkvault/shared";
import { EllipsisVertical, Folder, Share2, Star } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import { FOLDER_COLORS } from "@/shared/consts";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";

import BlankFallback from "./components/BlankFallback";

export default function BookmarkList() {
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoriesData(pathname ?? "/", true);
  const { folders, bookmarks } = loadedDirectory?.data ?? {};

  return (
    <main className={"h-[calc(100vh-64px)] w-[85%] bg-blue-50/75 p-5"}>
      {(!folders && !bookmarks) ||
        (folders?.length === 0 && bookmarks?.length === 0 && <BlankFallback />)}
      {folders && (
        <article>
          <ul className={"flex-center gap-4"}>
            {folders.map((folder: FolderType) => (
              <li key={`dir_button_${folder.data_id}`}>
                <FolderButton {...folder} />
              </li>
            ))}
          </ul>
        </article>
      )}
      {bookmarks && (
        <article className={"mt-6"}>
          <ul className={"flex-center gap-4"}>
            {bookmarks.map((bookmark: Bookmark) => (
              <li key={`bookmark_button_${bookmark.data_id}`}>
                <BookmarkButton {...bookmark} />
              </li>
            ))}
          </ul>
        </article>
      )}
    </main>
  );
}

function FolderButton({ title, color = FOLDER_COLORS.DEFAULT }: FolderType) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    if (pathname.includes(title)) return;
    navigate(pathname !== "/" ? `${pathname}/${title}` : `/${title}`);
  };

  return (
    <Button
      size={"custom"}
      variant={"ghost"}
      className={"rounded-lg border border-blue-300/75 px-4 py-2"}
      onClick={handleClick}
    >
      <div className={"rounded-lg p-2"} style={{ backgroundColor: color }}>
        <Folder className={"text-white"} />
      </div>
      {title}
    </Button>
  );
}

function BookmarkButton({ title, domain }: Bookmark) {
  return (
    <div
      className={
        "h-[400px] w-[300px] rounded-lg text-left whitespace-normal shadow-lg"
      }
    >
      <div className={"flex size-full flex-col"}>
        <div className={"h-1/2 rounded-t-lg bg-gray-100"} />
        <div className={"flex h-1/2 flex-col rounded-b-lg bg-white p-5"}>
          <div className={"mb-2 flex-1 border-b border-neutral-200 pb-2"}>
            <h3 className={"mb-5 line-clamp-1"}>{title}</h3>
            <p className={"text-neutral-400"}>{domain}</p>
          </div>
          <div className={"flex-center justify-between text-neutral-400"}>
            <div>
              <Button variant={"ghost"} size={"icon-sm"}>
                <Star />
              </Button>
              <Button variant={"ghost"} size={"icon-sm"}>
                <Share2 />
              </Button>
            </div>
            <Button variant={"ghost"} size={"icon-sm"}>
              <EllipsisVertical />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
