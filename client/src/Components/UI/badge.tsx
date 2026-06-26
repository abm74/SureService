import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none [a&]:cursor-pointer [a&]:hover:bg-surface-soft/60",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: "text-foreground border-border",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-surface-soft hover:text-ink",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
        success:
          "border-transparent bg-emerald-600 text-white shadow-xs",
        warning:
          "border-transparent bg-amber-500 text-white shadow-xs",
        trustTop:
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300",
        trustElite:
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300",
        trustHigh:
          "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300",
        trustStandard:
          "border-teal-200 bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-300",
        trustProven:
          "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300",
        trustRising:
          "border-teal-200 bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-300",
        trustNew:
          "border-slate-200 bg-slate-50 text-slate-800 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-300",
        trustMid:
          "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300",
        trustLow:
          "border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
