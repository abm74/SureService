import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  MoreVertical,
  Eye,
  Edit2,
  Ban,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  ShieldAlert,
  Shield,
  MapPin,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI/avatar";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/UI/dropdown-menu";
import { cn } from "@/lib/utils";
import { getTrustTier } from "@/utils/trustTier";
import { useAdminUsers } from "@/hooks/useAdmin";
import { useLocations } from "@/hooks/useLocations";
import UserDetailsModal from "./UserDetailsModal";
import UserEditModal from "./UserEditModal";
import UserStatusModal from "./UserStatusModal";
import UserDeleteModal from "./UserDeleteModal";
import type { User, AdminUserFilters } from "@/types";

export const UserManagement: React.FC = () => {
  const { cities } = useLocations();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<AdminUserFilters>(() => {
    const role = (searchParams.get("role") as "all" | "customer" | "provider" | "admin") || "all";
    const status = (searchParams.get("status") as "all" | "active" | "suspended") || "all";
    const verificationStatus = (searchParams.get("verificationStatus") as AdminUserFilters["verificationStatus"]) || "all";
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const sortBy = (searchParams.get("sortBy") as AdminUserFilters["sortBy"]) || "newest";
    const page = Number(searchParams.get("page")) || 1;

    return {
      role,
      status,
      verificationStatus,
      search,
      city,
      sortBy,
      page,
      limit: 12,
    };
  });

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const role = (searchParams.get("role") as "all" | "customer" | "provider" | "admin") || "all";
    const status = (searchParams.get("status") as "all" | "active" | "suspended") || "all";
    const verificationStatus = (searchParams.get("verificationStatus") as AdminUserFilters["verificationStatus"]) || "all";
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const sortBy = (searchParams.get("sortBy") as AdminUserFilters["sortBy"]) || "newest";
    const page = Number(searchParams.get("page")) || 1;

    setFilters((prev) => {
      if (
        prev.role === role &&
        prev.status === status &&
        prev.verificationStatus === verificationStatus &&
        prev.search === search &&
        prev.city === city &&
        prev.sortBy === sortBy &&
        prev.page === page
      ) {
        return prev;
      }
      return {
        ...prev,
        role,
        status,
        verificationStatus,
        search,
        city,
        sortBy,
        page,
      };
    });
    setSearchInput(search);
  }, [searchParams]);

  const updateUrlParams = (newFilters: Partial<AdminUserFilters>) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "users");

    const merged = { ...filters, ...newFilters };

    if (merged.role && merged.role !== "all") {
      nextParams.set("role", merged.role);
    } else {
      nextParams.delete("role");
    }

    if (merged.status && merged.status !== "all") {
      nextParams.set("status", merged.status);
    } else {
      nextParams.delete("status");
    }

    if (merged.verificationStatus && merged.verificationStatus !== "all") {
      nextParams.set("verificationStatus", merged.verificationStatus);
    } else {
      nextParams.delete("verificationStatus");
    }

    if (merged.search) {
      nextParams.set("search", merged.search);
    } else {
      nextParams.delete("search");
    }

    if (merged.city) {
      nextParams.set("city", merged.city);
    } else {
      nextParams.delete("city");
    }

    if (merged.sortBy && merged.sortBy !== "newest") {
      nextParams.set("sortBy", merged.sortBy);
    } else {
      nextParams.delete("sortBy");
    }

    if (merged.page && merged.page > 1) {
      nextParams.set("page", String(merged.page));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const { data, isLoading } = useAdminUsers(filters);

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const counts = data?.counts;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateUrlParams({ search: "", page: 1 });
  };

  const handleRoleTabChange = (role: "all" | "customer" | "provider" | "admin") => {
    updateUrlParams({ role, page: 1 });
  };

  const handleStatCardClick = (type: "all" | "provider" | "customer" | "suspended") => {
    if (type === "all") {
      updateUrlParams({ role: "all", status: "all", page: 1 });
    } else if (type === "provider") {
      updateUrlParams({ role: "provider", status: "all", page: 1 });
    } else if (type === "customer") {
      updateUrlParams({ role: "customer", status: "all", page: 1 });
    } else if (type === "suspended") {
      updateUrlParams({ status: "suspended", role: "all", page: 1 });
    }
  };

  const handleInspect = (user: User) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setStatusModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const isTotalSelected = filters.role === "all" && filters.status === "all";
  const isProvidersSelected = filters.role === "provider" && filters.status !== "suspended";
  const isCustomersSelected = filters.role === "customer" && filters.status !== "suspended";
  const isSuspendedSelected = filters.status === "suspended";

  return (
    <div className="space-y-6 text-left">
      {/* Summary metric pill banner */}
      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleStatCardClick("all")}
            className={cn(
              "rounded-lg sm:rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20",
              isTotalSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-primary/40 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Total Users</span>
              <Users className="size-3.5 sm:size-4 text-primary shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-extrabold text-ink tabular-nums truncate">
              {counts.total}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Platform accounts
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("provider")}
            className={cn(
              "rounded-lg sm:rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              isProvidersSelected
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-blue-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Service Providers</span>
              <ShieldCheck className="size-3.5 sm:size-4 text-blue-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums truncate">
              {counts.providers}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Verified & active trades
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("customer")}
            className={cn(
              "rounded-lg sm:rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20",
              isCustomersSelected
                ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-teal-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Customers</span>
              <Users className="size-3.5 sm:size-4 text-teal-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums truncate">
              {counts.customers}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Homeowners & clients
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("suspended")}
            className={cn(
              "rounded-lg sm:rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20",
              isSuspendedSelected
                ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-rose-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Suspended</span>
              <Ban className="size-3.5 sm:size-4 text-rose-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums truncate">
              {counts.suspended}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Moderated accounts
            </div>
          </button>
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Role filter buttons */}
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl self-start overflow-x-auto max-w-full scrollbar-none no-scrollbar"
          >
            <button
              type="button"
              onClick={() => handleRoleTabChange("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.role === "all"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              All Users ({counts?.total ?? total})
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange("customer")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.role === "customer"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Customers ({counts?.customers ?? 0})
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange("provider")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.role === "provider"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Providers ({counts?.providers ?? 0})
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 grow max-w-md">
            <div className="relative grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, phone, trade..."
                className="pl-8.5 pr-8 h-9 text-xs rounded-xl"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="h-9 px-3 text-xs rounded-xl">
              Search
            </Button>
          </form>
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-border">
          <div>
            <Select
              value={filters.status}
              onValueChange={(val: "all" | "active" | "suspended") =>
                updateUrlParams({ status: val, page: 1 })
              }
            >
              <SelectTrigger className="h-8 text-xs rounded-lg">
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="suspended">Suspended Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.verificationStatus}
              onValueChange={(val: "all" | "approved" | "pending" | "rejected" | "unverified") =>
                updateUrlParams({ verificationStatus: val, page: 1 })
              }
            >
              <SelectTrigger className="h-8 text-xs rounded-lg">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Verification: All</SelectItem>
                <SelectItem value="approved">Approved & Verified</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.city || "all"}
              onValueChange={(val) =>
                updateUrlParams({ city: val === "all" ? "" : val, page: 1 })
              }
            >
              <SelectTrigger className="h-8 text-xs rounded-lg">
                <SelectValue placeholder="Filter City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">City: All Locations</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.sortBy}
              onValueChange={(
                val: "newest" | "oldest" | "nameAsc" | "nameDesc" | "trustScore" | "completedJobs"
              ) => updateUrlParams({ sortBy: val, page: 1 })}
            >
              <SelectTrigger className="h-8 text-xs rounded-lg">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort: Newest First</SelectItem>
                <SelectItem value="oldest">Sort: Oldest First</SelectItem>
                <SelectItem value="nameAsc">Sort: Name (A-Z)</SelectItem>
                <SelectItem value="nameDesc">Sort: Name (Z-A)</SelectItem>
                <SelectItem value="trustScore">Sort: Trust Score</SelectItem>
                <SelectItem value="completedJobs">Sort: Completed Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {users.length === 0 && !isLoading ? (
          <div className="py-12 px-4 text-center text-muted-foreground">
            <Users className="size-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="font-semibold text-ink">No users found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search criteria or clear active filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Trust & Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-muted" />
                          <div className="space-y-1">
                            <div className="h-3.5 w-24 bg-muted rounded" />
                            <div className="h-2.5 w-32 bg-muted rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><div className="h-4 w-16 bg-muted rounded" /></td>
                      <td className="py-3.5 px-4"><div className="h-3 w-20 bg-muted rounded" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 w-14 bg-muted rounded" /></td>
                      <td className="py-3.5 px-4"><div className="h-3 w-16 bg-muted rounded" /></td>
                      <td className="py-3.5 px-4 text-right"><div className="h-7 w-7 bg-muted rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => {
                  const isProv = user.role === "provider";
                  const tier = isProv ? getTrustTier(user.trustScore ?? 15) : null;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 rounded-xl border border-border">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs font-bold">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-bold text-ink truncate flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === "admin" && (
                                <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-semibold text-[10px] tracking-wider",
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                              : user.role === "provider"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                              : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800"
                          )}
                        >
                          {user.role.toUpperCase()}
                        </Badge>
                        {isProv && user.category && (
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[130px]">
                            {user.category}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-ink">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate">
                            {user.location?.city || "Addis Ababa"},{" "}
                            {user.location?.subCity || "Bole"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {isProv && tier ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-baseline gap-0.5">
                                <span className="font-bold text-xs tabular-nums text-ink">
                                  {user.trustScore ?? 15}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-normal">/100</span>
                              </div>
                              <div className="w-12 h-1.5 rounded-full bg-muted/80 overflow-hidden shrink-0">
                                <div
                                  className={cn("h-full rounded-full transition-all", tier.barColor)}
                                  style={{ width: `${Math.min(100, Math.max(0, user.trustScore ?? 15))}%` }}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] font-semibold px-1.5 py-0.2 rounded-md border",
                                  tier.bgColor,
                                  tier.textColor,
                                  tier.borderColor
                                )}
                              >
                                {tier.tier}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {user.verificationStatus === "approved" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span>Verified</span>
                                </span>
                              ) : user.verificationStatus === "pending" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                                  <Clock className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                                  <span>Pending Review</span>
                                </span>
                              ) : user.verificationStatus === "rejected" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300">
                                  <ShieldAlert className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                                  <span>Rejected</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Shield className="size-3.5 opacity-50 shrink-0" />
                                  <span>Unverified</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted-foreground">
                            {user.role === "admin" ? (
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Platform Admin</span>
                            ) : user.completedJobsCount && user.completedJobsCount > 0 ? (
                              <span>{user.completedJobsCount} bookings</span>
                            ) : (
                              <span className="text-muted-foreground/70">—</span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {user.isSuspended ? (
                          <Badge
                            variant="outline"
                            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 flex items-center gap-1 w-fit font-semibold text-[11px] px-2 py-0.5"
                          >
                            <span className="size-1.5 rounded-full bg-rose-500" />
                            <span>Suspended</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1 w-fit font-semibold text-[11px] px-2 py-0.5"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-muted-foreground text-[11px]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-7 p-0 rounded-lg hover:bg-muted"
                            >
                              <MoreVertical className="size-3.5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs">
                            <DropdownMenuItem
                              onClick={() => handleInspect(user)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="size-3.5 text-primary" />
                              <span>Inspect Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(user)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit2 className="size-3.5 text-muted-foreground" />
                              <span>Edit Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                              className={`gap-2 cursor-pointer ${
                                user.isSuspended ? "text-emerald-700 font-semibold" : "text-rose-700"
                              }`}
                            >
                              {user.isSuspended ? (
                                <>
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Reactivate Account</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="size-3.5" />
                                  <span>Suspend Account</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            {user.role !== "admin" && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(user)}
                                className="gap-2 text-rose-700 cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

        {/* Pagination bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-border flex flex-col xs:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="text-muted-foreground text-center xs:text-left text-[11px] sm:text-xs">
            Showing <span className="font-semibold text-ink">{users.length}</span> of{" "}
            <span className="font-semibold text-ink">{total}</span> accounts
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1 || isLoading}
              onClick={() => updateUrlParams({ page: (filters.page || 1) - 1 })}
              className="h-7.5 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs"
            >
              <ChevronLeft className="size-3 sm:size-3.5 mr-0.5 sm:mr-1" />
              <span>Previous</span>
            </Button>
            <span className="px-1.5 sm:px-2 text-muted-foreground font-semibold text-[10.5px] sm:text-xs whitespace-nowrap">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) >= totalPages || isLoading}
              onClick={() => updateUrlParams({ page: (filters.page || 1) + 1 })}
              className="h-7.5 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs"
            >
              <span>Next</span>
              <ChevronRight className="size-3 sm:size-3.5 ml-0.5 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        onEdit={(u) => {
          setDetailsModalOpen(false);
          handleEdit(u);
        }}
        onToggleStatus={(u) => {
          setDetailsModalOpen(false);
          handleToggleStatus(u);
        }}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <UserStatusModal
        user={selectedUser}
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <UserDeleteModal
        user={selectedUser}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UserManagement;
