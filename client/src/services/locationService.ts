import api from "./api";

export interface LocationItem {
  city: string;
  subCities: string[];
}

export const getLocations = async (): Promise<LocationItem[]> => {
  const response = await api.get<{ locations: LocationItem[] }>("/locations");
  return response.data.locations;
};
