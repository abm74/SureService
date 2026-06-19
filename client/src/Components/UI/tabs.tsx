import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "line"
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group inline-flex h-11 items-center justify-center rounded-xl bg-surface-soft p-1 text-muted-foreground border border-hairline",
        variant === "line" &&
          "h-auto gap-1 rounded-none border-none bg-transparent p-0",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-ink data-[state=active]:shadow-xs cursor-pointer",
        "group-data-[variant=line]:rounded-none group-data-[variant=line]:bg-transparent group-data-[variant=line]:px-3 group-data-[variant=line]:py-1.5 group-data-[variant=line]:shadow-none group-data-[variant=line]:data-[state=active]:bg-transparent group-data-[variant=line]:data-[state=active]:text-ink group-data-[variant=line]:data-[state=active]:shadow-none",
        "group-data-[variant=line]:after:absolute group-data-[variant=line]:after:inset-x-0 group-data-[variant=line]:after:-bottom-px group-data-[variant=line]:after:h-0.5 group-data-[variant=line]:after:rounded-full group-data-[variant=line]:after:bg-transparent group-data-[variant=line]:after:transition-colors group-data-[variant=line]:data-[state=active]:after:bg-primary",
        "group-data-[variant=line]:data-[orientation=vertical]:after:inset-x-auto group-data-[variant=line]:data-[orientation=vertical]:after:inset-y-0 group-data-[variant=line]:data-[orientation=vertical]:after:-right-px group-data-[variant=line]:data-[orientation=vertical]:after:h-full group-data-[variant=line]:data-[orientation=vertical]:after:w-0.5",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
