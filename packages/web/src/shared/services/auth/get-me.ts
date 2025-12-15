import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

export interface BookmarkQueryOption {
  search?: string;
}

const getBookmarksList = async (options?: BookmarkQueryOption) => {
  const queryParams = options
    ? Object.entries(options)
        .map(([key, value], index) =>
          index === 0 ? `?${key}=${value}` : `&${key}=${value}`
        )
        .join("")
    : "";

  const response = await instance.get(
    SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + queryParams
  );
  return response.data;
};

export default getBookmarksList;
