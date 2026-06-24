import React, { useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  Ban,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/UI/dialog";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI/avatar";
import { TrustScoreBadge } from "@/Components/Providers/TrustScoreBadge";
import { TrustScoreGauge } from "@/Components/Providers/TrustScoreGauge";
import { VerificationBadge } from "@/Components/Providers/VerificationBadge";
import { useAdminUserDetails, useAdminUserBookings } from "@/hooks/useAdmin";
import type { User, Booking } from "@/types";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");

  const { data: userDetails } = useAdminUserDetails(
    isOpen && user ? user.id : null,
  );
  const { data: bookings = [], isLoading: isBookingsLoading } = useAdminUserBookings(
    isOpen && user ? user.id : null,
  );

  if (!user) return null;

  const currentUser = userDetails?.user || user;
  const isProvider = currentUser.role === "provider";
  const stats = userDetails?.stats;

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300">Completed</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300">Accepted</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300">Pending</Badge>;
      case "declined":
        return <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Declined</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 rounded-2xl border border-border shadow-sm">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-xl font-bold text-ink">
                    {currentUser.name}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={
                      currentUser.role === "admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : currentUser.role === "provider"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    }
                  >
                    {currentUser.role.toUpperCase()}
                  </Badge>
                  {currentUser.isSuspended ? (
                    <Badge variant="destructive" className="flex items-center gap-1 bg-rose-600">
                      <Ban className="size-3" />
                      <span>Suspended</span>
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-600 text-white flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Active</span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @{currentUser.username} • ID: {currentUser.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs h-8"
                  onClick={() => onEdit(currentUser)}
                >
                  Edit
                </Button>
              )}
              {onToggleStatus && (
                <Button
                  size="sm"
                  variant={currentUser.isSuspended ? "default" : "destructive"}
                  className="rounded-xl text-xs h-8"
                  onClick={() => onToggleStatus(currentUser)}
                >
                  {currentUser.isSuspended ? "Reactivate" : "Suspend"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-ink hover:bg-muted"
              }`}
            >
              Account Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bookings"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-ink hover:bg-muted"
              }`}
            >
              <span>Booking History</span>
              <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
                {bookings.length}
              </span>
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 text-left">
          {currentUser.isSuspended && currentUser.suspensionReason && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="size-4" />
                <span>Account Suspension Notice</span>
              </div>
              <p className="mt-1 text-rose-700 dark:text-rose-400">
                {currentUser.suspensionReason}
              </p>
            </div>
          )}

          {activeTab === "profile" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <UserIcon className="size-3.5" />
                    <span>Contact & Location</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-ink">
                      <Mail className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink">
                      <Phone className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{currentUser.phone || "No phone provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink">
                      <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {currentUser.location?.city || "Addis Ababa"},{" "}
                        {currentUser.location?.subCity || "Bole"}
                        {currentUser.location?.address ? ` (${currentUser.location.address})` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ink">
                      <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                      <span>
                        Joined {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5" />
                    <span>Activity & Standing</span>
                  </h4>
                  {stats ? (
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-extrabold text-ink">
                          {isProvider ? stats.totalBookingsProvider : stats.totalBookingsCustomer}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Total Bookings</div>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                        <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                          {stats.completedBookings}
                        </div>
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-400">Completed</div>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                        <div className="text-lg font-extrabold text-blue-700 dark:text-blue-300">
                          {stats.activeBookings}
                        </div>
                        <div className="text-[11px] text-blue-800 dark:text-blue-400">Active</div>
                      </div>
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                        <div className="text-lg font-extrabold text-rose-700 dark:text-rose-300">
                          {stats.cancelledBookings}
                        </div>
                        <div className="text-[11px] text-rose-800 dark:text-rose-400">Cancelled</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Loading activity...</div>
                  )}
                </div>
              </div>

              {isProvider && (
                <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" />
                      <span>Provider Trust Standing</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <VerificationBadge status={currentUser.verificationStatus || "unverified"} />
                      <TrustScoreBadge score={currentUser.trustScore ?? 15} />
                    </div>
                  </div>

                  <TrustScoreGauge score={currentUser.trustScore ?? 15} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-border">
                    <div>
                      <span className="text-muted-foreground">Service Category:</span>
                      <p className="font-semibold text-ink">{currentUser.category || "General Services"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hourly Rate:</span>
                      <p className="font-semibold text-ink">{currentUser.hourlyRate ? `${currentUser.hourlyRate} ETB/hr` : "Custom quote"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-semibold text-ink">{currentUser.experienceYears ? `${currentUser.experienceYears} years` : "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verification Document:</span>
                      {currentUser.verificationDocUrl ? (
                        <a
                          href={currentUser.verificationDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{currentUser.verificationDocType || "View Document"}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <p className="text-muted-foreground">None uploaded</p>
                      )}
                    </div>
                  </div>

                  {currentUser.skills && currentUser.skills.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Skills:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {currentUser.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-[11px] rounded-lg">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentUser.bio && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Bio / Overview:</span>
                      <p className="text-xs text-ink mt-1 bg-muted/30 p-2.5 rounded-lg">
                        {currentUser.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Bookings Involving User
              </h4>

              {isBookingsLoading ? (
                <div className="text-xs text-muted-foreground py-8 text-center">
                  Loading bookings history...
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-xs text-muted-foreground py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                  No bookings recorded for this account.
                </div>
              ) : (
                <div className="space-y-2">
                  {bookings.map((booking) => {
                    const counterpart =
                      currentUser.role === "provider"
                        ? (typeof booking.customer === "object" ? booking.customer : null)
                        : (typeof booking.provider === "object" ? booking.provider : null);

                    return (
                      <div
                        key={booking.id}
                        className="rounded-xl border border-border p-3.5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{booking.category}</span>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-muted-foreground">
                            {currentUser.role === "provider" ? "Customer: " : "Provider: "}
                            <span className="font-medium text-ink">
                              {counterpart ? counterpart.name : "User"}
                            </span>
                            {" • "}
                            <span>{booking.serviceDate} ({booking.timeSlot})</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Location: {booking.address}, {booking.city}
                          </p>
                        </div>

                        <div className="text-[11px] text-muted-foreground self-start sm:self-auto shrink-0">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
