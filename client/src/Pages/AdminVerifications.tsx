import React, { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import VerificationQueue from "@/Components/Admin/VerificationQueue";
import {
  usePendingVerifications,
  useApproveVerification,
  useRejectVerification,
} from "@/hooks/useAdmin";
import { Button } from "@/Components/UI/button";
import { getErrorMessage } from "@/utils/helpers";

export const AdminVerifications: React.FC = () => {
  const {
    data: pendingVerifications = [],
    isLoading,
    refetch,
    isRefetching,
  } = usePendingVerifications();

  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const [successMessage, setSuccessMessage] = useState("");

  const handleApprove = async (providerId: string) => {
    try {
      const updated = await approveMutation.mutateAsync(providerId);
      setSuccessMessage(`Approved ${updated?.name || "Provider"}! Verified badge enabled and trust standing updated.`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to approve verification."));
    }
  };

  const handleReject = async (providerId: string, reason: string) => {
    try {
      const updated = await rejectMutation.mutateAsync({ providerId, reason });
      setSuccessMessage(`Rejected verification for ${updated?.name || "Provider"}. Feedback sent for resubmission.`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to reject verification."));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink leading-tight">
              ID Verification Audit Center
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Audit uploaded government IDs and Ethiopian trade licenses.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-full text-[11px] sm:text-xs h-7.5 sm:h-8 px-2.5 sm:px-3.5 font-semibold text-ink bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`size-3 sm:size-3.5 text-primary ${isRefetching ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </Button>
        </div>

        {successMessage && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-ink flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Pending Provider Verifications</span>
                <span className="rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 px-2 py-0.2 text-[10.5px] sm:text-xs font-extrabold">
                  {pendingVerifications.length}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Approving grants the Verified marketplace shield and updates trust standing.
              </p>
            </div>
          </div>

          <VerificationQueue
            providers={pendingVerifications}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminVerifications;
