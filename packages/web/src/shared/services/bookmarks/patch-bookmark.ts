import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const patchBookmark = async (target: string, body: Record<string, unknown>) => {
  const response = await instance.patch(
    `${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/${target}`,
    body
  );
  return response.data;
};

export default patchBookmark;
