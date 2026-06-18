import api from "./api";
import type { CategoryItem } from "../types";

export const getCategories = async (): Promise<CategoryItem[]> => {
  const response = await api.get<{ categories: CategoryItem[] }>("/categories");
  return response.data.categories;
};

export const getCategoryNames = async (): Promise<string[]> => {
  const response = await api.get<{ categories: string[] }>("/providers/categories");
  return response.data.categories;
};
