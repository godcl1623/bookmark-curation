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
import SearchModal from "@/features/search/SearchModal";
import Button from "@/shared/components/atoms/button";
import type { BasicComponentProps } from "@/shared/types";
import useGlobalStore from "@/stores/global";

export default function Header() {
  const currentView = useGlobalStore((state) => state.currentView);
  const setCurrentView = useGlobalStore((state) => state.setCurrentView);
  const { handleSettingClick } = useSetting();
  const { handleSearchClick } = useSearch();

  const toggleView = (view: "card" | "list") => () => setCurrentView(view);

  return (
    <header className={"flex-center-between bg-white px-10 py-3"}>
      <Logo />
      <div className={STYLES.container}>
        <OptionButton onClick={handleSearchClick}>
          <Search className={STYLES.iconMd} />
        </OptionButton>
        <OptionButton onClick={handleSettingClick}>
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

  const handleSettingClick = () => {
    openModal(Options);
  };

  return { handleSettingClick };
};

const useSearch = () => {
  const { openModal } = useModal();

  const handleSearchClick = () => {
    openModal(SearchModal);
  };

  return { handleSearchClick };
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
