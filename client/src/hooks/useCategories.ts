import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categoryService";
import { queryKeys } from "@/constants/queryKeys";

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const categoryNames = categories.map((c) => c.name);

  return {
    categories,
    categoryNames,
    isLoading,
    error,
    isError,
    refetch,
  };
};
