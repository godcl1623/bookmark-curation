import type { BasicComponentProps } from "@/shared/types";

export default function ClientViewLayout({ children }: BasicComponentProps) {
  return <div className={"flex h-[calc(100vh-64px)]"}>{children}</div>;
}
