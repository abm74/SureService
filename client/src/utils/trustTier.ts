import { ShieldCheck, Award, CheckCircle, Sparkles } from "lucide-react";

export function getTrustTier(score: number = 0) {
  if (score >= 90) {
    return {
      tier: "Top",
      label: "Top",
      variant: "top",
      textColor: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      barColor: "bg-emerald-500",
      icon: ShieldCheck,
    };
  }
  if (score >= 75) {
    return {
      tier: "High",
      label: "High",
      variant: "high",
      textColor: "text-blue-700 dark:text-blue-300",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      borderColor: "border-blue-200 dark:border-blue-800",
      barColor: "bg-blue-500",
      icon: Award,
    };
  }
  if (score >= 50) {
    return {
      tier: "Standard",
      label: "Standard",
      variant: "standard",
      textColor: "text-teal-700 dark:text-teal-300",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
      borderColor: "border-teal-200 dark:border-teal-800",
      barColor: "bg-teal-500",
      icon: CheckCircle,
    };
  }
  return {
    tier: "New",
    label: "New",
    variant: "new",
    textColor: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
    borderColor: "border-slate-200 dark:border-slate-800",
    barColor: "bg-slate-400",
    icon: Sparkles,
  };
}
