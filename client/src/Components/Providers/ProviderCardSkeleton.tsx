import React from "react";
import { Skeleton } from "@/Components/UI/skeleton";

export const ProviderCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-hairline bg-card p-2.5 sm:p-4 md:p-5 shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-1.5 sm:gap-2.5 mb-2 sm:mb-3.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="size-9 sm:size-12 md:size-13 rounded-full shrink-0" />
            <div className="space-y-1 sm:space-y-1.5">
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
              <Skeleton className="h-2.5 sm:h-3.5 w-16 sm:w-24" />
              <Skeleton className="h-2 sm:h-3 w-20 sm:w-28" />
            </div>
          </div>
          <Skeleton className="h-5 sm:h-7 w-10 sm:w-14 rounded-full shrink-0" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-4 sm:h-5 w-14 sm:w-16 rounded-full" />
          <Skeleton className="h-4 sm:h-5 w-12 sm:w-14 rounded-full" />
        </div>

        <div className="space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-4">
          <Skeleton className="h-2.5 sm:h-3.5 w-full" />
          <Skeleton className="h-2.5 sm:h-3.5 w-4/5" />
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
          <Skeleton className="h-4 sm:h-5 w-14 sm:w-16 rounded-md" />
          <Skeleton className="h-4 sm:h-5 w-12 sm:w-14 rounded-md" />
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 rounded-md" />
        </div>
      </div>

      <div className="pt-2 sm:pt-3 border-t border-hairline flex items-center justify-between gap-1.5 sm:gap-2 mt-1 sm:mt-2">
        <div className="space-y-0.5 sm:space-y-1">
          <Skeleton className="h-2 sm:h-3 w-6 sm:w-10" />
          <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Skeleton className="h-7.5 sm:h-9 w-12 sm:w-16 rounded-lg sm:rounded-xl" />
          <Skeleton className="h-7.5 sm:h-9 w-14 sm:w-20 rounded-lg sm:rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProviderCardSkeleton;
