import SERVICE_ENDPOINTS from "@linkvault/shared/services/endpoints";

import instance from "@/shared/lib/http/axios";

const getDirectoryByPath = async (pathname: string = "/") => {
  const response = await instance.get(
    `${SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path}?path=${pathname}`
  );
  return response.data;
};

export default getDirectoryByPath;
