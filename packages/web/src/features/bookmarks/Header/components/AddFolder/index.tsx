import type { Folder as FolderType } from "@linkvault/shared";
import { Folder, Pencil, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import DataAddForm from "@/features/bookmarks/Header/components/common/DataAddForm";
import Button from "@/shared/components/atoms/button";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import useFolderList from "@/shared/hooks/useFolderList";
import type { BasicComponentProps } from "@/shared/types";

export default function AddFolder() {
  const { data: folders, isLoading, isError } = useFolderList();

  return (
    <article className={"h-[calc(100%-50px)] overflow-y-auto p-5"}>
      <DataAddForm
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
                name={FORM_ELEMENTS.SELECT.COLOR}
              />
            </AddonWrapper>
            <AddonWrapper>
              <ControlledSelect
                values={Object.entries(FOLDER_COLORS).map(([text, value]) => ({
                  text,
                  data_id: value,
                }))}
                name={FORM_ELEMENTS.SELECT.PARENT}
              />
            </AddonWrapper>
          </>
        )}
        onSubmit={handleSubmit}
      />
      {/* FIXME: 로딩, 에러 화면 구성 */}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading folders.</p>}
      {!isLoading && !isError && folders && folders.length > 0 && (
        <ul className={"mt-5 flex flex-col gap-2"}>
          {folders.map((folder) => (
            <li key={`option-${folder.id}`}>
              <FolderListItem {...folder} />
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

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const extractTarget = (name: string) =>
    event.currentTarget.elements.namedItem(name);

  const input = extractTarget(FORM_ELEMENTS.INPUT);
  const select = extractTarget(FORM_ELEMENTS.SELECT.COLOR);
  const parent = extractTarget(FORM_ELEMENTS.SELECT.PARENT);

  switch (true) {
    case input instanceof HTMLInputElement &&
      select instanceof HTMLButtonElement &&
      parent instanceof HTMLButtonElement:
      if (input.value === "") {
        toast.error("폴더 이름은 필수입니다.");
        return;
      }

      console.log(input.value);
      console.log(select.value);
      console.log(parent.value);

      return;

    case input instanceof RadioNodeList &&
      select instanceof RadioNodeList &&
      parent instanceof RadioNodeList:
      toast.error("잘못된 요소가 로드되었습니다.");
      return;

    default:
      toast.error("폼 요소가 로드되지 않았습니다.");
      return;
  }
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

function FolderListItem({ title, color, _count }: FolderType) {
  return (
    <section
      className={"flex-center gap-4 rounded-lg border border-neutral-200 p-4"}
    >
      <div
        className={"rounded-lg p-2 text-white"}
        style={{ backgroundColor: color }}
      >
        <Folder />
      </div>
      <div className={"flex-1 flex-col"}>
        <h2>{title}</h2>
        <p className={"text-sm text-neutral-500"}>
          북마크 {_count.bookmarks}개
        </p>
      </div>
      <div className={"flex-center gap-2"}>
        <FunctionButton color={"black"}>
          <Pencil />
        </FunctionButton>
        <FunctionButton>
          <Trash2 />
        </FunctionButton>
      </div>
    </section>
  );
}

function FunctionButton({
  children,
  color,
}: BasicComponentProps & { color?: "black" | "red" }) {
  const buttonColor = color === "black" ? "text-black" : "text-red-500";

  return (
    <Button variant={"ghost"} size={"icon-sm"} className={buttonColor}>
      {children}
    </Button>
  );
}
