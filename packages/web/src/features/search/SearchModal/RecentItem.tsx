import { memo, type ReactNode, useState } from "react";

import XButton from "@/features/search/SearchModal/XButton.tsx";

interface RecentItemProps {
  children: ReactNode;
  onClick: () => void;
}

export default memo(function RecentItem({
  children,
  onClick,
}: RecentItemProps) {
  const { hovered, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <div
      className={
        "flex-center-between h-10 w-full rounded-lg bg-neutral-100 px-6 py-1.5 font-bold"
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {hovered && (
        <XButton variants={"square"} className={"p-1.5"} onClick={onClick} />
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
