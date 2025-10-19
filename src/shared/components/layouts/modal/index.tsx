import type { BasicComponentProps } from "@/shared/types";

export default function ModalLayout({ children }: BasicComponentProps) {
  return (
    <div className={"absolute inset-0 bg-black/10 backdrop-blur-sm"}>
      {children}
    </div>
  );
}
