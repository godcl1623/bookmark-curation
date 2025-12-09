import type { Bookmark } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";

import getBookmarksList, {
  type BookmarkQueryOption,
} from "@/shared/services/bookmarks/get-bookmarks-list";
import BOOKMARKS_QUERY_KEY from "@/shared/services/bookmarks/queryKey";

const useBookmarksList = (options?: BookmarkQueryOption) => {
  const {
    data: response,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery<{ ok: boolean; data: Bookmark[] }>({
    queryKey: BOOKMARKS_QUERY_KEY.TOTAL_LISTS(options),
    queryFn: () => getBookmarksList(options),
  });

  return { data: response?.data, isLoading, isError, isRefetching, refetch };
};

export default useBookmarksList;
