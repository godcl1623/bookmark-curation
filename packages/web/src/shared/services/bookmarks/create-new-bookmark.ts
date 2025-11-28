import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const createNewBookmark = async (body: Record<string, unknown>) => {
  const response = await instance.post(
    SERVICE_ENDPOINTS.BOOKMARKS.ALL.path,
    body
  );
  return response.data;
};

export default createNewBookmark;
