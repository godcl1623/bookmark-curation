import SERVICE_ENDPOINTS from "@linkvault/shared/services/endpoints";

import instance from "../../lib/http/axios.ts";

const getFoldersList = async () => {
  const response = await instance.get(SERVICE_ENDPOINTS.FOLDERS.path);
  return response.data;
};

export default getFoldersList;
