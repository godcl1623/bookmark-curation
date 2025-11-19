import type { Folder as FolderType } from "@linkvault/shared";
import { nanoid } from "nanoid";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import FolderListItem from "@/features/bookmarks/Header/components/AddFolder/FolderListItem";
import DataAddForm from "@/features/bookmarks/Header/components/common/DataAddForm";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useFolderList from "@/shared/hooks/useFolderList";
import createNewFolder from "@/shared/services/folders/create-new-folder";
import type { BasicComponentProps } from "@/shared/types";

export default function AddFolder() {
  const {
    data: folders,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useFolderList();

  return (
    <article className={"h-[calc(100%-50px)] overflow-y-auto p-5"}>
      <DataAddForm
        key={`form_${isRefetching}`}
        title={"Add New Folder"}
        inputOptions={{ placeholder: "Folder Name", name: FORM_ELEMENTS.INPUT }}
        addOns={() => (
          <>
            <AddonWrapper>
              <ControlledSelect
                values={generateFolderOptions(
                  extractFoldersProperty(folders ?? [], "title"),
                  extractFoldersProperty(folders ?? [], "data_id")
                )}
                name={FORM_ELEMENTS.SELECT.PARENT}
              />
            </AddonWrapper>
            <AddonWrapper>
              <ControlledSelect
                values={Object.entries(FOLDER_COLORS).map(([text, value]) => ({
                  text,
                  data_id: value,
                }))}
                name={FORM_ELEMENTS.SELECT.COLOR}
              />
            </AddonWrapper>
          </>
        )}
        onSubmit={handleSubmit(refetch)}
      />
      {/* FIXME: 로딩, 에러 화면 구성 */}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading folders.</p>}
      {!isLoading && !isError && folders && folders.length > 0 && (
        <ul className={"mt-5 flex flex-col gap-2"}>
          {folders.map((folder) => (
            <li key={`option-${folder.id}`}>
              <FolderListItem {...folder} refetch={refetch} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

const FORM_ELEMENTS = {
  INPUT: "folderName",
  SELECT: {
    COLOR: "folderColor",
    PARENT: "folderParent",
  },
};

const handleSubmit =
  (callback?: () => void) => async (event: FormEvent<HTMLFormElement>) => {
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
      const data_id = nanoid();

      const postBody = {
        title:
          input.value == null || input.value === "" ? "Untitled" : input.value,
        color:
          color.value == null || color.value === ""
            ? FOLDER_COLORS.DEFAULT
            : color.value,
        parent_id: parentValue,
        data_id,
      };

      try {
        const result = await createNewFolder(postBody);
        if (result.ok) {
          toast.success(`${postBody.title} 폴더가 추가되었습니다.`);
          callback?.();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`폴더 추가에 실패했습니다(${error.name})`);
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

const extractFoldersProperty = (
  folders: FolderType[],
  extractKey: keyof FolderType
) => {
  return folders.map((folder) => {
    const value = folder[extractKey];
    if (typeof value === "string") return value;
    else if (typeof value === "number") return String(value);
    else return "";
  });
};

const generateFolderOptions = (
  titles: string[],
  data_ids: string[]
): { text: string; data_id: string | null }[] => {
  const defaultValue: { text: string; data_id: string | null }[] = [
    { text: "없음", data_id: null },
  ];
  return defaultValue.concat(
    titles.map((title, index) => ({
      text: title,
      data_id: data_ids[index],
    }))
  );
};

function AddonWrapper({ children }: BasicComponentProps) {
  return (
    <div
      className={"flex-[0.5] rounded-lg border border-neutral-200 bg-white p-1"}
    >
      {children}
    </div>
  );
}
