import type { Folder as FolderType } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import FolderMetaInfo from "@/features/bookmarks/Header/components/AddFolder/FolderListItem/FolderMetaInfo";
import AddonWrapper from "@/features/bookmarks/Header/components/common/DataAddForm/AddonWrapper";
import FormCore from "@/features/bookmarks/Header/components/common/DataAddForm/FormCore";
import {
  extractFoldersProperty,
  generateFolderOptions,
} from "@/features/bookmarks/Header/utils";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useFolderList from "@/shared/hooks/useFolderList";
import deleteFolder from "@/shared/services/folders/delete-folder";

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
                  initialIndex={findIndex(folderList, props.parent_id) ?? 0}
                />
              </AddonWrapper>
              <AddonWrapper>
                <ControlledSelect
                  values={colorList}
                  initialIndex={
                    findIndex(
                      colorList.map((color) => color.data_id),
                      color
                    ) ?? 0
                  }
                  name={FORM_ELEMENTS.SELECT.COLOR}
                />
              </AddonWrapper>
            </>
          )}
          actions={() => null}
          onSubmit={() => null}
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

const findIndex = (array: unknown[], value: unknown) => {
  return array.findIndex((item) => item === value);
};

const useEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  const changeEditMode = () => {
    setIsEdit(!isEdit);
  };

  return [isEdit, changeEditMode] as const;
};
