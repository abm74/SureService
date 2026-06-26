import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  UserCheck,
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
        <section className="px-6 py-12 md:py-20 lg:px-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-1.5 bg-surface-soft border border-hairline px-3 py-1 rounded-full shadow-2xs">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold tracking-tight text-ink">
                  Objective Trust Scores (0–100) • Anti-Gaming Architecture
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink leading-[1.18]">
                Verified Behavior <br />
                <span className="text-primary">Over Fake Star Reviews.</span>
              </h1>

              <p className="text-sm md:text-base text-body leading-relaxed max-w-xl">
                SureService ranks electricians, plumbers, cleaners, and tutors across Ethiopia through independently verified performance. Only paying clients can confirm job completion, and provider cancellations trigger automated score penalties.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full">
                <Link to="/marketplace">
                  <Button
                    size="lg"
                    className="rounded-full px-7 font-bold text-xs h-12 bg-primary hover:bg-brand-primary-active text-white shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Verified Providers</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-6 font-semibold text-xs h-12 border-hairline hover:border-ink cursor-pointer"
                  >
                    How Trust Score Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* HERO PREVIEW CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-3xl border border-hairline bg-card p-6 shadow-xl space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-hairline">
                  <div className="flex items-center gap-3">
                    <img
                      src="/default-avatar.jpg"
                      alt="Abebe Kebede"
                      className="size-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-ink">Abebe Kebede</h3>
                      <p className="text-xs text-muted-foreground">Master Electrician • Addis Ababa (Bole)</p>
                    </div>
                  </div>
                  <TrustScoreBadge score={96} size="sm" />
                </div>

                <div className="rounded-2xl bg-surface-soft/80 border border-hairline p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      Admin-Audited Trade License
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md text-[11px] font-bold">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-ink font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-blue-600" />
                      12 Client-Confirmed Jobs
                    </span>
                    <span className="text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950 px-2 py-0.5 rounded-md text-[11px] font-bold">100% Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between text-ink font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-4 text-teal-600" />
                      Repeat Client Track Record
                    </span>
                    <span className="text-teal-700 dark:text-teal-400 bg-teal-100/70 dark:bg-teal-950 px-2 py-0.5 rounded-md text-[11px] font-bold">High Retention</span>
                  </div>
                  <div className="flex items-center justify-between text-ink font-semibold">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="size-4 text-indigo-600" />
                      Service Area & Identity
                    </span>
                    <span className="text-indigo-700 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950 px-2 py-0.5 rounded-md text-[11px] font-bold">Bole, Addis</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Independent Ratings
                  </p>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    Abebe cannot rate himself or close his own jobs. Points for completed jobs come only from verified customers who hired him.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="bg-surface-soft/60 border-y border-hairline py-16 px-6 lg:px-20">
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
      <footer className="bg-background border-t border-hairline py-8 px-6 lg:px-20 text-xs text-muted-foreground font-medium select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>&copy; {new Date().getFullYear()} SureService</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/marketplace" className="hover:text-ink transition-colors">Marketplace</Link>
            <Link to="/about" className="hover:text-ink transition-colors">Trust Model</Link>
            <Link to="/login" className="hover:text-ink transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-ink transition-colors font-semibold text-primary">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
