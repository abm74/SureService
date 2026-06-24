import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  ExternalLink,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { User } from "@/types";
import { Button } from "@/Components/UI/button";
import { Modal } from "@/Components/UI/Modal";
import { Textarea } from "@/Components/UI/textarea";
import { Skeleton } from "@/Components/UI/skeleton";
import { TrustScoreBadge } from "../Providers/TrustScoreBadge";
import { getErrorMessage } from "@/utils/helpers";

interface VerificationQueueProps {
  providers: User[];
  isLoading: boolean;
  onApprove: (providerId: string) => Promise<void>;
  onReject: (providerId: string, reason: string) => Promise<void>;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  providers,
  isLoading,
  onApprove,
  onReject,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [previewDocProvider, setPreviewDocProvider] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleApprove = async (provider: User) => {
    setActionError("");
    setProcessingId(provider.id);
    try {
      await onApprove(provider.id);
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to approve verification."));
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectModal = (provider: User) => {
    setSelectedProvider(provider);
    setRejectionReason("");
    setActionError("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedProvider || !rejectionReason.trim()) return;
    setProcessingId(selectedProvider.id);
    setActionError("");
    try {
      await onReject(selectedProvider.id, rejectionReason.trim());
      setIsRejectModalOpen(false);
      setSelectedProvider(null);
      setRejectionReason("");
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to reject verification."));
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-hairline bg-card p-5 text-card-foreground shadow-xs"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <Skeleton className="size-12 rounded-full shrink-0" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                  <Skeleton className="h-6 w-44 rounded-lg" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline bg-card p-12 text-center shadow-xs">
        <div className="size-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle2 className="size-7" />
        </div>
        <h4 className="text-base font-bold text-ink mb-1">Queue is Empty</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          All provider verification submissions have been reviewed. New identity document submissions will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3.5">
        {actionError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {providers.map((provider) => {
          const isProcessing = processingId === provider.id;
          const locationStr = provider.location
            ? `${provider.location.subCity ? provider.location.subCity + ", " : ""}${provider.location.city || "Ethiopia"}`
            : "Ethiopia";

          return (
            <div
              key={provider.id}
              className="rounded-2xl border border-hairline bg-card p-5 text-card-foreground shadow-xs transition-all hover:border-border"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="size-12 rounded-full overflow-hidden ring-1 ring-hairline shrink-0">
                    <img
                      src={provider.avatar || "/default-avatar.jpg"}
                      alt={provider.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/default-avatar.jpg";
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-ink">{provider.name}</span>
                      <TrustScoreBadge score={provider.trustScore ?? 0} size="xs" showLabel={false} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-ink">
                        <Briefcase className="size-3.5 text-primary" />
                        {provider.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {locationStr}
                      </span>
                      {provider.phone && (
                        <>
                          <span>•</span>
                          <span>{provider.phone}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface-soft border border-hairline px-2.5 py-1 text-xs text-ink font-medium">
                        <FileText className="size-3.5 text-primary" />
                        <span className="capitalize">{provider.verificationDocType || "Government ID / License"}</span>
                      </div>

                      {provider.verificationDocUrl && (
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewDocProvider(provider)}
                            className="rounded-xl text-xs h-7 px-2.5 font-semibold text-ink border-hairline hover:border-ink flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="size-3 text-primary" />
                            <span>Inspect</span>
                          </Button>
                          <a
                            href={provider.verificationDocUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center size-7 rounded-lg border border-hairline bg-surface-soft hover:bg-surface-subtle text-muted-foreground hover:text-ink transition-colors"
                            title="Open document in new tab"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      )}

                      {provider.verificationSubmittedAt && (
                        <span className="text-[11px] text-muted-foreground">
                          Submitted: {new Date(provider.verificationSubmittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleOpenRejectModal(provider)}
                    disabled={isProcessing}
                    className="rounded-xl text-xs h-9 px-3.5 font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <ShieldAlert className="size-3.5" />
                    <span>Reject</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleApprove(provider)}
                    disabled={isProcessing}
                    className="rounded-xl text-xs h-9 px-4 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="size-4" />
                    <span>{isProcessing ? "Approving..." : "Approve"}</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <Modal
        isOpen={Boolean(previewDocProvider)}
        onClose={() => setPreviewDocProvider(null)}
        title={`${previewDocProvider?.name || "Provider"} — Verification Document`}
        description={previewDocProvider?.verificationDocType || "Government Issued Document"}
        className="sm:max-w-[600px]"
      >
        <div className="space-y-4 pt-2">
          {previewDocProvider?.verificationDocUrl && (
            <div className="rounded-2xl border border-hairline bg-surface-soft p-2 overflow-hidden flex items-center justify-center">
              {previewDocProvider.verificationDocUrl.toLowerCase().endsWith(".pdf") ||
              previewDocProvider.verificationDocUrl.toLowerCase().includes("/raw/upload/") ? (
                <iframe
                  src={previewDocProvider.verificationDocUrl}
                  title="Document Preview"
                  className="w-full h-96 rounded-xl border border-hairline bg-background"
                />
              ) : (
                <img
                  src={previewDocProvider.verificationDocUrl}
                  alt="Document Preview"
                  className="max-h-[65vh] w-auto mx-auto rounded-xl object-contain"
                />
              )}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 px-3.5 border-hairline hover:border-ink flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <a
                href={previewDocProvider?.verificationDocUrl || "#"}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3.5" />
                <span>Open in New Tab</span>
              </a>
            </Button>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewDocProvider(null)}
                className="rounded-xl text-xs h-9 px-4 border-hairline hover:border-ink cursor-pointer"
              >
                Close
              </Button>
              {previewDocProvider && (
                <>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const p = previewDocProvider;
                      setPreviewDocProvider(null);
                      handleOpenRejectModal(p);
                    }}
                    className="rounded-xl text-xs h-9 px-3.5 font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="size-3.5" />
                    <span>Reject</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const p = previewDocProvider;
                      setPreviewDocProvider(null);
                      handleApprove(p);
                    }}
                    className="rounded-xl text-xs h-9 px-4 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="size-4" />
                    <span>Approve</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Document Verification"
        description={`Specify a reason why ${selectedProvider?.name}'s document submission was rejected.`}
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">
              Rejection Feedback (Required)
            </label>
            <Textarea
              placeholder="e.g. Document image is blurry, expired trade license, or name does not match profile."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={Boolean(processingId)}
              className="rounded-xl text-xs h-9 px-4 border-hairline hover:border-ink cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || Boolean(processingId)}
              className="rounded-xl text-xs h-9 px-4 font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ShieldAlert className="size-3.5" />
              <span>{processingId ? "Rejecting..." : "Confirm Rejection"}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VerificationQueue;
