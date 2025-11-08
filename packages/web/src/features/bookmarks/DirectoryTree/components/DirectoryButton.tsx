import type { DataType } from "@linkvault/shared";
import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, useMemo } from "react";

import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";

interface DirectoryButtonProps {
  isOpen?: boolean;
  dataType?: DataType;
  parentId?: string | null;
}

export default function DirectoryButton({
  isOpen = false,
  dataType = "bookmark",
  parentId = null,
  children,
  onClick,
}: DirectoryButtonProps & ComponentProps<"button">) {
  const icon = useMemo(
    () => (dataType === "bookmark" ? <File /> : <Folder />),
    [dataType]
  );
  const hierarchy =
    parentId == null || parentId === "null" ? 0 : parentId.split("/").length;

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full pr-2 text-sm",
        dataType === "folder" ? "justify-between" : "justify-start"
      )}
      onClick={onClick}
      style={{
        paddingLeft: `${Math.max(8, hierarchy * 8 + 8)}px`,
      }}
    >
      <div className={"flex items-center gap-2 px-2"}>
        {icon}
        {children}
      </div>
      {dataType !== "bookmark" && (
        <ChevronRight className={isOpen ? "rotate-90" : ""} />
      )}
    </Button>
  );
}
