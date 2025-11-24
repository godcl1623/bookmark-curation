import { Tag } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import TagItem from "@/shared/components/molecules/TagItem";
import useClickOutside from "@/shared/hooks/useClickOutside";
import useInput from "@/shared/hooks/useInput";
import useTagsList from "@/shared/hooks/useTagsList";

export default function AddTags() {
  const { tags, addTag, removeTag } = useTags();
  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { wrapperRect, wrapperRef } = useInputWrapperRect();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const submitTag = () => {
    addTag(inputValue);
    changeValue("");
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"relative flex items-end gap-2"}>
        {isSearchVisible && wrapperRect && (
          <SearchList
            searchValue={debouncedValue}
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
            onKeyDown={handleKeyDown(submitTag)}
          />
        </LabeledElement>
        <Button
          size={"custom"}
          variant={"blank"}
          className={"bg-blue-50 px-6 py-[13px] text-lg text-blue-500"}
          onClick={submitTag}
        >
          Add
        </Button>
      </div>
      <ul className={"flex w-full flex-wrap gap-2"}>
        {tags.map((tag, index) => (
          <li key={`tag-${tag}-${index}`}>
            <TagItem tag={tag} needClose onClick={() => removeTag(tag)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const handleKeyDown =
  (callback?: (param?: unknown) => unknown) =>
  (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      callback?.();
      return;
    }
  };

const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);

  const addTag = (tag: string) => {
    if (tag.trim() === "") return;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  return { tags, addTag, removeTag };
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
  closeModal: () => void;
  wrapperWidth: number;
  wrapperHeight: number;
}

function SearchList({
  searchValue,
  closeModal,
  wrapperWidth,
  wrapperHeight,
}: SearchListProps) {
  const { data: tags } = useTagsList(searchValue);
  const { containerRef } = useClickOutside(closeModal ?? (() => null));

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
          <li
            key={tag.id}
            className={"cursor-pointer px-4 py-2 hover:bg-neutral-100"}
          >
            {tag.name}
          </li>
        ))
      ) : (
        <li className={"px-4 py-2 text-neutral-400"}>No tags found</li>
      )}
    </ul>
  );
}
