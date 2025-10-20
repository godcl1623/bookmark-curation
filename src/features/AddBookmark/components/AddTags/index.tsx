import { Tag, X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import { COMMON_STYLES } from "@/features/AddBookmark/consts";
import Button from "@/shared/components/atoms/button.tsx";
import LabeledElement from "@/shared/components/molecules/LabeledElement.tsx";
import useInput from "@/shared/hooks/useInput.ts";

export default function AddTags() {
  const { tags, addTag, removeTag } = useTags();
  const { inputValue, changeValue, handleChange } = useInput("");

  const submitTag = () => {
    addTag(inputValue);
    changeValue("");
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex items-end gap-2"}>
        <LabeledElement label={"Tags"}>
          <Tag className={COMMON_STYLES.ornament} />
          <input
            value={inputValue}
            placeholder={"Add tags..."}
            className={COMMON_STYLES.input}
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
      <ul className={"flex gap-2"}>
        {tags.map((tag) => (
          <li key={`tag-${tag}`}>
            <TagItem tag={tag} onClick={() => removeTag(tag)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const handleKeyDown =
  (callback?: (param?: unknown) => unknown) =>
  (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      callback?.();
    }
  };

const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);

  const addTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  return { tags, addTag, removeTag };
};

interface TagItemProps {
  tag: string;
  onClick?: () => void;
}

function TagItem({ tag, onClick }: TagItemProps) {
  const handleClick = () => {
    if (onClick != null) onClick();
  };

  return (
    <div
      className={
        "flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
      }
    >
      #{tag}
      <button onClick={handleClick}>
        <X className={"size-4"} />
      </button>
    </div>
  );
}
