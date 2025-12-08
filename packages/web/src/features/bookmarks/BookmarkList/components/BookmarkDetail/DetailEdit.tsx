import type { Tag } from "@linkvault/shared";
import { type FormEvent, useMemo } from "react";

import AddTags from "@/features/bookmarks/AddBookmark/components/AddTags";
import InputWithPaste from "@/features/bookmarks/AddBookmark/components/InputWithPaste";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import { findIndex } from "@/features/bookmarks/Header/utils";
import ControlledInput from "@/shared/components/molecules/ControlledInput.tsx";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import ControlledTextArea from "@/shared/components/molecules/ControlledTextArea";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";
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
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  errorMessages?: {
    url?: string;
    title?: string;
    note?: string;
  };
  formId: string;
}

export default function DetailEdit({
  initial,
  onSubmit,
  errorMessages,
  formId,
}: DetailEditProps) {
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
    <form
      className={"flex flex-col gap-5"}
      onSubmit={onSubmit ? onSubmit : () => null}
      id={formId}
    >
      <div className={"flex-center-between"}>
        <LabeledElement
          label={"Title"}
          variants={"blank"}
          errorMessage={errorMessages?.title}
        >
          <ControlledInput
            placeholder={"Enter bookmark title"}
            className={cn("text-xl text-black", STYLES.common_input)}
            name={BOOKMARK_FORM_ELEMENTS.TITLE}
            passedValue={initial.title}
          />
        </LabeledElement>
        <LabeledElement label={"Folder (Optional)"} variants={"blank"}>
          <div
            className={"flex-center gap-2 rounded-md border border-neutral-300"}
          >
            <ControlledSelect
              values={folderList}
              initialIndex={findIndex(
                folderList.map((folder) => folder.data_id),
                initial.parent_id
              )}
              name={BOOKMARK_FORM_ELEMENTS.FOLDER}
            />
          </div>
        </LabeledElement>
      </div>
      <LabeledElement label={"URL"} errorMessage={errorMessages?.url}>
        {/* FIXME: InputWithPaste 위치를 common으로 수정 */}
        <InputWithPaste
          input={({ key, value, onChange }) => (
            // FIXME: 공통 atom으로 재작성
            <input
              key={key}
              placeholder={"https://example.com"}
              className={COMMON_STYLES.input}
              name={BOOKMARK_FORM_ELEMENTS.URL}
              value={value}
              onChange={onChange}
            />
          )}
          defaultValue={initial.url}
        />
      </LabeledElement>
      <LabeledElement
        label={"Note (Optional)"}
        errorMessage={errorMessages?.note}
      >
        <ControlledTextArea
          placeholder={"Add your notes here..."}
          className={cn(COMMON_STYLES.input, STYLES.textarea)}
          defaultValue={initial.description}
          name={BOOKMARK_FORM_ELEMENTS.NOTE}
        />
      </LabeledElement>
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
          initialList={initial.tags}
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
