import type { ReactNode, RefObject } from "react";

interface LabeledInputProps {
  label?: string;
  children?: ReactNode;
  asLabel?: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  errorMessage?: string;
}

export default function LabeledElement({
  label,
  children,
  asLabel = true,
  ref,
  errorMessage,
}: LabeledInputProps) {
  const Wrapper = asLabel ? "label" : "div";

  return (
    <Wrapper className={"flex w-full flex-col gap-2"}>
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
      <div
        ref={ref}
        className={
          "flex-center gap-1 rounded-lg border border-neutral-200 p-2.5 focus-within:border-blue-500"
        }
      >
        {children}
      </div>
    </Wrapper>
  );
}
