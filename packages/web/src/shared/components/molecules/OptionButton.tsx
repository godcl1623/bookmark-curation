import type { ComponentProps, ReactNode } from "react";

import Button from "@/shared/components/atoms/button.tsx";

interface OptionButtonProps extends ComponentProps<"button"> {
  children?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export default function OptionButton({
  children,
  isActive = false,
  onClick = () => null,
  ...props
}: OptionButtonProps) {
  const activeVariant = isActive ? "outline" : "ghost";
  const activeColor = isActive ? "text-blue-600" : "";

  return (
    <Button
      size={"icon-sm"}
      variant={activeVariant}
      onClick={onClick}
      {...props}
    >
      <span className={activeColor}>{children}</span>
    </Button>
  );
}
