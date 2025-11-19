import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const deleteFolder = async (id: string) => {
  try {
    return instance.delete(`${SERVICE_ENDPOINTS.FOLDERS.path}/${id}`);
  } catch (error) {
    return error;
  }
};

export default deleteFolder;
