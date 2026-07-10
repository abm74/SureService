import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  ExternalLink,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Loader2,
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
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [docLoadError, setDocLoadError] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (previewDocProvider?.verificationDocUrl) {
      setIsDocLoading(true);
      setDocLoadError(false);
    }
  }, [previewDocProvider?.id, previewDocProvider?.verificationDocUrl]);

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
            className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-4 md:p-5 text-card-foreground shadow-xs min-w-0"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3.5 md:gap-4 min-w-0">
              <div className="flex items-start gap-2 sm:gap-3.5 min-w-0 flex-1">
                <Skeleton className="size-9 sm:size-10 md:size-12 rounded-full shrink-0" />
                <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-32" />
                    <Skeleton className="h-3.5 sm:h-4 w-10 sm:w-12 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 sm:h-3.5 w-20 sm:w-24" />
                    <Skeleton className="h-3 sm:h-3.5 w-24 sm:w-28" />
                  </div>
                  <Skeleton className="h-5 sm:h-6 w-36 sm:w-44 rounded-lg" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-hairline/60 md:border-0 md:pt-0 shrink-0 w-full md:w-auto">
                <Skeleton className="h-6 sm:h-7 md:h-8 w-14 sm:w-18 rounded-md sm:rounded-lg" />
                <Skeleton className="h-6 sm:h-7 md:h-8 w-16 sm:w-20 rounded-md sm:rounded-lg" />
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
      <div className="space-y-3 sm:space-y-3.5">
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
              className="rounded-xl sm:rounded-2xl border border-hairline bg-card p-3 sm:p-4 md:p-5 text-card-foreground shadow-xs transition-all hover:border-border min-w-0 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3.5 md:gap-4 min-w-0">
                <div className="flex items-start gap-2 sm:gap-3.5 min-w-0 flex-1">
                  <div className="size-9 sm:size-10 md:size-12 rounded-full overflow-hidden ring-1 ring-hairline shrink-0">
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

                  <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-ink truncate">{provider.name}</span>
                      <TrustScoreBadge score={provider.trustScore ?? 0} size="xs" showLabel={false} />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-ink">
                        <Briefcase className="size-3 sm:size-3.5 text-primary" />
                        {provider.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-2.5 sm:size-3" />
                        {locationStr}
                      </span>
                      {provider.phone && (
                        <>
                          <span>•</span>
                          <span>{provider.phone}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg bg-surface-soft border border-hairline px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs text-ink font-medium">
                        <FileText className="size-3 sm:size-3.5 text-primary" />
                        <span className="capitalize">{provider.verificationDocType || "Government ID / License"}</span>
                      </div>

                      {provider.verificationDocUrl && (
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewDocProvider(provider)}
                            className="rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-semibold text-ink border-hairline hover:border-ink flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="size-3 text-primary" />
                            <span>Inspect</span>
                          </Button>
                          <a
                            href={provider.verificationDocUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center size-6 sm:size-7 rounded-lg border border-hairline bg-surface-soft hover:bg-surface-subtle text-muted-foreground hover:text-ink transition-colors"
                            title="Open document in new tab"
                          >
                            <ExternalLink className="size-2.5 sm:size-3" />
                          </a>
                        </div>
                      )}

                      {provider.verificationSubmittedAt && (
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                          Submitted: {new Date(provider.verificationSubmittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-hairline/60 md:border-0 md:pt-0 shrink-0 w-full md:w-auto">
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => handleOpenRejectModal(provider)}
                    disabled={Boolean(processingId)}
                    className="rounded-md sm:rounded-lg text-[10px] sm:text-[11px] md:text-xs h-6 sm:h-7 md:h-8 px-2 sm:px-2.5 md:px-3 font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shadow-2xs disabled:opacity-50 shrink-0"
                  >
                    <ShieldAlert className="size-2.5 sm:size-3 md:size-3.5" />
                    <span>Reject</span>
                  </Button>

                  <Button
                    size="xs"
                    onClick={() => handleApprove(provider)}
                    disabled={Boolean(processingId)}
                    className="rounded-md sm:rounded-lg text-[10px] sm:text-[11px] md:text-xs h-6 sm:h-7 md:h-8 px-2 sm:px-2.5 md:px-3.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="size-2.5 sm:size-3 animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-2.5 sm:size-3 md:size-3.5" />
                        <span>Approve</span>
                      </>
                    )}
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
        onClose={() => !processingId && setPreviewDocProvider(null)}
        title={`${previewDocProvider?.name || "Provider"} — Verification Document`}
        description={previewDocProvider?.verificationDocType || "Government Issued Document"}
        className="sm:max-w-[600px]"
      >
        <div className="space-y-4 pt-2">
          {previewDocProvider?.verificationDocUrl && (
            <div className="relative rounded-2xl border border-hairline bg-surface-soft p-2 overflow-hidden min-h-[220px] sm:min-h-[300px] flex items-center justify-center">
              {isDocLoading && (
                <div className="w-full h-64 sm:h-80 flex flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
                  <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-ink">Loading Document Preview...</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Fetching high-resolution asset from secure storage
                    </p>
                  </div>
                </div>
              )}

              {docLoadError && !isDocLoading && (
                <div className="w-full h-56 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <AlertCircle className="size-8 text-amber-500" />
                  <p className="text-xs font-bold text-ink">Unable to preview document inline</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm">
                    The file may be in an unsupported inline format. Please click "Open in New Tab" below to inspect.
                  </p>
                </div>
              )}

              {!docLoadError &&
                (previewDocProvider.verificationDocUrl.toLowerCase().endsWith(".pdf") ||
                previewDocProvider.verificationDocUrl.toLowerCase().includes("/raw/upload/") ? (
                  <iframe
                    src={previewDocProvider.verificationDocUrl}
                    title="Document Preview"
                    onLoad={() => setIsDocLoading(false)}
                    onError={() => {
                      setIsDocLoading(false);
                      setDocLoadError(true);
                    }}
                    className={`max-h-[48vh] sm:max-h-[65vh] w-full h-80 sm:h-96 rounded-xl border border-hairline bg-background transition-opacity duration-300 ${
                      isDocLoading ? "hidden" : "block"
                    }`}
                  />
                ) : (
                  <img
                    src={previewDocProvider.verificationDocUrl}
                    alt="Document Preview"
                    onLoad={() => setIsDocLoading(false)}
                    onError={() => {
                      setIsDocLoading(false);
                      setDocLoadError(true);
                    }}
                    className={`max-h-[48vh] sm:max-h-[65vh] w-auto mx-auto rounded-xl object-contain transition-opacity duration-300 ${
                      isDocLoading ? "hidden" : "block"
                    }`}
                  />
                ))}
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-lg sm:rounded-xl text-[11px] sm:text-xs h-7.5 sm:h-9 px-2.5 sm:px-3.5 border-hairline hover:border-ink flex items-center gap-1.5 cursor-pointer"
              >
                <a
                  href={previewDocProvider?.verificationDocUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="size-3 sm:size-3.5" />
                  <span>Open in New Tab</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewDocProvider(null)}
                disabled={Boolean(processingId)}
                className="rounded-lg sm:rounded-xl text-[11px] sm:text-xs h-7.5 sm:h-9 px-3 sm:px-4 border-hairline hover:border-ink cursor-pointer"
              >
                Close
              </Button>
            </div>

            {previewDocProvider && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-hairline/60">
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={() => {
                    const p = previewDocProvider;
                    setPreviewDocProvider(null);
                    handleOpenRejectModal(p);
                  }}
                  disabled={Boolean(processingId)}
                  className="rounded-md sm:rounded-lg text-[10.5px] sm:text-xs h-6.5 sm:h-7.5 md:h-8.5 px-2.5 sm:px-3 font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1 sm:gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <ShieldAlert className="size-2.5 sm:size-3.5" />
                  <span>Reject</span>
                </Button>
                <Button
                  size="xs"
                  onClick={() => handleApprove(previewDocProvider)}
                  disabled={Boolean(processingId)}
                  className="rounded-md sm:rounded-lg text-[10.5px] sm:text-xs h-6.5 sm:h-7.5 md:h-8.5 px-2.5 sm:px-3 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {processingId === previewDocProvider.id ? (
                    <>
                      <Loader2 className="size-2.5 sm:size-3.5 animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-2.5 sm:size-3.5" />
                      <span>Approve</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => !processingId && setIsRejectModalOpen(false)}
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
              disabled={Boolean(processingId)}
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
              className="rounded-xl text-xs h-9 px-4 font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {processingId ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="size-3.5" />
                  <span>Confirm Rejection</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VerificationQueue;
