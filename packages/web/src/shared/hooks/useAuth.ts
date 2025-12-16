import type { Me } from "@linkvault/shared";
import { useQuery } from "@tanstack/react-query";

import getMe from "@/shared/services/auth/get-me.ts";
import AUTH_QUERY_KEY from "@/shared/services/auth/queryKey.ts";
import useAuthStore from "@/stores/auth.ts";

const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ user: Me } | null>({
    queryKey: AUTH_QUERY_KEY.ME,
    queryFn: () => (accessToken != null ? getMe() : null),
    enabled: accessToken != null,
    staleTime: 60 * 5 * 1000,
    retry: false,
  });

  return { user: response?.user, isLoading, isError, refetch };
};

export default useAuth;
