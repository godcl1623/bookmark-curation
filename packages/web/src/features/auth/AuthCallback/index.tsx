import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { checkIfMobileNative } from "@/shared/lib/utils";
import useAuthStore from "@/stores/auth.ts";

export default function AuthCallback() {
  useHandleCallback();

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50/75">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

    // If this is mobile, trigger deep link to close browser and return to app
    if (isMobile && isMobileNative) {
      setIsProcessing(true);

      // Small delay to ensure token is persisted in Zustand
      setTimeout(() => {
        // Trigger deep link - this will cause the app to receive appUrlOpen event
        window.location.href = `linkvault://auth/success`;
      }, 100);
    } else {
      // Web flow - just navigate
      redirectToRoot(false);
    }
  }, [hash, search, redirectToRoot, setAccessToken, isProcessing, setIsLoggedOut]);
};
