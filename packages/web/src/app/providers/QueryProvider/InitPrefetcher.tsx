import type { Directory } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import useAuth from "@/shared/hooks/useAuth.ts";
import { useDirectoryPath } from "@/shared/hooks/useDirectoryPath";
import useFolderList from "@/shared/hooks/useFolderList";
import refreshToken from "@/shared/services/auth/refresh-token";
import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import type { BasicComponentProps } from "@/shared/types";
import useAuthStore from "@/stores/auth.ts";
import useGlobalStore from "@/stores/global";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  usePrefetchDirectories();
  useFolderList();
  useAuth();
  useCheckAuthentication();

  return children;
}

const usePrefetchDirectories = () => {
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  const openPaths = useGlobalStore((state) => state.openPaths);
  const accessToken = useAuthStore((state) => state.accessToken);
  const dirPath = useDirectoryPath();

  const { data: response } = useQuery<{ ok: boolean; data: Directory } | null>({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(dirPath),
    queryFn: () => (dirPath != null ? getDirectoryByPath(dirPath) : null),
    enabled: accessToken != null,
  });

  useEffect(() => {
    if (response?.data == null) return;
    const { breadcrumbs } = response.data;
    if (breadcrumbs.length > 0) {
      breadcrumbs.forEach(({ id }) => {
        if (!openPaths.has(String(id))) {
          toggleOpen(String(id), decodeURI(dirPath));
        }
      });
    }
  }, [response, toggleOpen, openPaths, dirPath]);

  useGlobalLayout();
};

const useGlobalLayout = () => {
  const setIsMobile = useGlobalStore((state) => state.setIsMobile);
  const setIsTablet = useGlobalStore((state) => state.setIsTablet);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width < 768) {
        setIsMobile(true);
        setIsTablet(false);
      } else if (width < 1024) {
        setIsMobile(false);
        setIsTablet(true);
      } else {
        setIsMobile(false);
        setIsTablet(false);
      }
    });
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, [setIsMobile, setIsTablet]);
};

const useCheckAuthentication = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedOut = useAuthStore((state) => state.isLoggedOut);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken == null) {
      refreshToken()
        .then((response) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
          }
        })
        .catch((error) => {
          if (!isLoggedOut) {
            toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          }
          navigate("/");
          console.error(error);
        });
    }
  }, [accessToken, setAccessToken, navigate, isLoggedOut]);
};
