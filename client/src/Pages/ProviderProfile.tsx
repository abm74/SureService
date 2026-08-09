import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  Phone,
  Mail,
  Calendar,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import { useProvider } from "@/hooks/useProviders";
import { Button } from "@/Components/UI/button";
import { Skeleton } from "@/Components/UI/skeleton";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { TrustScoreGauge } from "@/Components/Providers/TrustScoreGauge";
import { VerificationBadge } from "@/Components/Providers/VerificationBadge";
import { UserAvatar } from "@/Components/UI/UserAvatar";
import { getErrorMessage } from "@/utils/helpers";

export const ProviderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    error,
  } = useProvider(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 text-left">
          <Skeleton className="h-4 w-36 mb-2" />

          <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
              <div className="flex flex-row items-start sm:items-center gap-3.5 sm:gap-5">
                <Skeleton className="size-16 sm:size-22 md:size-28 shrink-0 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-6 sm:h-8 w-36 sm:w-48" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                  <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-soft/80 border border-hairline shrink-0 w-full md:w-56 space-y-2 sm:space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-9 sm:h-11 w-full rounded-xl sm:rounded-2xl" />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-hairline space-y-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl border border-hairline bg-card p-4 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-hairline">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-3.5 w-56" />
                </div>
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 sm:h-24 rounded-xl sm:rounded-2xl" />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
              <div className="rounded-2xl border border-hairline bg-card p-3.5 sm:p-5 shadow-xs space-y-3">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-4 md:px-8 py-16 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-ink">Provider Not Found</h2>
          <p className="text-xs text-muted-foreground">
            {error ? getErrorMessage(error) : "This service provider profile could not be found."}
          </p>
          <Link to="/marketplace">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Back to Marketplace
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const { provider, reviews } = data;
  const locationStr = provider.location
    ? `${provider.location.subCity ? provider.location.subCity + ", " : ""}${provider.location.city || "Ethiopia"}${provider.location.address ? ` (${provider.location.address})` : ""}`
    : "Addis Ababa, Ethiopia";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 text-left min-w-0 overflow-x-hidden">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors mb-1 sm:mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* HERO PROFILE CARD */}
        <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-4 sm:p-6 md:p-8 shadow-sm min-w-0 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
            <div className="flex flex-row items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <UserAvatar
                src={provider.avatar}
                name={provider.name}
                className="size-16 sm:size-22 md:size-28 shrink-0 ring-3 sm:ring-4 ring-hairline shadow-md"
                fallbackClassName="text-lg sm:text-2xl md:text-3xl"
              />

              <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-ink tracking-tight break-words">
                    {provider.name}
                  </h1>
                  <TrustScoreBadge score={provider.trustScore ?? 0} size="md" />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-ink">
                    <Briefcase className="size-3.5 text-primary shrink-0" />
                    <span>{provider.category}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">{locationStr}</span>
                  </span>
                  {provider.experienceYears !== undefined && provider.experienceYears > 0 && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="w-full sm:w-auto text-[11px] sm:text-xs">{provider.experienceYears}+ years experience</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 flex-wrap">
                  <VerificationBadge status={provider.verificationStatus} size="sm" />
                  {provider.reviewCount > 0 && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span>{provider.averageRating.toFixed(1)}</span>
                      <span className="opacity-70 font-normal">({provider.reviewCount})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION CTA BOX */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-soft/80 border border-hairline shrink-0 w-full md:w-auto">
              <div className="text-left md:text-right">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Hourly Rate
                </span>
                <span className="text-lg sm:text-2xl font-extrabold text-ink whitespace-nowrap">
                  {provider.hourlyRate ? `${provider.hourlyRate} ETB` : "Negotiable"}
                  <span className="text-xs font-normal text-muted-foreground">/hr</span>
                </span>
              </div>

              <Link to={`/providers/${provider.id}/book`} className="shrink-0 md:w-full">
                <Button
                  size="sm"
                  className="rounded-xl sm:rounded-2xl text-xs font-bold h-9 sm:h-11 px-3.5 sm:px-6 bg-primary hover:bg-brand-primary-active text-white shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="size-3.5 sm:size-4 shrink-0" />
                  <span>Request Booking</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* BIO & SKILLS */}
          {provider.bio && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-hairline space-y-1.5 sm:space-y-2">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">About the Professional</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed max-w-3xl break-words">
                {provider.bio}
              </p>
            </div>
          )}

          {provider.skills && provider.skills.length > 0 && (
            <div className="mt-3.5 sm:mt-4 space-y-1.5 sm:space-y-2">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialties & Skills</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {provider.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-surface-soft border border-hairline px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TRUST SCORE GAUGE & AUDIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start min-w-0 w-full">
          <div className="lg:col-span-8 min-w-0 w-full">
            <TrustScoreGauge
              score={provider.trustScore ?? 0}
              breakdown={provider.trustBreakdown}
              completedJobsCount={provider.completedJobsCount}
              repeatCustomerCount={provider.repeatCustomerCount}
              providerCancelledCount={provider.providerCancelledCount}
              verificationStatus={provider.verificationStatus}
              isPublicView={true}
            />
          </div>

          {/* GATED CONTACT DETAILS */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4 min-w-0 w-full">
            <div className="rounded-2xl border border-hairline bg-card p-3.5 sm:p-5 shadow-xs space-y-3 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Details</h4>
                {provider.hasContactAccess ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <Lock className="size-3" /> Protected
                  </span>
                )}
              </div>

              {provider.hasContactAccess ? (
                <div className="space-y-2.5 pt-1 text-xs">
                  {provider.phone && (
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-soft border border-hairline text-ink font-bold hover:text-primary transition-colors"
                    >
                      <Phone className="size-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{provider.phone}</span>
                    </a>
                  )}
                  {provider.email && (
                    <a
                      href={`mailto:${provider.email}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-soft border border-hairline text-muted-foreground hover:text-ink transition-colors min-w-0"
                    >
                      <Mail className="size-4 text-primary shrink-0" />
                      <span className="truncate">{provider.email}</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3 sm:p-3.5 rounded-xl bg-surface-soft/60 border border-hairline space-y-1.5 sm:space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-ink font-semibold">
                    <Lock className="size-3.5 sm:size-4 text-amber-500 shrink-0" />
                    <span>Direct phone & email gated</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    To prevent off-platform spam and maintain verification integrity, contact numbers are revealed once your booking request is accepted.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUALITATIVE REVIEWS SECTION */}
        <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 md:p-8 shadow-xs space-y-3.5 sm:space-y-6 min-w-0 overflow-hidden">
          <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-hairline">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-base md:text-lg font-bold text-ink tracking-tight">
                Customer Reviews & Testimonials
              </h3>
              <p className="text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Qualitative feedback provided by clients following verified job completions.
              </p>
            </div>
            {provider.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 bg-surface-soft/60 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-xl sm:rounded-none border border-hairline sm:border-0">
                <div className="text-right">
                  <span className="text-base sm:text-2xl font-extrabold text-ink tabular-nums">{provider.averageRating.toFixed(1)}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground"> / 5.0</span>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-3 sm:size-4 ${
                        Math.round(provider.averageRating) >= s ? "fill-current" : "opacity-30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface-soft/30 px-4 py-6 sm:py-9 text-center space-y-2">
              <div className="size-9 sm:size-10 rounded-xl bg-surface-soft border border-hairline mx-auto flex items-center justify-center text-muted-foreground shadow-2xs">
                <Star className="size-4 sm:size-5 text-amber-400/80" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <p className="text-xs sm:text-sm font-bold text-ink">No qualitative reviews yet</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  Be the first client to book and leave feedback after service completion!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {reviews.map((rev) => {
                const reviewerObj = typeof rev.customer === "object" ? rev.customer : null;
                const reviewerName = reviewerObj?.name || "Verified Customer";

                return (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-hairline bg-surface-soft/40 p-3 sm:p-4 space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <UserAvatar
                          src={reviewerObj?.avatar}
                          name={reviewerName}
                          className="size-7 sm:size-8 shrink-0 ring-1 ring-hairline"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink truncate">{reviewerName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex text-amber-500 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${rev.rating >= s ? "fill-current" : "opacity-30"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-body leading-relaxed break-words">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;
