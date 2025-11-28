import { Folder, Link, X } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import ControlledTextArea from "@/shared/components/molecules/ControlledTextArea";
import LabeledElement from "@/shared/components/molecules/LabeledElement";
import { Card, CardHeader } from "@/shared/components/organisms/card";
import useFolderList from "@/shared/hooks/useFolderList";
import { cn } from "@/shared/lib/utils";
import { extractFoldersProperty, generateFolderOptions } from "@/shared/utils";

import AddTags from "./components/AddTags";
import InputWithPaste from "./components/InputWithPaste";
import { COMMON_STYLES } from "./consts";

export default function AddBookmark({
  resolve,
  reject,
}: DefaultModalChildrenProps) {
  const { data: folders } = useFolderList();
  const { urlErrorMessage, handleSubmit } = useHandleSubmit();

  const folderList = useMemo(
    () =>
      generateFolderOptions(
        extractFoldersProperty(folders ?? [], "title"),
        extractFoldersProperty(folders ?? [], "data_id")
      ),
    [folders]
  );

  return (
    <ModalLayout reject={reject}>
      <Card
        className={
          "screen-center h-[90vh] max-h-[88.89rem] w-full overflow-y-auto sm:w-[90%] lg:w-[60%] lg:max-w-[50rem]"
        }
      >
        <CardHeader
          className={"flex-center-between border-b border-neutral-200"}
        >
          <h1>Add New Bookmark</h1>
          <Button
            variant={"ghost"}
            className={"text-neutral-500"}
            onClick={reject}
          >
            <X className={"size-6"} />
          </Button>
        </CardHeader>
        <form
          className={"flex flex-col gap-7 p-6 pt-0"}
          onSubmit={handleSubmit}
          onKeyDown={disableKeyDown}
        >
          <LabeledElement label={"URL"} errorMessage={urlErrorMessage}>
            <Link className={COMMON_STYLES.ornament} />
            <InputWithPaste
              input={({ key, value, onChange }) => (
                <input
                  key={key}
                  placeholder={"https://example.com"}
                  className={COMMON_STYLES.input}
                  name={FORM_ELEMENTS.URL}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </LabeledElement>
          <LabeledElement label={"Title"}>
            <ControlledInput
              placeholder={"Enter bookmark title"}
              className={COMMON_STYLES.input}
              name={FORM_ELEMENTS.TITLE}
            />
          </LabeledElement>
          <LabeledElement label={"Note (Optional)"}>
            <ControlledTextArea
              placeholder={"Add your notes here..."}
              className={cn(COMMON_STYLES.input, STYLES.textarea)}
              name={FORM_ELEMENTS.NOTE}
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
            <ControlledSelect values={folderList} name={FORM_ELEMENTS.FOLDER} />
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

const FORM_ELEMENTS = {
  URL: "URL",
  TITLE: "Title",
  NOTE: "Note (Optional)",
  FOLDER: "Folder (Optional)",
};

const disableKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter") {
    event.preventDefault();
    event.stopPropagation();
  }
};

const useHandleSubmit = () => {
  const [urlErrorMessage, setUrlErrorMessage] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const getNamedItem = (name: string) => {
      const target = event.currentTarget.elements.namedItem(name);
      if (target instanceof HTMLButtonElement) return target;
      return null;
    };

    const formData = new FormData(event.currentTarget);

    const url = formData.get(FORM_ELEMENTS.URL);
    if (!url) {
      setUrlErrorMessage("URL은 필수 항목입니다.");
      return;
    } else {
      setUrlErrorMessage("");
    }

    const title = formData.get(FORM_ELEMENTS.TITLE);
    if (title === "") formData.set(FORM_ELEMENTS.TITLE, "Untitled");

    const note = formData.get(FORM_ELEMENTS.NOTE);
    const folder =
      formData.get(FORM_ELEMENTS.FOLDER) ??
      getNamedItem(FORM_ELEMENTS.FOLDER)?.value;

    const tags = Array.from(event.currentTarget.querySelectorAll("li"))
      .map((li) => li.getAttribute("data-id"))
      .filter(Boolean);

    console.log("url: ", url);
    console.log("title: ", title, formData.get(FORM_ELEMENTS.TITLE));
    console.log("note: ", note);
    console.log("folder: ", folder);
    console.log("tags: ", tags);
  };

  return { urlErrorMessage, handleSubmit };
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
      ? "bg-blue-500 py-2 text-lg text-white"
      : "py-2 text-lg";
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
