import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getDirectoryList from "@/shared/services/directories/get-directory-list";
import DIRECTORY_QUERY_KEY from "@/shared/services/directories/queryKey";

// const useDirectoriesData = (parentIds: (string | null)[] = [null]) => {
//   const results = useQueries({
//     queries: parentIds.map((parentId) => ({
//       queryKey: DIRECTORY_QUERY_KEY.CONTENTS(parentId),
//       queryFn: () => getDirectoryList(parentId),
//     })),
//   });
//
//   return useMemo(
//     () =>
//       results?.map((result) => {
//         return {
//           data: result?.data?.data,
//           isLoading: result?.isLoading,
//           isError: result?.isError,
//         };
//       }),
//     [results]
//   );
// };

const useDirectoriesData = (parentId: string | null = null) => {
  const result = useQuery({
    queryKey: DIRECTORY_QUERY_KEY.CONTENTS(parentId),
    queryFn: () => getDirectoryList(parentId),
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
