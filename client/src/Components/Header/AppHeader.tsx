import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  ChevronDown,
  Calendar,
  Store,
  Info,
  Users,
  Activity,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/store/Auth/AuthContext";
import { useProviderBookings } from "@/hooks/useBookings";
import { usePendingVerifications } from "@/hooks/useAdmin";
import { Button } from "@/Components/UI/button";
import { Badge } from "@/Components/UI/badge";

export const AppHeader: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const role = user?.role || "customer";
  const isAdmin = Boolean(isAuthenticated && role === "admin");
  const isProvider = Boolean(isAuthenticated && role === "provider");
  const { data: providerBookings = [] } = useProviderBookings(isProvider);
  const { data: pendingVerifications = [] } = usePendingVerifications(isAdmin);
  const navigate = useNavigate();

  const pendingRequestsCount = providerBookings.filter((b) => b.status === "pending").length;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const defaultAvatar = "/default-avatar.jpg";
  const profileAvatar = user?.avatar && !imgError ? user.avatar : defaultAvatar;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-2xs"
        : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
    }`;

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-hairline h-16 sm:h-18 px-3 sm:px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shrink-0 select-none">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="size-8 sm:size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="size-4 sm:size-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-ink">
            Sure<span className="text-primary">Service</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 bg-surface-soft/80 border border-hairline/80 rounded-full p-1 shadow-2xs">
          <NavLink to="/marketplace" className={linkClass}>
            <Store className="size-3.5" />
            <span>Marketplace</span>
          </NavLink>

          {isAuthenticated && role === "customer" && (
            <NavLink to="/bookings" className={linkClass}>
              <Calendar className="size-3.5" />
              <span>My Bookings</span>
            </NavLink>
          )}

          {isAuthenticated && role === "provider" && (
            <>
              <NavLink to="/provider/bookings" className={linkClass}>
                <Calendar className="size-3.5" />
                <span>Bookings</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                    {pendingRequestsCount}
                  </span>
                )}
              </NavLink>

              <NavLink to="/provider/stats" className={linkClass}>
                <Activity className="size-3.5" />
                <span>Trust & Stats</span>
              </NavLink>

              <NavLink to="/provider/verification" className={linkClass}>
                <ShieldCheck className="size-3.5" />
                <span>Verification</span>
              </NavLink>

              <NavLink to="/provider/profile" className={linkClass}>
                <SlidersHorizontal className="size-3.5" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {isAuthenticated && role === "admin" && (
            <>
              <NavLink to="/admin/users" className={linkClass}>
                <Users className="size-3.5" />
                <span>Users</span>
              </NavLink>

              <NavLink to="/admin/bookings" className={linkClass}>
                <Calendar className="size-3.5" />
                <span>Bookings</span>
              </NavLink>

              <NavLink to="/admin/verifications" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <ShieldCheck className="size-3.5" />
                    <span>Verifications</span>
                    {pendingVerifications.length > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? "bg-amber-400 text-amber-950 font-black"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {pendingVerifications.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </>
          )}

          {role !== "admin" && (
            <NavLink to="/about" className={linkClass}>
              <Info className="size-3.5" />
              <span>About</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-9 px-4 border-hairline hover:border-ink cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="rounded-full text-xs h-9 px-4 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer font-bold"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 bg-surface-soft border border-hairline/80 p-1 pr-3 rounded-full shadow-xs hover:bg-surface-hover hover:border-primary/30 transition-all cursor-pointer focus:outline-none group"
              aria-expanded={isDropdownOpen}
            >
              <div className="size-7.5 sm:size-8 rounded-full overflow-hidden ring-1 ring-primary/30 shrink-0">
                <img
                  className="size-full object-cover"
                  src={profileAvatar}
                  alt={user?.name || "User"}
                  onError={() => setImgError(true)}
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-ink max-w-[120px] truncate leading-tight group-hover:text-primary transition-colors">
                  {user?.name || "User"}
                </p>
                <span className="text-[10px] text-muted-foreground capitalize font-medium">
                  {role}
                </span>
              </div>
              <ChevronDown
                className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-72 max-w-xs bg-background border border-hairline rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md">
                <div className="p-3 bg-surface-soft/70 rounded-xl border border-hairline/60 mb-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <img
                      className="size-10 rounded-full object-cover ring-1 ring-primary/40 shadow-xs"
                      src={profileAvatar}
                      alt={user?.name || "User"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-ink truncate">{user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-hairline/50">
                    <span className="text-[11px] text-muted-foreground font-medium">Active Role</span>
                    <Badge variant={role === "admin" ? "destructive" : role === "provider" ? "trustHigh" : "default"}>
                      {role.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="md:hidden space-y-1 py-1 border-b border-hairline/60">
                  <Link
                    to="/marketplace"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                  >
                    <Store className="size-3.5 text-primary" />
                    <span>Marketplace</span>
                  </Link>

                  {role === "customer" && (
                    <Link
                      to="/bookings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                    >
                      <Calendar className="size-3.5 text-primary" />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  {role === "provider" && (
                    <>
                      <Link
                        to="/provider/bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="size-3.5 text-primary" />
                          <span>Bookings</span>
                        </div>
                        {pendingRequestsCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                            {pendingRequestsCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/provider/stats"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <Activity className="size-3.5 text-primary" />
                        <span>Trust & Stats</span>
                      </Link>
                      <Link
                        to="/provider/verification"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <ShieldCheck className="size-3.5 text-primary" />
                        <span>ID Verification</span>
                      </Link>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      <Link
                        to="/admin/users"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="size-3.5 text-primary" />
                          <span>User Directory</span>
                        </div>
                      </Link>
                      <Link
                        to="/admin/bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="size-3.5 text-primary" />
                          <span>Bookings</span>
                        </div>
                      </Link>
                      <Link
                        to="/admin/verifications"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="size-3.5 text-primary" />
                          <span>ID Verifications</span>
                        </div>
                        {pendingVerifications.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                            {pendingVerifications.length}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                </div>

                {role === "provider" && (
                  <div className="space-y-1 py-1">
                    {user?.id && (
                      <Link
                        to={`/providers/${user.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                      >
                        <ExternalLink className="size-3.5 text-primary" />
                        <span>View Public Profile</span>
                      </Link>
                    )}
                    <Link
                      to="/provider/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                    >
                      <SlidersHorizontal className="size-3.5 text-primary" />
                      <span>Edit Profile & Rates</span>
                    </Link>
                  </div>
                )}

                {role !== "admin" && (
                  <div className="md:hidden space-y-1 py-1">
                    <Link
                      to="/about"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-soft rounded-xl transition-colors"
                    >
                      <Info className="size-3.5 text-primary" />
                      <span>About</span>
                    </Link>
                  </div>
                )}

                <div className="pt-1.5 border-t border-hairline mt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
