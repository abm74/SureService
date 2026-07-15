import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Loader2,
} from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import VerificationBadge from "@/Components/Providers/VerificationBadge";
import { useAuth } from "@/store/Auth/AuthContext";
import { getTrustTier } from "@/utils/trustTier";
import { useSubmitVerification } from "@/hooks/useProviders";
import { Button } from "@/Components/UI/button";
import { Label } from "@/Components/UI/label";
import { getErrorMessage } from "@/utils/helpers";
import DocumentUpload from "@/Components/Upload/DocumentUpload";

export const ProviderVerification: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const submitVerificationMutation = useSubmitVerification();

  const [docUrl, setDocUrl] = useState(user?.verificationDocUrl || "");
  const [docType, setDocType] = useState(user?.verificationDocType || "Kebele ID");
  const [verifMessage, setVerifMessage] = useState("");

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      setDocUrl(user.verificationDocUrl || "");
      setDocType(user.verificationDocType || "Kebele ID");
    }
  }, [user]);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) return;
    setVerifMessage("");
    try {
      const updated = await submitVerificationMutation.mutateAsync({
        verificationDocUrl: docUrl.trim(),
        verificationDocType: docType,
      });
      updateUser(updated);
      setVerifMessage("Verification documents submitted! Status is now Pending Admin Review.");
      setTimeout(() => setVerifMessage(""), 4000);
      refreshUser();
    } catch (err) {
      setVerifMessage(getErrorMessage(err, "Failed to submit verification."));
    }
  };

  const isSubmittingVerif = submitVerificationMutation.isPending;

  const score = user?.trustScore ?? 0;
  const tier = getTrustTier(score);

  const isDocUnchanged =
    docUrl.trim() === (user?.verificationDocUrl || "").trim() &&
    docType === (user?.verificationDocType || "Kebele ID");
  const isPendingReview = user?.verificationStatus === "pending";
  const isApproved = user?.verificationStatus === "approved";
  const isRejected = user?.verificationStatus === "rejected";

  const isVerifSubmitDisabled =
    isSubmittingVerif ||
    !docUrl.trim() ||
    ((isPendingReview || isApproved) && isDocUnchanged);

  const verifButtonClassName =
    (isPendingReview || isApproved) && isDocUnchanged && !isSubmittingVerif
      ? "w-full sm:w-auto rounded-xl text-xs h-9 sm:h-11 px-4 sm:px-6 bg-emerald-700 dark:bg-emerald-600 text-white font-bold shadow-xs flex items-center justify-center gap-2 cursor-default"
      : "w-full sm:w-auto rounded-xl text-xs h-9 sm:h-11 px-4 sm:px-6 bg-primary hover:bg-brand-primary-active text-white font-bold cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 text-left min-w-0 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5 sm:mb-1">
              <ShieldCheck className="size-3 sm:size-3.5 shrink-0" />
              <span>Identity & License Credentials</span>
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-ink truncate">
              ID & Trade License Verification
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

        <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-card p-3.5 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-hairline">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-ink">Official Credentials Audit</h2>
              <p className="text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Submitting official credentials grants the Verified Provider shield and +25 Trust points upon review.
              </p>
            </div>
            <VerificationBadge status={user?.verificationStatus} size="sm" />
          </div>

          {user?.verificationStatus === "approved" && (
            <div className="rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 sm:p-4 text-[11px] sm:text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="size-4 sm:size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-bold">Identity & Credentials Approved</p>
                <p className="text-[10.5px] sm:text-[11px] mt-0.5">
                  Your account is fully verified with the +25 Trust Score boost and Verified shield on the marketplace.
                </p>
              </div>
            </div>
          )}

          {user?.verificationStatus === "rejected" && (
            <div className="rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 sm:p-4 text-[11px] sm:text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="size-4 sm:size-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Verification Rejected by Admin</p>
                <p className="text-[10.5px] sm:text-[11px] mt-0.5">
                  Reason: {user?.verificationRejectionReason || "Documents were illegible or expired."}
                </p>
                <p className="text-[10.5px] sm:text-[11px] mt-1 font-semibold">Please resubmit updated documents below.</p>
              </div>
            </div>
          )}

          {user?.verificationStatus === "pending" && (
            <div className="rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Clock className="size-4 sm:size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold">Under Admin Review</p>
                <p className="text-[10.5px] sm:text-[11px] mt-0.5">
                  Your submitted document is in the admin review queue. You will be notified once verified.
                </p>
              </div>
            </div>
          )}

          {verifMessage && (
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 sm:p-3 text-[11px] sm:text-xs font-semibold text-primary">
              {verifMessage}
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-3.5 sm:space-y-5 max-w-xl min-w-0">
            <div className="space-y-1">
              <Label htmlFor="docType" className="text-[11px] sm:text-xs font-bold text-ink">
                Document Type
              </Label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="h-9.5 sm:h-11 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Kebele ID">Kebele ID</option>
                <option value="National ID (Fayda)">National ID (Fayda)</option>
                <option value="Ethiopian Trade License">Ethiopian Trade License</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Passport">Passport</option>
                <option value="Professional Certification / Degree">Professional Certification / Degree</option>
              </select>
            </div>

            <DocumentUpload
              value={docUrl}
              onChange={setDocUrl}
              onRemove={() => setDocUrl("")}
              disabled={isSubmittingVerif}
              label="Identity / Trade Document"
              description="Upload scanned ID or license directly to secure cloud storage."
            />

            <Button
              type="submit"
              disabled={isVerifSubmitDisabled}
              className={verifButtonClassName}
            >
              {isSubmittingVerif ? (
                <>
                  <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                  <span>Submitting Documents...</span>
                </>
              ) : isPendingReview && isDocUnchanged ? (
                <>
                  <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-300" />
                  <span>Documents Under Review</span>
                </>
              ) : isApproved && isDocUnchanged ? (
                <>
                  <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-300" />
                  <span>Documents Verified & Approved</span>
                </>
              ) : isPendingReview && !isDocUnchanged ? (
                <span>Update & Resubmit</span>
              ) : isApproved && !isDocUnchanged ? (
                <span>Update Verification Document</span>
              ) : isRejected ? (
                <span>Resubmit Document</span>
              ) : (
                "Submit Document"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProviderVerification;
