import React from "react";
import { Skeleton } from "@/Components/UI/skeleton";

export const BookingCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-hairline bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>

        <Skeleton className="h-6 w-32 rounded-full self-start sm:self-center" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded shrink-0" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded shrink-0" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="size-4 rounded shrink-0 mt-0.5" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-xl bg-surface-soft/60 p-3 border border-hairline/60">
          <Skeleton className="h-3 w-32" />
          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
        <Skeleton className="h-3.5 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default BookingCardSkeleton;
