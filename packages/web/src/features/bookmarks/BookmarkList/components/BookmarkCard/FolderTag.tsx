import type { BasicComponentProps } from "@/shared/types";

export default function FolderTag({ children }: BasicComponentProps) {
  if (!children) return null;

  return (
    <div
      className={
        "min-w-max rounded-full bg-red-500/70 px-3 py-1 text-xs font-bold text-white"
      }
    >
      {children}
    </div>
  );
}
