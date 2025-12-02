import {
  Bookmark,
  LayoutGrid,
  LayoutList,
  Search,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router";

import { useModal } from "@/app/providers/ModalProvider/context";
import Options from "@/features/bookmarks/Header/components/Options";
import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";
import useGlobalStore from "@/stores/global";

export default function Header() {
  const currentView = useGlobalStore((state) => state.currentView);
  const setCurrentView = useGlobalStore((state) => state.setCurrentView);
  const { handleClick } = useSetting();

  const toggleView = (view: "card" | "list") => () => setCurrentView(view);

  return (
    <header className={"flex-center-between px-10 py-3 shadow"}>
      <Logo />
      <div className={STYLES.container}>
        <OptionButton>
          <Search className={STYLES.iconMd} />
        </OptionButton>
        <OptionButton onClick={handleClick}>
          <Settings className={STYLES.iconMd} />
        </OptionButton>
        <ul className={"flex-center gap-1 rounded-md bg-neutral-200 p-1"}>
          <li className={"flex-center"}>
            <OptionButton
              isActive={currentView === "card"}
              onClick={toggleView("card")}
            >
              <LayoutGrid className={STYLES.iconSm} />
            </OptionButton>
          </li>
          <li className={"flex-center"}>
            <OptionButton
              isActive={currentView === "list"}
              onClick={toggleView("list")}
            >
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

const useSetting = () => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(Options);
  };

  return { handleClick };
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
  onClick?: () => void;
}

function OptionButton({
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
