import { Folder, Link, X } from "lucide-react";
import { nanoid } from "nanoid";
import { type KeyboardEvent, type ReactNode, useMemo } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import ControlledTextArea from "@/shared/components/molecules/ControlledTextArea";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import { Card, CardHeader } from "@/shared/components/organisms/card";
import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import useFolderList from "@/shared/hooks/useFolderList";
import useHandleSubmit from "@/shared/hooks/useHandleSubmit";
import { cn } from "@/shared/lib/utils";
import createNewBookmark from "@/shared/services/bookmarks/create-new-bookmark";
import { extractFoldersProperty, generateFolderOptions } from "@/shared/utils";
import useGlobalStore from "@/stores/global.ts";

import AddTags from "./components/AddTags";
import InputWithPaste from "./components/InputWithPaste";
import { COMMON_STYLES } from "./consts";

export default function AddBookmark({
  resolve,
  reject,
}: DefaultModalChildrenProps) {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const { data: folders } = useFolderList();
  const { refetch } = useDirectoriesData("/", true);
  const { urlErrorMessage, titleErrorMessage, noteErrorMessage, handleSubmit } =
    useHandleSubmit({
      onSubmit: async (data) => {
        return createNewBookmark({
          data_id: nanoid(),
          ...data,
          domain: "",
          favicon_url: null,
          preview_image: null,
          metadata: {},
          is_favorite: false,
          is_archived: false,
          is_private: true,
          type: "bookmark",
        });
      },
      successMessage: "북마크가 추가되었습니다.",
      errorMessage: "북마크 추가에 실패했습니다.",
    });

  const folderList = useMemo(
    () =>
      generateFolderOptions(
        extractFoldersProperty(folders ?? [], "title"),
        extractFoldersProperty(folders ?? [], "data_id")
      ),
    [folders]
  );

  const successCallback = () => {
    refetch();
    resolve();
  };

  return (
    <ModalLayout reject={reject}>
      <Card
        className={
          "screen-center h-max w-full py-3 sm:w-[90%] md:py-6 lg:w-[60%] lg:max-w-200"
        }
      >
        <CardHeader
          className={
            "flex-center-between border-b border-neutral-200 p-3! pt-0! md:p-6! md:pt-0!"
          }
        >
          <h1 className={isMobile ? "text-base" : ""}>Add New Bookmark</h1>
          <Button
            variant={"ghost"}
            className={"text-neutral-500"}
            onClick={reject}
          >
            <X className={isMobile ? "size-5" : "size-6"} />
          </Button>
        </CardHeader>
        <form
          className={
            "flex h-full flex-col gap-3.5 overflow-y-auto px-3 md:gap-7 md:px-6"
          }
          onSubmit={handleSubmit(successCallback)}
          onKeyDown={disableKeyDown}
          onReset={reject}
        >
          <LabeledElement label={"URL"} errorMessage={urlErrorMessage}>
            <Link className={COMMON_STYLES.ornament} />
            <InputWithPaste
              input={({ key, value, onChange }) => (
                <input
                  key={key}
                  placeholder={"https://example.com"}
                  className={COMMON_STYLES.input}
                  name={BOOKMARK_FORM_ELEMENTS.URL}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </LabeledElement>
          <LabeledElement label={"Title"} errorMessage={titleErrorMessage}>
            <ControlledInput
              placeholder={"Enter bookmark title"}
              className={COMMON_STYLES.input}
              name={BOOKMARK_FORM_ELEMENTS.TITLE}
            />
          </LabeledElement>
          <LabeledElement
            label={"Note (Optional)"}
            errorMessage={noteErrorMessage}
          >
            <ControlledTextArea
              placeholder={"Add your notes here..."}
              className={cn(COMMON_STYLES.input, STYLES.textarea)}
              name={BOOKMARK_FORM_ELEMENTS.NOTE}
            />
          </LabeledElement>
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
          <LabeledElement label={"Folder (Optional)"} asLabel={false}>
            <Folder className={COMMON_STYLES.ornament} />
            <ControlledSelect
              values={folderList}
              name={BOOKMARK_FORM_ELEMENTS.FOLDER}
            />
          </LabeledElement>
          <div className={"mt-3 grid grid-cols-2 gap-2"}>
            <FormControl type={"reset"} variant={"outline"}>
              Cancel
            </FormControl>
            <FormControl type={"submit"} variant={"blank"} disabled={false}>
              Save Bookmark
            </FormControl>
          </div>
        </form>
      </Card>
    </ModalLayout>
  );
}

const STYLES = {
  textarea: "h-[6rem] resize-none",
};

const disableKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter") {
    event.preventDefault();
    event.stopPropagation();
  }
};

interface FormControlProps {
  type?: "submit" | "reset" | "button";
  variant?: "outline" | "blank";
  disabled?: boolean;
  onClick?: (params?: unknown) => unknown;
  children?: ReactNode;
}

function FormControl({
  type = "button",
  variant = "blank",
  disabled = false,
  onClick,
  children,
}: FormControlProps) {
  const variantStyle =
    variant === "blank"
      ? "bg-blue-500 py-2 text-sm text-white md:text-lg"
      : "py-2 text-sm md:text-lg";
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Button
      type={type}
      size={"custom"}
      variant={variant}
      className={variantStyle}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
