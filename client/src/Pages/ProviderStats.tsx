import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Users,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import TrustScoreGauge from "@/Components/Providers/TrustScoreGauge";
import VerificationBadge from "@/Components/Providers/VerificationBadge";
import { useAuth } from "@/store/Auth/AuthContext";
import { getTrustTier } from "@/utils/trustTier";
import { Button } from "@/Components/UI/button";

export const ProviderStats: React.FC = () => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const score = user?.trustScore ?? 0;
  const tier = getTrustTier(score);
  const completedJobsCount = user?.completedJobsCount ?? 0;
  const repeatCustomerCount = user?.repeatCustomerCount ?? 0;
  const providerCancelledCount = user?.providerCancelledCount ?? 0;
  const isVerified = user?.verificationStatus === "approved";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <Activity className="size-3.5" />
              <span>Trust Standing & Analytics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              Trust Standing & Performance
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review your verified track record, algorithmic factor breakdown, and actionable coaching tips.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <VerificationBadge status={user?.verificationStatus} size="md" />
            <Link to="/provider-dashboard">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-9 px-4 border-hairline hover:border-ink cursor-pointer font-bold flex items-center gap-1.5"
              >
                <Calendar className="size-3.5 text-primary" />
                <span>Go to Bookings</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Overall Trust Score</span>
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">{score}</span>
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold border ${tier.bgColor} ${tier.borderColor} ${tier.textColor}`}>
                {tier.tier} Tier ({tier.label})
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Confirmed Deliveries</span>
              <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">{completedJobsCount}</span>
              <span className="text-xs font-bold text-muted-foreground">Jobs</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              {completedJobsCount > 0 ? "100% Client Confirmed" : "Completing initial jobs"}
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Client Retention</span>
              <div className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">{repeatCustomerCount}</span>
              <span className="text-xs font-bold text-muted-foreground">Repeat Clients</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              {repeatCustomerCount > 0 ? "Repeat bonus applied" : "Awaiting returning clients"}
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Fulfillment Reliability</span>
              <div className={`size-8 rounded-xl flex items-center justify-center ${
                providerCancelledCount === 0
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
              }`}>
                {providerCancelledCount === 0 ? <ShieldCheck className="size-4" /> : <AlertTriangle className="size-4" />}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">{providerCancelledCount}</span>
              <span className="text-xs font-bold text-muted-foreground">Cancellations</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              {providerCancelledCount === 0 ? "Zero cancellations recorded" : "-10 pts penalty per incident"}
            </p>
          </div>
        </div>

        {!isVerified && (
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-bold">Unlock +25 Trust Score Boost with ID Verification</p>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-0.5">
                  Submit your Kebele ID, National ID (Fayda), or Trade License to gain our verified marketplace shield.
                </p>
              </div>
            </div>
            <Link to="/provider-dashboard?tab=verification" className="shrink-0">
              <Button
                size="sm"
                className="rounded-xl text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
              >
                Submit Documents
              </Button>
            </Link>
          </div>
        )}

        <TrustScoreGauge
          score={user?.trustScore ?? 0}
          breakdown={user?.trustBreakdown}
          completedJobsCount={user?.completedJobsCount}
          repeatCustomerCount={user?.repeatCustomerCount}
          providerCancelledCount={user?.providerCancelledCount}
          verificationStatus={user?.verificationStatus}
          isPublicView={false}
        />
      </main>
    </div>
  );
};

export default ProviderStats;
