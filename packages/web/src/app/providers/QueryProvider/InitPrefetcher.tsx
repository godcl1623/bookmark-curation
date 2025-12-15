import type { Directory } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import useFolderList from "@/shared/hooks/useFolderList";
import useMe from "@/shared/hooks/useMe.ts";
import refreshToken from "@/shared/services/auth/refresh-token";
import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import type { BasicComponentProps } from "@/shared/types";
import useAuthStore from "@/stores/auth.ts";
import useGlobalStore from "@/stores/global";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  usePrefetchDirectories();
  useFolderList();
  useMe();
  useCheckAuthentication();

  return children;
}

const usePrefetchDirectories = () => {
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  const openIds = useGlobalStore((state) => state.openIds);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { pathname } = useLocation();

  const { data: response } = useQuery<{ ok: boolean; data: Directory } | null>({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(pathname),
    queryFn: () => (pathname != null ? getDirectoryByPath(pathname) : null),
    enabled: accessToken != null,
  });

  useEffect(() => {
    if (response?.data == null) return;
    const { breadcrumbs } = response.data;
    if (breadcrumbs.length > 0) {
      breadcrumbs.forEach(({ data_id }) => {
        if (!openIds.has(data_id)) toggleOpen(data_id);
      });
    }
  }, [response, toggleOpen, openIds]);

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
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
          console.error(error);
        });
    }
  }, [accessToken, setAccessToken, navigate]);
};
