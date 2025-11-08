import type { DataType } from "@linkvault/shared";
import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, type MouseEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global";

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
  const slugToId = useGlobalStore((state) => state.slugToId);
  console.log(slugToId);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const icon = useMemo(
    () => (dataType === "bookmark" ? <File /> : <Folder />),
    [dataType]
  );
  const hierarchy =
    parentId == null || parentId === "null" ? 0 : parentId.split("/").length;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (dataType === "folder") {
      if (onClick) {
        onClick(event);
      }
      if (parentId === "null") {
        navigate(`/${children}`);
      } else {
        navigate(`${pathname}/${children}`);
      }
    }
  };

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full pr-2 text-sm",
        dataType === "folder" ? "justify-between" : "justify-start"
      )}
      onClick={handleClick}
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
