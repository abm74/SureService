import React from "react";
import { Search, SlidersHorizontal, ShieldCheck, X } from "lucide-react";
import { Input } from "@/Components/UI/input";
import { Button } from "@/Components/UI/button";
import { Skeleton } from "@/Components/UI/skeleton";
import type { ProviderFilters } from "@/types";

import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";

interface ProviderFilterProps {
  filters: ProviderFilters;
  onFilterChange: (filters: ProviderFilters) => void;
  onReset: () => void;
  totalCount?: number;
}

export const ProviderFilter: React.FC<ProviderFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}) => {
  const { categoryNames } = useCategories();
  const { cities, getSubCities } = useLocations();
  const categoryFilterList = ["All Categories", ...categoryNames];
  const citiesFilterList = ["All Cities", ...cities];
  const activeCity = filters.city || "All Cities";
  const activeSubCities = getSubCities(activeCity);
  const subCitiesFilterList = ["All Sub-cities", ...activeSubCities];
  const activeSubCity = filters.subCity || "All Sub-cities";
  const verifiedOnly = !!filters.verifiedOnly;
  const sortBy = filters.sortBy || "trustScore";
  const minScore = filters.minScore ?? 0;

  const handleCategorySelect = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === "All Categories" ? undefined : category,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
      ...filters,
      city: val === "All Cities" ? undefined : val,
      subCity: undefined,
    });
  };

  const handleSubCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
      ...filters,
      subCity: val === "All Sub-cities" ? undefined : val,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as ProviderFilters["sortBy"],
    });
  };

  const handleMinScoreChange = (score: number) => {
    onFilterChange({
      ...filters,
      minScore: minScore === score ? undefined : score,
    });
  };

  const toggleVerified = () => {
    onFilterChange({
      ...filters,
      verifiedOnly: !verifiedOnly,
    });
  };

  const isFiltered = Boolean(
    filters.category ||
    filters.city ||
    filters.subCity ||
    filters.search ||
    filters.verifiedOnly ||
    (filters.minScore && filters.minScore > 0) ||
    (filters.sortBy && filters.sortBy !== "trustScore")
  );

  return (
    <div className="space-y-4 rounded-2xl border border-hairline bg-card p-5 shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by provider name, trade, or skill..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-10 h-11 rounded-xl text-xs border-hairline"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, search: undefined })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <select
              value={activeCity}
              onChange={handleCityChange}
              className="h-11 rounded-xl border border-hairline bg-background px-3 py-2 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {citiesFilterList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {activeSubCities.length > 0 && (
              <select
                value={activeSubCity}
                onChange={handleSubCityChange}
                className="h-11 rounded-xl border border-hairline bg-background px-3 py-2 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer animate-in fade-in duration-200"
              >
                {subCitiesFilterList.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVerified}
              className={`h-11 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                verifiedOnly
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-2xs"
                  : "bg-surface-soft text-ink border-hairline hover:bg-surface-hover"
              }`}
              title="Filter by Admin-Verified identity only"
            >
              <ShieldCheck className="size-4" />
              <span>Verified Only</span>
            </button>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="h-11 rounded-xl border border-hairline bg-background px-3 py-2 text-xs font-semibold text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="trustScore">Highest Trust Score</option>
              <option value="completedJobs">Most Completed Jobs</option>
              <option value="rateAsc">Lowest Hourly Rate</option>
              <option value="rateDesc">Highest Hourly Rate</option>
              <option value="newest">Newest Listed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        {categoryFilterList.map((cat) => {
          const isSelected = (cat === "All Categories" && !filters.category) || filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-surface-soft text-muted-foreground border border-hairline hover:text-ink hover:bg-surface-hover"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-hairline text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Trust Tier:</span>
          <button
            type="button"
            onClick={() => handleMinScoreChange(90)}
            className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-all cursor-pointer ${
              minScore === 90
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100"
            }`}
          >
            Top (90+)
          </button>
          <button
            type="button"
            onClick={() => handleMinScoreChange(75)}
            className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-all cursor-pointer ${
              minScore === 75
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100"
            }`}
          >
            High (75+)
          </button>
          <button
            type="button"
            onClick={() => handleMinScoreChange(50)}
            className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-all cursor-pointer ${
              minScore === 50
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 hover:bg-teal-100"
            }`}
          >
            Standard (50+)
          </button>
        </div>

        <div className="flex items-center gap-3">
          {totalCount !== undefined ? (
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-bold text-ink">{totalCount}</span> verified professional{totalCount === 1 ? "" : "s"}
            </span>
          ) : (
            <Skeleton className="h-4 w-36 rounded" />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-ink flex items-center gap-1 cursor-pointer h-7"
            >
              <SlidersHorizontal className="size-3" />
              <span>Reset filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderFilter;
