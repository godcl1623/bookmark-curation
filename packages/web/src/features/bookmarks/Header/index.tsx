import {
  Bookmark,
  LayoutGrid,
  LayoutList,
  Search,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router";

import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";

export default function Header() {
  return (
    <header className={"flex-center-between px-10 py-3 shadow"}>
      <Logo />
      <div className={STYLES.container}>
        <OptionButton>
          <Search className={STYLES.iconMd} />
        </OptionButton>
        <OptionButton>
          <Settings className={STYLES.iconMd} />
        </OptionButton>
        <ul className={"flex-center gap-1 rounded-md bg-neutral-200 p-1"}>
          <li className={"flex-center"}>
            <OptionButton isActive>
              <LayoutGrid className={STYLES.iconSm} />
            </OptionButton>
          </li>
          <li className={"flex-center"}>
            <OptionButton>
              <LayoutList className={STYLES.iconSm} />
            </OptionButton>
          </li>
        </ul>
      </div>
    </header>
  );
}

const STYLES = {
  container: "flex-center gap-2",
  iconMd: "size-5",
  iconSm: "size-4",
};

function Logo() {
  return (
    <NavLink className={STYLES.container} to={"/"}>
      <div className={"rounded-md bg-blue-600 p-1.5 text-white"}>
        <Bookmark />
      </div>
      <h1>LinkVault</h1>
    </NavLink>
  );
}

interface OptionButtonProps extends BasicComponentProps {
  isActive?: boolean;
}

function OptionButton({ children, isActive = false }: OptionButtonProps) {
  const activeVariant = isActive ? "outline" : "ghost";
  const activeColor = isActive ? "text-blue-600" : "";

  return (
    <Button size={"icon-sm"} variant={activeVariant}>
      <span className={activeColor}>{children}</span>
    </Button>
  );
}
