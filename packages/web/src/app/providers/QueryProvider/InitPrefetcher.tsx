import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";

import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import type { BasicComponentProps } from "@/shared/types";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  usePrefetchData();

  return children;
}

const usePrefetchData = () => {
  const { pathname } = useLocation();

  useQuery({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(pathname),
    queryFn: () => (pathname != null ? getDirectoryByPath(pathname) : null),
  });
};
