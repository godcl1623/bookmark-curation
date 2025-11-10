import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryList from "@/shared/services/directories/get-directory-list";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";

const useDirectoriesData = (
  parentId: string | null = null,
  shouldLoad: boolean = false
) => {
  const result = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.CONTENTS(parentId),
    queryFn: () => (shouldLoad ? getDirectoryList(parentId) : null),
    enabled: shouldLoad,
  });

  return useMemo(
    () => ({
      data: result?.data?.data,
      isLoading: result?.isLoading,
      isError: result?.isError,
    }),
    [result]
  );
};

export default useDirectoriesData;
