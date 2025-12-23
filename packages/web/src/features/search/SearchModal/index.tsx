import { Clock, SearchIcon, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types.ts";
import BookmarkCard from "@/features/bookmarks/BookmarkList/components/BookmarkCard";
import RecentItem from "@/features/search/SearchModal/RecentItem.tsx";
import XButton from "@/features/search/SearchModal/XButton.tsx";
import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import useBookmarksList from "@/shared/hooks/useBookmarksList.ts";
import useDebouncedInput from "@/shared/hooks/useDebouncedInput.ts";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData.ts";
import useTagsList from "@/shared/hooks/useTagsList.ts";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global.ts";

export default function SearchModal({ reject }: DefaultModalChildrenProps) {
  const isMobile = useGlobalStore((state) => state.isMobile);

  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { recentSearches, removeRecentItem, clearRecentSearches, bookmarks } =
    useSearchBookmark(debouncedValue);
  const { data: tags } = useTagsList({ sort_by: "count", limit: 10 });
  const loadedDirectory = useDirectoriesData(window.location.pathname);

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
    <article
      className={
        "absolute inset-0 h-max min-h-full min-w-full bg-white pt-7 md:pt-0"
      }
    >
      <XButton
        className={"absolute top-0 right-0 p-1.5 md:top-2.5 md:right-2.5"}
        onClick={reject}
        iconSize={"lg"}
        variants={"square"}
      />
      <section className={"w-full p-2.5 shadow-md md:p-5"}>
        <div
          className={
            "flex-center gap-3 rounded-lg border border-neutral-300 px-2 py-2 md:mx-auto md:max-w-1/2 md:px-4"
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
      {debouncedValue !== "" && bookmarks && bookmarks.length > 0 ? (
        <section
          className={
            "flex-col-center-center mx-auto my-5 w-full px-5 md:my-10 md:px-0"
          }
        >
          <p className={"mb-5 text-sm font-bold text-neutral-500"}>
            검색결과: 북마크 {bookmarks.length}개
          </p>
          <ul
            className={cn(
              "mx-auto w-full",
              "flex flex-wrap justify-center gap-5"
            )}
          >
            {bookmarks.map((bookmark) => (
              <li key={`search-bookmark-${bookmark.id}`}>
                <BookmarkCard
                  {...bookmark}
                  refetch={loadedDirectory?.refetch}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          <section className={"mx-auto my-5 w-[85%] md:my-10 md:w-1/2"}>
            <header className={"flex-center-between mb-5"}>
              <div className={"flex-center gap-2"}>
                <Clock
                  className={cn("text-neutral-400", isMobile ? "size-5" : "")}
                />
                <h2 className={isMobile ? "text-base" : "text-lg"}>
                  Recent Searches
                </h2>
              </div>
              <Button
                variant={"ghost"}
                onClick={clearRecentSearches}
                className={cn(
                  "text-neutral-400",
                  isMobile ? "text-xs" : "text-sm"
                )}
              >
                Clear All
              </Button>
            </header>
            <ul className={"flex-col-center-center gap-2"}>
              {recentSearches.map((search, index) => (
                <li
                  key={`search-recent-${search}_${index}`}
                  className={"w-full"}
                >
                  <RecentItem
                    onClick={() => changeValue(search)}
                    onRemove={() => removeRecentItem(index)}
                  >
                    {search}
                  </RecentItem>
                </li>
              ))}
            </ul>
          </section>
          <section className={"mx-auto my-5 w-[85%] md:my-10 md:w-1/2"}>
            <header className={"flex-center mb-5 gap-2"}>
              <TrendingUp
                className={cn("text-neutral-400", isMobile ? "size-5" : "")}
              />
              <h2 className={isMobile ? "text-base" : "text-lg"}>
                Popular Tags
              </h2>
            </header>
            <ul className={"flex-center w-full flex-wrap gap-2"}>
              {tagsList.map((tag) => (
                <li key={`search-tag-${tag.id}`}>
                  <button onClick={() => changeValue(tag.name)}>
                    <TagItem
                      tag={tag.name}
                      bookmarks={tag._count.bookmark_tags}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </article>
  );
}

const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const storeRecentSearches = useCallback(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = useCallback((searchValue: string) => {
    if (searchValue === "") return;
    setRecentSearches((prev) =>
      [searchValue, ...prev.filter((value) => value !== searchValue)].slice(
        0,
        5
      )
    );
  }, []);

  const removeRecentItem = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, i) => i !== index));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  useEffect(() => {
    const storedRecentSearches = localStorage.getItem("recentSearches");
    if (!storedRecentSearches) return;

    const parsedList = JSON.parse(storedRecentSearches);
    if (!Array.isArray(parsedList) || parsedList.length === 0) return;

    setRecentSearches(
      storedRecentSearches ? JSON.parse(storedRecentSearches) : []
    );
  }, []);

  useEffect(() => {
    storeRecentSearches();
  }, [recentSearches.length, storeRecentSearches]);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentItem,
    clearRecentSearches,
  };
};

const useSearchBookmark = (searchValue?: string) => {
  const {
    recentSearches,
    addRecentSearch,
    removeRecentItem,
    clearRecentSearches,
  } = useRecentSearches();

  const { data: bookmarks, isLoading } = useBookmarksList(
    searchValue ? { search: searchValue } : undefined
  );

  useEffect(() => {
    if (searchValue && searchValue.trim() !== "") {
      addRecentSearch(searchValue);
    }
  }, [searchValue, addRecentSearch]);

  return {
    recentSearches,
    removeRecentItem,
    clearRecentSearches,
    bookmarks,
    isLoading,
  };
};
