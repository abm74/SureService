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

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useDocumentTitle("SureService | Sign In");

  const { login, demoLogin, isAuthenticated, isLoading, user } = useAuth();
  const { data: isDemoEnabled = false } = useDemoStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(
        getErrorMessage(err, "Login failed. Please check your credentials."),
      );
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError("");
    try {
      await demoLogin(role);
    } catch (err) {
      setError(
        getErrorMessage(err, "Demo login failed. Please try again."),
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (user.role === "provider") navigate("/provider-dashboard", { replace: true });
      else navigate("/marketplace", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />

      <main className="grow flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md border-hairline rounded-3xl shadow-xl p-3">
          <CardHeader className="text-center space-y-1.5 pb-2">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-ink">
              Welcome to SureService
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Sign in to explore verified professionals, manage service bookings, or access your cockpit.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-ink">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-ink">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive animate-in fade-in duration-150">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl h-11 font-bold text-xs bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer mt-1"
              >
                {isLoading ? "Signing in..." : "Sign In with Credentials"}
              </Button>
            </form>

            {/* DEMO LOGIN DROPDOWN */}
            {isDemoEnabled && (
              <div className="pt-3 border-t border-hairline space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="size-3 text-amber-500" />
                  <span>Instant Demo Access</span>
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      className="w-full h-11 rounded-xl border-hairline hover:bg-surface-soft text-xs font-bold text-ink flex items-center justify-between px-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        <span>Select Demo Account...</span>
                      </div>
                      <ChevronDown className="size-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center" className="w-[360px] p-2 space-y-1">
                    <DropdownMenuLabel className="text-[10px]">
                      Choose a role to test the marketplace:
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("customer")}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                        <User className="size-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-ink">Customer Demo</p>
                          <span className="text-[10px] text-primary font-semibold">Bethlehem Girma</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Browse marketplace, book trades & mark jobs completed
                        </p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("provider")}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                        <Briefcase className="size-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-ink">Provider Demo</p>
                          <span className="text-[10px] text-blue-600 font-semibold">Abebe Kebede (96 Score)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Master electrician, manage requests & live Trust score
                        </p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDemoLogin("admin")}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-soft"
                    >
                      <div className="size-8 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                        <ShieldAlert className="size-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-ink">Admin Demo</p>
                          <span className="text-[10px] text-rose-600 font-semibold">Dawit Haile</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Review ID verification queue & platform metrics
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className="text-center text-xs text-muted-foreground font-medium pt-2 border-t border-hairline/60">
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
