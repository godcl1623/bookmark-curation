import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const updateTag = async (target: string, body: Record<string, unknown>) => {
  try {
    const response = await instance.put(
      `${SERVICE_ENDPOINTS.TAGS.path}/${target}`,
      body
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export default updateTag;
