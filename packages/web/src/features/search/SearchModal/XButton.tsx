import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";

import Button from "@/shared/components/atoms/button.tsx";
import { cn } from "@/shared/lib/utils";

interface XButtonProps extends ComponentProps<"button"> {
  iconSize?: "sm" | "lg";
  variants?: "round" | "square";
}

export default function XButton({
  onClick,
  className = "",
  iconSize = "sm",
  variants = "round",
  ...props
}: XButtonProps) {
  const size = iconSize === "sm" ? "size-4" : "size-6";
  const rounded = variants === "round" ? "rounded-full" : "rounded-lg";

  return (
    <Button
      variant={"ghost"}
      size={"custom"}
      className={cn(rounded, className)}
      onClick={onClick ?? (() => null)}
      {...props}
    >
      <XIcon className={size} />
    </Button>
  );
}
