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
