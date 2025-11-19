import type { Folder as FolderType } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";

import getFoldersList from "@/shared/services/folders/get-folders-list";
import FOLDERS_QUERY_KEY from "@/shared/services/folders/queryKey";

const useFolderList = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<{ ok: boolean; data: FolderType[] }>({
    queryKey: FOLDERS_QUERY_KEY.TOTAL_LISTS,
    queryFn: getFoldersList,
  });

  return { data: response?.data, isLoading, isError };
};

export default useFolderList;
