import React from "react";
import { Link } from "react-router-dom";
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg sm:rounded-xl border border-hairline bg-card p-2.5 sm:p-3.5 shadow-xs flex flex-col justify-between min-h-[5.25rem] sm:min-h-[6rem]">
            <div className="flex items-start justify-between gap-1.5 mb-2">
              <Skeleton className="h-3.5 w-16 sm:w-20 rounded" />
              <Skeleton className="size-6 sm:size-7.5 rounded-lg shrink-0" />
            </div>
            <Skeleton className="h-6 sm:h-7 w-12 sm:w-16 rounded-md" />
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
      href: "/admin/users?role=provider",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers ?? 0,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      href: "/admin/users?role=customer",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings ?? 0,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      href: "/admin/users",
    },
    {
      title: "Completed Jobs",
      value: stats.completedBookings ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      href: "/admin/users?role=provider&sortBy=completedJobs",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications ?? 0,
      icon: ShieldAlert,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      highlight: (stats.pendingVerifications ?? 0) > 0,
      href: "/admin/verifications",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers ?? 0,
      icon: CalendarCheck,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/40",
      href: "/admin/users?role=all",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-3.5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            to={item.href}
            className={`group rounded-lg sm:rounded-xl border bg-card p-2.5 sm:p-3.5 shadow-xs transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.99] flex flex-col justify-between cursor-pointer min-w-0 min-h-[5.25rem] sm:min-h-[6rem] ${
              item.highlight
                ? "border-amber-300 ring-1 ring-amber-300/40 hover:border-amber-400"
                : "border-hairline hover:border-primary/40"
            }`}
          >
            <div className="flex items-start justify-between gap-1.5 mb-2">
              <span className="text-[10.5px] sm:text-xs font-semibold text-muted-foreground leading-tight line-clamp-2">
                {item.title}
              </span>
              <div className={`size-6 sm:size-7.5 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.bg} ${item.color}`}>
                <Icon className="size-3 sm:size-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1.5 min-w-0">
              <p className="text-xl sm:text-2xl font-black text-ink tabular-nums group-hover:text-primary transition-colors truncate">
                {(item.value ?? 0).toLocaleString()}
              </p>
              {item.highlight && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50 shrink-0">
                  Review
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PlatformStats;
