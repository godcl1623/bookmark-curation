import { Bookmark, Search, Settings } from "lucide-react";
import { NavLink } from "react-router";

import { useModal } from "@/app/providers/ModalProvider/context";
import Options from "@/features/bookmarks/Header/components/Options";
import SearchModal from "@/features/search/SearchModal";
import OptionButton from "@/shared/components/molecules/OptionButton.tsx";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global";

export default function Header() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const { handleSettingClick } = useSetting();
  const { handleSearchClick } = useSearch();

  const normalIconStyle = isMobile ? STYLES.iconSm : STYLES.iconMd;

  return (
    <header className={"flex-center-between bg-white p-1.5 md:px-10 md:py-3"}>
      <Logo />
      <div className={STYLES.container}>
        <OptionButton onClick={handleSearchClick}>
          <Search className={normalIconStyle} />
        </OptionButton>
        <OptionButton onClick={handleSettingClick}>
          <Settings className={normalIconStyle} />
        </OptionButton>
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
