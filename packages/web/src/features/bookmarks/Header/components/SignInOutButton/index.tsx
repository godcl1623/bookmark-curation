import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import Button from "@/shared/components/atoms/button";
import useAuth from "@/shared/hooks/useAuth";
import { cn } from "@/shared/lib/utils";
import logoutUser from "@/shared/services/auth/logout-user";
import useAuthStore from "@/stores/auth";
import useGlobalStore from "@/stores/global";

export default function SignInOutButton() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setIsLoggedOut = useAuthStore((state) => state.setIsLoggedOut);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    <Button
      variant={"blank"}
      size={isMobile ? "sm" : "lg"}
      className={cn(
        "text-xs font-bold text-white md:text-base",
        user ? "bg-red-400" : "bg-blue-400"
      )}
      onClick={handleLogOut}
    >
      {user ? "Logout" : "Login"}
    </Button>
  );
}
