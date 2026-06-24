import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import PlatformStats from "@/Components/Admin/PlatformStats";
import VerificationQueue from "@/Components/Admin/VerificationQueue";
import UserManagement from "@/Components/Admin/UserManagement";
import {
  usePlatformStats,
  usePendingVerifications,
  useApproveVerification,
  useRejectVerification,
} from "@/hooks/useAdmin";
import { Button } from "@/Components/UI/button";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getErrorMessage } from "@/utils/helpers";

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: "users" | "verifications" | "metrics" =
    tabParam === "verifications" || tabParam === "metrics" ? tabParam : "users";

  const {
    data: stats = null,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = usePlatformStats();

  const {
    data: pendingVerifications = [],
    isLoading: isVerifsLoading,
    refetch: refetchVerifs,
    isRefetching: isRefetchingVerifs,
  } = usePendingVerifications();

  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const [successMessage, setSuccessMessage] = useState("");

  const isLoading = isStatsLoading || isVerifsLoading;
  const isRefreshing = isRefetchingStats || isRefetchingVerifs;

  const handleRefresh = () => {
    refetchStats();
    refetchVerifs();
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
  };

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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              {activeTab === "users" && "User Directory & Moderation"}
              {activeTab === "verifications" && "ID Verification Audit Center"}
              {activeTab === "metrics" && "Platform Pulse & Marketplace Metrics"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeTab === "users" && "Manage customer and provider accounts, status, search, and profile audits."}
              {activeTab === "verifications" && "Audit uploaded government IDs and Ethiopian trade licenses."}
              {activeTab === "metrics" && "Comprehensive health, trust scores, and booking lifecycle metrics."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="rounded-full text-xs h-8 px-3.5 font-semibold text-ink bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`size-3.5 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </Button>
        </div>

        {successMessage && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {activeTab === "users" && <UserManagement />}

        {activeTab === "verifications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                  <span>Pending Provider Verifications</span>
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 px-2.5 py-0.5 text-xs font-extrabold">
                    {pendingVerifications.length}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
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
        )}

        {activeTab === "metrics" && (
          <div className="space-y-4">
            <PlatformStats stats={stats} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
