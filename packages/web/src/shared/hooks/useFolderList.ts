import type { Folder as FolderType } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";

import getFoldersList from "@/shared/services/folders/get-folders-list";
import FOLDERS_QUERY_KEY from "@/shared/services/folders/queryKey";
import useAuthStore from "@/stores/auth.ts";

const useFolderList = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    data: response,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery<{ ok: boolean; data: FolderType[] }>({
    queryKey: FOLDERS_QUERY_KEY.TOTAL_LISTS,
    queryFn: getFoldersList,
    enabled: accessToken != null,
  });

  return { data: response?.data, isLoading, isError, isRefetching, refetch };
};

export default useFolderList;
