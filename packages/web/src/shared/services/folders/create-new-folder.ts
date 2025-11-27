import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const createNewFolder = async (body: Record<string, unknown>) => {
  try {
    const response = await instance.post(SERVICE_ENDPOINTS.FOLDERS.path, body);
    return response.data;
  } catch (error) {
    return error;
  }
};

export default createNewFolder;
