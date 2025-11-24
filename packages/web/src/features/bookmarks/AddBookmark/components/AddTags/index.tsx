import { type Tag as TagType } from "@linkvault/shared";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Plus, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import TagItem from "@/shared/components/molecules/TagItem";
import { FOLDER_COLORS } from "@/shared/consts";
import useClickOutside from "@/shared/hooks/useClickOutside";
import useInput from "@/shared/hooks/useInput";
import useTagsList from "@/shared/hooks/useTagsList";
import createNewTag from "@/shared/services/tags/create-new-tag";
import TAGS_QUERY_KEY from "@/shared/services/tags/queryKey";

export default function AddTags() {
  const { tags, addTag, addNewTag, removeTag } = useTags();
  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { wrapperRect, wrapperRef } = useInputWrapperRect();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"relative flex items-end gap-2"}>
        {isSearchVisible && wrapperRect && (
          <SearchList
            searchValue={debouncedValue}
            addTag={addTag}
            addNewTag={addNewTag}
            clearSearchValue={() => changeValue("")}
            closeModal={() => setIsSearchVisible(false)}
            wrapperWidth={wrapperRect.width}
            wrapperHeight={wrapperRect.height}
          />
        )}
        <LabeledElement label={"Tags"} ref={wrapperRef}>
          <Tag className={COMMON_STYLES.ornament} />
          <input
            value={inputValue}
            placeholder={"Add tags..."}
            className={COMMON_STYLES.input}
            onClick={() => setIsSearchVisible(true)}
            onChange={handleChange}
          />
        </LabeledElement>
      </div>
      <ul className={"flex w-full flex-wrap gap-2"}>
        {tags.map((tag) => (
          <li key={`tag-added-${tag.id}`}>
            <TagItem
              tag={tag.name}
              needClose
              onClick={() => removeTag(tag.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const useTags = () => {
  const [tags, setTags] = useState<TagType[]>([]);

  const addTag = (tag: TagType) => {
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  const addNewTag = async (tagName: string) => {
    const postBody = { name: tagName, color: FOLDER_COLORS.DEFAULT };

    try {
      const result = await createNewTag(postBody);
      if (result.ok) {
        toast.success(`${postBody.name} 태그가 추가되었습니다.`);
        addTag(result.data);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`태그 추가에 실패했습니다(${error.status})`);
      }
      console.error(error);
    }
  };

  const removeTag = (id: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  return { tags, addTag, addNewTag, removeTag };
};

const useDebouncedInput = (defaultValue: string = "") => {
  const { inputValue, changeValue, handleChange } = useInput(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return { debouncedValue, inputValue, changeValue, handleChange };
};

const useInputWrapperRect = () => {
  const [wrapperRect, setWrapperRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperRect(wrapperRef.current.getBoundingClientRect());
    }
  }, []);

  return { wrapperRect, wrapperRef };
};

interface SearchListProps {
  searchValue: string;
  addTag: (tag: TagType) => void;
  addNewTag: (tagName: string) => void;
  clearSearchValue: () => void;
  closeModal: () => void;
  wrapperWidth: number;
  wrapperHeight: number;
}

function SearchList({
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
