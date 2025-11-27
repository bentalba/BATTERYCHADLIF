import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ElectricButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "electric" | "orange" | "ghost-electric" | "outline-electric";
}

const ElectricButton = forwardRef<HTMLButtonElement, ElectricButtonProps>(
  ({ className, variant = "electric", ...props }, ref) => {
    const variants = {
      electric: "bg-primary text-primary-foreground hover:bg-electric-blue-hover shadow-lg hover:shadow-xl transition-all duration-300",
      orange: "bg-accent text-accent-foreground hover:bg-energy-orange-hover shadow-lg hover:shadow-xl transition-all duration-300",
      "ghost-electric": "bg-transparent text-primary hover:bg-primary/10 transition-all duration-300",
      "outline-electric": "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300",
    };

    return (
      <Button
        ref={ref}
        className={cn(variants[variant], "font-semibold tracking-tight", className)}
        {...props}
      />
    );
  }
);

ElectricButton.displayName = "ElectricButton";

export { ElectricButton };
