import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Store } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import BookingCard from "@/Components/Bookings/BookingCard";
import BookingCardSkeleton from "@/Components/Bookings/BookingCardSkeleton";
import ReviewModal from "@/Components/Bookings/ReviewModal";
import {
  useCustomerBookings,
  useCompleteBooking,
  useCancelBooking,
} from "@/hooks/useBookings";
import type { Booking } from "@/types";
import { Button } from "@/Components/UI/button";
import { getErrorMessage } from "@/utils/helpers";

export const CustomerBookings: React.FC = () => {
  const { data: bookings = [], isLoading } = useCustomerBookings();
  const completeMutation = useCompleteBooking();
  const cancelMutation = useCancelBooking();

  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const handleComplete = async (bookingId: string) => {
    try {
      await completeMutation.mutateAsync(bookingId);
      setActionMessage("Job marked as Completed! Provider trust score updated.");
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to complete booking."));
    }
  };

  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      await cancelMutation.mutateAsync({ id: bookingId, reason });
      setActionMessage("Booking cancelled.");
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to cancel booking."));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "active") return b.status === "pending" || b.status === "accepted";
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "cancelled") return b.status === "cancelled" || b.status === "declined";
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 text-left">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
              <Calendar className="size-3 sm:size-3.5 shrink-0" />
              <span>Customer Booking Hub</span>
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              My Service Bookings
            </h1>
          </div>

          <Link to="/marketplace" className="shrink-0">
            <Button
              size="sm"
              className="rounded-full text-xs h-8 sm:h-9 px-3 sm:px-4 bg-primary hover:bg-brand-primary-active text-white shadow-xs flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Store className="size-3.5" />
              <span className="hidden sm:inline">Find New Service</span>
              <span className="sm:hidden">Browse</span>
            </Button>
          </Link>
        </div>


        {actionMessage && (
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs font-semibold text-primary animate-in fade-in duration-200">
            {actionMessage}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-hairline pb-2 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "all"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "active"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
            }`}
          >
            Active & Pending ({bookings.filter((b) => b.status === "pending" || b.status === "accepted").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "completed"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
            }`}
          >
            Completed ({bookings.filter((b) => b.status === "completed").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            className={`rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "cancelled"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === "cancelled" || b.status === "declined").length})
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-hairline bg-card p-12 text-center shadow-xs space-y-3">
            <div className="size-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto text-primary">
              <Calendar className="size-6" />
            </div>
            <h3 className="text-base font-bold text-ink">No Bookings Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You don't have any bookings under this category. Need help with plumbing, electrical, or tutoring?
            </p>
            <Link to="/marketplace">
              <Button size="sm" className="rounded-full text-xs font-bold mt-2">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isCustomer={true}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onOpenReview={(b) => setSelectedBookingForReview(b)}
              />
            ))}
          </div>
        )}
      </main>

      <ReviewModal
        isOpen={Boolean(selectedBookingForReview)}
        onClose={() => setSelectedBookingForReview(null)}
        booking={selectedBookingForReview}
      />
    </div>
  );
};

export default CustomerBookings;
