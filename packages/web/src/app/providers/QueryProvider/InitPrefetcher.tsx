import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";

import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import getDirectoryContents from "@/shared/services/directories/get-directory-contents";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import type { BasicComponentProps } from "@/shared/types";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  usePrefetchData();

  return children;
}

const usePrefetchData = () => {
  const { pathname } = useLocation();
  useQuery({
    queryKey: DIRECTORY_QUERY_KEY.CONTENTS(null),
    queryFn: () =>
      pathname == null || pathname === "/" ? getDirectoryContents() : null,
  });
  useQuery({
    queryKey: ["test", pathname],
    queryFn: () =>
      pathname != null && pathname !== "/"
        ? getDirectoryByPath(pathname)
        : null,
  });
};
