import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { checkIfMobileNative } from "@/shared/lib/utils";
import useAuthStore from "@/stores/auth.ts";

import { isValidToken } from "./utils";

export default function AuthCallback() {
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

const useHandleCallback = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedOut = useAuthStore((state) => state.setIsLoggedOut);
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  // FIXME: isProcessing 관련 플로우 재점검 및 필요시 삭제
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

    // 토큰 읽기: 모바일은 query parameter, 웹은 hash
    let token: string | null = null;

    if (isMobile && isMobileNative) {
      // 모바일: query parameter에서 토큰 읽기
      token = params.get("token");
    } else {
      // 웹: hash에서 토큰 읽기
      if (hash === "") return redirectToRoot();
      const hashParams = new URLSearchParams(hash.substring(1));
      token = hashParams.get("access_token");
    }

    if (!token || !isValidToken(token)) {
      return redirectToRoot();
    }

    // URL에서 토큰 제거 (보안)
    window.history.replaceState({}, "", "/auth/callback");

    // Store token
    setAccessToken(token);
    setIsLoggedOut(false);

    // If this is mobile, navigate to home
    if (isMobile && isMobileNative) {
      setIsProcessing(true);

      // Small delay to ensure token is persisted in Zustand
      setTimeout(() => {
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
