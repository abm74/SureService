import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  size?: "default" | "sm" | "lg";
  alt?: string;
  shape?: "circle" | "rounded";
}

export function UserAvatar({
  src,
  name,
  className,
  imageClassName,
  fallbackClassName,
  size = "default",
  alt,
  shape = "circle",
}: UserAvatarProps) {
  const initials = React.useMemo(() => {
    if (!name || !name.trim()) return null;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const cleanSrc =
    src && src.trim() && src.trim() !== "/default-avatar.jpg"
      ? src.trim()
      : undefined;

  return (
    <Avatar
      size={size}
      className={cn(
        shape === "rounded" ? "rounded-xl sm:rounded-2xl" : "rounded-full",
        className
      )}
    >
      {cleanSrc && (
        <AvatarImage
          src={cleanSrc}
          alt={alt || name || "User avatar"}
          className={imageClassName}
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-primary/10 text-primary font-bold text-xs select-none",
          shape === "rounded" ? "rounded-xl sm:rounded-2xl" : "rounded-full",
          fallbackClassName
        )}
      >
        {initials ? initials : <UserIcon className="size-1/2 opacity-70" />}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
