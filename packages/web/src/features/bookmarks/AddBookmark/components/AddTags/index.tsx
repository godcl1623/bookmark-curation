import { Tag } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import TagItem from "@/shared/components/molecules/TagItem";
import useClickOutside from "@/shared/hooks/useClickOutside";
import useInput from "@/shared/hooks/useInput";

// TODO: 디바운싱 + 검색기능 추가 필요

export default function AddTags() {
  const { tags, addTag, removeTag } = useTags();
  const { inputValue, changeValue, handleChange } = useInput("");
  const { wrapperRect, wrapperRef } = useInputWrapperRect();
  const { toggleSearchList } = useSearchTags();

  const submitTag = () => {
    addTag(inputValue);
    changeValue("");
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"relative flex items-end gap-2"}>
        <LabeledElement label={"Tags"} ref={wrapperRef}>
          <Tag className={COMMON_STYLES.ornament} />
          <input
            value={inputValue}
            placeholder={"Add tags..."}
            className={COMMON_STYLES.input}
            onClick={() => toggleSearchList(wrapperRect)}
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

const useDebouncedInput = () => {};

const useInputWrapperRect = () => {
  const [wrapperRect, setwrapperRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      setwrapperRect(wrapperRef.current.getBoundingClientRect());
    }
  }, []);

  return { wrapperRect, wrapperRef };
};

const useSearchTags = () => {
  const { openModal, findModal, closeModal } = useModal();

  const closeOptionModal = useCallback(() => {
    const modal = findModal("SearchList");
    if (modal) closeModal(modal.id);
  }, [closeModal, findModal]);

  const toggleSearchList = (wrapperRect?: DOMRect | null) => {
    try {
      const detail = findModal("SearchList");
      if (!detail) {
        openModal(SearchList, {
          closeModal: closeOptionModal,
          wrapperTop: wrapperRect?.top ?? 0,
          wrapperLeft: wrapperRect?.left ?? 0,
          wrapperWidth: wrapperRect?.width ?? 0,
        });
      } else {
        closeOptionModal();
      }
    } catch (error) {
      console.error("### Error in toggleSearchList: ", error);
    }
  };

  return { closeOptionModal, toggleSearchList };
};

interface SearchListProps {
  closeModal: () => void;
  wrapperTop: number;
  wrapperLeft: number;
  wrapperWidth: number;
}

function SearchList({
  closeModal,
  wrapperTop,
  wrapperLeft,
  wrapperWidth,
}: SearchListProps) {
  const { containerRef } = useClickOutside(closeModal ?? (() => null));

  return (
    <ul
      ref={containerRef}
      className={"absolute h-[120px] border border-neutral-200 bg-white"}
      style={{
        top: wrapperTop - 120,
        left: wrapperLeft,
        width: wrapperWidth,
      }}
    ></ul>
  );
}
