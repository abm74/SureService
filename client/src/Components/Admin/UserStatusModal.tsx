import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog";
import { Button } from "@/Components/UI/button";
import { Label } from "@/Components/UI/label";
import { Textarea } from "@/Components/UI/textarea";
import { Ban, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useAdminToggleUserStatus } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/utils/helpers";
import type { User } from "@/types";

interface UserStatusModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: User) => void;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toggleMutation = useAdminToggleUserStatus();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const isSuspending = !user.isSuspended;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const updated = await toggleMutation.mutateAsync({
        userId: user.id,
        isSuspended: isSuspending,
        reason: isSuspending ? reason.trim() : "",
      });

      if (onSuccess) onSuccess(updated);
      setReason("");
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update account status."));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isSuspending ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700" : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700"
              }`}
            >
              {isSuspending ? <Ban className="size-5" /> : <CheckCircle2 className="size-5" />}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-ink">
                {isSuspending ? `Suspend Account: ${user.name}` : `Reactivate Account: ${user.name}`}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">@{user.username} • {user.role}</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {isSuspending ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>
                  Suspending this user will immediately terminate all active sessions, invalidate tokens, and block any login attempts until reactivated.
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Suspension Reason (Required)</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Terms of Service violation, repeated cancellations, fraud investigation..."
                  required
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Reactivating this account will remove all restrictions and allow <strong>{user.name}</strong> to log in, accept jobs, or create booking requests again.
            </p>
          )}

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={toggleMutation.isPending}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={isSuspending ? "destructive" : "default"}
              disabled={toggleMutation.isPending}
              className="rounded-xl text-xs h-9 flex items-center gap-1.5 disabled:opacity-50"
            >
              {toggleMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSuspending ? (
                "Confirm Suspension"
              ) : (
                "Reactivate User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserStatusModal;
