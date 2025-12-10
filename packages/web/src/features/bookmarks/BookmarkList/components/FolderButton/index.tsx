import type { Folder as FolderType } from "@linkvault/shared";
import { Folder } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import { FOLDER_COLORS } from "@/shared/consts";

export default function FolderButton({
  title,
  color = FOLDER_COLORS.DEFAULT,
}: FolderType) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    if (pathname.includes(title)) return;
    navigate(pathname !== "/" ? `${pathname}/${title}` : `/${title}`);
  };

  return (
    <Button
      size={"custom"}
      variant={"ghost"}
      className={
        "rounded-lg bg-white px-2 py-1 text-xs shadow-sm md:px-4 md:py-2 md:text-sm"
      }
      onClick={handleClick}
    >
      <div
        className={"rounded-sm p-1 md:rounded-lg md:p-2"}
        style={{ backgroundColor: color }}
      >
        <Folder className={"text-white"} />
      </div>
      {title}
    </Button>
  );
}
