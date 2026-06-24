import React from "react";
import { Users, Briefcase, CalendarCheck, ShieldAlert, CheckCircle, TrendingUp } from "lucide-react";
import type { PlatformStats as PlatformStatsType } from "@/types";
import { Skeleton } from "@/Components/UI/skeleton";

interface PlatformStatsProps {
  stats: PlatformStatsType | null;
  isLoading?: boolean;
}

export const PlatformStats: React.FC<PlatformStatsProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-hairline bg-card p-4 shadow-xs">
            <Skeleton className="size-8 rounded-xl mb-3" />
            <Skeleton className="h-7 w-12 rounded-md mb-1.5" />
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Providers",
      value: stats.totalProviders ?? 0,
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers ?? 0,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings ?? 0,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      title: "Completed Jobs",
      value: stats.completedBookings ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications ?? 0,
      icon: ShieldAlert,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      highlight: (stats.pendingVerifications ?? 0) > 0,
    },
    {
      title: "Registered Users",
      value: stats.totalUsers ?? 0,
      icon: CalendarCheck,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl border bg-card p-4 shadow-xs transition-all hover:shadow-sm flex flex-col justify-between ${
              item.highlight
                ? "border-amber-300 ring-1 ring-amber-300/40"
                : "border-hairline"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`size-8 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                <Icon className="size-4" />
              </div>
              {item.highlight && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50">
                  Review
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink tabular-nums">
                {(item.value ?? 0).toLocaleString()}
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 leading-snug">
                {item.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlatformStats;
