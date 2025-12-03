import type { Bookmark, Folder as FolderType } from "@linkvault/shared";
import {
  ChevronRight,
  EllipsisVertical,
  Folder,
  Share2,
  Star,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import { FOLDER_COLORS } from "@/shared/consts";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global";

import BlankFallback from "./components/BlankFallback";

export default function BookmarkList() {
  const currentView = useGlobalStore((state) => state.currentView);
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoriesData(pathname ?? "/", true);

  const { folders, bookmarks, breadcrumbs } = loadedDirectory?.data ?? {};
  const isListView = currentView === "list";

  return (
    <main className={"h-[calc(100vh-64px)] w-[85%] rounded-2xl bg-blue-50/75"}>
      <aside className={"w-full rounded-t-2xl border-b bg-neutral-50 p-5"}>
        <nav className={"px-5"}>
          <ul className={"flex-center gap-2 font-bold"}>
            <li className={"flex-center gap-2"}>
              <NavLink to={"/"} className={"hover:underline"}>
                홈
              </NavLink>
              {pathname !== "/" && <ChevronRight />}
            </li>
            {breadcrumbs?.map((breadcrumb, index, selfArray) => (
              <li
                key={`breadcrumb_${breadcrumb.data_id}`}
                className={"flex-center gap-2"}
              >
                <NavLink
                  to={
                    "/" +
                    selfArray
                      .slice(0, index + 1)
                      .map((item) => item.title)
                      .join("/")
                  }
                  className={`hover:underline`}
                >
                  {breadcrumb.title}
                </NavLink>
                {index < selfArray.length - 1 && <ChevronRight />}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {(!folders && !bookmarks) ||
        (folders?.length === 0 && bookmarks?.length === 0 && <BlankFallback />)}
      {folders && folders.length > 0 && (
        <article className={"p-5"}>
          <ul className={"flex-center gap-4"}>
            {folders.map((folder: FolderType) => (
              <li key={`dir_button_${folder.data_id}`}>
                <FolderButton {...folder} />
              </li>
            ))}
          </ul>
        </article>
      )}
      {bookmarks && bookmarks.length > 0 && (
        <article className={cn("p-5", folders?.length > 0 && "mt-6")}>
          <ul className={cn("flex-center gap-4", isListView && "flex-col")}>
            {bookmarks.map((bookmark: Bookmark) => (
              <li
                key={`bookmark_button_${bookmark.data_id}`}
                className={isListView ? "w-full" : ""}
              >
                <BookmarkButton
                  {...bookmark}
                  isListView={currentView === "list"}
                />
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
      className={"rounded-lg bg-white px-4 py-2 shadow-sm"}
      onClick={handleClick}
    >
      <div className={"rounded-lg p-2"} style={{ backgroundColor: color }}>
        <Folder className={"text-white"} />
      </div>
      {title}
    </Button>
  );
}

function BookmarkButton({
  title,
  domain,
  isListView = false,
}: Bookmark & { isListView?: boolean }) {
  return (
    <div
      className={cn(
        "flex cursor-pointer gap-5 rounded-lg bg-white text-left whitespace-normal shadow-lg transition-transform hover:brightness-90 active:brightness-75",
        isListView
          ? "h-[200px] items-center p-5"
          : "h-[400px] w-[300px] flex-col"
      )}
    >
      <div
        className={cn(
          "bg-gray-100",
          isListView ? "aspect-video h-full rounded-lg" : "h-1/2 rounded-t-lg"
        )}
      />
      <div
        className={cn(
          "flex flex-col",
          isListView ? "size-full" : "h-1/2 rounded-b-lg p-5"
        )}
      >
        <div className={"mb-2 flex-1 border-b border-neutral-200 pb-2"}>
          <h3 className={"mb-5 line-clamp-1"}>{title}</h3>
          <p className={"text-neutral-400"}>{domain}</p>
        </div>
        <div className={"flex-center justify-between text-neutral-400"}>
          <div className={"flex gap-2"}>
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
  );
}
