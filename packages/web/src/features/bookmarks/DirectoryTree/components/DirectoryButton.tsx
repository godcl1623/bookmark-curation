import type { DataType } from "@linkvault/shared";
import { ChevronRight, File, Folder } from "lucide-react";
import { type ComponentProps, type MouseEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
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
        paddingLeft: `${Math.max(8, hierarchy * 8 + 8)}px`,
      }}
    >
      <Button
        variant={"link"}
        size={"custom"}
        onClick={handleClick}
        className={"py-2"}
      >
        <div className={"flex items-center gap-2 px-2"}>
          {icon}
          {children}
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
