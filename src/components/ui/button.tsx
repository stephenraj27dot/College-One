import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "whatsapp"
    | "destructive"
    | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-md shadow-blue-500/20",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100",
      whatsapp:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-md shadow-emerald-600/20",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-md shadow-rose-600/20",
      accent:
        "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 focus-visible:ring-amber-500 shadow-md shadow-amber-500/20",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
