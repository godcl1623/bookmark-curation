import type { FormEvent } from "react";
import toast from "react-hot-toast";

import TagListItem from "@/features/bookmarks/Header/components/AddTags/TagListItem";
import DataAddForm from "@/features/bookmarks/Header/components/common/DataAddForm";
import AddonWrapper from "@/features/bookmarks/Header/components/common/DataAddForm/AddonWrapper";
import { TAGS_FORM_ELEMENTS } from "@/features/bookmarks/Header/consts";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useTagsList from "@/shared/hooks/useTagsList";
import createNewTag from "@/shared/services/tags/create-new-tag";

export default function AddTags() {
  const {
    data: tags,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useTagsList();
  console.log(tags);

  return (
    <article className={"h-[calc(100%-50px)] overflow-y-auto p-5"}>
      <DataAddForm
        key={`form_${isRefetching}`}
        title={"Add New Tag"}
        inputOptions={{
          placeholder: "Tag Name",
          name: TAGS_FORM_ELEMENTS.NAME,
        }}
        addOns={() => (
          <AddonWrapper>
            <ControlledSelect
              values={Object.entries(FOLDER_COLORS).map(([text, value]) => ({
                text,
                data_id: value,
              }))}
              name={TAGS_FORM_ELEMENTS.COLOR}
            />
          </AddonWrapper>
        )}
        onSubmit={handleSubmit(refetch)}
      />
      {/* FIXME: 로딩, 에러 화면 구성 */}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading tags.</p>}
      {!isLoading && !isError && tags && tags.length > 0 && (
        <ul className={"mt-5 flex flex-col gap-2"}>
          {tags.map((tag) => (
            <li key={`option-${tag.id}`}>
              <TagListItem {...tag} refetch={refetch} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

const handleSubmit =
  (callback?: () => void) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const extractTarget = (name: string) =>
      event.currentTarget.elements.namedItem(name);

    const name = extractTarget(TAGS_FORM_ELEMENTS.NAME);
    const color = extractTarget(TAGS_FORM_ELEMENTS.COLOR);

    if (
      name instanceof HTMLInputElement &&
      color instanceof HTMLButtonElement
    ) {
      if (name.value === "") {
        toast.error("태그 이름은 필수입니다.");
        return;
      }

      const postBody = {
        name: name.value == null || name.value === "" ? "Untitled" : name.value,
        color:
          color.value == null || color.value === ""
            ? FOLDER_COLORS.DEFAULT
            : color.value,
      };

      try {
        const result = await createNewTag(postBody);
        if (result.ok) {
          toast.success(`${postBody.name} 태그가 추가되었습니다.`);
          callback?.();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`태그 추가에 실패했습니다(${error.name})`);
        }
        console.error(error);
      }

      return;
    }

    if (name instanceof RadioNodeList && color instanceof RadioNodeList) {
      toast.error("잘못된 요소가 로드되었습니다.");
      return;
    }

    toast.error("폼 요소가 로드되지 않았습니다.");
  };
