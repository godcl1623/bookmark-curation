import type { Tag } from "@linkvault/shared";
import { Calendar, CalendarCog, ExternalLink, Link } from "lucide-react";

import InputWithPaste from "@/features/bookmarks/AddBookmark/components/InputWithPaste";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import FolderTag from "@/features/bookmarks/BookmarkList/components/BookmarkCard/FolderTag.tsx";
import ControlledInput from "@/shared/components/molecules/ControlledInput.tsx";
import TagItem from "@/shared/components/molecules/TagItem.tsx";

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
  return (
    <form>
      <div className={"flex-center-between"}>
        <ControlledInput
          placeholder={"Enter bookmark title"}
          className={"text-2xl text-black"}
          name={"title"}
          passedValue={initial.title}
        />
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
        <div className={"flex-center gap-2"}>
          <FolderTag>{parent?.title}</FolderTag>
        </div>
      </div>
      <div className={"flex-col-center-center gap-2"}>
        <p className={"flex-center w-full gap-2"}>
          <Link className={"size-4"} />
          <span className={"mb-1"}>{domain}</span>
        </p>
        <a
          href={url}
          rel={"noreferrer noopener"}
          className={
            "flex-center-center w-full gap-2 rounded-md bg-blue-500 py-2 text-white hover:brightness-95 active:brightness-90"
          }
        >
          <ExternalLink className={"size-5"} />
          Open Link
        </a>
      </div>
      <div>
        <h3 className={"text-base"}>Description</h3>
        <p className={"text-sm"}>{description}</p>
      </div>
      <div>
        <h3
          className={
            "before:contents-[''] mb-2 text-base before:mr-2 before:border-2 before:border-blue-400"
          }
        >
          Tags
        </h3>
        <ul className={"flex-center gap-2"}>
          {tags.map((tag) => (
            <li key={`detail_tag_${tag.id}`}>
              <TagItem tag={tag.name} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className={"flex-center-between border-t border-neutral-200 px-5 pt-5"}
      >
        <div className={"flex-center gap-2"}>
          <div className={"rounded-lg bg-neutral-100 p-2"}>
            <Calendar />
          </div>
          <div>
            <h3 className={"text-xs font-semibold"}>Created:</h3>
            <p className={"text-lg font-bold text-black"}>
              {created_at.split("T")[0]}
            </p>
          </div>
        </div>
        <div className={"flex-center gap-2"}>
          <div className={"rounded-lg bg-neutral-100 p-2"}>
            <CalendarCog />
          </div>
          <div>
            <h3 className={"text-xs font-semibold"}>Modified:</h3>
            <p className={"text-lg font-bold text-black"}>
              {updated_at.split("T")[0]}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
