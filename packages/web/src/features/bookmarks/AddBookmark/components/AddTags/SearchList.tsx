import type { Tag as TagType } from "@linkvault/shared";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import Button from "@/shared/components/atoms/button";
import useClickOutside from "@/shared/hooks/useClickOutside";
import useTagsList from "@/shared/hooks/useTagsList";
import TAGS_QUERY_KEY from "@/shared/services/tags/queryKey";

interface SearchListProps {
  searchValue: string;
  addTag: (tag: TagType) => void;
  addNewTag: (tagName: string) => void;
  clearSearchValue: () => void;
  closeModal: () => void;
  wrapperWidth: number;
  wrapperHeight: number;
}

export default function SearchList({
  searchValue,
  closeModal,
  addTag,
  addNewTag,
  clearSearchValue,
  wrapperWidth,
  wrapperHeight,
}: SearchListProps) {
  const queryClient = useQueryClient();
  const { data: tags } = useTagsList(searchValue);
  const { containerRef } = useClickOutside(closeModal ?? (() => null));

  const initializeTagList = () => {
    queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY.TOTAL_LISTS("") });
  };

  const handleClickTag = (tag: TagType) => {
    addTag(tag);
    initializeTagList();
    clearSearchValue();
  };

  const handleClickNewTag = (tagName: string) => {
    addNewTag(tagName);
    initializeTagList();
    clearSearchValue();
  };

  return (
    <ul
      ref={containerRef}
      className={
        "absolute z-10 h-[120px] overflow-y-auto border border-neutral-200 bg-white"
      }
      style={{
        bottom: wrapperHeight,
        left: 0,
        width: wrapperWidth,
      }}
    >
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <li key={`tag-${tag.id}`}>
            <Button
              type={"button"}
              variant={"ghost"}
              size={"custom"}
              className={"w-full justify-start px-4 py-2"}
              onClick={() => handleClickTag(tag)}
            >
              {tag.name}
            </Button>
          </li>
        ))
      ) : (
        <li className={"px-4 py-2 text-sm text-neutral-400"}>No tags found</li>
      )}
      <li>
        <Button
          type={"button"}
          variant={"ghost"}
          size={"custom"}
          className={"w-full justify-start px-4 py-2 text-neutral-400"}
          onClick={() => handleClickNewTag(searchValue)}
        >
          <Plus />
          Add New Tag
        </Button>
      </li>
    </ul>
  );
}
