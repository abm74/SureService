import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Users,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { Button } from "@/Components/UI/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const About: React.FC = () => {
  useDocumentTitle("SureService | Trust Architecture & Philosophy");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />

      <main className="grow px-6 py-12 md:py-16 lg:px-20 max-w-5xl mx-auto w-full space-y-12 text-left">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold">
            <ShieldCheck className="size-4" />
            <span>Anti-Gaming Integrity Framework</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
            Why Star Ratings Fail & How Trust Score Fixes It
          </h1>
          <p className="text-sm md:text-base text-body leading-relaxed">
            Traditional 5-star ratings suffer from review blackmail, fake upvotes, and lack of accountability. SureService replaces subjective stars with a behavior-based, anti-collusion <strong>Trust Score (0–100)</strong> built on explainable evaluation pillars.
          </p>
        </div>

        {/* MATHEMATICAL FORMULA CARD */}
        <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-hairline flex-wrap gap-2">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <span>The 5 Evaluation Pillars</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
              Explainable & Anti-Collusion
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-hairline bg-surface-soft/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  1. Verified Completed Jobs
                </span>
                <span className="text-xs font-extrabold text-emerald-700">~35% Weight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scored exclusively upon client confirmation with non-linear diminishing returns to prevent rapid collusion farming while rewarding steady track records.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-hairline bg-surface-soft/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-blue-600" />
                  2. Official ID & License Verification
                </span>
                <span className="text-xs font-extrabold text-blue-700">~25% Weight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Audited government ID (Kebele ID, National ID / Fayda) or municipal Ethiopian trade license verified by platform operators.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-hairline bg-surface-soft/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                  <Users className="size-4 text-teal-600" />
                  3. Client Retention & Repeat Service
                </span>
                <span className="text-xs font-extrabold text-teal-700">~15% Weight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Milestone bonuses earned when distinct clients hire and confirm repeat service, signaling true long-term satisfaction.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-hairline bg-surface-soft/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                  <UserCheck className="size-4 text-indigo-600" />
                  4. Profile Completeness & Location
                </span>
                <span className="text-xs font-extrabold text-indigo-700">~15% Weight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete profile with verified phone, practical experience, transparent hourly rates, trade skills, and accurate Ethiopian city/sub-city coverage.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between text-rose-800 dark:text-rose-300">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-rose-600" />
                  5. Reliability Deductions
                </span>
                <span className="text-xs font-extrabold text-rose-700">Automated Penalty</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unfulfilled accepted jobs or provider no-shows trigger automated score deductions to protect marketplace reliability. Customer-initiated cancellations never penalize the provider.
              </p>
            </div>
          </div>
        </div>

        {/* 4 CORE PILLARS */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            The 4 Anti-Gaming Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-hairline bg-card shadow-xs space-y-2.5">
              <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-ink">Customer-Only Completion Authority</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Providers cannot complete their own jobs or manufacture fake completions. Only the authentic customer account who submitted the request can click "Mark Job Complete".
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-hairline bg-card shadow-xs space-y-2.5">
              <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-ink">Gated Direct Contact Information</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To eliminate spam and guarantee verified track records, phone numbers and emails are hidden until a booking request is accepted by the provider.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-hairline bg-card shadow-xs space-y-2.5">
              <div className="size-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-ink">Human-Audited Verification Queue</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Admin operators review government ID scans and municipal trade licenses in a dedicated verification cockpit before granting the verified shield and +25 Trust points.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-hairline bg-card shadow-xs space-y-2.5">
              <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-ink">Separation of Qualitative Reviews</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                1–5 star reviews provide personal stories and craftsmanship feedback for the community, but are strictly excluded from the algorithmic Trust Score calculation to prevent bribery or blackmail.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-surface-soft border border-hairline text-center space-y-4">
          <h3 className="text-xl font-bold text-ink">Ready to Experience True Service Trust?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Browse top-rated electricians, plumbers, cleaners, and tutors in Addis Ababa and across Ethiopia.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/marketplace">
              <Button size="lg" className="rounded-full text-xs font-bold px-7 h-11 bg-primary text-white shadow-xs">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;