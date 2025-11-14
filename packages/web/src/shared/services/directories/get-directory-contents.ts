import SERVICE_ENDPOINTS from "@linkvault/shared/services/endpoints";

import instance from "@/shared/lib/http/axios";

const getDirectoryContents = async (parentId: string | null = null) => {
  const response = await instance.get(
    `${SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path}${parentId ? `?parent_id=${parentId}` : ""}`
  );
  return response.data;
};

export default getDirectoryContents;
