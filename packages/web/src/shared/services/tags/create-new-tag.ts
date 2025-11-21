import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const createNewTag = async (body: Record<string, unknown>) => {
  try {
    const response = await instance.post(SERVICE_ENDPOINTS.TAGS.path, body);
    return response.data;
  } catch (error) {
    return error;
  }
};

export default createNewTag;
