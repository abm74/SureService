import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import BookingCard from "@/Components/Bookings/BookingCard";
import BookingCardSkeleton from "@/Components/Bookings/BookingCardSkeleton";
import VerificationBadge from "@/Components/Providers/VerificationBadge";
import { useAuth } from "@/store/Auth/AuthContext";
import { getTrustTier } from "@/utils/trustTier";
import {
  useProviderBookings,
  useAcceptBooking,
  useDeclineBooking,
  useCancelBooking,
} from "@/hooks/useBookings";
import { getErrorMessage } from "@/utils/helpers";

export const ProviderBookings: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
  } = useProviderBookings();

  const acceptBookingMutation = useAcceptBooking();
  const declineBookingMutation = useDeclineBooking();
  const cancelBookingMutation = useCancelBooking();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

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

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeJobs = bookings.filter((b) => b.status === "accepted");
  const completedJobs = bookings.filter((b) => b.status === "completed");
  const cancelledJobs = bookings.filter((b) => b.status === "cancelled" || b.status === "declined");

  const score = user?.trustScore ?? 0;
  const tier = getTrustTier(score);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 text-left min-w-0 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              <Calendar className="size-3 sm:size-3.5 shrink-0" />
              <span>Service Bookings & Inquiries</span>
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-ink truncate">
              Welcome back, {user?.name}
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

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5 sm:gap-2">
                <Clock className="size-3.5 sm:size-4 text-amber-500 shrink-0" />
                <span>Pending Client Inquiries ({isBookingsLoading ? "..." : pendingRequests.length})</span>
              </h3>
            </div>

            {isBookingsLoading ? (
              <div className="space-y-3">
                <BookingCardSkeleton />
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
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

          <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="size-3.5 sm:size-4 text-blue-500 shrink-0" />
                <span>Active & Scheduled Jobs ({isBookingsLoading ? "..." : activeJobs.length})</span>
              </h3>
            </div>

            {isBookingsLoading ? (
              <div className="space-y-3">
                <BookingCardSkeleton />
              </div>
            ) : activeJobs.length === 0 ? (
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
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

          <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
            <h3 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="size-3.5 sm:size-4 text-emerald-500 shrink-0" />
              <span>Verified Completed Jobs ({isBookingsLoading ? "..." : completedJobs.length})</span>
            </h3>

            {isBookingsLoading ? (
              <div className="space-y-3">
                <BookingCardSkeleton />
              </div>
            ) : completedJobs.length === 0 ? (
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-hairline bg-card text-center text-xs text-muted-foreground">
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

          {cancelledJobs.length > 0 && (
            <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
              <h3 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5 sm:gap-2">
                <AlertTriangle className="size-3.5 sm:size-4 text-rose-500 shrink-0" />
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
      </main>
    </div>
  );
};

export default ProviderBookings;
