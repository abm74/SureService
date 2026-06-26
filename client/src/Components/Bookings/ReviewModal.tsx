import React, { useState } from "react";
import { Star, AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import type { Booking, User } from "@/types";
import { useCreateReview } from "@/hooks/useReviews";
import { Modal } from "@/Components/UI/Modal";
import { Button } from "@/Components/UI/button";
import { Textarea } from "@/Components/UI/textarea";
import { Label } from "@/Components/UI/label";
import { getErrorMessage } from "@/utils/helpers";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createReviewMutation = useCreateReview();

  if (!booking) return null;

  const providerObj = typeof booking.provider === "object" ? (booking.provider as User) : null;
  const providerName = providerObj?.name || "Service Provider";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please provide a brief comment describing your experience.");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        setSuccess(false);
        setComment("");
        setRating(5);
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to submit review. Please try again.")
      );
    }
  };

  const isSubmitting = createReviewMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Service with ${providerName}`}
      description={`Job: ${booking.category} on ${booking.serviceDate}`}
      contentClassName="sm:max-w-[480px]"
    >
      <div className="space-y-4 pt-1">
        {success ? (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-5 text-center text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
            <CheckCircle2 className="size-9 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
            <p className="font-bold text-sm">Thank You for Your Feedback!</p>
            <p className="text-xs mt-1 opacity-80">Your review helps other clients find great professionals.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-center py-2">
              <Label className="text-xs font-bold text-ink block">
                Overall Service Rating
              </Label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-muted-foreground hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`size-8 ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-ink">
                {rating === 5 && "Outstanding (5/5)"}
                {rating === 4 && "Great Service (4/5)"}
                {rating === 3 && "Average (3/5)"}
                {rating === 2 && "Needs Improvement (2/5)"}
                {rating === 1 && "Poor Experience (1/5)"}
              </span>
            </div>

            <div className="space-y-1 text-left">
              <Label htmlFor="comment" className="text-xs font-bold text-ink">
                Your Review
              </Label>
              <Textarea
                id="comment"
                placeholder="How was the punctuality, craftsmanship, and communication?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                className="text-xs rounded-xl"
              />
            </div>

            <div className="rounded-xl bg-surface-soft p-3 border border-hairline flex items-start gap-2 text-[11px] text-muted-foreground">
              <Info className="size-4 shrink-0 text-primary mt-0.5" />
              <span>
                <strong>Anti-Gaming Notice:</strong> Qualitative star ratings provide community feedback and are explicitly excluded from the 0–100 Trust Score calculation.
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-xl text-xs bg-primary hover:bg-brand-primary-active text-white shadow-xs font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModal;
