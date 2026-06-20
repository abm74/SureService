import React from "react";
import { ShieldCheck, Award, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustScoreBadgeProps {
  score?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function getTrustTier(score: number = 0) {
  if (score >= 90) {
    return {
      tier: "Top",
      label: "Top",
      variant: "top",
      textColor: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      barColor: "bg-emerald-500",
      icon: ShieldCheck,
    };
  }
  if (score >= 75) {
    return {
      tier: "High",
      label: "High",
      variant: "high",
      textColor: "text-blue-700 dark:text-blue-300",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      borderColor: "border-blue-200 dark:border-blue-800",
      barColor: "bg-blue-500",
      icon: Award,
    };
  }
  if (score >= 50) {
    return {
      tier: "Standard",
      label: "Standard",
      variant: "standard",
      textColor: "text-teal-700 dark:text-teal-300",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
      borderColor: "border-teal-200 dark:border-teal-800",
      barColor: "bg-teal-500",
      icon: CheckCircle,
    };
  }
  return {
    tier: "New",
    label: "New",
    variant: "new",
    textColor: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
    borderColor: "border-slate-200 dark:border-slate-800",
    barColor: "bg-slate-400",
    icon: Sparkles,
  };
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  score = 0,
  size = "md",
  showLabel = true,
  showIcon = true,
  className,
}) => {
  const tierInfo = getTrustTier(score);
  const Icon = tierInfo.icon;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[11px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs font-bold gap-2",
    lg: "px-4 py-2 text-sm font-bold gap-2.5",
  };

  const iconSizes = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs font-semibold select-none transition-all",
        tierInfo.bgColor,
        tierInfo.borderColor,
        tierInfo.textColor,
        sizeClasses[size],
        className
      )}
      title={`Trust Score: ${score}/100 (${tierInfo.label})`}
    >
      {showIcon && <Icon className={cn("shrink-0", iconSizes[size])} />}
      <span className="tabular-nums tracking-tight">
        {score}
        <span className="text-[10px] opacity-75 font-normal ml-0.5">/100</span>
      </span>
      {showLabel && (
        <>
          <span className="opacity-40 font-light">•</span>
          <span className="text-[11px] tracking-normal font-medium">{tierInfo.tier}</span>
        </>
      )}
    </div>
  );
};

export default TrustScoreBadge;
