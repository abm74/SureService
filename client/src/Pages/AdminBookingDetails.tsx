import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Ban,
  RefreshCw,
  History,
  XCircle,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI/avatar";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { VerificationBadge } from "@/Components/Providers/VerificationBadge";
import AdminCancelBookingModal from "@/Components/Admin/AdminCancelBookingModal";
import { useAdminBookingDetails, useAdminCancelBooking } from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import type { User, Booking } from "@/types";
import { getErrorMessage } from "@/utils/helpers";

export const AdminBookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading, isError, refetch, isRefetching } = useAdminBookingDetails(id || null);
  const cancelMutation = useAdminCancelBooking();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
  };

  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ id: bookingId, reason });
      setActionNotice("Booking successfully cancelled by administrator.");
      setTimeout(() => setActionNotice(""), 4000);
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, "Failed to cancel booking."));
    }
  };

  const customer = booking && typeof booking.customer === "object" ? (booking.customer as User) : null;
  const provider = booking && typeof booking.provider === "object" ? (booking.provider as User) : null;
  const isCancellable = booking?.status === "pending" || booking?.status === "accepted";

  const getStatusBadge = (status?: Booking["status"]) => {
    if (!status) return null;
    switch (status) {
      case "pending":
        return <Badge variant="warning" className="text-xs px-2.5 py-0.5 whitespace-nowrap">Pending</Badge>;
      case "accepted":
        return <Badge variant="trustHigh" className="text-xs px-2.5 py-0.5 whitespace-nowrap">Accepted</Badge>;
      case "completed":
        return <Badge variant="trustElite" className="text-xs px-2.5 py-0.5 whitespace-nowrap">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="text-xs px-2.5 py-0.5 whitespace-nowrap">Cancelled</Badge>;
      case "declined":
        return <Badge variant="secondary" className="text-xs px-2.5 py-0.5 whitespace-nowrap">Declined</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2.5 py-0.5 whitespace-nowrap">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-4 md:px-8 py-6 max-w-5xl mx-auto w-full space-y-4 text-left">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-card border border-border rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />
            <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <AppHeader />
        <main className="grow px-4 py-16 max-w-md mx-auto w-full text-center space-y-4">
          <div className="size-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-ink">Booking Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The requested booking record could not be found or you do not have permission to view it.
          </p>
          <div className="pt-2">
            <Link to="/admin/bookings">
              <Button size="sm" className="rounded-xl text-xs font-bold">
                Back to Bookings
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-5xl mx-auto w-full space-y-4 text-left min-w-0">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Bookings</span>
          </button>
        </div>

        {actionNotice && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Page Header Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono font-bold text-ink text-base sm:text-lg">
                #{booking.id.slice(-6).toUpperCase()}
              </span>
              <span className="text-sm font-bold text-ink">{booking.category}</span>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Created on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
              className="rounded-xl text-xs h-7.5 px-3 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`size-3 text-primary ${isRefetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            {isCancellable && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                className="rounded-xl text-xs h-7.5 px-3 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="size-3" />
                <span>Cancel Booking</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Schedule, Location & Order Status */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                <span>Schedule & Location</span>
              </h2>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 space-y-0.5">
                  <span className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3 text-primary" />
                    <span>Date</span>
                  </span>
                  <p className="font-bold text-ink text-xs">{booking.serviceDate}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 space-y-0.5">
                  <span className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3 text-primary" />
                    <span>Time Slot</span>
                  </span>
                  <p className="font-bold text-ink text-xs">{booking.timeSlot}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 text-xs space-y-0.5">
                <span className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  <span>Address & City</span>
                </span>
                <p className="font-bold text-ink text-xs">{booking.address}</p>
                <p className="text-[11px] text-muted-foreground">
                  {booking.subCity ? `${booking.subCity}, ` : ""}{booking.city || "Addis Ababa"}
                </p>
              </div>

              {booking.notes && (
                <div className="p-2.5 rounded-xl bg-muted/40 text-xs space-y-1">
                  <span className="text-[10.5px] font-semibold text-muted-foreground flex items-center gap-1">
                    <FileText className="size-3 text-primary" />
                    <span>Customer Notes</span>
                  </span>
                  <p className="text-ink text-xs whitespace-pre-wrap">{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Status & Lifecycle Info */}
            <div className="pt-3.5 border-t border-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <History className="size-3.5 text-primary" />
                  <span>Status & Timeline</span>
                </h3>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              {/* Visual Lifecycle Stepper */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-muted/25 border border-border/70">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-border -z-0" />

                  {/* Step 1: Requested */}
                  <div className="flex flex-col items-center relative z-10 text-center gap-1">
                    <div className="size-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="size-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-bold text-ink">Requested</span>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Step 2: Provider Action */}
                  <div className="flex flex-col items-center relative z-10 text-center gap-1">
                    {booking.status === "declined" ? (
                      <div className="size-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                        <X className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : booking.status === "pending" ? (
                      <div className="size-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs ring-4 ring-amber-500/20">
                        <Clock className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="size-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-ink">
                      {booking.status === "declined"
                        ? "Declined"
                        : booking.status === "pending"
                        ? "In Review"
                        : "Accepted"}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {booking.status === "declined"
                        ? "By Provider"
                        : booking.status === "pending"
                        ? "Awaiting"
                        : "Confirmed"}
                    </span>
                  </div>

                  {/* Step 3: Resolution */}
                  <div className="flex flex-col items-center relative z-10 text-center gap-1">
                    {booking.status === "completed" ? (
                      <div className="size-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs ring-4 ring-emerald-500/20">
                        <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : booking.status === "cancelled" ? (
                      <div className="size-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs ring-4 ring-rose-500/20">
                        <Ban className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : booking.status === "declined" ? (
                      <div className="size-7 rounded-full bg-muted-foreground/30 text-muted-foreground flex items-center justify-center">
                        <Ban className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : booking.status === "accepted" ? (
                      <div className="size-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs ring-4 ring-blue-500/20">
                        <Calendar className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="size-7 rounded-full bg-muted text-muted-foreground border border-border flex items-center justify-center text-[10px] font-bold">
                        3
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-ink capitalize">
                      {booking.status === "completed"
                        ? "Completed"
                        : booking.status === "cancelled"
                        ? "Cancelled"
                        : booking.status === "declined"
                        ? "Closed"
                        : booking.status === "accepted"
                        ? "Scheduled"
                        : "Fulfillment"}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {booking.status === "completed" && booking.completedAt
                        ? new Date(booking.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        : booking.status === "accepted"
                        ? booking.serviceDate
                        : booking.status === "cancelled" || booking.status === "declined"
                        ? "Terminated"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Outcome Callout */}
              {(booking.status === "cancelled" || booking.status === "declined") && (
                <div className="rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 p-3 sm:p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                      {booking.status === "cancelled" ? (
                        <Ban className="size-4 text-rose-600 shrink-0" />
                      ) : (
                        <XCircle className="size-4 text-rose-600 shrink-0" />
                      )}
                      <span className="capitalize">{booking.status} Audit Notice</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                      <UserIcon className="size-3 text-rose-600" />
                      <span>By {booking.cancelledBy ? booking.cancelledBy.charAt(0).toUpperCase() + booking.cancelledBy.slice(1) : "User"}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700/90 dark:text-rose-400">
                      Reason Given
                    </span>
                    <div className="rounded-lg bg-background/90 dark:bg-card/90 border border-rose-200/70 dark:border-rose-900/40 p-2.5 text-xs text-ink font-medium leading-relaxed italic">
                      "{booking.cancellationReason || "No reason provided"}"
                    </div>
                  </div>

                  {booking.cancelledBy === "provider" && (
                    <div className="flex items-center gap-1.5 text-[10.5px] text-rose-700 dark:text-rose-300/90 font-semibold pt-0.5">
                      <ShieldAlert className="size-3.5 text-rose-600 shrink-0" />
                      <span>Reliability deduction (-10 pts) applied to provider trust score.</span>
                    </div>
                  )}
                </div>
              )}

              {booking.status === "completed" && (
                <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 p-3 sm:p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                      <span>Service Successfully Completed</span>
                    </div>
                    {booking.completedAt && (
                      <span className="text-[10.5px] text-emerald-700 dark:text-emerald-300 font-semibold">
                        {new Date(booking.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300/90">
                    Confirmed by customer. Verified job milestone and trust score credit updated.
                  </p>
                </div>
              )}

              {booking.status === "accepted" && (
                <div className="rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 p-3 sm:p-3.5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                    <Clock className="size-4 text-blue-600 shrink-0" />
                    <span>Confirmed & Scheduled</span>
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300/90">
                    Provider accepted this booking for {booking.serviceDate} ({booking.timeSlot}). Contact channels unlocked.
                  </p>
                </div>
              )}

              {booking.status === "pending" && (
                <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 p-3 sm:p-3.5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                    <Clock className="size-4 text-amber-600 shrink-0" />
                    <span>Awaiting Provider Action</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/90">
                    Booking request submitted and awaiting provider acceptance or decline.
                  </p>
                </div>
              )}

              {/* Timestamp Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-muted/40 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <Calendar className="size-2.5 text-primary" />
                    <span>Requested At</span>
                  </span>
                  <p className="font-bold text-ink text-xs">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {new Date(booking.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-muted/40 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <Clock className="size-2.5 text-primary" />
                    <span>{booking.completedAt ? "Completed At" : booking.updatedAt ? "Last Updated" : "Schedule"}</span>
                  </span>
                  <p className="font-bold text-ink text-xs">
                    {booking.completedAt
                      ? new Date(booking.completedAt).toLocaleDateString()
                      : booking.updatedAt
                      ? new Date(booking.updatedAt).toLocaleDateString()
                      : booking.serviceDate}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {booking.completedAt
                      ? new Date(booking.completedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                      : booking.updatedAt
                      ? new Date(booking.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                      : booking.timeSlot}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Participants (Customer & Provider) */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-xs">
            {/* Customer Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="size-3.5 text-teal-600" />
                  <span>Customer</span>
                </h2>
                <Badge variant="outline" className="text-[10px] bg-teal-50 text-teal-700 border-teal-200">
                  CUSTOMER
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="size-10 rounded-xl border border-border shrink-0">
                  <AvatarImage src={customer?.avatar} alt={customer?.name} />
                  <AvatarFallback className="font-bold text-xs">
                    {customer?.name ? customer.name.charAt(0).toUpperCase() : "C"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-ink text-xs sm:text-sm truncate">
                    {customer?.name || "Customer"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    @{customer?.username || "unknown"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-ink">
                  <Mail className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{customer?.email || "No email on record"}</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <Phone className="size-3.5 text-muted-foreground shrink-0" />
                  <span>{customer?.phone || "No phone on record"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-3">
              {/* Provider Section */}
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-blue-600" />
                  <span>Provider</span>
                </h2>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                  PROVIDER
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="size-10 rounded-xl border border-border shrink-0">
                  <AvatarImage src={provider?.avatar} alt={provider?.name} />
                  <AvatarFallback className="font-bold text-xs">
                    {provider?.name ? provider.name.charAt(0).toUpperCase() : "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-ink text-xs sm:text-sm truncate">
                    {provider?.name || "Provider"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {provider?.verificationStatus && (
                      <VerificationBadge status={provider.verificationStatus} size="sm" />
                    )}
                    {provider?.trustScore !== undefined && (
                      <TrustScoreBadge score={provider.trustScore} size="xs" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Trade:</span>
                  <span className="font-bold text-ink">{provider?.category || "General Services"}</span>
                </div>
                {provider?.hourlyRate !== undefined && (
                  <div className="flex items-center justify-between">
                    <span>Rate:</span>
                    <span className="font-bold text-ink">{provider.hourlyRate} ETB/hr</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-ink">
                  <Mail className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{provider?.email || "No email on record"}</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <Phone className="size-3.5 text-muted-foreground shrink-0" />
                  <span>{provider?.phone || "No phone on record"}</span>
                </div>
              </div>

              {provider?.id && (
                <div className="pt-1">
                  <Link
                    to={`/providers/${provider.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl text-xs h-7.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
                    >
                      <span>View Public Profile</span>
                      <ExternalLink className="size-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AdminCancelBookingModal
        booking={booking}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default AdminBookingDetails;
