import type { Directory } from "@linkvault/shared";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import useAuthStore from "@/stores/auth";
import useGlobalStore from "@/stores/global";

export const useDirectoryData = (
  dirName: string,
  shouldLoad: boolean = true
): {
  data: Directory;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoad = shouldLoad && accessToken != null;

  const result = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(dirName),
    queryFn: () => (isLoad ? getDirectoryByPath(dirName) : null),
    enabled: isLoad,
  });

  return useMemo(
    () => ({
      data: result?.data?.data,
      isLoading: result?.isLoading,
      isError: result?.isError,
      refetch: result?.refetch,
    }),
    [result]
  );
};

export const useDirectoriesData = (
  shouldLoad: boolean = true
): {
  data: Directory[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const openPaths = useGlobalStore((state) => state.openPaths);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoad = shouldLoad && accessToken != null;
  const queryList = useMemo(
    () => ["/"].concat(Array.from(openPaths.values())),
    [openPaths]
  );

  const result = useQueries({
    queries: queryList.map((path) => ({
      queryKey: DIRECTORY_QUERY_KEY.BY_PATH(path),
      queryFn: () => (isLoad ? getDirectoryByPath(path) : null),
      enabled: isLoad,
    })),
    combine: (results) => ({
      data: results.map((result) => result?.data?.data),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
      refetch: () => results.forEach((result) => result.refetch()),
    }),
  });

  return useMemo(
    () => ({
      data: result?.data,
      isLoading: result?.isLoading,
      isError: result?.isError,
      refetch: result?.refetch,
    }),
    [result]
  );
};
