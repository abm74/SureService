import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/store/Auth/AuthContext";
import { useProvider } from "@/hooks/useProviders";
import { useCreateBooking } from "@/hooks/useBookings";
import { useLocations } from "@/hooks/useLocations";
import AppHeader from "@/Components/Header/AppHeader";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Textarea } from "@/Components/UI/textarea";
import { Skeleton } from "@/Components/UI/skeleton";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { VerificationBadge } from "@/Components/Providers/VerificationBadge";
import { UserAvatar } from "@/Components/UI/UserAvatar";
import { getErrorMessage } from "@/utils/helpers";
import type { CreateBookingPayload } from "@/types";

const TIME_SLOTS = [
  "Morning (08:00 AM - 12:00 PM)",
  "Afternoon (01:00 PM - 05:00 PM)",
  "Evening (05:00 PM - 08:00 PM)",
];

export const BookProvider: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading, error: fetchError } = useProvider(id);
  const createBookingMutation = useCreateBooking();
  const { cities, getSubCities } = useLocations();

  const [serviceDate, setServiceDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [subCity, setSubCity] = useState("Bole");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const provider = data?.provider;

  useEffect(() => {
    if (provider?.location) {
      if (provider.location.city) setCity(provider.location.city);
      if (provider.location.subCity) setSubCity(provider.location.subCity);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setServiceDate(tomorrow.toISOString().split("T")[0]);
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "customer") {
      setFormError("Only registered customer accounts can request bookings.");
      return;
    }

    if (!provider) {
      setFormError("Provider information could not be verified.");
      return;
    }

    if (!provider.category) {
      setFormError("The selected provider does not have an assigned category.");
      return;
    }

    if (!serviceDate) {
      setFormError("Please select a valid service date.");
      return;
    }

    if (!address.trim()) {
      setFormError("Please specify a street address or nearby landmark.");
      return;
    }

    const payload: CreateBookingPayload = {
      providerId: provider.id,
      category: provider.category,
      serviceDate,
      timeSlot,
      address: address.trim(),
      city,
      subCity: getSubCities(city).length > 0 ? subCity : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      await createBookingMutation.mutateAsync(payload);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/bookings");
      }, 1500);
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Failed to submit booking request. Please try again.")
      );
    }
  };

  const isSubmitting = createBookingMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 text-left">
          <Skeleton className="h-4 sm:h-5 w-36 sm:w-40 mb-2" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              <Skeleton className="h-44 sm:h-56 rounded-2xl" />
              <Skeleton className="h-36 sm:h-44 rounded-2xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-56 sm:h-72 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (fetchError || !provider) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-4 md:px-8 py-16 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-base sm:text-xl font-bold text-ink">Service Provider Not Found</h2>
          <p className="text-xs text-muted-foreground">
            {fetchError ? getErrorMessage(fetchError) : "The requested provider profile is unavailable."}
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

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 max-w-5xl mx-auto w-full space-y-3.5 sm:space-y-5 text-left min-w-0 overflow-x-hidden">
        <div className="flex items-center gap-3">
          <Link
            to={`/providers/${provider.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground hover:text-ink transition-colors p-1 sm:p-1.5 pr-2.5 sm:pr-3 rounded-full hover:bg-surface-soft border border-transparent hover:border-hairline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Profile</span>
          </Link>
        </div>

        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="size-3 shrink-0" />
            <span>Direct Service Request</span>
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight text-ink break-words leading-tight">
            Request Service with {provider.name}
          </h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
            Choose a date and outline your service needs.
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 text-center text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200 max-w-lg mx-auto space-y-2.5 my-6 shadow-sm">
            <CheckCircle2 className="size-10 sm:size-12 mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce" />
            <h2 className="text-sm sm:text-lg font-bold text-emerald-900 dark:text-emerald-100">Booking Request Sent!</h2>
            <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
              Your service request was transmitted to {provider.name}. Redirecting to your bookings hub...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-start min-w-0 w-full">
            {/* LEFT COLUMN: FORM SECTIONS */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-4 min-w-0 w-full">
              {isAuthenticated && user?.role === "provider" && (
                <div className="flex items-start gap-2.5 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Provider Account Restricted</p>
                    <p className="opacity-90 leading-snug">
                      Provider accounts cannot book services to prevent score manipulation. Please use a Customer account.
                    </p>
                  </div>
                </div>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <div className="flex items-start gap-2.5 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Admin Account Notice</p>
                    <p className="opacity-90 leading-snug">
                      Admin accounts cannot initiate bookings. Please switch to a Customer account.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* STEP 1: DATE & TIME */}
                <div className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-5 shadow-xs space-y-2.5 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 pb-2 border-b border-hairline">
                    <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                      1
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-ink">Date & Time</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="serviceDate" className="text-[10.5px] sm:text-xs font-bold text-ink flex items-center gap-1">
                        <Calendar className="size-3 text-primary shrink-0" />
                        <span>Service Date</span>
                      </Label>
                      <Input
                        id="serviceDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={serviceDate}
                        onChange={(e) => setServiceDate(e.target.value)}
                        required
                        disabled={isAuthenticated && user?.role !== "customer"}
                        className="h-9 text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="timeSlot" className="text-[10.5px] sm:text-xs font-bold text-ink flex items-center gap-1">
                        <Clock className="size-3 text-primary shrink-0" />
                        <span>Preferred Time Slot</span>
                      </Label>
                      <select
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        disabled={isAuthenticated && user?.role !== "customer"}
                        className="h-9 w-full rounded-xl border border-hairline bg-background px-2.5 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* STEP 2: LOCATION */}
                <div className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-5 shadow-xs space-y-2.5 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 pb-2 border-b border-hairline">
                    <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                      2
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-ink">Service Location</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-[10.5px] sm:text-xs font-bold text-ink">
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
                        disabled={isAuthenticated && user?.role !== "customer"}
                        className="h-9 w-full rounded-xl border border-hairline bg-background px-2.5 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
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
                        <Label htmlFor="subCity" className="text-[10.5px] sm:text-xs font-bold text-ink">
                          Sub-City / District
                        </Label>
                        <select
                          id="subCity"
                          value={subCity}
                          onChange={(e) => setSubCity(e.target.value)}
                          disabled={isAuthenticated && user?.role !== "customer"}
                          className="h-9 w-full rounded-xl border border-hairline bg-background px-2.5 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
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
                    <Label htmlFor="address" className="text-[10.5px] sm:text-xs font-bold text-ink flex items-center gap-1">
                      <MapPin className="size-3 text-primary shrink-0" />
                      <span>Address / Landmark</span>
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="e.g. Bole Medhanialem, House #204"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      disabled={isAuthenticated && user?.role !== "customer"}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* STEP 3: JOB DETAILS */}
                <div className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-5 shadow-xs space-y-2.5 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 pb-2 border-b border-hairline">
                    <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                      3
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-ink">Job Description (Optional)</h2>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Textarea
                      id="notes"
                      placeholder="Describe what needs to be fixed or installed..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      disabled={isAuthenticated && user?.role !== "customer"}
                      className="text-xs rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* SUBMIT BUTTONS */}
                <div className="flex items-center justify-end gap-2 pt-1 min-w-0 w-full">
                  <Link to={`/providers/${provider.id}`} className="shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      className="rounded-xl text-[11px] sm:text-xs font-bold h-8.5 px-3 sm:px-4 bg-surface-soft text-ink border border-hairline cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || (isAuthenticated && user?.role !== "customer")}
                    className="flex-1 sm:flex-none rounded-xl text-[11px] sm:text-xs font-bold h-8.5 px-4 sm:px-6 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin shrink-0" />
                        <span>Submitting...</span>
                      </>
                    ) : isAuthenticated && user?.role === "provider" ? (
                      <span>Providers Restricted</span>
                    ) : isAuthenticated && user?.role === "admin" ? (
                      <span>Admins Restricted</span>
                    ) : (
                      <>
                        <Calendar className="size-3.5 shrink-0" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: PROVIDER SUMMARY CARD */}
            <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-24 min-w-0 w-full">
              <div className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-4 shadow-xs space-y-3 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-hairline min-w-0">
                  <UserAvatar
                    src={provider.avatar}
                    name={provider.name}
                    className="size-10 sm:size-11 ring-1.5 ring-hairline shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-ink truncate">{provider.name}</h3>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{provider.category}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <VerificationBadge status={provider.verificationStatus} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-soft border border-hairline gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Trust Score
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-ink truncate block">Verified Track Record</span>
                  </div>
                  <TrustScoreBadge score={provider.trustScore ?? 0} size="xs" showLabel={true} />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-soft border border-hairline gap-2 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">
                    Rate
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-ink whitespace-nowrap">
                    {provider.hourlyRate ? `${provider.hourlyRate} ETB/hr` : "Negotiable"}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-[10px] sm:text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3 text-primary shrink-0" />
                    <span>No upfront payment required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="size-3 text-primary shrink-0" />
                    <span>Contact details revealed upon request acceptance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookProvider;
