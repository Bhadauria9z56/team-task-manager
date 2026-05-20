import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-secondary text-secondary-foreground ring-1 ring-border/60",
  success: "bg-background text-foreground ring-1 ring-border",
  warning: "bg-foreground text-background",
  danger: "bg-red-500/15 text-red-700 ring-1 ring-red-500/20 dark:text-red-300",
  info: "bg-card text-foreground ring-1 ring-border"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
