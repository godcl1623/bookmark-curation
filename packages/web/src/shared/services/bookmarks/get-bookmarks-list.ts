import SERVICE_ENDPOINTS from "../../../../../shared/services/endpoints.ts";
import instance from "../../lib/http/axios.ts";

const getBookmarksList = async () => {
  const response = await instance.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path);
  return response.data;
};

export default getBookmarksList;
