import { cn } from "@/lib/utils";
import { getTrustTier } from "@/utils/trustTier";

interface TrustScoreBadgeProps {
  score?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
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
    xs: "px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] gap-0.5 sm:gap-1",
    sm: "px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs gap-1 sm:gap-1.5",
    md: "px-2 sm:px-3 py-0.5 sm:py-1.5 text-[11px] sm:text-xs font-bold gap-1 sm:gap-2",
    lg: "px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold gap-1.5 sm:gap-2.5",
  };

  const iconSizes = {
    xs: "size-2.5 sm:size-3",
    sm: "size-2.5 sm:size-3.5",
    md: "size-3.5 sm:size-4",
    lg: "size-4 sm:size-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs font-semibold select-none transition-all shrink-0 whitespace-nowrap",
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
        <span className="text-[9px] sm:text-[10px] opacity-75 font-normal ml-0.5">/100</span>
      </span>
      {showLabel && (
        <span className="hidden sm:inline-flex items-center gap-1">
          <span className="opacity-40 font-light">•</span>
          <span className="text-[11px] tracking-normal font-medium">{tierInfo.tier}</span>
        </span>
      )}
    </div>
  );
};

export default TrustScoreBadge;
