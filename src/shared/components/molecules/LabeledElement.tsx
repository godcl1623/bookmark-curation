import type { ReactNode } from "react";

interface LabeledInputProps {
  label?: string;
  children?: ReactNode;
  asLabel?: boolean;
}

export default function LabeledElement({
  label,
  children,
  asLabel = true,
}: LabeledInputProps) {
  const Wrapper = asLabel ? "label" : "div";

  return (
    <Wrapper className={"flex w-full flex-col gap-2"}>
      {label && (
        <strong className={"text-sm font-semibold text-neutral-700"}>
          {label}
        </strong>
      )}
      <div
        className={
          "flex-center gap-1 rounded-lg border border-neutral-200 p-2.5 focus-within:border-blue-500"
        }
      >
        {children}
      </div>
    </Wrapper>
  );
}
