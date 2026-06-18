import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/services/locationService";
import { queryKeys } from "@/constants/queryKeys";

export const useLocations = () => {
  const {
    data: locations = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: getLocations,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const cities = locations.map((loc) => loc.city);

  const getSubCities = useCallback(
    (cityName: string): string[] => {
      const match = locations.find(
        (loc) => loc.city.toLowerCase() === cityName.toLowerCase(),
      );
      return match ? match.subCities : [];
    },
    [locations],
  );

  return {
    locations,
    cities,
    getSubCities,
    isLoading,
    error,
    isError,
    refetch,
  };
};
