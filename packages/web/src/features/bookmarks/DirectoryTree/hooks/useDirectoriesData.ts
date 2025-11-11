import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryContents from "@/shared/services/directories/get-directory-contents";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";

const useDirectoriesData = (
  parentId: string | null = null,
  shouldLoad: boolean = false
) => {
  const result = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.CONTENTS(parentId),
    queryFn: () => (shouldLoad ? getDirectoryContents(parentId) : null),
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
