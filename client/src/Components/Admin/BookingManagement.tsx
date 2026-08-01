import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
import { useAdminBookings, useAdminCancelBooking } from "@/hooks/useAdmin";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import AdminCancelBookingModal from "./AdminCancelBookingModal";
import type { Booking, User, AdminBookingFilters } from "@/types";
import { getErrorMessage } from "@/utils/helpers";

export const BookingManagement: React.FC = () => {
  const { categories } = useCategories();
  const { cities } = useLocations();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<AdminBookingFilters>(() => {
    const status = (searchParams.get("status") as AdminBookingFilters["status"]) || "all";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const search = searchParams.get("search") || "";
    const sortBy = (searchParams.get("sortBy") as AdminBookingFilters["sortBy"]) || "newest";
    const page = Number(searchParams.get("page")) || 1;

    return {
      status,
      category,
      city,
      search,
      sortBy,
      page,
      limit: 12,
    };
  });

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const cancelMutation = useAdminCancelBooking();

  useEffect(() => {
    const status = (searchParams.get("status") as AdminBookingFilters["status"]) || "all";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const search = searchParams.get("search") || "";
    const sortBy = (searchParams.get("sortBy") as AdminBookingFilters["sortBy"]) || "newest";
    const page = Number(searchParams.get("page")) || 1;

    setFilters((prev) => {
      if (
        prev.status === status &&
        prev.category === category &&
        prev.city === city &&
        prev.search === search &&
        prev.sortBy === sortBy &&
        prev.page === page
      ) {
        return prev;
      }
      return {
        ...prev,
        status,
        category,
        city,
        search,
        sortBy,
        page,
      };
    });
    setSearchInput(search);
  }, [searchParams]);

  const updateUrlParams = (newFilters: Partial<AdminBookingFilters>) => {
    const nextParams = new URLSearchParams(searchParams);

    const merged = { ...filters, ...newFilters };

    if (merged.status && merged.status !== "all") {
      nextParams.set("status", merged.status);
    } else {
      nextParams.delete("status");
    }

    if (merged.category && merged.category !== "all") {
      nextParams.set("category", merged.category);
    } else {
      nextParams.delete("category");
    }

    if (merged.city && merged.city !== "all") {
      nextParams.set("city", merged.city);
    } else {
      nextParams.delete("city");
    }

    if (merged.search) {
      nextParams.set("search", merged.search);
    } else {
      nextParams.delete("search");
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

  const { data, isLoading } = useAdminBookings(filters);

  const bookings = data?.bookings || [];
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

  const handleStatusTabChange = (status: AdminBookingFilters["status"]) => {
    updateUrlParams({ status, page: 1 });
  };

  const handleStatCardClick = (status: AdminBookingFilters["status"]) => {
    updateUrlParams({ status, page: 1 });
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ id: bookingId, reason });
      setActionNotice("Booking successfully cancelled by administrator.");
      setTimeout(() => setActionNotice(""), 4000);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to cancel booking."));
    }
  };

  const isAllSelected = !filters.status || filters.status === "all";
  const isPendingSelected = filters.status === "pending";
  const isAcceptedSelected = filters.status === "accepted";
  const isCompletedSelected = filters.status === "completed";
  const isCancelledSelected = filters.status === "cancelled" || filters.status === "declined";

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="trustHigh" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">
            Accepted
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="trustElite" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">
            Completed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">Cancelled</Badge>;
      case "declined":
        return <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">Declined</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 whitespace-nowrap">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-left min-w-0">
      {actionNotice && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 sm:p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Summary metric cards */}
      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleStatCardClick("all")}
            className={cn(
              "rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20",
              isAllSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-primary/40 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">All Bookings</span>
              <Calendar className="size-3.5 sm:size-4 text-primary shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-base sm:text-2xl font-extrabold text-ink tabular-nums truncate">
              {counts.total}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              All platform orders
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("pending")}
            className={cn(
              "rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20",
              isPendingSelected
                ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-amber-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Pending</span>
              <Clock className="size-3.5 sm:size-4 text-amber-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-base sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums truncate">
              {counts.pending}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Awaiting confirmation
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("accepted")}
            className={cn(
              "rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              isAcceptedSelected
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-blue-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Active / Scheduled</span>
              <CheckCircle2 className="size-3.5 sm:size-4 text-blue-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-base sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums truncate">
              {counts.accepted}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              In progress & active
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("completed")}
            className={cn(
              "rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
              isCompletedSelected
                ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-emerald-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Completed</span>
              <ShieldCheck className="size-3.5 sm:size-4 text-emerald-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-base sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums truncate">
              {counts.completed}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Verified deliveries
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick("cancelled")}
            className={cn(
              "rounded-xl border p-2.5 sm:p-4 text-left min-w-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20",
              isCancelledSelected
                ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs"
                : "border-border bg-card shadow-xs hover:border-rose-400/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-xs font-semibold">
              <span className="truncate">Cancelled / Declined</span>
              <Ban className="size-3.5 sm:size-4 text-rose-600 shrink-0 ml-1" />
            </div>
            <div className="mt-1 sm:mt-2 text-base sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums truncate">
              {counts.cancelled + counts.declined}
            </div>
            <div className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              Closed or rejected
            </div>
          </button>
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status quick tabs */}
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl overflow-x-auto max-w-full scrollbar-none no-scrollbar shrink-0"
          >
            <button
              type="button"
              onClick={() => handleStatusTabChange("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isAllSelected
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              All ({counts?.total ?? total})
            </button>
            <button
              type="button"
              onClick={() => handleStatusTabChange("pending")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.status === "pending"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Pending ({counts?.pending ?? 0})
            </button>
            <button
              type="button"
              onClick={() => handleStatusTabChange("accepted")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.status === "accepted"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Accepted ({counts?.accepted ?? 0})
            </button>
            <button
              type="button"
              onClick={() => handleStatusTabChange("completed")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.status === "completed"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Completed ({counts?.completed ?? 0})
            </button>
            <button
              type="button"
              onClick={() => handleStatusTabChange("cancelled")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filters.status === "cancelled"
                  ? "bg-background text-ink shadow-xs"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Cancelled / Declined ({(counts?.cancelled ?? 0) + (counts?.declined ?? 0)})
            </button>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:max-w-md">
            <div className="relative grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search booking ref, customer, provider..."
                className="pl-8.5 pr-8 h-9 text-xs rounded-xl"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="h-9 px-3 text-xs rounded-xl shrink-0 cursor-pointer font-bold">
              Search
            </Button>
          </form>
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border">
          <div>
            <Select
              value={filters.category || "all"}
              onValueChange={(val) =>
                updateUrlParams({ category: val === "all" ? "" : val, page: 1 })
              }
            >
              <SelectTrigger className="h-8.5 text-xs rounded-lg">
                <SelectValue placeholder="Category: All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All Services</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
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
              <SelectTrigger className="h-8.5 text-xs rounded-lg">
                <SelectValue placeholder="Location: All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Location: All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.sortBy || "newest"}
              onValueChange={(val) =>
                updateUrlParams({ sortBy: val as AdminBookingFilters["sortBy"], page: 1 })
              }
            >
              <SelectTrigger className="h-8.5 text-xs rounded-lg">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort: Newest First</SelectItem>
                <SelectItem value="oldest">Sort: Oldest First</SelectItem>
                <SelectItem value="serviceDateAsc">Sort: Service Date (Soonest)</SelectItem>
                <SelectItem value="serviceDateDesc">Sort: Service Date (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bookings View: Desktop Table & Mobile Cards */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {bookings.length === 0 && !isLoading ? (
          <div className="py-12 px-4 text-center text-muted-foreground">
            <Calendar className="size-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="font-semibold text-ink">No bookings found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your filter criteria or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 whitespace-nowrap">Booking Ref</th>
                    <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                    <th className="py-3 px-4 whitespace-nowrap">Provider</th>
                    <th className="py-3 px-4 whitespace-nowrap">Service & Schedule</th>
                    <th className="py-3 px-4 whitespace-nowrap">Location</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Created</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-3.5 px-4"><div className="h-4 w-16 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 w-28 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 w-16 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4"><div className="h-3 w-16 bg-muted rounded" /></td>
                        <td className="py-3.5 px-4 text-right"><div className="h-7 w-7 bg-muted rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    bookings.map((booking) => {
                      const customerObj =
                        typeof booking.customer === "object" ? (booking.customer as User) : null;
                      const providerObj =
                        typeof booking.provider === "object" ? (booking.provider as User) : null;
                      const isCancellable =
                        booking.status === "pending" || booking.status === "accepted";

                      return (
                        <tr key={booking.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="py-3.5 px-4 font-mono font-bold text-ink text-xs whitespace-nowrap">
                            <Link
                              to={`/admin/bookings/${booking.id}`}
                              className="text-primary hover:underline"
                            >
                              #{booking.id.slice(-6).toUpperCase()}
                            </Link>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-8 rounded-xl border border-border shrink-0">
                                <AvatarImage src={customerObj?.avatar} alt={customerObj?.name} />
                                <AvatarFallback className="text-[11px] font-bold">
                                  {customerObj?.name ? customerObj.name.charAt(0).toUpperCase() : "C"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-bold text-ink leading-tight whitespace-nowrap">
                                  {customerObj?.name || "Customer"}
                                </p>
                                <p className="text-[11px] text-muted-foreground whitespace-nowrap mt-0.5">
                                  {customerObj?.phone || customerObj?.email || "No contact info"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-8 rounded-xl border border-border shrink-0">
                                <AvatarImage src={providerObj?.avatar} alt={providerObj?.name} />
                                <AvatarFallback className="text-[11px] font-bold">
                                  {providerObj?.name ? providerObj.name.charAt(0).toUpperCase() : "P"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-bold text-ink leading-tight whitespace-nowrap">
                                  {providerObj?.name || "Provider"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                                  {providerObj?.trustScore !== undefined && (
                                    <TrustScoreBadge score={providerObj.trustScore} size="xs" showLabel={false} />
                                  )}
                                  <span className="text-[11px] text-muted-foreground">
                                    {providerObj?.category || ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-ink whitespace-nowrap">
                              {booking.category}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 whitespace-nowrap">
                              <Calendar className="size-3 text-primary shrink-0" />
                              <span>{booking.serviceDate}</span>
                              <span className="text-muted-foreground/40">•</span>
                              <span>{booking.timeSlot}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-ink">
                            <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                              <MapPin className="size-3 text-muted-foreground shrink-0" />
                              <span>
                                {booking.subCity ? `${booking.subCity}, ` : ""}
                                {booking.city || "Addis Ababa"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getStatusBadge(booking.status)}
                          </td>

                          <td className="py-3.5 px-4 text-muted-foreground text-[11px] whitespace-nowrap">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "—"}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-7.5 p-0 rounded-lg hover:bg-muted cursor-pointer"
                                >
                                  <MoreVertical className="size-3.5 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs">
                                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                  <Link to={`/admin/bookings/${booking.id}`} className="flex items-center gap-2">
                                    <Eye className="size-3.5 text-primary" />
                                    <span>Inspect Details</span>
                                  </Link>
                                </DropdownMenuItem>
                                {isCancellable && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleCancelClick(booking)}
                                      className="gap-2 text-rose-700 cursor-pointer"
                                    >
                                      <Ban className="size-3.5" />
                                      <span>Cancel as Admin</span>
                                    </DropdownMenuItem>
                                  </>
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

            {/* Mobile Card View (visible on <md) */}
            <div className="md:hidden divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="p-3.5 space-y-2.5 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-16 w-full bg-muted rounded-xl" />
                  </div>
                ))
              ) : (
                bookings.map((booking) => {
                  const customerObj =
                    typeof booking.customer === "object" ? (booking.customer as User) : null;
                  const providerObj =
                    typeof booking.provider === "object" ? (booking.provider as User) : null;
                  const isCancellable =
                    booking.status === "pending" || booking.status === "accepted";

                  return (
                    <div key={booking.id} className="p-3.5 sm:p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <Link
                            to={`/admin/bookings/${booking.id}`}
                            className="font-mono font-bold text-primary text-xs shrink-0 hover:underline"
                          >
                            #{booking.id.slice(-6).toUpperCase()}
                          </Link>
                          <span className="text-xs font-bold text-ink truncate">
                            {booking.category}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Customer & Provider Rows */}
                      <div className="space-y-1.5 py-0.5">
                        <div className="flex items-center justify-between gap-2 bg-muted/40 p-2.5 rounded-xl text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-7.5 rounded-lg border border-border shrink-0">
                              <AvatarImage src={customerObj?.avatar} alt={customerObj?.name} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {customerObj?.name ? customerObj.name.charAt(0).toUpperCase() : "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
                                Customer
                              </div>
                              <p className="font-bold text-ink text-xs truncate leading-tight">
                                {customerObj?.name || "Customer"}
                              </p>
                            </div>
                          </div>
                          {customerObj?.phone && (
                            <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                              {customerObj.phone}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 bg-muted/40 p-2.5 rounded-xl text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-7.5 rounded-lg border border-border shrink-0">
                              <AvatarImage src={providerObj?.avatar} alt={providerObj?.name} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {providerObj?.name ? providerObj.name.charAt(0).toUpperCase() : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
                                Provider
                              </div>
                              <p className="font-bold text-ink text-xs truncate leading-tight">
                                {providerObj?.name || "Provider"}
                              </p>
                            </div>
                          </div>
                          {providerObj?.trustScore !== undefined && (
                            <div className="shrink-0">
                              <TrustScoreBadge score={providerObj.trustScore} size="xs" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Schedule and Location */}
                      <div className="space-y-1 text-xs text-muted-foreground pt-0.5">
                        <div className="flex items-center gap-1.5 text-ink font-medium flex-wrap">
                          <Calendar className="size-3.5 text-primary shrink-0" />
                          <span className="whitespace-nowrap">{booking.serviceDate}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="whitespace-nowrap">{booking.timeSlot}</span>
                        </div>

                        <div className="flex items-start gap-1.5 text-[11px]">
                          <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-ink">
                            {booking.address ? `${booking.address}, ` : ""}
                            {booking.subCity ? `${booking.subCity}, ` : ""}
                            {booking.city || "Addis Ababa"}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Card Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                        <span className="text-[10.5px] text-muted-foreground">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : ""}
                        </span>

                        <div className="flex items-center gap-2">
                          <Link to={`/admin/bookings/${booking.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl text-xs h-7.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer"
                            >
                              <Eye className="size-3 text-primary" />
                              <span>Details</span>
                            </Button>
                          </Link>
                          {isCancellable && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-xl text-xs h-7.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer"
                              onClick={() => handleCancelClick(booking)}
                            >
                              <Ban className="size-3" />
                              <span>Cancel</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Pagination bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-border flex flex-col xs:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="text-muted-foreground text-center xs:text-left text-[11px] sm:text-xs">
            Showing <span className="font-semibold text-ink">{bookings.length}</span> of{" "}
            <span className="font-semibold text-ink">{total}</span> bookings
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

      <AdminCancelBookingModal
        booking={selectedBooking}
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default BookingManagement;
