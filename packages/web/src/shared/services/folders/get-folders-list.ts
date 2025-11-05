import instance from "../../lib/http/axios.ts";

const getFoldersList = async () => {
  try {
    const response = await instance.get("/api/folders");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getFoldersList;
