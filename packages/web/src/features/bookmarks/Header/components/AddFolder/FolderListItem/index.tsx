import type { Folder as FolderType } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { type FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

import FolderMetaInfo from "@/features/bookmarks/Header/components/AddFolder/FolderListItem/FolderMetaInfo";
import AddonWrapper from "@/features/bookmarks/Header/components/common/DataAddForm/AddonWrapper";
import FormCore from "@/features/bookmarks/Header/components/common/DataAddForm/FormCore";
import {
  extractFoldersProperty,
  generateFolderOptions,
} from "@/features/bookmarks/Header/utils";
import Button from "@/shared/components/atoms/button";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useFolderList from "@/shared/hooks/useFolderList";
import { cn } from "@/shared/lib/utils";
import deleteFolder from "@/shared/services/folders/delete-folder";
import updateFolder from "@/shared/services/folders/update-folder";

export default function FolderListItem({
  title,
  color,
  _count,
  data_id,
  refetch,
  ...props
}: FolderType & { refetch?: () => void }) {
  const [isEdit, changeEditMode] = useEdit();
  const { data: folders } = useFolderList();
  const folderList = useMemo(
    () =>
      generateFolderOptions(
        extractFoldersProperty(folders ?? [], "title"),
        extractFoldersProperty(folders ?? [], "data_id")
      ),
    [folders]
  );
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
      className={"flex-center gap-4 rounded-lg border border-neutral-200 p-4"}
    >
      {isEdit ? (
        <FormCore
          inputOptions={{
            placeholder: "Folder Name",
            name: FORM_ELEMENTS.INPUT,
            initialValue: title,
          }}
          addOns={() => (
            <>
              <AddonWrapper>
                <ControlledSelect
                  values={folderList}
                  name={FORM_ELEMENTS.SELECT.PARENT}
                  initialIndex={findIndex(
                    folderList.map((folder) => folder.text),
                    props.parent?.title
                  )}
                />
              </AddonWrapper>
              <AddonWrapper>
                <ControlledSelect
                  values={colorList}
                  initialIndex={findIndex(
                    colorList.map((color) => color.data_id),
                    color
                  )}
                  name={FORM_ELEMENTS.SELECT.COLOR}
                />
              </AddonWrapper>
            </>
          )}
          actions={() => (
            <div className={"flex-center gap-2"}>
              {ACTION_BUTTONS.map((button) => (
                <Button
                  key={`${data_id}_edit`}
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
          onSubmit={handleSubmit(data_id, () => {
            changeEditMode();
            refetch?.();
          })}
          onReset={changeEditMode}
        />
      ) : (
        <FolderMetaInfo
          title={title}
          color={color}
          _count={_count}
          changeEditMode={changeEditMode}
          handleDelete={handleDelete(data_id, refetch)}
          data_id={data_id}
          {...props}
        />
      )}
    </section>
  );
}

const FORM_ELEMENTS = {
  INPUT: "folderName",
  SELECT: {
    COLOR: "folderColor",
    PARENT: "folderParent",
  },
};

const ACTION_BUTTONS = [
  {
    label: "Edit",
    type: "submit",
    color: "bg-green-500",
  },
  {
    label: "Cancel",
    type: "reset",
    color: "bg-red-500",
  },
];

const handleDelete = (data_id: string, callback?: () => void) => async () => {
  try {
    const result = (await deleteFolder(data_id)) as AxiosResponse;
    if (result.status === 200) {
      toast.success(`폴더를 성공적으로 삭제했습니다.`);
      callback?.();
    }
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`폴더를 삭제하지 못했습니다(${error.status})`);
    } else if (error instanceof Error) {
      toast.error(`폴더를 삭제하지 못했습니다(${error.name})`);
    }
    console.error("### Failed to delete folder: ", error);
  }
};

const handleSubmit =
  (targetId: string, callback?: () => void) =>
  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const extractTarget = (name: string) =>
      event.currentTarget.elements.namedItem(name);

    const input = extractTarget(FORM_ELEMENTS.INPUT);
    const color = extractTarget(FORM_ELEMENTS.SELECT.COLOR);
    const parent = extractTarget(FORM_ELEMENTS.SELECT.PARENT);

    if (
      input instanceof HTMLInputElement &&
      color instanceof HTMLButtonElement &&
      parent instanceof HTMLButtonElement
    ) {
      if (input.value === "") {
        toast.error("폴더 이름은 필수입니다.");
        return;
      }

      const parentValue = parent.value === "" ? null : parent.value;

      const putBody = {
        title:
          input.value == null || input.value === "" ? "Untitled" : input.value,
        color:
          color.value == null || color.value === ""
            ? FOLDER_COLORS.DEFAULT
            : color.value,
        parent_id: parentValue,
        data_id: targetId,
      };

      try {
        const result = await updateFolder(targetId, putBody);
        if (result.ok) {
          toast.success(`${putBody.title} 폴더가 수정되었습니다.`);
          callback?.();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`폴더 수정에 실패했습니다(${error.name})`);
        }
        console.error(error);
      }

      return;
    }

    if (
      input instanceof RadioNodeList &&
      color instanceof RadioNodeList &&
      parent instanceof RadioNodeList
    ) {
      toast.error("잘못된 요소가 로드되었습니다.");
      return;
    }

    toast.error("폼 요소가 로드되지 않았습니다.");
  };

const findIndex = (array: unknown[], value: unknown) => {
  const index = array.findIndex((item) => item === value);
  return index === -1 ? 0 : index;
};

const useEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  const changeEditMode = () => {
    setIsEdit(!isEdit);
  };

  return [isEdit, changeEditMode] as const;
};
