import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Lock,
  Loader2,
} from "lucide-react";
import type { Booking, User } from "@/types";
import { Button } from "@/Components/UI/button";
import { Badge } from "@/Components/UI/badge";
import { Modal } from "@/Components/UI/Modal";
import { Textarea } from "@/Components/UI/textarea";
import { TrustScoreBadge } from "../Providers/TrustScoreBadge";

interface BookingCardProps {
  booking: Booking;
  isCustomer?: boolean;
  onAccept?: (bookingId: string) => Promise<void>;
  onDecline?: (bookingId: string, reason?: string) => Promise<void>;
  onComplete?: (bookingId: string) => Promise<void>;
  onCancel?: (bookingId: string, reason?: string) => Promise<void>;
  onOpenReview?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isCustomer = true,
  onAccept,
  onDecline,
  onComplete,
  onCancel,
  onOpenReview,
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const providerObj = typeof booking.provider === "object" ? (booking.provider as User) : null;
  const customerObj = typeof booking.customer === "object" ? (booking.customer as User) : null;

  const otherPerson = isCustomer ? providerObj : customerObj;
  const otherPersonName = otherPerson?.name || (isCustomer ? "Service Provider" : "Customer");
  const otherPersonAvatar = otherPerson?.avatar || "/default-avatar.jpg";
  const otherPersonPhone = otherPerson?.phone;
  const otherPersonEmail = otherPerson?.email;

