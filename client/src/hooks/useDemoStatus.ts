import { useQuery } from "@tanstack/react-query";
import { getDemoStatus } from "@/services/authService";
import { queryKeys } from "@/constants/queryKeys";

export const useDemoStatus = () => {
  return useQuery({
    queryKey: queryKeys.auth.demoStatus(),
    queryFn: getDemoStatus,
    staleTime: Infinity,
  });
};
