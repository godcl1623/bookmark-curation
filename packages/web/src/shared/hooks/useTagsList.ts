import type { Tag } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";

import getTagsList from "@/shared/services/tags/get-tags-list";
import TAGS_QUERY_KEY from "@/shared/services/tags/queryKey";
import type { TagQueryOption } from "@/shared/types";

const useTagsList = (options?: TagQueryOption) => {
  const {
    data: response,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery<{ ok: boolean; data: Tag[] }>({
    queryKey: TAGS_QUERY_KEY.TOTAL_LISTS(options ?? {}),
    queryFn: () => getTagsList(options ?? {}),
  });

  return { data: response?.data, isLoading, isError, isRefetching, refetch };
};

export default useTagsList;
