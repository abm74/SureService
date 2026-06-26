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
  FileText,
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

    if (!serviceDate) {
      setFormError("Please select a valid service date.");
      return;
    }

    if (!address.trim()) {
      setFormError("Please specify a street address, house number, or nearby landmark.");
      return;
    }

    const payload: CreateBookingPayload = {
      providerId: provider.id,
      category: provider.category || "General Service",
      serviceDate,
      timeSlot,
      address: address.trim(),
      city,
      subCity: city === "Addis Ababa" ? subCity : undefined,
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
        <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-48 rounded-3xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-80 rounded-3xl" />
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
          <h2 className="text-xl font-bold text-ink">Service Provider Not Found</h2>
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

  const defaultAvatar = "/default-avatar.jpg";
  const avatarUrl = provider.avatar || defaultAvatar;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex items-center gap-3">
          <Link
            to={`/providers/${provider.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors p-1.5 pr-3 rounded-full hover:bg-surface-soft border border-transparent hover:border-hairline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Profile</span>
          </Link>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Direct Service Request</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
            Request Service with {provider.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Schedule an appointment and outline your requirements. The provider will review and respond to your request.
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-10 text-center text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200 max-w-xl mx-auto space-y-4 my-12 shadow-sm">
            <CheckCircle2 className="size-14 mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce" />
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Booking Request Sent Successfully!</h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
              Your service request has been transmitted to {provider.name}. Redirecting to your bookings management hub...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FORM SECTIONS */}
            <div className="lg:col-span-8 space-y-6">
              {isAuthenticated && user?.role === "provider" && (
                <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                  <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Provider Account Restricted</p>
                    <p className="text-xs leading-relaxed opacity-90">
                      You are currently signed in as a Service Provider. To prevent trust score manipulation and circular booking rings, booking services is reserved for Customer accounts.
                    </p>
                  </div>
                </div>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                  <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Administrator Account Notice</p>
                    <p className="text-xs leading-relaxed opacity-90">
                      Administrator accounts cannot initiate service bookings. Please switch to a Customer account to book services.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: DATE & TIME */}
                <div className="rounded-3xl border border-hairline bg-card p-6 md:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-hairline">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ink">Date & Time Slot</h2>
                      <p className="text-[11px] text-muted-foreground">Select when you need this service performed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="serviceDate" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" />
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
                        className="h-11 text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="timeSlot" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        <span>Preferred Time Slot</span>
                      </Label>
                      <select
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        disabled={isAuthenticated && user?.role !== "customer"}
                        className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
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
                <div className="rounded-3xl border border-hairline bg-card p-6 md:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-hairline">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ink">Service Location</h2>
                      <p className="text-[11px] text-muted-foreground">Where should the provider visit for the service?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
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
                        disabled={isAuthenticated && user?.role !== "customer"}
                        className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                      >
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {getSubCities(city).length > 0 && (
                      <div className="space-y-1.5 animate-in fade-in duration-150">
                        <Label htmlFor="subCity" className="text-xs font-bold text-ink">
                          Sub-City / District
                        </Label>
                        <select
                          id="subCity"
                          value={subCity}
                          onChange={(e) => setSubCity(e.target.value)}
                          disabled={isAuthenticated && user?.role !== "customer"}
                          className="h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
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

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      <span>Street Address / House Number / Landmark</span>
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="e.g. Bole Medhanialem, Near Edna Mall, House #204"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      disabled={isAuthenticated && user?.role !== "customer"}
                      className="h-11 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* STEP 3: JOB DETAILS */}
                <div className="rounded-3xl border border-hairline bg-card p-6 md:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-hairline">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ink">Job Description & Requirements</h2>
                      <p className="text-[11px] text-muted-foreground">Describe what needs to be fixed, installed, or tutored</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <FileText className="size-3.5 text-primary" />
                      <span>Job Description / Specific Requests (Optional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Please describe the scope of work (e.g. kitchen sink leak under the cabinet, replacement parts needed, etc.)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      disabled={isAuthenticated && user?.role !== "customer"}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive">
                    <AlertCircle className="size-4.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* SUBMIT BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <Link to={`/providers/${provider.id}`} className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto rounded-2xl text-xs font-bold h-12 px-6 border-hairline"
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || (isAuthenticated && user?.role !== "customer")}
                    className="w-full sm:w-auto rounded-2xl text-xs font-bold h-12 px-8 bg-primary hover:bg-brand-primary-active text-white shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : isAuthenticated && user?.role === "provider" ? (
                      "Booking Restricted for Providers"
                    ) : isAuthenticated && user?.role === "admin" ? (
                      "Booking Restricted for Admins"
                    ) : (
                      <>
                        <Calendar className="size-4" />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: PROVIDER SUMMARY CARD */}
            <div className="lg:col-span-4 space-y-5 sticky top-24">
              <div className="rounded-3xl border border-hairline bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-3.5 pb-4 border-b border-hairline">
                  <div className="size-14 rounded-full overflow-hidden ring-2 ring-hairline shrink-0">
                    <img
                      src={avatarUrl}
                      alt={provider.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = defaultAvatar;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-ink truncate">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">{provider.category}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <VerificationBadge status={provider.verificationStatus} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-soft border border-hairline">
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Trust Standing
                    </span>
                    <span className="text-xs font-semibold text-ink">Objective behavioral track record</span>
                  </div>
                  <TrustScoreBadge score={provider.trustScore ?? 0} size="md" showLabel={true} />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-soft border border-hairline">
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Hourly Rate
                    </span>
                    <span className="text-xs text-muted-foreground">Standard service rate</span>
                  </div>
                  <span className="text-base font-extrabold text-ink">
                    {provider.hourlyRate ? `${provider.hourlyRate} ETB/hr` : "Negotiable"}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Platform Guarantees
                  </span>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 text-xs text-body">
                      <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-ink font-semibold">No Upfront Payment:</strong> You only pay directly after the service is successfully completed.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-body">
                      <Lock className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-ink font-semibold">Gated Contacts:</strong> Phone and email are securely exchanged once the provider accepts your request.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-body">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-ink font-semibold">Customer Completion Authority:</strong> Only you have the authority to confirm the job as complete.
                      </span>
                    </div>
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
