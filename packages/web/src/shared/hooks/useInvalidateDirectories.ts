import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateDirectories = (target: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [target],
    });
  };
};
