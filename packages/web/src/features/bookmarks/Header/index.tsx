import { Search, Settings } from "lucide-react";

import { useModal } from "@/app/providers/ModalProvider/context";
import Options from "@/features/bookmarks/Header/components/Options";
import SignInOutButton from "@/features/bookmarks/Header/components/SignInOutButton";
import SearchModal from "@/features/search/SearchModal";
import Logo from "@/shared/components/molecules/Logo.tsx";
import OptionButton from "@/shared/components/molecules/OptionButton.tsx";
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
        <SignInOutButton />
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
