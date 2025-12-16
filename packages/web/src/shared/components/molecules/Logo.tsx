import { Bookmark } from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global.ts";

export default function Logo() {
  const isMobile = useGlobalStore((state) => state.isMobile);

  return (
    <NavLink className={STYLES.container} to={"/"}>
      <div
        className={cn(
          "rounded-md bg-blue-600 p-1.5 text-white",
          isMobile ? "p-1" : "p-1.5"
        )}
      >
        <Bookmark className={isMobile ? STYLES.iconSm : ""} />
      </div>
      <h1 className={isMobile ? "text-base" : ""}>LinkVault</h1>
    </NavLink>
  );
}

const STYLES = {
  container: "flex-center gap-2",
  iconMd: "size-5",
  iconSm: "size-4",
};
