import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { checkIfMobileNative } from "@/shared/lib/utils";
import useAuthStore from "@/stores/auth.ts";

export default function AuthCallback() {
  console.log("[AuthCallback] Component rendered");
  useHandleCallback();

  return (
    <div className="flex h-screen items-center justify-center bg-blue-50/75">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
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
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (isProcessing) return;

    const params = new URLSearchParams(search);
    const isMobile = params.get("mobile") === "true";
    const isMobileNative = checkIfMobileNative();

    // Validate we have a hash with access token
    if (hash === "") return redirectToRoot();

    window.history.replaceState({}, "", "/auth/callback");

    const hashParams = new URLSearchParams(hash.substring(1));

    if (!hashParams.has("access_token")) return redirectToRoot();
    const token = hashParams.get("access_token");

    if (!token || !isValidToken(token)) {
      return redirectToRoot();
    }

    // Store token
    setAccessToken(token);
    setIsLoggedOut(false);

    // If this is mobile, navigate to home
    if (isMobile && isMobileNative) {
      setIsProcessing(true);

      // Small delay to ensure token is persisted in Zustand
      setTimeout(() => {
        console.log("[AuthCallback] Navigating to home");
        // App Links로 앱이 포그라운드로 왔으므로, 단순히 navigate만 하면 됨
        navigate("/", { replace: true });
      }, 100);
    } else {
      // Web flow - just navigate
      redirectToRoot(false);
    }
  }, [
    hash,
    search,
    redirectToRoot,
    setAccessToken,
    isProcessing,
    setIsLoggedOut,
    navigate,
  ]);
};
