import { useParams } from "react-router";

export const useDirectoryPath = () => {
  const params = useParams();
  return "/" + (params["*"] ?? "");
};
