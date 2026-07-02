import React from "react";
import { ShieldCheck, UserCheck, CheckCircle2, Users, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustBreakdown } from "@/types";
import { getTrustTier } from "@/utils/trustTier";

interface TrustScoreGaugeProps {
  score?: number;
  breakdown?: TrustBreakdown;
  completedJobsCount?: number;
  repeatCustomerCount?: number;
  providerCancelledCount?: number;
  verificationStatus?: string;
  className?: string;
  showBreakdown?: boolean;
  compact?: boolean;
  isPublicView?: boolean;
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score = 0,
  breakdown = {
    profileScore: 0,
    verificationScore: 0,
    completedJobsScore: 0,
    repeatBonusScore: 0,
    cancellationPenalty: 0,
  },
  completedJobsCount = 0,
  repeatCustomerCount = 0,
  providerCancelledCount = 0,
  verificationStatus = "unverified",
  className,
  showBreakdown = true,
  compact = false,
  isPublicView = false,
}) => {
  const tier = getTrustTier(score);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const coachingFactors = [
    {
      title: "Confirmed Service Delivery",
      impact: "High Impact",
      status: breakdown.completedJobsScore > 0 ? "Active Track Record" : "Building Initial Traction",
      icon: CheckCircle2,
      color: "bg-emerald-500",
      textColor: "text-emerald-700 dark:text-emerald-400",
      actionText: "Deliver quality service. Customer confirmations build your primary trust standing.",
    },
    {
      title: "Verified Credentials",
      impact: "High Impact",
      status: verificationStatus === "approved" || breakdown.verificationScore > 0 ? "Audited & Approved" : "Not Verified",
      icon: ShieldCheck,
      color: "bg-blue-500",
      textColor: "text-blue-700 dark:text-blue-400",
      actionText: "Submit your Kebele ID, National ID (Fayda), or Trade License to gain our verified marketplace shield.",
    },
    {
      title: "Client Retention",
      impact: "Medium Impact",
      status: breakdown.repeatBonusScore > 0 ? "Repeat Clients Active" : "First-Time Bookings",
      icon: Users,
      color: "bg-teal-500",
      textColor: "text-teal-700 dark:text-teal-400",
      actionText: "Satisfied returning clients who rebook strengthen your standing over time.",
    },
    {
      title: "Profile Completeness",
      impact: "Medium Impact",
      status: breakdown.profileScore >= 12 ? "Complete Profile" : "Incomplete Details",
      icon: UserCheck,
      color: "bg-indigo-500",
      textColor: "text-indigo-700 dark:text-indigo-400",
      actionText: "Maintain an accurate bio, verified phone number, transparent rates, and city coverage.",
    },
    {
      title: "Reliability Standing",
      impact: "Critical Impact",
      status: breakdown.cancellationPenalty > 0 ? "Penalty Deductions Active" : "Flawless Standing",
      isPenalty: true,
      icon: AlertTriangle,
      color: "bg-rose-500",
      textColor: "text-rose-700 dark:text-rose-400",
      actionText: "Fulfill all accepted jobs. Provider-initiated cancellations trigger automated standing deductions.",
    },
  ];

  const publicCredentials = [
    {
      label: "Service Delivery",
      value: completedJobsCount > 0 ? `${completedJobsCount} Confirmed Completed Job${completedJobsCount === 1 ? "" : "s"}` : "Recently Onboarded",
      status: completedJobsCount > 0 ? "100% Confirmed" : "Starting History",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      label: "ID & Trade License",
      value: verificationStatus === "approved" ? "Government ID / Trade License" : "Pending Document Submission",
      status: verificationStatus === "approved" ? "Admin Audited" : "Unverified",
      icon: ShieldCheck,
      color: verificationStatus === "approved" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground",
      badgeColor: verificationStatus === "approved" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300" : "bg-muted text-muted-foreground border-border",
    },
    {
      label: "Client Retention",
      value: repeatCustomerCount > 0 ? `${repeatCustomerCount} Unique Returning Client${repeatCustomerCount === 1 ? "" : "s"}` : "Accepting First Repeat Clients",
      status: repeatCustomerCount > 0 ? "Repeat Verified" : "New Clients",
      icon: Users,
      color: "text-teal-600 dark:text-teal-400",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
    },
    {
      label: "Fulfillment Record",
      value: providerCancelledCount === 0 ? "Zero Provider Cancellations" : `${providerCancelledCount} Cancellation Incident${providerCancelledCount === 1 ? "" : "s"}`,
      status: providerCancelledCount === 0 ? "100% Reliable" : "Deduction Applied",
      icon: providerCancelledCount === 0 ? ShieldCheck : AlertTriangle,
      color: providerCancelledCount === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      badgeColor: providerCancelledCount === 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    },
  ];

  return (
    <div className={cn("rounded-2xl sm:rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 shadow-xs min-w-0 w-full overflow-hidden", className)}>
      <div className={cn("flex items-center gap-3.5 sm:gap-6", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <div className="relative flex size-24 sm:size-32 md:size-36 shrink-0 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-muted/60"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={cn("transition-all duration-1000 ease-out", tier.textColor)}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-ink tabular-nums">{score}</span>
            <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {tier.tier} Tier
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 sm:space-y-2 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm md:text-base font-bold text-ink">
              {isPublicView ? "Verified Trust Standing" : "Trust Standing & Factor Coaching"}
            </h4>
            <span className={cn("rounded-full px-2 sm:px-2.5 py-0.5 text-[10.5px] sm:text-xs font-semibold border", tier.bgColor, tier.borderColor, tier.textColor)}>
              {tier.label}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            {isPublicView
              ? "Calculated strictly from client-confirmed service deliveries and audited credentials. Providers cannot self-rate or fabricate history."
              : "Your Trust Score is evaluated from authentic client confirmations, audited credentials, and fulfillment reliability."}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
            {verificationStatus === "approved" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                <ShieldCheck className="size-3" /> ID Verified
              </span>
            )}
            {completedJobsCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3" /> {completedJobsCount} Confirmed
              </span>
            )}
            {providerCancelledCount === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-soft border border-hairline px-2 py-0.5 text-[10.5px] sm:text-[11px] font-medium text-muted-foreground">
                Zero Cancellations
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2 py-0.5 text-[10.5px] sm:text-[11px] font-medium text-rose-700 dark:text-rose-300">
                {providerCancelledCount} Cancellation{providerCancelledCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>

      {showBreakdown && (
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 border-t border-hairline pt-3.5 sm:pt-5">
          {isPublicView ? (
            <div className="space-y-2.5 sm:space-y-3 min-w-0 w-full">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <h5 className="text-[9.5px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <span className="hidden sm:inline">Verified </span>Performance Signals
                </h5>
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                  <Info className="size-3 shrink-0 text-primary" />
                  <span><span className="hidden sm:inline">Independent </span>Audit</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 min-w-0 w-full">
                {publicCredentials.map((cred, idx) => {
                  const Icon = cred.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl sm:rounded-2xl border border-hairline/80 bg-surface-soft/40 p-2.5 sm:p-3 flex flex-col justify-between gap-1.5 sm:gap-2 transition-all hover:bg-surface-soft min-w-0 w-full overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                          <div className={cn("size-5.5 sm:size-7 rounded-lg sm:rounded-xl flex items-center justify-center bg-background border border-hairline shrink-0", cred.color)}>
                            <Icon className="size-3 sm:size-3.5 shrink-0" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate min-w-0 block">
                            {cred.label}
                          </span>
                        </div>
                        <span className={cn("rounded-full border px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[10px] font-bold shrink-0 whitespace-nowrap text-right", cred.badgeColor)}>
                          {cred.status}
                        </span>
                      </div>
                      <div className="pl-7 sm:pl-9 text-xs sm:text-[13px] font-bold text-ink tracking-tight break-words min-w-0">
                        {cred.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <h5 className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Trust Factor Audit & Growth Tips
                </h5>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">
                  Private to your dashboard
                </span>
              </div>

              <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-1">
                {coachingFactors.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-hairline/70 bg-surface-soft/40 p-3 sm:p-3.5 transition-colors hover:bg-surface-soft space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn("size-6 rounded-lg flex items-center justify-center bg-background border border-hairline shadow-2xs shrink-0", f.textColor)}>
                            <Icon className="size-3.5" />
                          </div>
                          <span className="text-xs font-bold text-ink truncate">{f.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="rounded-full bg-background border border-hairline px-2 py-0.5 text-[10px] font-bold text-ink">
                            {f.status}
                          </span>
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            f.impact === "Critical Impact"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : f.impact === "High Impact"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                          )}>
                            {f.impact}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-normal pl-8">
                        {f.actionText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrustScoreGauge;
