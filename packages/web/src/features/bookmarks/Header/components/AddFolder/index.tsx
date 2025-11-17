import type { Folder as FolderType } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";
import { Folder, Pencil, Plus, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import Button from "@/shared/components/atoms/button";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";
import getFoldersList from "@/shared/services/folders/get-folders-list";
import FOLDERS_QUERY_KEY from "@/shared/services/folders/queryKey";
import type { BasicComponentProps } from "@/shared/types";

export default function AddFolder() {
  const { data: folders, isLoading, isError } = useFolderList();

  return (
    <article className={"h-[calc(100%-50px)] overflow-y-auto p-5"}>
      <section className={"rounded-lg bg-neutral-50 p-4"}>
        <header className={"flex-center mb-2 gap-2"}>
          <Plus className={"size-5 text-blue-500"} />
          <h2 className={"text-base"}>Add New Folder</h2>
        </header>
        <form className={"flex-center gap-2"} onSubmit={handleSubmit}>
          <ControlledInput
            placeholder={"Folder Name"}
            name={FORM_ELEMENTS.INPUT}
            className={
              "flex-2 rounded-lg border border-neutral-200 bg-white px-4 py-2"
            }
          />
          <div
            className={
              "flex-[0.5] rounded-lg border border-neutral-200 bg-white p-1"
            }
          >
            <ControlledSelect
              values={Object.keys(FOLDER_COLORS)}
              name={FORM_ELEMENTS.SELECT}
            />
          </div>
          <Button
            type={"submit"}
            variant={"blank"}
            size={"lg"}
            className={"flex-[0.3] bg-blue-500 text-white"}
          >
            <Plus />
            Add
          </Button>
        </form>
      </section>
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
  SELECT: "folderColor",
};

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const input = event.currentTarget.elements.namedItem(FORM_ELEMENTS.INPUT);
  const select = event.currentTarget.elements.namedItem(FORM_ELEMENTS.SELECT);

  switch (true) {
    case input instanceof HTMLInputElement &&
      select instanceof HTMLButtonElement:
      if (input.value === "") {
        toast.error("폴더 이름은 필수입니다.");
        return;
      }

      console.log(input.value);
      console.log(select.value);

      return;

    case input instanceof RadioNodeList && select instanceof RadioNodeList:
      toast.error("잘못된 요소가 로드되었습니다.");
      return;

    default:
      toast.error("폼 요소가 로드되지 않았습니다.");
      return;
  }
};

const useFolderList = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<{ ok: boolean; data: FolderType[] }>({
    queryKey: FOLDERS_QUERY_KEY.TOTAL_LISTS,
    queryFn: getFoldersList,
  });

  return { data: response?.data, isLoading, isError };
};

function FolderListItem({ title, color }: FolderType) {
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
        <p className={"text-sm text-neutral-500"}>북마크 3개</p>
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
