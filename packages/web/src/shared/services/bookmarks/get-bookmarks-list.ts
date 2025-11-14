import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const getBookmarksList = async () => {
  const response = await instance.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path);
  return response.data;
};

export default getBookmarksList;