  const isAcceptedOrCompleted = booking.status === "accepted" || booking.status === "completed";

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending Confirmation</Badge>;
      case "accepted":
        return <Badge variant="trustHigh">Accepted & Scheduled</Badge>;
      case "completed":
        return <Badge variant="trustElite">Completed & Verified</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "declined":
        return <Badge variant="secondary">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAccept = async () => {
    if (!onAccept || isAccepting || isSubmitting) return;
    setIsAccepting(true);
    try {
      await onAccept(booking.id);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleComplete = async () => {
    if (!onComplete || isCompleting || isSubmitting) return;
    setIsCompleting(true);
    try {
      await onComplete(booking.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!onCancel) return;
    setIsSubmitting(true);
    try {
      await onCancel(booking.id, reason);
      setIsCancelModalOpen(false);
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!onDecline) return;
    setIsSubmitting(true);
    try {
      await onDecline(booking.id, reason);
      setIsDeclineModalOpen(false);
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-hairline bg-card p-5 text-card-foreground shadow-xs transition-all hover:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="size-11 shrink-0 rounded-full overflow-hidden ring-1 ring-hairline">
              <img
                src={otherPersonAvatar}
                alt={otherPersonName}
                className="size-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/default-avatar.jpg";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isCustomer && providerObj ? (
                  <Link
                    to={`/providers/${providerObj.id}`}
                    className="font-bold text-sm text-ink hover:text-primary transition-colors"
                  >
                    {otherPersonName}
                  </Link>
                ) : (
                  <span className="font-bold text-sm text-ink">{otherPersonName}</span>
                )}
                {isCustomer && providerObj?.trustScore !== undefined && (
                  <TrustScoreBadge score={providerObj.trustScore} size="xs" showLabel={false} />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {booking.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-ink font-medium">
              <Calendar className="size-4 text-primary shrink-0" />
              <span>{booking.serviceDate}</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-medium">
              <Clock className="size-4 text-primary shrink-0" />
              <span>{booking.timeSlot}</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-ink font-medium">{booking.address}</p>
                <p className="text-[11px]">{booking.subCity ? `${booking.subCity}, ` : ""}{booking.city}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-surface-soft/60 p-3 border border-hairline/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Contact & Gated Details
            </span>
            {isAcceptedOrCompleted ? (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                {otherPersonPhone ? (
                  <a
                    href={`tel:${otherPersonPhone}`}
                    className="flex items-center gap-2 text-ink font-bold hover:text-primary transition-colors"
                  >
                    <Phone className="size-3.5 text-emerald-600" />
                    <span>{otherPersonPhone}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5" />
                    <span>Phone not provided</span>
                  </div>
                )}
                {otherPersonEmail ? (
                  <a
                    href={`mailto:${otherPersonEmail}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-ink transition-colors truncate"
                  >
                    <Mail className="size-3.5 text-primary" />
                    <span className="truncate">{otherPersonEmail}</span>
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground py-1">
                <Lock className="size-3.5 shrink-0 text-amber-500" />
                <span className="text-[11px]">Contact info unlocked once booking is accepted</span>
              </div>
            )}
          </div>
        </div>

        {booking.notes && (
          <div className="pb-3 text-xs">
            <span className="font-semibold text-muted-foreground">Notes: </span>
            <span className="text-ink">{booking.notes}</span>
          </div>
        )}

        {booking.status === "cancelled" && (
          <div className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-2.5 text-xs text-rose-800 dark:text-rose-300">
            <span className="font-bold">Cancelled by: </span>
            <span className="capitalize">{booking.cancelledBy || "user"}</span>
            {booking.cancellationReason && (
              <span className="block text-[11px] mt-0.5 opacity-90">Reason: {booking.cancellationReason}</span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground">
            Created: {new Date(booking.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isCustomer && booking.status === "accepted" && onComplete && (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={isCompleting || isSubmitting}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Only the customer can mark this job completed"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Mark Job Complete</span>
                  </>
                )}
              </Button>
            )}

            {!isCustomer && booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  disabled={isAccepting || isSubmitting}
                  className="rounded-xl text-xs font-bold bg-primary hover:bg-brand-primary-active text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAccepting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>Accept Booking</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDeclineModalOpen(true)}
                  disabled={isAccepting || isSubmitting}
                  className="rounded-xl text-xs border-hairline hover:border-destructive hover:text-destructive cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <XCircle className="size-4" />
                  <span>Decline</span>
                </Button>
              </>
            )}

            {!isCustomer && booking.status === "accepted" && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                  Awaiting customer completion
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  title="Cancelling as provider incurs a -10 pts Trust penalty"
                >
                  <AlertTriangle className="size-3.5 text-rose-600" />
                  <span>Cancel Job (-10 pts)</span>
                </Button>
              </div>
            )}

            {isCustomer && (booking.status === "pending" || booking.status === "accepted") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={isCompleting || isSubmitting}
                className="rounded-xl text-xs text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50"
              >
                Cancel Booking
              </Button>
            )}

            {isCustomer && booking.status === "completed" && onOpenReview && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenReview(booking)}
                className="rounded-xl text-xs font-semibold border-amber-300 text-amber-800 dark:text-amber-300 hover:bg-amber-50 cursor-pointer flex items-center gap-1.5"
              >
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span>Write Review</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Booking"
        description={
          !isCustomer
            ? "Warning: As a provider, cancelling an accepted job will deduct 10 points from your Trust Score to preserve platform reliability."
            : "Are you sure you want to cancel this booking request? Customer cancellations do not penalize the provider."
        }
      >
        <div className="space-y-4 pt-2">
          {!isCustomer && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="size-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Reliability Deduction Notice</p>
                <p className="text-[11px] mt-0.5">
                  Your Trust Score will drop by 10 points. Please only cancel in emergencies.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <Textarea
              placeholder="e.g. Schedule conflict, client unreachable, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl text-xs"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmCancel}
              disabled={isSubmitting}
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        title="Decline Service Request"
        description="Let the customer know why you cannot accept this job request."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">
              Reason for Declining (Optional)
            </label>
            <Textarea
              placeholder="e.g. Fully booked on that date, outside service area, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeclineModalOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl text-xs"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDecline}
              disabled={isSubmitting}
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Declining...</span>
                </>
              ) : (
                "Decline Request"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;
