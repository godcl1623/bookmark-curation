import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Search, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { useModal } from "@/app/providers/ModalProvider/context";
import Options from "@/features/bookmarks/Header/components/Options";
import SearchModal from "@/features/search/SearchModal";
import Button from "@/shared/components/atoms/button.tsx";
import Logo from "@/shared/components/molecules/Logo.tsx";
import OptionButton from "@/shared/components/molecules/OptionButton.tsx";
import useAuth from "@/shared/hooks/useAuth.ts";
import logoutUser from "@/shared/services/auth/logout-user.ts";
import useAuthStore from "@/stores/auth.ts";
import useGlobalStore from "@/stores/global";

export default function Header() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setIsLoggedOut = useAuthStore((state) => state.setIsLoggedOut);
  const { handleSettingClick } = useSetting();
  const { handleSearchClick } = useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const normalIconStyle = isMobile ? STYLES.iconSm : STYLES.iconMd;

  const handleLogOut = async () => {
    try {
      await logoutUser();
      setIsLoggedOut(true);
      clearAuth();
      queryClient.clear();
      navigate("/login");
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`로그아웃에 실패했습니다(${error.message}'`);
      } else if (isAxiosError(error)) {
        toast.error(`로그아웃에 실패했습니다(${error.status})`);
      }
      console.error(error);
    }
  };

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
        {user && (
          <Button
            variant={"blank"}
            size={isMobile ? "sm" : "lg"}
            className={"bg-red-400 text-xs font-bold text-white md:text-base"}
            onClick={handleLogOut}
          >
            Logout
          </Button>
        )}
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
