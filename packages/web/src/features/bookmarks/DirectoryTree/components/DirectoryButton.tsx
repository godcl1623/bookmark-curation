import type { DataType } from "@linkvault/shared";
import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, type MouseEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import { FOLDER_COLORS } from "@/shared/consts";
import { cn } from "@/shared/lib/utils";

interface DirectoryButtonProps {
  isOpen?: boolean;
  dataType?: DataType;
  url?: string;
}

export default function DirectoryButton({
  url,
  isOpen = false,
  dataType = "bookmark",
  children,
  onClick,
  color,
}: DirectoryButtonProps & ComponentProps<"button">) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const icon = useMemo(
    () => (dataType === "bookmark" ? <File /> : <Folder />),
    [dataType]
  );
  const hierarchy = url == null ? 0 : url.split("/").length - 1;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (dataType === "folder") {
      if (!isOpen && onClick) {
        onClick(event);
      }
      if (url && url !== pathname) navigate(url);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full items-center rounded-lg pr-2 text-sm hover:bg-neutral-600/20",
        dataType === "folder" ? "justify-between" : "justify-start"
      )}
      style={{
        paddingLeft: `${Math.max(6, hierarchy * 6 + 6)}px`,
      }}
    >
      <Button
        variant={"link"}
        size={"custom"}
        onClick={handleClick}
        className={"max-w-full py-1"}
      >
        <div className={"line-clamp-1 flex items-center gap-2 px-2"}>
          <div
            className={cn("rounded-lg p-2", determineColor(dataType, color))}
            style={{ backgroundColor: color ?? FOLDER_COLORS.DEFAULT }}
          >
            {icon}
          </div>
          <span className={"w-full truncate"}>{children}</span>
        </div>
      </Button>
      {dataType !== "bookmark" && (
        <Button variant={"ghost"} size={"icon-sm"} onClick={onClick}>
          <ChevronRight className={isOpen ? "rotate-90" : ""} />
        </Button>
      )}
    </div>
  );
}

const determineColor = (dataType: DataType, color: string | undefined) => {
  if (dataType === "folder" && color != null) return "text-white";
  return "text-neutral-600";
};
