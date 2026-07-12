import React, { useState } from "react";
import { Search, SlidersHorizontal, ShieldCheck, X, MapPin, ArrowUpDown, RotateCcw } from "lucide-react";
import { Input } from "@/Components/UI/input";
import { Button } from "@/Components/UI/button";
import { Skeleton } from "@/Components/UI/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/UI/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select";
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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

  const handleCitySelect = (val: string) => {
    onFilterChange({
      ...filters,
      city: val === "All Cities" ? undefined : val,
      subCity: undefined,
    });
  };

  const handleSubCitySelect = (val: string) => {
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

  const handleSortSelect = (val: string) => {
    onFilterChange({
      ...filters,
      sortBy: val as ProviderFilters["sortBy"],
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

  const activeDetailedFilterCount =
    (filters.city ? 1 : 0) +
    (filters.subCity ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.minScore && filters.minScore > 0 ? 1 : 0) +
    (filters.sortBy && filters.sortBy !== "trustScore" ? 1 : 0);

  const isFiltered = Boolean(
    filters.category ||
    filters.city ||
    filters.subCity ||
    filters.search ||
    filters.verifiedOnly ||
    (filters.minScore && filters.minScore > 0) ||
    (filters.sortBy && filters.sortBy !== "trustScore")
  );

  const sortLabels: Record<string, string> = {
    trustScore: "Highest Trust Score",
    completedJobs: "Most Completed Jobs",
    rateAsc: "Lowest Hourly Rate",
    rateDesc: "Highest Hourly Rate",
    newest: "Newest Listed",
  };

  return (
    <div className="space-y-1.5 sm:space-y-4 rounded-xl sm:rounded-2xl border border-hairline bg-card p-2 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row gap-1.5 sm:gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 size-3 sm:size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search providers..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="pl-6.5 sm:pl-10 pr-6 h-7.5 sm:h-11 rounded-lg sm:rounded-xl text-[10px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm border-hairline"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: undefined })}
                className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 text-muted-foreground hover:text-ink cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-2.5 sm:size-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden h-7.5 px-2 sm:px-3 rounded-lg sm:rounded-xl border-hairline flex items-center gap-1 sm:gap-1.5 shrink-0 text-[9.5px] sm:text-xs font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="size-2.5 sm:size-3.5 text-primary" />
            <span>Filters</span>
            {activeDetailedFilterCount > 0 && (
              <span className="size-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">
                {activeDetailedFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2.5 w-auto flex-wrap justify-end">
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={activeCity} onValueChange={handleCitySelect}>
              <SelectTrigger className="h-11 w-auto px-3.5 rounded-xl border border-hairline bg-surface-soft text-ink hover:bg-surface-hover text-xs font-semibold shadow-xs justify-center gap-1.5 transition-all">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                {citiesFilterList.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeSubCities.length > 0 && (
              <Select value={activeSubCity} onValueChange={handleSubCitySelect}>
                <SelectTrigger className="h-11 w-auto px-3.5 rounded-xl border border-hairline bg-surface-soft text-ink hover:bg-surface-hover text-xs font-semibold shadow-xs justify-center gap-1.5 transition-all animate-in fade-in duration-200">
                  <SelectValue placeholder="All Sub-cities" />
                </SelectTrigger>
                <SelectContent>
                  {subCitiesFilterList.map((sc) => (
                    <SelectItem key={sc} value={sc}>
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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

            <Select value={sortBy} onValueChange={handleSortSelect}>
              <SelectTrigger className="h-11 w-auto px-3.5 rounded-xl border border-hairline bg-surface-soft text-ink hover:bg-surface-hover text-xs font-semibold shadow-xs justify-center gap-1.5 transition-all">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trustScore">Highest Trust Score</SelectItem>
                <SelectItem value="completedJobs">Most Completed Jobs</SelectItem>
                <SelectItem value="rateAsc">Lowest Hourly Rate</SelectItem>
                <SelectItem value="rateDesc">Highest Hourly Rate</SelectItem>
                <SelectItem value="newest">Newest Listed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0"
      >
        {categoryFilterList.map((cat) => {
          const isSelected = (cat === "All Categories" && !filters.category) || filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`rounded-full px-2 sm:px-3.5 py-0.5 sm:py-1.5 text-[9px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
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

      {isFiltered && (
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
          <span className="text-[8.5px] sm:text-[11px] text-muted-foreground font-medium mr-0.5 sm:mr-1">Active:</span>

          {filters.category && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-surface-soft border border-hairline px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-medium text-ink">
              <span>{filters.category}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, category: undefined })}
                className="text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          {filters.city && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-surface-soft border border-hairline px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-medium text-ink">
              <MapPin className="size-2 sm:size-3 text-muted-foreground" />
              <span>{filters.city}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, city: undefined, subCity: undefined })}
                className="text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          {filters.subCity && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-surface-soft border border-hairline px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-medium text-ink">
              <span>{filters.subCity}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, subCity: undefined })}
                className="text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          {filters.verifiedOnly && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-semibold">
              <ShieldCheck className="size-2 sm:size-3 text-emerald-600" />
              <span>Verified Only</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, verifiedOnly: undefined })}
                className="text-emerald-700 hover:text-emerald-950 dark:hover:text-white cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          {filters.minScore && filters.minScore > 0 && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-semibold">
              <span>{filters.minScore}+ Trust</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, minScore: undefined })}
                className="text-primary hover:text-ink cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          {filters.sortBy && filters.sortBy !== "trustScore" && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-surface-soft border border-hairline px-1.5 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[11px] font-medium text-ink">
              <ArrowUpDown className="size-2 sm:size-3 text-muted-foreground" />
              <span>{sortLabels[filters.sortBy] || filters.sortBy}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, sortBy: "trustScore" })}
                className="text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-2 sm:size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            className="text-[8.5px] sm:text-[11px] text-muted-foreground hover:text-destructive font-medium underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 pt-1 sm:pt-2.5 border-t border-hairline text-xs">
        <div className="hidden md:flex items-center gap-2">
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

        <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3">
          {totalCount !== undefined ? (
            <span className="text-muted-foreground font-medium text-[8.5px] sm:text-xs">
              Showing <span className="font-bold text-ink">{totalCount}</span> verified professional{totalCount === 1 ? "" : "s"}
            </span>
          ) : (
            <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-36 rounded" />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="text-[8.5px] sm:text-xs text-muted-foreground hover:text-ink flex items-center gap-0.5 sm:gap-1 cursor-pointer h-5 sm:h-7 px-1.5 sm:px-2"
            >
              <SlidersHorizontal className="size-2 sm:size-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <DialogContent className="max-w-md p-3 sm:p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xs sm:text-lg font-bold">Filters & Sorting</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-xs">
              Customize location, verification, and sorting criteria.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 sm:space-y-4 py-1 sm:py-2 text-left">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-ink flex items-center gap-1.5">
                <MapPin className="size-3 sm:size-3.5 text-primary" />
                <span>Location</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                <Select value={activeCity} onValueChange={handleCitySelect}>
                  <SelectTrigger className="h-8.5 sm:h-10 rounded-xl text-xs font-medium w-full">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesFilterList.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeSubCities.length > 0 && (
                  <Select value={activeSubCity} onValueChange={handleSubCitySelect}>
                    <SelectTrigger className="h-8.5 sm:h-10 rounded-xl text-xs font-medium w-full">
                      <SelectValue placeholder="All Sub-cities" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCitiesFilterList.map((sc) => (
                        <SelectItem key={sc} value={sc}>
                          {sc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-ink flex items-center gap-1.5">
                <ArrowUpDown className="size-3 sm:size-3.5 text-primary" />
                <span>Sort Providers</span>
              </label>
              <Select value={sortBy} onValueChange={handleSortSelect}>
                <SelectTrigger className="h-8.5 sm:h-10 rounded-xl text-xs font-semibold w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trustScore">Highest Trust Score (Recommended)</SelectItem>
                  <SelectItem value="completedJobs">Most Completed Jobs</SelectItem>
                  <SelectItem value="rateAsc">Lowest Hourly Rate</SelectItem>
                  <SelectItem value="rateDesc">Highest Hourly Rate</SelectItem>
                  <SelectItem value="newest">Newest Listed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-ink">Verification Standing</label>
              <button
                type="button"
                role="switch"
                aria-checked={verifiedOnly}
                onClick={toggleVerified}
                className={`w-full p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer select-none active:scale-[0.99] ${
                  verifiedOnly
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-2xs"
                    : "bg-surface-soft border-hairline hover:bg-surface-hover hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <div
                      className={`size-5.5 sm:size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        verifiedOnly ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <ShieldCheck className="size-3 sm:size-3.5" />
                    </div>
                    <span className={`text-[10.5px] sm:text-xs font-bold truncate ${verifiedOnly ? "text-emerald-950 dark:text-emerald-200" : "text-ink"}`}>
                      Verified Providers Only
                    </span>
                  </div>

                  <div
                    className={`w-7.5 sm:w-9 h-4 sm:h-5 flex items-center rounded-full p-0.5 shrink-0 transition-colors duration-200 ease-in-out ${
                      verifiedOnly ? "bg-emerald-500 justify-end" : "bg-muted-foreground/30 justify-start"
                    }`}
                  >
                    <div className="bg-white size-3 sm:size-4 rounded-full shadow-xs transition-transform" />
                  </div>
                </div>

                <p className="text-[9.5px] sm:text-[11px] text-muted-foreground leading-tight sm:leading-snug mt-1 pl-7 sm:pl-9.5">
                  Show only professionals with audited ID & trade licenses.
                </p>
              </button>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-ink">Minimum Trust Tier</label>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleMinScoreChange(0)}
                  className={`h-7.5 sm:h-9 rounded-lg sm:rounded-xl border px-1.5 sm:px-2 text-[10.5px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    minScore === 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface-soft border-hairline text-muted-foreground hover:text-ink"
                  }`}
                >
                  All Scores (0+)
                </button>
                <button
                  type="button"
                  onClick={() => handleMinScoreChange(50)}
                  className={`h-7.5 sm:h-9 rounded-lg sm:rounded-xl border px-1.5 sm:px-2 text-[10.5px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    minScore === 50
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-surface-soft border-hairline text-muted-foreground hover:text-ink"
                  }`}
                >
                  Standard (50+)
                </button>
                <button
                  type="button"
                  onClick={() => handleMinScoreChange(75)}
                  className={`h-7.5 sm:h-9 rounded-lg sm:rounded-xl border px-1.5 sm:px-2 text-[10.5px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    minScore === 75
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-surface-soft border-hairline text-muted-foreground hover:text-ink"
                  }`}
                >
                  High Tier (75+)
                </button>
                <button
                  type="button"
                  onClick={() => handleMinScoreChange(90)}
                  className={`h-7.5 sm:h-9 rounded-lg sm:rounded-xl border px-1.5 sm:px-2 text-[10.5px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    minScore === 90
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-surface-soft border-hairline text-muted-foreground hover:text-ink"
                  }`}
                >
                  Top Tier (90+)
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-1.5 pt-2 sm:pt-3 border-t border-hairline sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-semibold h-8 sm:h-10 px-2.5 sm:px-3.5 border border-border bg-surface-soft text-ink hover:bg-surface-hover hover:border-ink/20 flex items-center gap-1 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="size-2.5 sm:size-3.5 text-muted-foreground" />
              <span>Reset All</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsMobileFilterOpen(false)}
              className="rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-bold h-8 sm:h-10 px-3.5 sm:px-5 bg-primary text-primary-foreground hover:bg-brand-primary-active shadow-xs active:scale-[0.98] cursor-pointer"
            >
              Show Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderFilter;

