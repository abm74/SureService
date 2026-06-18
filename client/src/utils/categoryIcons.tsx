import {
  Zap,
  Wrench,
  Sparkle,
  GraduationCap,
  Hammer,
  Paintbrush,
  Flame,
  Cpu,
  ShieldCheck,
  Trees,
  Scissors,
  Truck,
  Tv,
  Sun,
  Droplet,
  Layers,
  Building,
  Armchair,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Wrench,
  Sparkle,
  GraduationCap,
  Hammer,
  Paintbrush,
  Flame,
  Cpu,
  ShieldCheck,
  Trees,
  Scissors,
  Truck,
  Tv,
  Sun,
  Droplet,
  Layers,
  Building,
  Armchair,
  Sofa: Armchair,
  Briefcase,
};

export const getCategoryIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return Briefcase;
  return ICON_MAP[iconName] || Briefcase;
};
