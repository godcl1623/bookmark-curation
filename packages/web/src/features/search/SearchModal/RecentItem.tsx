import { memo, type ReactNode, useState } from "react";

import XButton from "@/features/search/SearchModal/XButton.tsx";

interface RecentItemProps {
  children: ReactNode;
  onRemove?: () => void;
  onClick: () => void;
}

export default memo(function RecentItem({
  children,
  onRemove = () => null,
  onClick = () => null,
}: RecentItemProps) {
  const { hovered, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <div
      className={
        "flex-center-between h-10 w-full cursor-pointer rounded-lg bg-neutral-100 px-6 py-1.5 font-bold hover:brightness-90"
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
      {hovered && (
        <XButton variants={"square"} className={"p-1.5"} onClick={onRemove} />
      )}
    </div>
  );
});

const useHover = () => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => setHovered(false);

  return { hovered, handleMouseEnter, handleMouseLeave };
};
