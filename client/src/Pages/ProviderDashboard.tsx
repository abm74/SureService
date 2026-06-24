import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import BookingCard from "@/Components/Bookings/BookingCard";
import BookingCardSkeleton from "@/Components/Bookings/BookingCardSkeleton";
import TrustScoreGauge from "@/Components/Providers/TrustScoreGauge";
import VerificationBadge from "@/Components/Providers/VerificationBadge";
import { useAuth } from "@/store/Auth/AuthContext";
import {
  useProviderBookings,
  useAcceptBooking,
  useDeclineBooking,
  useCancelBooking,
} from "@/hooks/useBookings";
import {
  useUpdateProviderProfile,
  useSubmitVerification,
} from "@/hooks/useProviders";
import type { UpdateProviderProfilePayload } from "@/types";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Textarea } from "@/Components/UI/textarea";
import { getErrorMessage } from "@/utils/helpers";
import DocumentUpload from "@/Components/Upload/DocumentUpload";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";

export const ProviderDashboard: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const { categoryNames } = useCategories();
  const { cities, getSubCities } = useLocations();

  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
  } = useProviderBookings();

  const acceptBookingMutation = useAcceptBooking();
  const declineBookingMutation = useDeclineBooking();
  const cancelBookingMutation = useCancelBooking();
  const updateProfileMutation = useUpdateProviderProfile();
  const submitVerificationMutation = useSubmitVerification();

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: "requests" | "verification" | "profile" =
    tabParam === "verification" || tabParam === "profile" ? tabParam : "requests";

  // Profile Form State
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

  // Verification Form State
  const [docUrl, setDocUrl] = useState(user?.verificationDocUrl || "");
  const [docType, setDocType] = useState(user?.verificationDocType || "Kebele ID");
  const [verifMessage, setVerifMessage] = useState("");

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
      setDocUrl(user.verificationDocUrl || "");
      setDocType(user.verificationDocType || "Kebele ID");
    }
  }, [user]);

  const handleAccept = async (bookingId: string) => {
    try {
      await acceptBookingMutation.mutateAsync(bookingId);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to accept booking."));
    }
  };

  const handleDecline = async (bookingId: string, reason?: string) => {
    try {
      await declineBookingMutation.mutateAsync({ id: bookingId, reason });
    } catch (err) {
      alert(getErrorMessage(err, "Failed to decline booking."));
    }
  };

  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      await cancelBookingMutation.mutateAsync({ id: bookingId, reason });
    } catch (err) {
      alert(getErrorMessage(err, "Failed to cancel booking."));
    }
  };

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
          subCity: city === "Addis Ababa" ? subCity : "",
        },
      };
      const updated = await updateProfileMutation.mutateAsync(payload);
      updateUser(updated);
      setProfileMessage("Profile and rates updated successfully! Trust score recalculated.");
      setTimeout(() => setProfileMessage(""), 4000);
      refreshUser();
    } catch (err) {
      setProfileMessage(getErrorMessage(err, "Failed to update profile."));
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) return;
    setVerifMessage("");
    try {
      const updated = await submitVerificationMutation.mutateAsync({
        verificationDocUrl: docUrl.trim(),
        verificationDocType: docType,
      });
      updateUser(updated);
      setVerifMessage("Verification documents submitted! Status is now Pending Admin Review.");
      setTimeout(() => setVerifMessage(""), 4000);
      refreshUser();
    } catch (err) {
      setVerifMessage(getErrorMessage(err, "Failed to submit verification."));
    }
  };

  const isSavingProfile = updateProfileMutation.isPending;
  const isSubmittingVerif = submitVerificationMutation.isPending;

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeJobs = bookings.filter((b) => b.status === "accepted");
  const completedJobs = bookings.filter((b) => b.status === "completed");
  const cancelledJobs = bookings.filter((b) => b.status === "cancelled" || b.status === "declined");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <LayoutDashboard className="size-3.5" />
              <span>Provider Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              Welcome back, {user?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <VerificationBadge status={user?.verificationStatus} size="md" />
          </div>
        </div>

        {/* TAB 1: REQUESTS & JOBS */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* LIVE TRUST SCORE MANAGER */}
            <TrustScoreGauge
              score={user?.trustScore ?? 0}
              breakdown={user?.trustBreakdown}
              completedJobsCount={user?.completedJobsCount}
              repeatCustomerCount={user?.repeatCustomerCount}
              providerCancelledCount={user?.providerCancelledCount}
              verificationStatus={user?.verificationStatus}
              isPublicView={false}
            />
            {/* PENDING REQUESTS INBOX */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                  <Clock className="size-4 text-amber-500" />
                  <span>Pending Client Inquiries ({isBookingsLoading ? "..." : pendingRequests.length})</span>
                </h3>
              </div>

              {isBookingsLoading ? (
                <div className="space-y-3">
                  <BookingCardSkeleton />
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="p-6 rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
                  No new pending requests right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      isCustomer={false}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ACTIVE SCHEDULED JOBS */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500" />
                  <span>Active & Scheduled Jobs ({isBookingsLoading ? "..." : activeJobs.length})</span>
                </h3>
              </div>

              {isBookingsLoading ? (
                <div className="space-y-3">
                  <BookingCardSkeleton />
                </div>
              ) : activeJobs.length === 0 ? (
                <div className="p-6 rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
                  No active ongoing jobs.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeJobs.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      isCustomer={false}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COMPLETED JOBS ARCHIVE */}
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>Verified Completed Jobs ({isBookingsLoading ? "..." : completedJobs.length})</span>
              </h3>

              {isBookingsLoading ? (
                <div className="space-y-3">
                  <BookingCardSkeleton />
                </div>
              ) : completedJobs.length === 0 ? (
                <div className="p-6 rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
                  No completed jobs yet. Once clients confirm service, they appear here and boost your Trust Score!
                </div>
              ) : (
                <div className="space-y-3">
                  {completedJobs.map((b) => (
                    <BookingCard key={b.id} booking={b} isCustomer={false} />
                  ))}
                </div>
              )}
            </div>

            {/* CANCELLED & DECLINED JOBS ARCHIVE */}
            {cancelledJobs.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                  <AlertTriangle className="size-4 text-rose-500" />
                  <span>Cancelled & Declined Records ({cancelledJobs.length})</span>
                </h3>
                <div className="space-y-3">
                  {cancelledJobs.map((b) => (
                    <BookingCard key={b.id} booking={b} isCustomer={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERIFICATION CENTER */}
        {activeTab === "verification" && (
          <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-bold text-ink">Trade License & National ID Verification</h3>
                <p className="text-xs text-muted-foreground">
                  Submitting official Ethiopian credentials grants a Verified Provider badge and +25 Trust points upon admin review.
                </p>
              </div>
              <VerificationBadge status={user?.verificationStatus} size="lg" />
            </div>

            {user?.verificationStatus === "approved" && (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-bold">Identity & Credentials Approved</p>
                  <p className="text-[11px] mt-0.5">
                    Your account is fully verified. You enjoy the +25 Trust Score boost and the official Verified shield on the marketplace.
                  </p>
                </div>
              </div>
            )}

            {user?.verificationStatus === "rejected" && (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-3">
                <AlertTriangle className="size-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <p className="font-bold">Verification Rejected by Admin</p>
                  <p className="text-[11px] mt-0.5">
                    Reason: {user?.verificationRejectionReason || "Documents were illegible or expired."}
                  </p>
                  <p className="text-[11px] mt-1 font-semibold">Please resubmit updated documents below.</p>
                </div>
              </div>
            )}

            {user?.verificationStatus === "pending" && (
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Clock className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-bold">Under Admin Review</p>
                  <p className="text-[11px] mt-0.5">
                    Your submitted document is queued for review by platform administrators. You will be notified once reviewed.
                  </p>
                </div>
              </div>
            )}

            {verifMessage && (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs font-semibold text-primary">
                {verifMessage}
              </div>
            )}

            <form onSubmit={handleVerificationSubmit} className="space-y-5 max-w-xl">
              <div className="space-y-1">
                <Label htmlFor="docType" className="text-xs font-bold text-ink">
                  Document Type
                </Label>
                <select
                  id="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="Kebele ID">Kebele ID</option>
                  <option value="National ID (Fayda)">National ID (Fayda)</option>
                  <option value="Ethiopian Trade License">Ethiopian Trade License</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="Professional Certification / Degree">Professional Certification / Degree</option>
                </select>
              </div>

              <DocumentUpload
                value={docUrl}
                onChange={setDocUrl}
                onRemove={() => setDocUrl("")}
                disabled={isSubmittingVerif}
                label="Identity / Trade Document"
                description="Upload your scanned ID or license (JPG, PNG, WEBP, or PDF up to 10MB) directly to Cloudinary."
              />

              <Button
                type="submit"
                disabled={isSubmittingVerif || !docUrl.trim()}
                className="rounded-xl text-xs h-11 px-6 bg-primary hover:bg-brand-primary-active text-white font-bold cursor-pointer shadow-xs"
              >
                {isSubmittingVerif ? "Submitting..." : "Submit Verification Documents"}
              </Button>
            </form>
          </div>
        )}

        {/* TAB 3: PROFILE & RATES EDITOR */}
        {activeTab === "profile" && (
          <div className="rounded-3xl border border-hairline bg-card p-6 md:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-hairline">
              <h3 className="text-lg font-bold text-ink">Edit Professional Profile & Service Details</h3>
              <p className="text-xs text-muted-foreground">
                Keeping your bio, location, and rates up to date contributes up to 15 points to your Profile Completeness trust factor.
              </p>
            </div>

            {profileMessage && (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs font-semibold text-primary">
                {profileMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-bold text-ink">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-bold text-ink">
                    Phone Number (Gated to Accepted Bookings)
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+251 911 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs font-bold text-ink">
                    Primary Trade
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {categoryNames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="hourlyRate" className="text-xs font-bold text-ink">
                    Rate (ETB / hr)
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={50}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="h-11 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="experienceYears" className="text-xs font-bold text-ink">
                    Experience (Years)
                  </Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min={0}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="h-11 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs font-bold text-ink">
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
                    className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
                    <Label htmlFor="subCity" className="text-xs font-bold text-ink">
                      Sub-City
                    </Label>
                    <select
                      id="subCity"
                      value={subCity}
                      onChange={(e) => setSubCity(e.target.value)}
                      className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
                <Label htmlFor="skills" className="text-xs font-bold text-ink">
                  Skills & Services (Comma separated)
                </Label>
                <Input
                  id="skills"
                  type="text"
                  placeholder="Wiring, Circuit Breakers, Solar Setup, Appliance Repair"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="h-11 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio" className="text-xs font-bold text-ink">
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Describe your background, craftsmanship philosophy, and warranty guarantees..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-xl text-xs h-11 px-6 bg-primary hover:bg-brand-primary-active text-white font-bold cursor-pointer shadow-xs"
              >
                {isSavingProfile ? "Saving Profile..." : "Save Profile & Update Score"}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;
