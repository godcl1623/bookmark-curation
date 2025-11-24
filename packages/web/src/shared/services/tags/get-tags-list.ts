import SERVICE_ENDPOINTS from "@linkvault/shared/services/endpoints";

import instance from "@/shared/lib/http/axios";

const getTagsList = async (search?: string) => {
  const response = await instance.get(
    SERVICE_ENDPOINTS.TAGS.path + (search ? `?search=${search}` : "")
  );
  return response.data;
};

export default getTagsList;
