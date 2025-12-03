import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const deleteBookmark = async (id: string) => {
  try {
    return instance.delete(`${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/${id}`);
  } catch (error) {
    return error;
  }
};

export default deleteBookmark;
