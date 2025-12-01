import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router";

import useFolderList from "@/shared/hooks/useFolderList";
import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import type { BasicComponentProps } from "@/shared/types";
import useGlobalStore from "@/stores/global";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  usePrefetchData();

  return children;
}

const usePrefetchData = () => {
  usePrefetchDirectories();
  useFolderList();
};

const usePrefetchDirectories = () => {
  const toggleOpen = useGlobalStore((state) => state.toggleOpen);
  const openIds = useGlobalStore((state) => state.openIds);
  const { pathname } = useLocation();

  const { data: response } = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(pathname),
    queryFn: () => (pathname != null ? getDirectoryByPath(pathname) : null),
  });

  useEffect(() => {
    if (response?.data == null) return;
    const { breadcrumbs } = response.data;
    if (breadcrumbs.length > 0) {
      // FIXME: 타입 재설정 + Breadcrumb 및 필터링 등 설정
      breadcrumbs.forEach(({ data_id }) => {
        if (!openIds.has(data_id)) toggleOpen(data_id);
      });
    }
  }, [response, toggleOpen, openIds]);
};
