import React from "react";
import { Skeleton } from "@/Components/UI/skeleton";

export const ProviderCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-hairline bg-card p-5 shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-13 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-7 w-14 rounded-full shrink-0" />
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="space-y-1.5 mb-4">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>

      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2 mt-2">
        <div className="space-y-1">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProviderCardSkeleton;
