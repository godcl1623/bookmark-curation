import { Clock, SearchIcon, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types.ts";
import RecentItem from "@/features/search/SearchModal/RecentItem.tsx";
import XButton from "@/features/search/SearchModal/XButton.tsx";
import Button from "@/shared/components/atoms/button.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import useDebouncedInput from "@/shared/hooks/useDebouncedInput.ts";
import useTagsList from "@/shared/hooks/useTagsList.ts";

export default function SearchModal({ reject }: DefaultModalChildrenProps) {
  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { recentSearches, removeRecentItem, clearRecentSearches } =
    useSearchBookmark(debouncedValue);
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
        variants={"square"}
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
        <header className={"flex-center-between mb-5"}>
          <div className={"flex-center gap-2"}>
            <Clock className={"text-neutral-400"} />
            <h2 className={"text-lg"}>Recent Searches</h2>
          </div>
          <Button variant={"ghost"} onClick={clearRecentSearches}>
            Clear All
          </Button>
        </header>
        <ul className={"flex-col-center-center gap-2"}>
          {recentSearches.map((search, index) => (
            <li key={`search-recent-${search}_${index}`} className={"w-full"}>
              <RecentItem onClick={() => removeRecentItem(index)}>
                {search}
              </RecentItem>
            </li>
          ))}
        </ul>
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

  useEffect(() => {
    console.log(searchValue);
    addRecentSearch(searchValue ?? "");
  }, [searchValue, addRecentSearch]);

  return { recentSearches, removeRecentItem, clearRecentSearches };
};
