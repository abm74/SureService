import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Star, ArrowUpRight, Calendar } from "lucide-react";
import type { User } from "@/types";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { VerificationBadge } from "./VerificationBadge";
import { Button } from "@/Components/UI/button";
import { UserAvatar } from "@/Components/UI/UserAvatar";

interface ProviderCardProps {
  provider: User & { averageRating?: number; reviewCount?: number };
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
}) => {
  const score = provider.trustScore ?? 0;
  const locationStr = provider.location
    ? `${provider.location.subCity ? provider.location.subCity + ", " : ""}${provider.location.city || "Ethiopia"}`
    : "Addis Ababa, Ethiopia";

  return (
    <div className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-hairline bg-card p-2.5 sm:p-4 md:p-5 text-card-foreground shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-1.5 sm:gap-2.5 mb-2 sm:mb-3.5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <UserAvatar
              src={provider.avatar}
              name={provider.name}
              className="size-9 sm:size-12 md:size-13 shrink-0 ring-2 ring-hairline group-hover:ring-primary/40 transition-all"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <Link
                  to={`/providers/${provider.id}`}
                  className="font-bold text-xs sm:text-sm text-ink hover:text-primary transition-colors flex items-center gap-1 truncate"
                >
                  <span className="truncate">{provider.name}</span>
                  <ArrowUpRight className="size-3 sm:size-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary shrink-0" />
                </Link>
              </div>
              <div className="flex items-center gap-1 text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                <Briefcase className="size-2.5 sm:size-3.5 text-primary shrink-0" />
                <span className="font-semibold text-ink truncate">{provider.category || "Service Professional"}</span>
              </div>
              <div className="flex items-center gap-1 text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                <MapPin className="size-2.5 sm:size-3 shrink-0" />
                <span className="truncate">{locationStr}</span>
              </div>
            </div>
          </div>

          <TrustScoreBadge score={score} size="sm" showLabel={false} className="shrink-0" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <VerificationBadge status={provider.verificationStatus} size="sm" />
          {provider.experienceYears !== undefined && provider.experienceYears > 0 && (
            <span className="rounded-full bg-surface-soft border border-hairline px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[11px] font-medium text-muted-foreground">
              {provider.experienceYears}+ yrs exp
            </span>
          )}
          {typeof provider.averageRating === "number" && provider.reviewCount !== undefined && provider.reviewCount > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-300">
              <Star className="size-2.5 sm:size-3 fill-amber-500 text-amber-500" />
              <span>{provider.averageRating.toFixed(1)}</span>
              <span className="text-[9px] opacity-70 font-normal">({provider.reviewCount})</span>
            </div>
          )}
        </div>

        {provider.bio && (
          <p className="text-[10.5px] sm:text-xs text-body line-clamp-2 leading-relaxed mb-2 sm:mb-3">
            {provider.bio}
          </p>
        )}

        {provider.skills && provider.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
            {provider.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md bg-muted/70 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {provider.skills.length > 3 && (
              <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground self-center">
                +{provider.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 sm:pt-3 border-t border-hairline flex items-center justify-between gap-1.5 sm:gap-2 mt-1 sm:mt-2">
        <div className="min-w-0">
          <span className="text-[9.5px] sm:text-[11px] text-muted-foreground font-medium block leading-none mb-0.5">Rate</span>
          <span className="text-[11.5px] sm:text-sm font-extrabold text-ink truncate block leading-tight">
            {provider.hourlyRate ? `${provider.hourlyRate} ETB` : "Negotiable"}
            <span className="text-[9.5px] sm:text-[11px] font-normal text-muted-foreground">/hr</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link to={`/providers/${provider.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs h-7.5 sm:h-9 px-2.5 sm:px-3 border-hairline hover:border-ink cursor-pointer"
            >
              Profile
            </Button>
          </Link>
          <Link to={`/providers/${provider.id}/book`}>
            <Button
              size="sm"
              className="rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs h-7.5 sm:h-9 px-2.5 sm:px-3.5 bg-primary hover:bg-brand-primary-active text-white shadow-2xs flex items-center gap-1 sm:gap-1.5 cursor-pointer font-bold"
            >
              <Calendar className="size-3 sm:size-3.5" />
              <span>Book</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
