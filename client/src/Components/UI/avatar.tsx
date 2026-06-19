import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-hairline shadow-xs",
        size === "sm" && "size-7",
        size === "lg" && "size-14",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-surface-soft text-xs font-bold text-ink",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-badge"
      className={cn(
        "absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <div
      data-slot="avatar-group"
      data-size={size}
      className={cn("group flex -space-x-2", className)}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xs font-bold text-ink ring-1 ring-hairline",
        "group-data-[size=sm]:size-7 group-data-[size=sm]:text-[10px]",
        "group-data-[size=lg]:size-14 group-data-[size=lg]:text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}