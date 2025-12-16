import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const getMe = async () => {
  const response = await instance.get(SERVICE_ENDPOINTS.AUTH.ME.path);
  return response.data;
};

export default getMe;
