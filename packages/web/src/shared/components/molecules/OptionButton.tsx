import type { ComponentProps } from "react";

import Button from "@/shared/components/atoms/button.tsx";

interface OptionButtonProps extends ComponentProps<"button"> {
  isActive?: boolean;
}

export default function OptionButton({
  children,
  isActive = false,
  onClick = () => null,
  type = "button",
  ...props
}: OptionButtonProps) {
  const activeVariant = isActive ? "outline" : "ghost";
  const activeColor = isActive ? "text-blue-600" : "";

  return (
    <Button
      type={type}
      size={"icon-sm"}
      variant={activeVariant}
      onClick={onClick}
      {...props}
    >
      <span className={activeColor}>{children}</span>
    </Button>
  );
}
