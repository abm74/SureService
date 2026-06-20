import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Store } from "lucide-react";
import { Button } from "@/Components/UI/button";
import { useAuth } from "@/store/Auth/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-xs font-bold transition-colors pb-1 border-b-2 select-none ${
    isActive
      ? "text-ink border-primary"
      : "text-muted-foreground border-transparent hover:text-ink hover:border-hairline"
  }`;

export const PageNav: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/marketplace";
    if (user.role === "admin") return "/admin-dashboard";
    if (user.role === "provider") return "/provider-dashboard";
    return "/bookings";
  };

  return (
    <nav className="flex justify-between bg-background/95 backdrop-blur-md border-b border-hairline h-18 px-6 lg:px-20 items-center sticky top-0 z-50 shrink-0 select-none">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
          <ShieldCheck className="size-5" />
        </div>
        <span className="text-xl md:text-2xl font-bold tracking-tight text-ink">
          Sure<span className="text-primary">Service</span>
        </span>
      </Link>

      <ul className="flex items-center gap-6 sm:gap-8">
        <li>
          <NavLink to="/marketplace" className={linkClass}>
            Marketplace
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <NavLink to={getDashboardPath()}>
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-5 font-bold text-xs h-9 shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </NavLink>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 font-bold text-xs h-9 border-hairline hover:border-ink cursor-pointer"
                >
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/marketplace" className="hidden sm:block">
                <Button
                  size="sm"
                  className="rounded-full px-4 font-bold text-xs h-9 bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Store className="size-3.5" />
                  <span>Explore</span>
                </Button>
              </NavLink>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default PageNav;
