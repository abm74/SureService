import React, { useEffect, useState } from "react";
import { Eye, EyeOff, User as UserIcon, Briefcase, ShieldCheck, Loader2 } from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { useAuth } from "@/store/Auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card";
import { Label } from "@/Components/UI/label";
import { Input } from "@/Components/UI/input";
import { Button } from "@/Components/UI/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { UserRole, SignupPayload } from "@/types";
import { getErrorMessage } from "@/utils/helpers";

import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";
import SpinnerFullPage from "@/Components/UI/SpinnerFullPage";

export const Signup: React.FC = () => {
  const { signup, isAuthenticated, isLoading, user } = useAuth();
  const { categoryNames } = useCategories();
  const { cities, getSubCities } = useLocations();
  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Electrician");
  const [hourlyRate, setHourlyRate] = useState(350);
  const [city, setCity] = useState("Addis Ababa");
  const [subCity, setSubCity] = useState("Bole");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle("SureService | Create Account");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    const payload: SignupPayload = {
      name: name.trim() || username.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      role,
      phone: phone.trim() || undefined,
      category: role === "provider" ? category : undefined,
      hourlyRate: role === "provider" ? Number(hourlyRate) : undefined,
      location: {
        city,
        subCity: city === "Addis Ababa" ? subCity : "",
      },
    };

    setIsSubmitting(true);
    try {
      const registeredUser = await signup(payload);
      if (registeredUser.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (registeredUser.role === "provider") navigate("/provider-dashboard", { replace: true });
      else navigate("/marketplace", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Registration failed. Please check inputs and try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (user.role === "provider") navigate("/provider-dashboard", { replace: true });
      else navigate("/marketplace", { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />

      <main className="grow flex items-center justify-center p-3.5 sm:p-6 md:p-8">
        <Card className="w-full max-w-lg border-hairline rounded-3xl shadow-xl p-3 sm:p-4">
          <CardHeader className="text-center space-y-1 sm:space-y-1.5 pb-2">
            <div className="relative size-11 sm:size-12 mx-auto mb-2">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md pointer-events-none" />
              <div className="relative size-full rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 flex items-center justify-center text-white shadow-md shadow-primary/25 ring-4 ring-primary/10">
                <ShieldCheck className="size-5 sm:size-6" />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-2xl font-extrabold tracking-tight text-ink">
              Join Sure<span className="text-primary">Service</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
              Create your account to book verified trades or build your professional trust record.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 bg-surface-soft border border-hairline rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap select-none ${
                  role === "customer"
                    ? "bg-primary text-white shadow-2xs"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                <UserIcon className="size-3.5 shrink-0" />
                <span><span className="hidden sm:inline">I'm a </span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("provider")}
                className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap select-none ${
                  role === "provider"
                    ? "bg-primary text-white shadow-2xs"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                <Briefcase className="size-3.5 shrink-0" />
                <span><span className="hidden sm:inline">I'm a </span><span className="hidden sm:inline">Service </span>Provider</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name" className="text-xs font-bold text-ink">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Bethlehem Girma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="username" className="text-xs font-bold text-ink">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="bethlehem_g"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email" className="text-xs font-bold text-ink">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="phone" className="text-xs font-bold text-ink">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+251 911 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password" className="text-xs font-bold text-ink">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="pr-10 h-10 text-xs rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-ink cursor-pointer focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* PROVIDER SPECIFIC FIELDS */}
              {role === "provider" && (
                <div className="space-y-3 p-3.5 bg-surface-soft/80 rounded-2xl border border-hairline animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                    Provider Profile Setup
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="category" className="text-xs font-bold text-ink">
                        Primary Trade
                      </Label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                      >
                        {categoryNames.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="hourlyRate" className="text-xs font-bold text-ink">
                        Hourly Rate (ETB)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min={50}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        disabled={isSubmitting}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs font-bold text-ink">
                    City
                  </Label>
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const subList = getSubCities(newCity);
                      setSubCity(subList.length > 0 ? subList[0] : "");
                    }}
                    disabled={isSubmitting}
                    className="h-10 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {getSubCities(city).length > 0 && (
                  <div className="space-y-1 animate-in fade-in duration-150">
                    <Label htmlFor="subCity" className="text-xs font-bold text-ink">
                      Sub-City
                    </Label>
                    <select
                      id="subCity"
                      value={subCity}
                      onChange={(e) => setSubCity(e.target.value)}
                      disabled={isSubmitting}
                      className="h-10 w-full rounded-xl border border-hairline bg-background px-3 text-xs font-medium text-ink shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                    >
                      {getSubCities(city).map((sc) => (
                        <option key={sc} value={sc}>
                          {sc}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-destructive text-xs font-medium bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl h-11 font-bold text-xs bg-primary hover:bg-brand-primary-active text-white shadow-xs cursor-pointer mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  `Register as ${role === "provider" ? "Service Provider" : "Customer"}`
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground font-medium pt-2 border-t border-hairline/60">
                <span>Already have an account? </span>
                <Link to="/login" className="font-bold text-primary hover:underline hover:text-brand-primary-active transition-colors ml-1">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Signup;
