import Button from "@/shared/components/atoms/button.tsx";
import type { BasicComponentProps } from "@/shared/types";

interface OptionButtonProps extends BasicComponentProps {
  isActive?: boolean;
  onClick?: () => void;
}

export default function OptionButton({
  children,
  isActive = false,
  onClick = () => null,
}: OptionButtonProps) {
  const activeVariant = isActive ? "outline" : "ghost";
  const activeColor = isActive ? "text-blue-600" : "";

  return (
    <Button size={"icon-sm"} variant={activeVariant} onClick={onClick}>
      <span className={activeColor}>{children}</span>
    </Button>
  );
}
