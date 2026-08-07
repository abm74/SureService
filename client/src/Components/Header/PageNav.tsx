import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/Components/UI/button";
import { useAuth } from "@/store/Auth/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-xs font-semibold px-3.5 rounded-full transition-colors select-none flex items-center h-9 ${
    isActive
      ? "bg-primary text-primary-foreground shadow-2xs"
      : "text-muted-foreground hover:text-ink hover:bg-surface-soft"
  }`;

export const PageNav: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/marketplace";
    if (user.role === "admin") return "/admin/users";
    if (user.role === "provider") return "/provider/bookings";
    return "/bookings";
  };

  const getDashboardLabel = () => {
    if (user?.role === "admin") return "Dashboard";
    if (user?.role === "provider") return "Dashboard";
    return "My Bookings";
  };

  return (
    <nav className="flex justify-between bg-background/95 backdrop-blur-md border-b border-hairline h-18 px-4 sm:px-6 lg:px-20 items-center sticky top-0 z-50 shrink-0 select-none">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
          <ShieldCheck className="size-5" />
        </div>
        <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-ink">
          Sure<span className="text-primary">Service</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
        <NavLink to="/marketplace" className={linkClass}>
          Marketplace
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>

        {isAuthenticated ? (
          <Button
            asChild
            variant="default"
            size="sm"
            className="rounded-full px-5 font-bold text-xs h-9 shadow-xs cursor-pointer ml-1"
          >
            <NavLink to={getDashboardPath()} className="flex items-center gap-1.5">
              <span>{getDashboardLabel()}</span>
              <ArrowRight className="size-3.5" />
            </NavLink>
          </Button>
        ) : (
          <>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full px-3.5 font-semibold text-xs h-9 text-muted-foreground hover:text-ink hover:bg-surface-soft cursor-pointer"
            >
              <NavLink to="/login">
                Sign In
              </NavLink>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full px-4.5 font-bold text-xs h-9 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer ml-1"
            >
              <NavLink to="/signup">
                Sign Up
              </NavLink>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex sm:hidden items-center">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded-xl border border-hairline bg-surface-soft text-ink hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="absolute top-18 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-hairline p-4 sm:hidden flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <NavLink
            to="/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-surface-soft transition-colors"
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-surface-soft transition-colors"
          >
            About
          </NavLink>
          <div className="pt-2 border-t border-hairline flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                asChild
                variant="default"
                size="sm"
                className="w-full rounded-xl font-bold text-xs h-10 shadow-xs cursor-pointer"
              >
                <NavLink
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5"
                >
                  <span>{getDashboardLabel()}</span>
                  <ArrowRight className="size-3.5" />
                </NavLink>
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-bold text-xs h-10 border-hairline hover:border-ink cursor-pointer"
                >
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </NavLink>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="w-full rounded-xl font-bold text-xs h-10 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer"
                >
                  <NavLink to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </NavLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PageNav;
