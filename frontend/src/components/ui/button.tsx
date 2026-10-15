import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm active:bg-[#1E40AF]",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC] hover:border-[#94A3B8]",
        secondary: "bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0]",
        ghost: "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
        sidebar: "w-full justify-start text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E314F] font-normal",
        sidebarActive: "w-full justify-start bg-[#2563EB] text-white font-medium shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
