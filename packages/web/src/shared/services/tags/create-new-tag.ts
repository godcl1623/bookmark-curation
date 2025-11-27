import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const createNewTag = async (body: Record<string, unknown>) => {
  const response = await instance.post(SERVICE_ENDPOINTS.TAGS.path, body);
  return response.data;
};

export default createNewTag;
