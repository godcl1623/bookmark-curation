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
  const { hash } = useLocation();
  const navigate = useNavigate();

  const redirectToRoot = useCallback(
    (isError: boolean = true) => {
      if (isError) {
        toast.error("올바르지 않은 접근입니다.");
      }
      navigate("/");
      return;
    },
    [navigate]
  );

  const parseHash = useCallback(
    (hashString: string) => {
      if (hashString === "") return redirectToRoot();
      return hashString.slice(1).split("=");
    },
    [redirectToRoot]
  );

  useEffect(() => {
    if (hash === "") return redirectToRoot();
    const [key, value] = parseHash(hash) ?? [];

    if (key !== "access_token") return redirectToRoot();
    setAccessToken(value);
    redirectToRoot(false);
  }, [hash, redirectToRoot, parseHash, setAccessToken]);
};
