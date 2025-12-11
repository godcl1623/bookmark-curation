import { memo, type ReactNode, useState } from "react";

import XButton from "@/features/search/SearchModal/XButton.tsx";
import useGlobalStore from "@/stores/global.ts";

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
  const isMobile = useGlobalStore((state) => state.isMobile);
  const { hovered, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <div
      className={
        "flex-center-between h-10 w-full cursor-pointer rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-bold hover:brightness-90 md:px-6 md:text-base"
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
      {(isMobile || (!isMobile && hovered)) && (
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
