import type { Tag } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { type FormEvent, useMemo } from "react";
import toast from "react-hot-toast";

import TagMetaInfo from "@/features/bookmarks/Header/components/AddTags/TagListItem/TagMetaInfo";
import AddonWrapper from "@/features/bookmarks/Header/components/common/DataAddForm/AddonWrapper";
import FormCore from "@/features/bookmarks/Header/components/common/DataAddForm/FormCore";
import {
  ACTION_BUTTONS,
  TAGS_FORM_ELEMENTS,
} from "@/features/bookmarks/Header/consts";
import { findIndex } from "@/features/bookmarks/Header/utils";
import Button from "@/shared/components/atoms/button";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useEdit from "@/shared/hooks/useEdit.ts";
import { cn } from "@/shared/lib/utils";
import deleteTag from "@/shared/services/tags/delete-tag";
import updateTag from "@/shared/services/tags/update-tag";
import useGlobalStore from "@/stores/global.ts";

export default function TagListItem({
  id,
  name,
  color,
  _count,
  refetch,
  ...props
}: Tag & { refetch?: () => void }) {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [isEdit, changeEditMode] = useEdit();

  const colorList = useMemo(
    () =>
      Object.entries(FOLDER_COLORS).map(([text, value]) => ({
        text,
        data_id: value,
      })),
    []
  );

  return (
    <section
      className={
        "flex-center gap-2 rounded-lg border border-neutral-200 p-2 md:gap-4 md:p-4"
      }
    >
      {isEdit ? (
        <FormCore
          inputOptions={{
            placeholder: "Tag Name",
            name: TAGS_FORM_ELEMENTS.NAME,
            initialValue: name,
          }}
          shouldDisplayVertical={isMobile}
          addOns={() => (
            <AddonWrapper>
              <ControlledSelect
                values={colorList}
                initialIndex={findIndex(
                  colorList.map((color) => color.data_id),
                  color
                )}
                name={TAGS_FORM_ELEMENTS.COLOR}
              />
            </AddonWrapper>
          )}
          actions={() => (
            <div className={"flex-center gap-2"}>
              {ACTION_BUTTONS.map((button) => (
                <Button
                  key={`tag_${id}_edit_${button.type}`}
                  type={button.type as "submit" | "reset" | "button"}
                  variant={"blank"}
                  size={"default"}
                  className={cn("flex-[0.3] text-white", button.color)}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
          onSubmit={handleSubmit(String(id), () => {
            changeEditMode()();
            refetch?.();
          })}
          onReset={changeEditMode()}
        />
      ) : (
        <TagMetaInfo
          name={name}
          color={color}
          _count={_count}
          changeEditMode={changeEditMode()}
          handleDelete={handleDelete(String(id), refetch)}
          id={id}
          {...props}
        />
      )}
    </section>
  );
}

const handleDelete = (data_id: string, callback?: () => void) => async () => {
  try {
    const result = (await deleteTag(data_id)) as AxiosResponse;
    if (result.status === 200) {
      toast.success(`태그를 성공적으로 삭제했습니다.`);
      callback?.();
    }
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`태그를 삭제하지 못했습니다(${error.status})`);
    } else if (error instanceof Error) {
      toast.error(`태그를 삭제하지 못했습니다(${error.name})`);
    }
    console.error("### Failed to delete tag: ", error);
  }
};

const handleSubmit =
  (targetId: string, callback?: () => void) =>
  async (event: FormEvent<HTMLFormElement>) => {
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

      const putBody = {
        name: name.value == null || name.value === "" ? "Untitled" : name.value,
        color:
          color.value == null || color.value === ""
            ? FOLDER_COLORS.DEFAULT
            : color.value,
      };

      try {
        const result = await updateTag(targetId, putBody);
        if (result.ok) {
          toast.success(`${putBody.name} 태그가 수정되었습니다.`);
          callback?.();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`태그 수정에 실패했습니다(${error.name})`);
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
