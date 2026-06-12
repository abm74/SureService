import LocationModel from "../models/Location.js";
import UserModel from "../models/User.js";

export interface LocationItem {
  city: string;
  subCities: string[];
}

export const getAllLocations = async (): Promise<LocationItem[]> => {
  const [dbLocations, userCities, userSubCities] = await Promise.all([
    LocationModel.find({}).sort({ city: 1 }),
    UserModel.distinct("location.city", { "location.city": { $exists: true, $ne: "" } }),
    UserModel.distinct("location.subCity", { "location.subCity": { $exists: true, $ne: "" } }),
  ]);

  const cityMap = new Map<string, Set<string>>();

  dbLocations.forEach((loc) => {
    if (loc.city) {
      if (!cityMap.has(loc.city)) {
        cityMap.set(loc.city, new Set<string>());
      }
      (loc.subCities || []).forEach((sc: string) => {
        if (sc) cityMap.get(loc.city)!.add(sc);
      });
    }
  });

  userCities.forEach((city) => {
    if (city && !cityMap.has(city)) {
      cityMap.set(city, new Set<string>());
    }
  });

  if (userSubCities.length > 0 && cityMap.has("Addis Ababa")) {
    const addisSet = cityMap.get("Addis Ababa")!;
    userSubCities.forEach((sc) => {
      if (sc) addisSet.add(sc);
    });
  }

  const result: LocationItem[] = [];
  cityMap.forEach((subCitiesSet, city) => {
    result.push({
      city,
      subCities: Array.from(subCitiesSet).sort(),
    });
  });

  return result.sort((a, b) => a.city.localeCompare(b.city));
};
