import type { ReactNode } from "react";

interface LabeledInputProps {
  label?: string;
  children?: ReactNode;
}

export default function LabeledElement({ label, children }: LabeledInputProps) {
  return (
    <label className={"flex flex-col gap-2"}>
      {label && <strong className={"text-sm font-semibold"}>{label}</strong>}
      <div
        className={
          "rounded-lg border border-neutral-200 p-2.5 focus-within:border-blue-500"
        }
      >
        {children}
      </div>
    </label>
  );
}
