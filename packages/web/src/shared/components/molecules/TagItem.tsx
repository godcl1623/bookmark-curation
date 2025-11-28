import { X } from "lucide-react";
import { type MouseEvent } from "react";

import { cn } from "@/shared/lib/utils";

interface TagItemProps {
  tag: string;
  onClick?: () => void;
  needClose?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TagItem({
  tag,
  onClick,
  needClose = false,
  size = "md",
}: TagItemProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClick != null) onClick();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-blue-100 text-blue-700",
        SIZES[size]
      )}
    >
      #{tag}
      {needClose && (
        <button type={"button"} onClick={handleClick}>
          <X className={"size-4"} />
        </button>
      )}
    </div>
  );
}

const SIZES = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-6 py-2",
};
