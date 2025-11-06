import { SERVICE_ENDPOINTS } from "@linkvault/shared";

import instance from "../../lib/http/axios.ts";

const getDirectoryList = async () => {
  const response = await instance.get(
    SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path
  );
  return response.data;
};

export default getDirectoryList;
