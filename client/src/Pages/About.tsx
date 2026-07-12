import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Users,
  AlertTriangle,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import { Button } from "@/Components/UI/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const About: React.FC = () => {
  useDocumentTitle("SureService | Trust Architecture & Philosophy");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 py-5 sm:py-12 md:py-16 lg:px-20 max-w-5xl mx-auto w-full space-y-6 sm:space-y-10 text-left">
        {/* HERO SECTION */}
        <div className="text-center space-y-2 sm:space-y-3.5 max-w-2xl mx-auto px-1">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold">
            <ShieldCheck className="size-3.5 sm:size-4 shrink-0" />
            <span>Anti-Gaming Integrity Framework</span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-snug sm:leading-tight text-balance">
            Why Star Ratings Fail & How Trust Score Fixes It
          </h1>
          <p className="text-[11.5px] sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto text-balance">
            Traditional 5-star ratings suffer from review blackmail, fake upvotes, and lack of accountability. SureService replaces subjective stars with a behavior-based, anti-collusion <strong className="text-ink font-semibold">Trust Score (0–100)</strong> built on explainable evaluation pillars.
          </p>
        </div>

        {/* 5 EVALUATION PILLARS */}
        <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 md:p-8 shadow-sm space-y-3.5 sm:space-y-6">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-hairline">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-ink flex items-center gap-2">
              <Award className="size-4 sm:size-5 text-primary shrink-0" />
              <span>The 5 Evaluation Pillars</span>
            </h2>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
              Anti-Collusion
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-hairline bg-surface-soft/40 space-y-1.5 sm:space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-ink flex items-start gap-1.5 min-w-0">
                  <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">1. Confirmed Jobs</span>
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">~35% Weight</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Scored exclusively upon client confirmation with non-linear diminishing returns to prevent rapid collusion farming while rewarding steady track records.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-hairline bg-surface-soft/40 space-y-1.5 sm:space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-ink flex items-start gap-1.5 min-w-0">
                  <ShieldCheck className="size-3.5 sm:size-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">2. ID & Trade License</span>
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-950/60 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">~25% Weight</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Audited government ID (Kebele ID, National ID / Fayda) or municipal Ethiopian trade license verified by platform operators.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-hairline bg-surface-soft/40 space-y-1.5 sm:space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-ink flex items-start gap-1.5 min-w-0">
                  <Users className="size-3.5 sm:size-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">3. Repeat Clients</span>
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-teal-700 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-950/60 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">~15% Weight</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Milestone bonuses earned when distinct clients hire and confirm repeat service, signaling true long-term satisfaction.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-hairline bg-surface-soft/40 space-y-1.5 sm:space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-ink flex items-start gap-1.5 min-w-0">
                  <UserCheck className="size-3.5 sm:size-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">4. Profile & Coverage</span>
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100/60 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">~15% Weight</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Complete profile with verified phone, practical experience, transparent hourly rates, trade skills, and accurate Ethiopian city/sub-city coverage.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 space-y-1.5 sm:space-y-2 md:col-span-2">
              <div className="flex items-start justify-between gap-2 text-rose-800 dark:text-rose-300">
                <span className="font-bold text-xs sm:text-sm flex items-start gap-1.5 min-w-0">
                  <AlertTriangle className="size-3.5 sm:size-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">5. Reliability Deductions</span>
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/70 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">Penalty</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Unfulfilled accepted jobs or provider no-shows trigger automated score deductions to protect marketplace reliability. Customer-initiated cancellations never penalize the provider.
              </p>
            </div>
          </div>
        </div>

        {/* 4 ANTI-GAMING PILLARS */}
        <div className="space-y-3.5 sm:space-y-6">
          <h2 className="text-sm sm:text-lg md:text-xl font-extrabold tracking-tight text-ink">
            The 4 Anti-Gaming Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-hairline bg-card shadow-xs space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-6 sm:size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-ink leading-snug">Customer-Only Job Confirmation</h3>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Providers cannot mark their own jobs complete. Only the customer who booked the service can confirm completion.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-hairline bg-card shadow-xs space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-6 sm:size-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-ink leading-snug">Gated Direct Contact Information</h3>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                To eliminate spam and guarantee verified track records, phone numbers and emails are hidden until a booking request is accepted by the provider.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-hairline bg-card shadow-xs space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-6 sm:size-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-ink leading-snug">Human-Audited Verification Queue</h3>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                Admin operators review government ID scans and municipal trade licenses in a dedicated verification cockpit before granting the verified shield and +25 Trust points.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-hairline bg-card shadow-xs space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-6 sm:size-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-ink leading-snug">Separation of Qualitative Reviews</h3>
              </div>
              <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                1–5 star reviews provide personal stories and craftsmanship feedback for the community, but are strictly excluded from the algorithmic Trust Score calculation to prevent bribery or blackmail.
              </p>
            </div>
          </div>
        </div>

        {/* CTA CARD */}
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-surface-soft border border-hairline text-center space-y-2.5 sm:space-y-4">
          <h3 className="text-sm sm:text-lg md:text-xl font-extrabold text-ink text-balance leading-snug">
            Ready to Experience True Service Trust?
          </h3>
          <p className="text-[11.5px] sm:text-sm text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
            Browse top-rated electricians, plumbers, cleaners, and tutors in Addis Ababa and across Ethiopia.
          </p>
          <div className="pt-1 sm:pt-2 flex justify-center">
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full text-xs font-bold px-6 sm:px-8 h-10 sm:h-11 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer flex items-center justify-center gap-2">
                <span>Explore Marketplace</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;