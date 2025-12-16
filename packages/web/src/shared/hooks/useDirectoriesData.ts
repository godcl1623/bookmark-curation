import type { Directory } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";
import useAuthStore from "@/stores/auth.ts";

const useDirectoriesData = (
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

export default useDirectoriesData;
