import CategoryModel from "../models/Category.js";
import UserModel from "../models/User.js";

export interface CategoryWithCount {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  isPopular: boolean;
  providerCount: number;
}

export const getAllCategories = async (): Promise<CategoryWithCount[]> => {
  const [categories, providerCounts, userDistinct] = await Promise.all([
    CategoryModel.find({}).sort({ isPopular: -1, name: 1 }),
    UserModel.aggregate([
      { $match: { role: "provider", category: { $exists: true, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
    UserModel.distinct("category", {
      role: "provider",
      category: { $ne: "" },
    }),
  ]);

  const countMap = new Map<string, number>();
  providerCounts.forEach((c) => {
    if (c._id) {
      countMap.set(String(c._id).toLowerCase(), c.count);
    }
  });

  const knownNames = new Set<string>();
  const result: CategoryWithCount[] = [];

  for (const cat of categories) {
    knownNames.add(cat.name.toLowerCase());
    const count = countMap.get(cat.name.toLowerCase()) || 0;
    result.push({
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: cat.icon || "Wrench",
      color: cat.color || "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
      description: cat.description || "",
      isPopular: !!cat.isPopular,
      providerCount: count,
    });
  }

  for (const name of userDistinct) {
    if (name && !knownNames.has(name.toLowerCase())) {
      const count = countMap.get(name.toLowerCase()) || 0;
      result.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: "Wrench",
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
        description: "",
        isPopular: false,
        providerCount: count,
      });
    }
  }

  return result;
};

let cachedCategoryNames: { data: string[]; timestamp: number } | null = null;
const CATEGORY_NAMES_CACHE_TTL_MS = 60 * 1000;

export const clearCategoryNamesCache = (): void => {
  cachedCategoryNames = null;
};

export const getCategoryNames = async (forceRefresh = false): Promise<string[]> => {
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedCategoryNames &&
    now - cachedCategoryNames.timestamp < CATEGORY_NAMES_CACHE_TTL_MS
  ) {
    return [...cachedCategoryNames.data];
  }

  const [categoryDocs, userCategories] = await Promise.all([
    CategoryModel.distinct("name"),
    UserModel.distinct("category", { role: "provider", category: { $ne: "" } }),
  ]);

  const set = new Set<string>();
  categoryDocs.forEach((c) => c && set.add(c));
  userCategories.forEach((c) => c && set.add(c));

  const sorted = Array.from(set).sort();
  cachedCategoryNames = { data: sorted, timestamp: now };
  return [...sorted];
};
