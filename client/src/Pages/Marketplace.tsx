import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Frown } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import ProviderFilter from "@/Components/Providers/ProviderFilter";
import ProviderCard from "@/Components/Providers/ProviderCard";
import ProviderCardSkeleton from "@/Components/Providers/ProviderCardSkeleton";
import { useProviders } from "@/hooks/useProviders";
import type { ProviderFilters } from "@/types";
import { Button } from "@/Components/UI/button";
import { getErrorMessage } from "@/utils/helpers";

export const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<ProviderFilters>(() => {
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const verifiedOnly = searchParams.get("verified") === "true";
    const sortBy = (searchParams.get("sortBy") as ProviderFilters["sortBy"]) || "trustScore";
    return { category, city, search, verifiedOnly, sortBy };
  });

  const {
    data: providers = [],
    isLoading,
    error,
  } = useProviders(filters);

  const handleFilterChange = (newFilters: ProviderFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.subCity) params.set("subCity", newFilters.subCity);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.verifiedOnly) params.set("verified", "true");
    if (newFilters.sortBy && newFilters.sortBy !== "trustScore") params.set("sortBy", newFilters.sortBy);
    if (newFilters.minScore) params.set("minScore", String(newFilters.minScore));
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const emptyFilters: ProviderFilters = { sortBy: "trustScore" };
    setFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
  };

  const formattedError = error ? getErrorMessage(error, "Failed to load service providers.") : "";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              Discover Trustworthy Professionals
            </h1>
          </div>
        </div>

        <ProviderFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={isLoading ? undefined : providers.length}
        />

        {formattedError && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs font-medium text-destructive text-left">
            {formattedError}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProviderCardSkeleton key={i} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-3xl border border-hairline bg-card p-12 text-center shadow-xs space-y-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Frown className="size-6" />
            </div>
            <h3 className="text-base font-bold text-ink">No Service Providers Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any professionals matching your selected criteria. Try adjusting your search keywords, category, or location.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-full text-xs font-semibold mt-2 border-hairline"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
