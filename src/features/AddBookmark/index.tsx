import { Folder, Link, X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

import AddTags from "@/features/AddBookmark/components/AddTags";
import InputWithPaste from "@/features/AddBookmark/components/InputWithPaste";
import { COMMON_STYLES } from "@/features/AddBookmark/consts";
import Button from "@/shared/components/atoms/button.tsx";
import ModalLayout from "@/shared/components/layouts/modal";
import ControlledInput from "@/shared/components/molecules/ControlledInput.tsx";
import ControlledTextArea from "@/shared/components/molecules/ControlledTextArea.tsx";
import LabeledElement from "@/shared/components/molecules/LabeledElement.tsx";
import { Card, CardHeader } from "@/shared/components/organisms/card.tsx";
import { cn } from "@/shared/lib/utils.ts";
import type { DefaultModalChildrenProps } from "@/shared/providers/ModalProvider/types.ts";

export default function AddBookmark({
  resolve,
  reject,
}: DefaultModalChildrenProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <ModalLayout>
      <Card
        className={
          "screen-center h-[90vh] max-h-[88.89rem] w-full overflow-y-auto sm:w-[90%] lg:w-[60%] lg:max-w-[50rem]"
        }
      >
        <CardHeader
          className={"flex-center-between border-b border-neutral-200"}
        >
          <h1>Add New Bookmark</h1>
          <Button variant={"ghost"} className={"text-neutral-500"}>
            <X className={"size-6"} />
          </Button>
        </CardHeader>
        <form
          className={"flex flex-col gap-7 p-6 pt-0"}
          onSubmit={handleSubmit}
        >
          <LabeledElement label={"URL"}>
            <Link className={COMMON_STYLES.ornament} />
            <InputWithPaste />
          </LabeledElement>
          <LabeledElement label={"Title"}>
            <ControlledInput
              placeholder={"Enter bookmark title"}
              className={COMMON_STYLES.input}
            />
          </LabeledElement>
          <LabeledElement label={"Note (Optional)"}>
            <ControlledTextArea
              placeholder={"Add your notes here..."}
              className={cn(COMMON_STYLES.input, STYLES.textarea)}
            />
          </LabeledElement>
          <AddTags />
          <LabeledElement label={"Folder (Optional)"}>
            <Folder className={COMMON_STYLES.ornament} />
            <div className={cn(COMMON_STYLES.input, "flex items-center")}>
              No Folder
            </div>
          </LabeledElement>
          <div className={"mt-3 grid grid-cols-2 gap-2"}>
            <FormControl variant={"outline"} onClick={reject}>
              Cancel
            </FormControl>
            <FormControl variant={"blank"} disabled={true} onClick={resolve}>
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

interface FormControlProps {
  variant?: "outline" | "blank";
  disabled?: boolean;
  onClick?: (params?: unknown) => unknown;
  children?: ReactNode;
}

function FormControl({
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
