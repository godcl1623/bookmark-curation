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
          className={"text-2xl text-black"}
          name={"title"}
          passedValue={initial.title}
        />
        <div className={"flex-center gap-2"}>
          <ControlledSelect
            values={folderList}
            initialIndex={findIndex(
              folderList.map((folder) => folder.data_id),
              initial.parent_id
            )}
            name={"folder"}
          />
        </div>
      </div>
      <div className={"flex-col-center-center gap-2"}>
        {/* FIXME: InputWithPaste 위치를 common으로 수정 */}
        <InputWithPaste
          input={({ key, value, onChange }) => (
            // FIXME: 공통 atom으로 재작성
            <input
              key={key}
              placeholder={"https://example.com"}
              className={COMMON_STYLES.input}
              name={"url"}
              value={value}
              defaultValue={initial.url}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div>
        <h3 className={"text-base"}>Description</h3>
        <ControlledTextArea
          placeholder={"Add your notes here..."}
          className={cn(COMMON_STYLES.input, "h-[6rem] resize-none")}
          defaultValue={initial.description}
          name={"notes"}
        />
      </div>
      <div>
        <h3
          className={
            "before:contents-[''] mb-2 text-base before:mr-2 before:border-2 before:border-blue-400"
          }
        >
          Tags
        </h3>
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
