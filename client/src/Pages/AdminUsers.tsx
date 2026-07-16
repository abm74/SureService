import React from "react";
import { RefreshCw } from "lucide-react";
import AppHeader from "@/Components/Header/AppHeader";
import UserManagement from "@/Components/Admin/UserManagement";
import { Button } from "@/Components/UI/button";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader />

      <main className="grow px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink leading-tight">
              User Directory & Moderation
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Manage customer and provider accounts, status, search, and profile audits.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-full text-[11px] sm:text-xs h-7.5 sm:h-8 px-2.5 sm:px-3.5 font-semibold text-ink bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="size-3 sm:size-3.5 text-primary" />
            <span>Refresh Data</span>
          </Button>
        </div>

        <UserManagement />
      </main>
    </div>
  );
};

export default AdminUsers;
