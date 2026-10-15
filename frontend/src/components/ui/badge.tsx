import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#2563EB] text-white",
        success: "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
        blocked: "border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]",
        warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
        outline: "border-[#E2E8F0] text-[#475569] bg-white",
        secondary: "border-[#E2E8F0] bg-[#F1F5F9] text-[#334155]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
