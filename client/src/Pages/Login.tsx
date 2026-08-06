import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Briefcase,
  ShieldAlert,
  ChevronDown,
  Loader2,
} from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { useAuth } from "@/store/Auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card";
import { Label } from "@/Components/UI/label";
import { Input } from "@/Components/UI/input";
import { Button } from "@/Components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/UI/dropdown-menu";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { UserRole } from "@/types";
import { getErrorMessage } from "@/utils/helpers";
import { useDemoStatus } from "@/hooks/useDemoStatus";
import SpinnerFullPage from "@/Components/UI/SpinnerFullPage";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingRole, setSubmittingRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  useDocumentTitle("SureService | Sign In");

  const { login, demoLogin, isAuthenticated, isLoading, user } = useAuth();
  const { data: isDemoEnabled = false } = useDemoStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === "admin") navigate("/admin/users", { replace: true });
      else if (loggedUser.role === "provider") navigate("/provider/bookings", { replace: true });
      else navigate("/marketplace", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Login failed. Please check your credentials."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError("");
    setSubmittingRole(role);
    try {
      const loggedUser = await demoLogin(role);
      if (loggedUser.role === "admin") navigate("/admin/users", { replace: true });
      else if (loggedUser.role === "provider") navigate("/provider/bookings", { replace: true });
      else navigate("/marketplace", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Demo login failed. Please try again."),
      );
    } finally {
      setSubmittingRole(null);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") navigate("/admin/users", { replace: true });
      else if (user.role === "provider") navigate("/provider/bookings", { replace: true });
      else navigate("/marketplace", { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />

      <main className="grow flex items-center justify-center p-3 sm:p-6 md:p-8">
        <Card className="w-full max-w-[340px] sm:max-w-md border-hairline rounded-2xl sm:rounded-3xl shadow-xl py-3.5 sm:py-6 gap-2.5 sm:gap-6">
          <CardHeader className="text-center space-y-1 sm:space-y-1.5 px-3.5 sm:px-6 pb-0 sm:pb-2">
            <div className="relative size-10 sm:size-12 mx-auto mb-1.5 sm:mb-2">
              <div className="absolute inset-0 bg-primary/20 rounded-xl sm:rounded-2xl blur-md pointer-events-none" />
              <div className="relative size-full rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 flex items-center justify-center text-white shadow-md shadow-primary/25 ring-4 ring-primary/10">
                <ShieldCheck className="size-5 sm:size-6" />
              </div>
            </div>
            <CardTitle className="text-base sm:text-2xl font-extrabold tracking-tight text-ink">
              Welcome to Sure<span className="text-primary">Service</span>
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-sm text-muted-foreground font-medium max-w-[240px] sm:max-w-sm mx-auto leading-snug sm:leading-relaxed">
              Sign in to explore verified professionals, manage service bookings, or access your cockpit.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2.5 sm:space-y-4 px-3.5 sm:px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3.5 text-left">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-[11px] sm:text-xs font-bold text-ink">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-2.5 sm:left-3.5 size-3.5 sm:size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || Boolean(submittingRole)}
                    className="pl-8 sm:pl-10 h-9 sm:h-11 rounded-lg sm:rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password" className="text-[11px] sm:text-xs font-bold text-ink">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-2.5 sm:left-3.5 size-3.5 sm:size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting || Boolean(submittingRole)}
                    className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-11 rounded-lg sm:rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3.5 text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-3.5 sm:size-4" /> : <Eye className="size-3.5 sm:size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive animate-in fade-in duration-150">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || Boolean(submittingRole)}
                className="w-full rounded-lg sm:rounded-xl h-9 sm:h-11 font-bold text-xs bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer mt-0.5 sm:mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In with Credentials"
                )}
              </Button>
            </form>

            {/* DEMO LOGIN DROPDOWN */}
            {isDemoEnabled && (
              <div className="pt-2 sm:pt-3 border-t border-hairline space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
                  Instant Demo Access
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting || Boolean(submittingRole)}
                      className="w-full h-9 sm:h-11 rounded-lg sm:rounded-xl border-hairline hover:bg-surface-soft text-xs font-bold text-ink flex items-center justify-between px-3 sm:px-4 cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        {submittingRole ? (
                          <>
                            <Loader2 className="size-3.5 sm:size-4 text-primary animate-spin" />
                            <span>Accessing {submittingRole === "customer" ? "Customer" : submittingRole === "provider" ? "Provider" : "Admin"} Demo...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3.5 sm:size-4 text-primary" />
                            <span>Select Demo Account...</span>
                          </>
                        )}
                      </div>
                      <ChevronDown className="size-3.5 sm:size-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center" className="w-[calc(100vw-2rem)] sm:w-[350px] max-w-sm p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                    <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-1 px-2">
                      Choose a role to test the marketplace:
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("customer")}
                      className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-7 sm:size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                        <User className="size-3.5 sm:size-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="font-bold text-xs text-ink shrink-0">Customer Demo</p>
                          <span className="text-[10px] sm:text-[11px] text-primary font-semibold truncate">Bethlehem Girma</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight sm:leading-snug truncate sm:whitespace-normal">
                          Browse marketplace, book trades & mark jobs completed
                        </p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("provider")}
                      className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-7 sm:size-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                        <Briefcase className="size-3.5 sm:size-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="font-bold text-xs text-ink shrink-0">Provider Demo</p>
                          <span className="text-[10px] sm:text-[11px] text-blue-600 font-semibold truncate">Abebe Kebede (Master Electrician)</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight sm:leading-snug truncate sm:whitespace-normal">
                          Master electrician, manage requests & live Trust score
                        </p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("admin")}
                      className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-7 sm:size-8 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                        <ShieldAlert className="size-3.5 sm:size-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="font-bold text-xs text-ink shrink-0">Admin Demo</p>
                          <span className="text-[10px] sm:text-[11px] text-rose-600 font-semibold truncate">Dawit Haile</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight sm:leading-snug truncate sm:whitespace-normal">
                          Audit verifications, manage users & bookings
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className="text-center text-xs text-muted-foreground font-medium pt-1.5 sm:pt-2 border-t border-hairline/60">
              <span>Don't have an account? </span>
              <Link
                to="/signup"
                className="font-bold text-primary hover:underline transition-colors ml-1"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
