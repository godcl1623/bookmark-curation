import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import useAuthStore from "@/stores/auth.ts";

export default function AuthCallback() {
  useHandleCallback();

  return null;
}

const isValidToken = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    if (!payload.exp || !payload.userId || !payload.uuid || !payload.type) {
      return false;
    }

    if (payload.type !== "access") return false;

    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

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
        setIsLoggedOut(false);
        navigate("/", { replace: true });
      }
      return;
    },
    [navigate, setIsLoggedOut]
  );

  useEffect(() => {
    if (hash === "") return redirectToRoot();

    window.history.replaceState({}, "", "/auth/callback");

    const params = new URLSearchParams(hash.substring(1));

    if (!params.has("access_token")) return redirectToRoot();
    const token = params.get("access_token");

    if (!token || !isValidToken(token)) {
      return redirectToRoot();
    }

    setAccessToken(token);
    redirectToRoot(false);
  }, [hash, redirectToRoot, setAccessToken]);
};
