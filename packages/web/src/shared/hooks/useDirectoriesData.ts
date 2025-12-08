import type { Directory } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";

const useDirectoriesData = (
  dirName: string,
  shouldLoad: boolean = false
): {
  data: Directory;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const result = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.BY_PATH(dirName),
    queryFn: () => (shouldLoad ? getDirectoryByPath(dirName) : null),
    enabled: shouldLoad,
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
