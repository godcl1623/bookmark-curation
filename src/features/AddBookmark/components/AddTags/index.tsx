import { Tag } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import { COMMON_STYLES } from "@/features/AddBookmark/consts";
import Button from "@/shared/components/atoms/button.tsx";
import LabeledElement from "@/shared/components/molecules/LabeledElement.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
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
