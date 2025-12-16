import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import useAuthStore from "@/stores/auth.ts";

export default function AuthCallback() {
  useHandleCallback();

  return null;
}

const useHandleCallback = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedOut = useAuthStore((state) => state.setIsLoggedOut);
  const { hash } = useLocation();
  const navigate = useNavigate();

  const redirectToRoot = useCallback(
    (isError: boolean = true) => {
      if (isError) {
        toast.error("올바르지 않은 접근입니다.");
        navigate("/login", { replace: true });
      } else {
        window.history.replaceState({}, "", "/auth/callback");
        setIsLoggedOut(false);
        navigate("/", { replace: true });
      }
      return;
    },
    [navigate, setIsLoggedOut]
  );

  useEffect(() => {
    if (hash === "") return redirectToRoot();
    const params = new URLSearchParams(hash.substring(1));

    if (!params.has("access_token")) return redirectToRoot();
    const token = params.get("access_token");
    setAccessToken(token);
    redirectToRoot(false);
  }, [hash, redirectToRoot, setAccessToken]);
};
