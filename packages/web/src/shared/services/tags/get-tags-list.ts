import SERVICE_ENDPOINTS from "@linkvault/shared/services/endpoints";

import instance from "@/shared/lib/http/axios";
import type { TagQueryOption } from "@/shared/types";

const getTagsList = async (options: TagQueryOption) => {
  const response = await instance.get(
    SERVICE_ENDPOINTS.TAGS.path +
      Object.entries(options)
        .map(([key, value], index) =>
          index === 0 ? `?${key}=${value}` : `&${key}=${value}`
        )
        .join()
  );
  return response.data;
};

export default getTagsList;
