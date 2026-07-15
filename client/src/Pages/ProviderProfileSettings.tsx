import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Activity,
  Loader2,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import VerificationBadge from "@/Components/Providers/VerificationBadge";
import { useAuth } from "@/store/Auth/AuthContext";
import { getTrustTier } from "@/utils/trustTier";
import { useUpdateProviderProfile } from "@/hooks/useProviders";
import type { UpdateProviderProfilePayload } from "@/types";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Textarea } from "@/Components/UI/textarea";
import { getErrorMessage } from "@/utils/helpers";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";

export const ProviderProfileSettings: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const { categoryNames } = useCategories();
  const { cities, getSubCities } = useLocations();

  const updateProfileMutation = useUpdateProviderProfile();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [category, setCategory] = useState(user?.category || "Electrician");
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 350);
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 5);
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [city, setCity] = useState(user?.location?.city || "Addis Ababa");
  const [subCity, setSubCity] = useState(user?.location?.subCity || "Bole");
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCategory(user.category || "Electrician");
      setHourlyRate(user.hourlyRate || 350);
      setExperienceYears(user.experienceYears || 5);
      setBio(user.bio || "");
      setSkills(user.skills?.join(", ") || "");
      setCity(user.location?.city || "Addis Ababa");
      setSubCity(user.location?.subCity || "Bole");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    try {
      const payload: UpdateProviderProfilePayload = {
        name,
        phone,
        category,
        hourlyRate: Number(hourlyRate),
        experienceYears: Number(experienceYears),
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        location: {
          city,
          subCity: getSubCities(city).length > 0 ? subCity : "",
        },
      };
      const updated = await updateProfileMutation.mutateAsync(payload);
      updateUser(updated);
      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(""), 4000);
      refreshUser();
    } catch (err) {
      setProfileMessage(getErrorMessage(err, "Failed to update profile."));
    }
  };

  const isSavingProfile = updateProfileMutation.isPending;

  const score = user?.trustScore ?? 0;
  const tier = getTrustTier(score);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 text-left min-w-0 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              <User className="size-3 sm:size-3.5 shrink-0" />
              <span>Personal Settings & Rates</span>
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-ink truncate">
              Edit Professional Profile & Rates
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              to="/provider/stats"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-hairline bg-surface-soft hover:bg-surface-hover hover:border-primary/30 transition-all text-[11px] sm:text-xs font-bold text-ink cursor-pointer shadow-2xs group shrink-0"
            >
              <Activity className="size-3 sm:size-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
              <span>Trust: <span className="text-primary font-black">{score}</span></span>
              <span className="text-muted-foreground font-normal hidden xs:inline">({tier.label})</span>
            </Link>
            <VerificationBadge status={user?.verificationStatus} size="sm" />
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
          <div className="pb-3 sm:pb-4 border-b border-hairline">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-ink">Public Profile Details</h2>
            <p className="text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Keeping your bio, rates, and coverage up to date contributes up to 15 points to your Profile Completeness.
            </p>
          </div>

          {profileMessage && (
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 sm:p-3 text-[11px] sm:text-xs font-semibold text-primary">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3.5 sm:space-y-4 max-w-2xl min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-[11px] sm:text-xs font-bold text-ink">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-9.5 sm:h-11 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-[11px] sm:text-xs font-bold text-ink">
                  Phone Number (Gated to Accepted Bookings)
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="+251 911 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9.5 sm:h-11 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="category" className="text-[11px] sm:text-xs font-bold text-ink">
                  Primary Trade
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9.5 sm:h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {categoryNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="hourlyRate" className="text-[11px] sm:text-xs font-bold text-ink">
                  Rate (ETB / hr)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="h-9.5 sm:h-11 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="experienceYears" className="text-[11px] sm:text-xs font-bold text-ink">
                  Experience (Years)
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="h-9.5 sm:h-11 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-[11px] sm:text-xs font-bold text-ink">
                  City
                </Label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setCity(newCity);
                    const subList = getSubCities(newCity);
                    setSubCity(subList.length > 0 ? subList[0] : "");
                  }}
                  className="h-9.5 sm:h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {getSubCities(city).length > 0 && (
                <div className="space-y-1 animate-in fade-in duration-150">
                  <Label htmlFor="subCity" className="text-[11px] sm:text-xs font-bold text-ink">
                    Sub-City
                  </Label>
                  <select
                    id="subCity"
                    value={subCity}
                    onChange={(e) => setSubCity(e.target.value)}
                    className="h-9.5 sm:h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {getSubCities(city).map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="skills" className="text-[11px] sm:text-xs font-bold text-ink">
                Skills & Services (Comma separated)
              </Label>
              <Input
                id="skills"
                type="text"
                placeholder="Wiring, Circuit Breakers, Solar Setup"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-9.5 sm:h-11 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio" className="text-[11px] sm:text-xs font-bold text-ink">
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="Describe your background, craftsmanship philosophy, and warranty guarantees..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isSavingProfile}
              className="w-full sm:w-auto rounded-xl text-xs h-9.5 sm:h-11 px-5 sm:px-6 bg-primary hover:bg-brand-primary-active text-white font-bold cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfileSettings;
