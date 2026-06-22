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
  Info,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import { useProvider } from "@/hooks/useProviders";
import { Button } from "@/Components/UI/button";
import { Skeleton } from "@/Components/UI/skeleton";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { TrustScoreGauge } from "@/Components/Providers/TrustScoreGauge";
import { VerificationBadge } from "@/Components/Providers/VerificationBadge";
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
        <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
          <Skeleton className="h-4 w-36 mb-2" />

          <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Skeleton className="size-24 md:size-28 shrink-0 rounded-full" />
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-36 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-soft/80 border border-hairline shrink-0 w-full md:w-56 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-11 w-full rounded-2xl" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-hairline space-y-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3.5 w-64" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-3">
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

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* HERO PROFILE CARD */}
        <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative size-24 md:size-28 shrink-0 rounded-full overflow-hidden ring-4 ring-hairline shadow-md">
                <img
                  src={provider.avatar || "/default-avatar.jpg"}
                  alt={provider.name}
                  className="size-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/default-avatar.jpg";
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
                    {provider.name}
                  </h1>
                  <TrustScoreBadge score={provider.trustScore ?? 0} size="md" />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-ink">
                    <Briefcase className="size-3.5 text-primary" />
                    {provider.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" />
                    {locationStr}
                  </span>
                  {provider.experienceYears !== undefined && provider.experienceYears > 0 && (
                    <>
                      <span>•</span>
                      <span>{provider.experienceYears}+ years practical experience</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <VerificationBadge status={provider.verificationStatus} size="md" />
                  {provider.reviewCount > 0 && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{provider.averageRating.toFixed(1)}</span>
                      <span className="text-[11px] opacity-70 font-normal">({provider.reviewCount} customer review{provider.reviewCount === 1 ? "" : "s"})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION CTA BOX */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 p-4 rounded-2xl bg-surface-soft/80 border border-hairline shrink-0 w-full md:w-auto">
              <div className="text-left md:text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Hourly Rate
                </span>
                <span className="text-2xl font-extrabold text-ink">
                  {provider.hourlyRate ? `${provider.hourlyRate} ETB` : "Negotiable"}
                  <span className="text-xs font-normal text-muted-foreground">/hour</span>
                </span>
              </div>

              <Link to={`/providers/${provider.id}/book`} className="w-full sm:w-auto md:w-full">
                <Button
                  size="lg"
                  className="w-full rounded-2xl text-xs font-bold h-11 px-6 bg-primary hover:bg-brand-primary-active text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="size-4" />
                  <span>Request Service Booking</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* BIO & SKILLS */}
          {provider.bio && (
            <div className="mt-6 pt-6 border-t border-hairline space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About the Professional</h3>
              <p className="text-sm text-body leading-relaxed max-w-3xl">
                {provider.bio}
              </p>
            </div>
          )}

          {provider.skills && provider.skills.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialties & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {provider.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-surface-soft border border-hairline px-3 py-1 text-xs font-medium text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TRUST SCORE GAUGE & AUDIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
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

          {/* GATED CONTACT DETAILS & ANTI-GAMING */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-hairline bg-card p-5 shadow-xs space-y-3">
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
                      <Phone className="size-4 text-emerald-600" />
                      <span>{provider.phone}</span>
                    </a>
                  )}
                  {provider.email && (
                    <a
                      href={`mailto:${provider.email}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-soft border border-hairline text-muted-foreground hover:text-ink transition-colors truncate"
                    >
                      <Mail className="size-4 text-primary" />
                      <span className="truncate">{provider.email}</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-surface-soft/60 border border-hairline space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-ink font-semibold">
                    <Lock className="size-4 text-amber-500" />
                    <span>Direct phone & email gated</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    To prevent off-platform spam and maintain verification integrity, contact numbers are revealed once your booking request is accepted.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-surface-soft border border-hairline p-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <Info className="size-4 text-primary" />
                <span>Anti-Gaming Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This provider cannot alter their completed job records, delete low reviews, or fabricate ratings. Only clients with verified bookings can confirm jobs.
              </p>
            </div>
          </div>
        </div>

        {/* QUALITATIVE REVIEWS SECTION */}
        <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
            <div>
              <h3 className="text-lg font-bold text-ink">Customer Reviews & Testimonials</h3>
              <p className="text-xs text-muted-foreground">
                Qualitative feedback provided by clients following verified job completions.
              </p>
            </div>
            {provider.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-ink tabular-nums">{provider.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground"> / 5.0</span>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${
                        Math.round(provider.averageRating) >= s ? "fill-current" : "opacity-30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No qualitative reviews yet for this provider. Be the first to book and leave feedback after service completion!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((rev) => {
                const reviewerObj = typeof rev.customer === "object" ? rev.customer : null;
                const reviewerName = reviewerObj?.name || "Verified Customer";
                const reviewerAvatar = reviewerObj?.avatar || "/default-avatar.jpg";

                return (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-hairline bg-surface-soft/40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full overflow-hidden ring-1 ring-hairline">
                          <img
                            src={reviewerAvatar}
                            alt={reviewerName}
                            className="size-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/default-avatar.jpg";
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ink">{reviewerName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${rev.rating >= s ? "fill-current" : "opacity-30"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-body leading-relaxed">{rev.comment}</p>
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
