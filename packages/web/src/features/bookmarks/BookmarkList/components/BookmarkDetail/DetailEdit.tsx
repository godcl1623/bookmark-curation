import type { Tag } from "@linkvault/shared";
import { useMemo } from "react";

import AddTags from "@/features/bookmarks/AddBookmark/components/AddTags";
import InputWithPaste from "@/features/bookmarks/AddBookmark/components/InputWithPaste";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import { findIndex } from "@/features/bookmarks/Header/utils";
import ControlledInput from "@/shared/components/molecules/ControlledInput.tsx";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import ControlledTextArea from "@/shared/components/molecules/ControlledTextArea";
import useFolderList from "@/shared/hooks/useFolderList";
import { cn } from "@/shared/lib/utils";
import { extractFoldersProperty, generateFolderOptions } from "@/shared/utils";

interface DetailEditProps {
  initial: {
    url: string;
    title: string;
    description: string;
    tags: Tag[];
    parent_id: string | null;
  };
}

export default function DetailEdit({ initial }: DetailEditProps) {
  const { data: folders } = useFolderList();
  const folderList = useMemo(
    () =>
      generateFolderOptions(
        extractFoldersProperty(folders ?? [], "title"),
        extractFoldersProperty(folders ?? [], "data_id")
      ),
    [folders]
  );

  return (
    <form>
      <div className={"flex-center-between"}>
        <ControlledInput
          placeholder={"Enter bookmark title"}
          className={cn("text-2xl text-black", STYLES.common_input)}
          name={FORM_ELEMENTS.TITLE}
          passedValue={initial.title}
        />
        <div
          className={"flex-center gap-2 rounded-md border border-neutral-300"}
        >
          <ControlledSelect
            values={folderList}
            initialIndex={findIndex(
              folderList.map((folder) => folder.data_id),
              initial.parent_id
            )}
            name={FORM_ELEMENTS.FOLDER}
          />
        </div>
      </div>
      <div className={cn("my-5", STYLES.common_input)}>
        {/* FIXME: InputWithPaste 위치를 common으로 수정 */}
        <InputWithPaste
          input={({ key, value, onChange }) => (
            // FIXME: 공통 atom으로 재작성
            <input
              key={key}
              placeholder={"https://example.com"}
              className={COMMON_STYLES.input}
              name={FORM_ELEMENTS.URL}
              value={value}
              onChange={onChange}
            />
          )}
          defaultValue={initial.url}
        />
      </div>
      <div className={"my-5"}>
        <h3 className={"text-base"}>Description</h3>
        <ControlledTextArea
          placeholder={"Add your notes here..."}
          className={cn(
            COMMON_STYLES.input,
            STYLES.textarea,
            STYLES.common_input
          )}
          defaultValue={initial.description}
          name={FORM_ELEMENTS.NOTE}
        />
      </div>
      <div>
        <AddTags
          input={({ value, onClick, onChange }) => (
            <input
              value={value}
              placeholder={"Add tags..."}
              className={COMMON_STYLES.input}
              onClick={onClick}
              onChange={onChange}
            />
          )}
        />
      </div>
    </form>
  );
}

const STYLES = {
  common_input:
    "rounded-md border border-neutral-300 px-2 py-0.5 text-black focus:border-blue-500 focus:outline-blue-500",
  textarea: "h-[6rem] resize-none",
};

const FORM_ELEMENTS = {
  URL: "URL",
  TITLE: "Title",
  NOTE: "Note",
  FOLDER: "Folder",
};
