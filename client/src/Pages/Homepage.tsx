import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  CalendarX2,
  ArrowRight,
} from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { Button } from "@/Components/UI/button";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/utils/categoryIcons";

export const Homepage: React.FC = () => {
  const { categories } = useCategories();
  const popularCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />

      <main className="grow flex flex-col">
        {/* HERO SECTION */}
        <section className="px-3 sm:px-6 py-8 md:py-20 lg:px-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6 text-left">
              <div className="inline-flex items-center gap-1.5 bg-surface-soft border border-hairline px-2.5 sm:px-3 py-1 rounded-full shadow-2xs max-w-full">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[10.5px] sm:text-[11px] font-bold tracking-tight text-ink">
                  Objective Trust Scores (0–100) <span className="hidden sm:inline">• Anti-Gaming Architecture</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink leading-[1.18]">
                Verified Behavior <br />
                <span className="text-primary">Over Fake Star Reviews.</span>
              </h1>

              <p className="text-sm md:text-base text-body leading-relaxed max-w-xl">
                SureService ranks electricians, plumbers, cleaners, and tutors across Ethiopia through independently verified performance. Only paying clients can confirm job completion, and provider cancellations trigger automated score penalties.
              </p>

              <div className="flex flex-nowrap items-center gap-1 min-[380px]:gap-1.5 sm:gap-3.5 pt-1 w-full max-w-full">
                <Button
                  asChild
                  className="rounded-full px-2 min-[380px]:px-2.5 sm:px-6 font-bold text-[10px] min-[380px]:text-[10.5px] sm:text-xs h-8.5 min-[380px]:h-9 sm:h-11.5 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer shrink-0"
                >
                  <Link to="/marketplace" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    <span>Browse <span className="hidden sm:inline">Verified </span>Providers</span>
                    <ArrowRight className="size-3 sm:size-4 shrink-0" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full px-2 min-[380px]:px-2.5 sm:px-5.5 font-semibold text-[10px] min-[380px]:text-[10.5px] sm:text-xs h-8.5 min-[380px]:h-9 sm:h-11.5 cursor-pointer shrink-0"
                >
                  <Link to="/about" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    <ShieldCheck className="size-3 sm:size-4 shrink-0" />
                    <span>How Trust Score Works</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* HERO PREVIEW CARD */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="w-full max-w-md rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 shadow-xl space-y-3.5 sm:space-y-4 text-left">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-hairline">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img
                      src="/avater_1.jpg"
                      alt="Abebe Kebede"
                      className="size-10 sm:size-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = "/default-avatar.jpg";
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-ink truncate">Abebe Kebede</h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground truncate">Master Electrician • Bole, Addis</p>
                    </div>
                  </div>
                  <TrustScoreBadge score={90} size="sm" className="shrink-0" />
                </div>

                <div className="rounded-2xl bg-surface-soft/80 border border-hairline p-2.5 sm:p-4 space-y-2 sm:space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2 text-ink font-semibold">
                    <span className="flex items-center gap-1.5 min-w-0 text-[11px] sm:text-xs text-body">
                      <ShieldCheck className="size-3.5 sm:size-4 text-primary shrink-0" />
                      <span>Trade License</span>
                    </span>
                    <span className="text-primary bg-primary/10 border border-primary/20 w-16 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold text-center shrink-0">Verified</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-ink font-semibold">
                    <span className="flex items-center gap-1.5 min-w-0 text-[11px] sm:text-xs text-body">
                      <CheckCircle2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                      <span>Completed Jobs</span>
                    </span>
                    <span className="text-ink font-bold text-[10.5px] sm:text-[11px] w-16 text-center shrink-0">12</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-ink font-semibold">
                    <span className="flex items-center gap-1.5 min-w-0 text-[11px] sm:text-xs text-body">
                      <Users className="size-3.5 sm:size-4 text-primary shrink-0" />
                      <span>Repeat Clients</span>
                    </span>
                    <span className="text-ink font-bold text-[10.5px] sm:text-[11px] w-16 text-center shrink-0">4</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-ink font-semibold">
                    <span className="flex items-center gap-1.5 min-w-0 text-[11px] sm:text-xs text-body">
                      <CalendarX2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                      <span>Cancellation Rate</span>
                    </span>
                    <span className="text-ink font-bold text-[10.5px] sm:text-[11px] w-16 text-center shrink-0">0%</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-surface-soft/80 border border-hairline text-xs text-ink">
                  <p className="font-bold flex items-center gap-1.5 text-[11px] sm:text-xs text-ink">
                    <CheckCircle2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                    Independent Ratings
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] mt-0.5 text-muted-foreground leading-snug">
                    Abebe cannot rate himself or close his own jobs. Points for completed jobs come only from verified customers who hired him.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="bg-surface-soft/60 border-y border-hairline py-12 md:py-16 px-4 sm:px-6 lg:px-20">
          <div className="max-w-7xl mx-auto text-left space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Explore Trades in Ethiopia
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mt-1">
                  Find Verified Professionals in Your City
                </h2>
              </div>
              <Link to="/marketplace" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>View all categories</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {popularCategories.map((cat, idx) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug || idx}
                    to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                    className="group rounded-2xl border border-hairline bg-card p-4 text-card-foreground shadow-xs transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${cat.color || "text-blue-500 bg-blue-50 dark:bg-blue-950/40"}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink group-hover:text-primary transition-colors line-clamp-1">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {cat.providerCount ? `${cat.providerCount} Providers` : "Verified Providers"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-background border-t border-hairline py-6 sm:py-8 px-3.5 sm:px-6 lg:px-20 text-xs text-muted-foreground font-medium select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span className="text-[11px] sm:text-xs">&copy; {new Date().getFullYear()} SureService</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-xs">
            <Link to="/marketplace" className="hover:text-ink transition-colors whitespace-nowrap">Marketplace</Link>
            <Link to="/about" className="hover:text-ink transition-colors whitespace-nowrap">Trust Model</Link>
            <Link to="/login" className="hover:text-ink transition-colors whitespace-nowrap">Sign In</Link>
            <Link to="/signup" className="hover:text-ink transition-colors font-semibold text-primary whitespace-nowrap">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
