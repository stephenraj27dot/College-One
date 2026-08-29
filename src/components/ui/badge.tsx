import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-900 border-blue-200 font-bold",
    secondary: "bg-slate-100 text-slate-900 border-slate-200 font-semibold",
    outline: "border-slate-300 text-slate-800 font-semibold",
    success: "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold",
    warning: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    destructive: "bg-rose-50 text-rose-900 border-rose-300 font-bold",
    gold: "bg-amber-100 text-amber-950 border-amber-300 font-bold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
