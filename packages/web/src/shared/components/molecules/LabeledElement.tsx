import type { ReactNode, RefObject } from "react";

import { cn } from "@/shared/lib/utils";

interface LabeledInputProps {
  label?: string;
  children?: ReactNode;
  asLabel?: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  errorMessage?: string;
  variants?: "default" | "blank";
}

export default function LabeledElement({
  label,
  children,
  asLabel = true,
  ref,
  errorMessage,
  variants = "default",
}: LabeledInputProps) {
  const Wrapper = asLabel ? "label" : "div";
  const elementStyle =
    variants === "blank"
      ? ""
      : "flex-center gap-1 rounded-lg border border-neutral-200 p-1.5 md:p-2.5 focus-within:border-blue-500";

  return (
    <Wrapper
      className={cn(
        "flex flex-col gap-2",
        variants === "default" ? "w-full" : ""
      )}
    >
      {label && (
        <strong
          className={"flex-center gap-2 text-sm font-semibold text-neutral-700"}
        >
          {label}
          {errorMessage && (
            <span className={"font-bold text-red-500"}>{errorMessage}</span>
          )}
        </strong>
      )}
      <div ref={ref} className={elementStyle}>
        {children}
      </div>
    </Wrapper>
  );
}
