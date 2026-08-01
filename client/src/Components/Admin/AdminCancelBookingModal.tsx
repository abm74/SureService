import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/UI/dialog";
import { Button } from "@/Components/UI/button";
import { Textarea } from "@/Components/UI/textarea";
import type { Booking } from "@/types";

interface AdminCancelBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string, reason: string) => Promise<void>;
}

const PRESET_REASONS = [
  "Administrative cancellation per user request",
  "Terms of service or safety guideline violation",
  "Unresponsive provider / schedule conflict resolution",
  "Duplicate or fraudulent booking request",
];

export const AdminCancelBookingModal: React.FC<AdminCancelBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(
        booking.id,
        reason.trim() || "Cancelled by platform administrator",
      );
      onClose();
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-destructive font-bold">
            <AlertTriangle className="size-5" />
            <DialogTitle className="text-base font-bold text-ink">
              Cancel Booking (Admin Action)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Cancelling booking #{booking.id.slice(-6).toUpperCase()} will immediately terminate
            the request. Both the customer and service provider will be notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2 text-left">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">
              Select Quick Reason
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-left ${
                    reason === preset
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-muted/40 border-border text-muted-foreground hover:text-ink hover:bg-muted"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">
              Detailed Reason / Note (Optional)
            </label>
            <Textarea
              placeholder="Provide context or explanation for why this booking was cancelled..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className="text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-8 px-3"
            >
              Back
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-8 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
};

export default AdminCancelBookingModal;
