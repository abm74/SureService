import React from "react";
import { ShieldCheck, Clock, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

interface VerificationBadgeProps {
  status?: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status = "unverified",
  size = "md",
  showText = true,
  className,
}) => {
  if (status === "approved") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 px-2.5 py-0.5 font-medium select-none dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60",
          size === "sm" && "text-[11px] px-2 py-0.5 gap-1",
          size === "lg" && "text-xs px-3 py-1 gap-2",
          className
        )}
        title="Admin-Verified Identity & Credentials (+25 Trust Points)"
      >
        <ShieldCheck className={cn("size-3.5 text-emerald-600 dark:text-emerald-400", size === "lg" && "size-4")} />
        {showText && <span>Verified Provider</span>}
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 text-amber-800 border border-amber-300/80 px-2.5 py-0.5 font-medium select-none dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60",
          size === "sm" && "text-[11px] px-2 py-0.5 gap-1",
          size === "lg" && "text-xs px-3 py-1 gap-2",
          className
        )}
        title="Identity Verification Pending Admin Review"
      >
        <Clock className={cn("size-3.5 text-amber-600 dark:text-amber-400 animate-pulse", size === "lg" && "size-4")} />
        {showText && <span>Verification Pending</span>}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-rose-100/90 text-rose-800 border border-rose-300/80 px-2.5 py-0.5 font-medium select-none dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700/60",
          size === "sm" && "text-[11px] px-2 py-0.5 gap-1",
          size === "lg" && "text-xs px-3 py-1 gap-2",
          className
        )}
        title="Document Verification Rejected - Needs Resubmission"
      >
        <ShieldAlert className={cn("size-3.5 text-rose-600 dark:text-rose-400", size === "lg" && "size-4")} />
        {showText && <span>Verification Rejected</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-0.5 text-xs font-medium select-none",
        size === "sm" && "text-[11px] px-2 py-0.5 gap-1",
        size === "lg" && "text-xs px-3 py-1 gap-2",
        className
      )}
      title="Unverified Provider"
    >
      <Shield className={cn("size-3.5 opacity-60", size === "lg" && "size-4")} />
      {showText && <span>Unverified</span>}
    </div>
  );
};

export default VerificationBadge;
