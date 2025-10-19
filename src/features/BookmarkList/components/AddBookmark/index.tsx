import { X } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/shared/components/atoms/button.tsx";
import ModalLayout from "@/shared/components/layouts/modal";
import LabeledElement from "@/shared/components/molecules/LabeledElement.tsx";
import { Card, CardHeader } from "@/shared/components/organisms/card.tsx";
import type { DefaultModalChildrenProps } from "@/shared/providers/ModalProvider/types.ts";

export default function AddBookmark({
  resolve,
  reject,
}: DefaultModalChildrenProps) {
  return (
    <ModalLayout>
      <Card
        className={
          "screen-center h-[90vh] max-h-[88.89rem] w-full sm:w-[90%] lg:w-[60%] lg:max-w-[50rem]"
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
        <form className={"flex flex-col gap-7 p-6 pt-0"}>
          <LabeledElement label={"URL"} />
          <div className={"grid grid-cols-2 gap-2"}>
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
