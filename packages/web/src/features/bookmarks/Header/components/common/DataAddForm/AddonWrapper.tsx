import type { BasicComponentProps } from "@/shared/types";

export default function AddonWrapper({ children }: BasicComponentProps) {
  return (
    <div
      className={"flex-[0.5] rounded-lg border border-neutral-200 bg-white p-1"}
    >
      {children}
    </div>
  );
}
