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
      electric: "relative bg-gradient-primary text-primary-foreground shadow-colored-blue hover:shadow-glow-blue hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
      orange: "relative bg-gradient-accent text-accent-foreground shadow-colored-orange hover:shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
      "ghost-electric": "bg-transparent text-primary hover:bg-electric-blue-light hover:scale-105 active:scale-95 transition-all duration-300",
      "outline-electric": "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-colored-blue hover:scale-105 active:scale-95 transition-all duration-300",
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
