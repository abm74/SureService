import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useAdminDeleteUser } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/utils/helpers";
import type { User } from "@/types";

interface UserDeleteModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const deleteMutation = useAdminDeleteUser();
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const isConfirmed = confirmName.trim().toLowerCase() === user.name.trim().toLowerCase();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;
    setError(null);

    try {
      await deleteMutation.mutateAsync(user.id);
      if (onSuccess) onSuccess();
      setConfirmName("");
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete user account."));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700">
              <Trash2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-ink">
                Delete Account: {user.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">@{user.username} • {user.role}</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleDelete} className="space-y-4 text-left pt-2">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600" />
            <span>
              <strong>Warning:</strong> This action is permanent and cannot be undone. All user data, session tokens, and active requests will be removed or cancelled.
            </span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Type <span className="font-bold text-ink">"{user.name}"</span> to confirm:
            </Label>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={user.name}
              className="h-9 text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!isConfirmed || deleteMutation.isPending}
              className="rounded-xl text-xs h-9 flex items-center gap-1.5 disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Permanently Delete"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteModal;
