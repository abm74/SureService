import React from "react";
import { Skeleton } from "@/Components/UI/skeleton";

export const BookingCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3.5 sm:p-4 md:p-5 text-card-foreground shadow-xs">
      <div className="flex items-start justify-between gap-2.5 pb-2.5 sm:pb-3.5 border-b border-hairline">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <Skeleton className="size-8.5 sm:size-11 shrink-0 rounded-full mt-0.5 sm:mt-0" />
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-36" />
              <Skeleton className="hidden sm:inline-block h-3.5 sm:h-4 w-10 sm:w-12 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20" />
              <Skeleton className="inline-block sm:hidden h-3 w-10 rounded-full" />
            </div>
          </div>
        </div>

        <Skeleton className="h-4.5 sm:h-6 w-14 sm:w-28 rounded-full shrink-0 self-start sm:self-center" />
      </div>

      <div className="space-y-2 sm:space-y-2.5 py-2.5 sm:py-3.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 sm:size-4 rounded shrink-0" />
            <Skeleton className="h-3 sm:h-3.5 w-20 sm:w-24" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 sm:size-4 rounded shrink-0" />
            <Skeleton className="h-3 sm:h-3.5 w-24 sm:w-28" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 sm:size-4 rounded shrink-0" />
          <Skeleton className="h-3 sm:h-3.5 w-36 sm:w-48" />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3 border-t border-hairline flex items-center justify-between gap-2">
        <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20" />
        <Skeleton className="h-7.5 sm:h-9 w-20 sm:w-24 rounded-lg sm:rounded-xl" />
      </div>
    </div>
  );
};

export default BookingCardSkeleton;
