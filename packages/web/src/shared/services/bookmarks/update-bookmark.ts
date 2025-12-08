import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const updateBookmark = async (
  target: string,
  body: Record<string, unknown>
) => {
  try {
    const response = await instance.put(
      `${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/${target}`,
      body
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export default updateBookmark;
