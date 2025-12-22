import { type Tag as TagType } from "@linkvault/shared";
import { isAxiosError } from "axios";
import { Tag } from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import SearchList from "@/features/bookmarks/AddBookmark/components/AddTags/SearchList";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import { COMMON_STYLES, FOLDER_COLORS } from "@/shared/consts";
import useDebouncedInput from "@/shared/hooks/useDebouncedInput.ts";
import createNewTag from "@/shared/services/tags/create-new-tag";

interface AddTagsProps {
  input?: (props: ComponentProps<"input">) => ReactNode;
  initialList?: TagType[];
}

export default function AddTags({ input, initialList = [] }: AddTagsProps) {
  const { tags, addTag, addNewTag, removeTag } = useTags(initialList);
  const { debouncedValue, inputValue, changeValue, handleChange } =
    useDebouncedInput();
  const { wrapperRect, wrapperRef } = useInputWrapperRect();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"relative flex items-end gap-2"}>
        {/* TODO: 추후 방향키로 태그 선택하는 기능 구현, 태그를 세로 리스트 형태에서 배지 모음으로 나타내도록 수정 */}
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
          {input &&
            input({
              value: inputValue,
              onClick: () => setIsSearchVisible(true),
              onChange: handleChange,
            })}
        </LabeledElement>
      </div>
      <ul className={"flex w-full flex-wrap gap-2"}>
        {tags.map((tag) => (
          <li key={`tag-added-${tag.id}`} data-id={tag.id}>
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

const useTags = (initialList: TagType[] = []) => {
  const [tags, setTags] = useState<TagType[]>([]);

  const addTag = (tag: TagType) => {
    setTags((prev) =>
      prev.map((prevTag) => prevTag.id).includes(tag.id) ? prev : [...prev, tag]
    );
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

  useEffect(() => {
    if (initialList.length === 0) return;
    setTags((prev) =>
      prev
        .filter(
          (prevTag) => !initialList.map((tag) => tag.id).includes(prevTag.id)
        )
        .concat(initialList)
    );
  }, [initialList]);

  return { tags, addTag, addNewTag, removeTag };
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
