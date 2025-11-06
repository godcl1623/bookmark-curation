import { useQuery } from "@tanstack/react-query";

import getDirectoryList from "../../../shared/services/directories/get-directory-list.ts";
import DIRECTORY_QUERY_KEY from "../../../shared/services/directories/queryKey.ts";
import type { BasicComponentProps } from "../../../shared/types";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  useQuery({
    queryKey: DIRECTORY_QUERY_KEY.CONTENTS(null),
    queryFn: getDirectoryList,
  });

  return children;
}
