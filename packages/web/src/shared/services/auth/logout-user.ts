import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "@/shared/lib/http/axios";

const refreshToken = async () => {
  const response = await instance.post(
    SERVICE_ENDPOINTS.AUTH.LOGOUT.CURRENT.path
  );
  return response.data;
};

export default refreshToken;
