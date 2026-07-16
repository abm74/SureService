import React from "react";
import { RefreshCw } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import PlatformStats from "@/Components/Admin/PlatformStats";
import { usePlatformStats } from "@/hooks/useAdmin";
import { Button } from "@/Components/UI/button";

export const AdminMetrics: React.FC = () => {
  const {
    data: stats = null,
    isLoading,
    refetch,
    isRefetching,
  } = usePlatformStats();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink leading-tight">
              Platform Pulse & Marketplace Metrics
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Comprehensive health, trust scores, and booking lifecycle metrics.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-full text-[11px] sm:text-xs h-7.5 sm:h-8 px-2.5 sm:px-3.5 font-semibold text-ink bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`size-3 sm:size-3.5 text-primary ${isRefetching ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </Button>
        </div>

        <div className="space-y-4">
          <PlatformStats stats={stats} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default AdminMetrics;
