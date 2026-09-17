import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * IconButton component with proper touch target size (44x44px minimum)
 * for better mobile usability and accessibility
 */

interface IconButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  icon: LucideIcon;
  label: string; // Accessible label for screen readers
  iconSize?: 'sm' | 'md' | 'lg';
}

const iconSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, iconSize = 'md', className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        aria-label={label}
        className={cn("min-h-[44px] min-w-[44px]", className)}
        {...props}
      >
        <Icon className={iconSizeMap[iconSize]} />
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
