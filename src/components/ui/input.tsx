import * as React from "react"
import { hapticService } from "@/services/hapticService"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  // Mobile optimization props
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
  autoCorrect?: 'off' | 'on';
  spellCheck?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onFocus, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Light haptic feedback on focus for mobile
      hapticService.light();
      onFocus?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          // Increased height for better mobile touch targets (44px minimum)
          "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2",
          // Better mobile font sizing
          "text-base md:text-sm",
          // Standard input styling
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Mobile optimizations
          "[-webkit-appearance:none] [appearance:none]", // Remove iOS default styling
          className
        )}
        onFocus={handleFocus}
        ref={ref}
        // Mobile-friendly defaults
        autoCapitalize={props.autoCapitalize ?? (type === 'email' ? 'off' : undefined)}
        autoCorrect={props.autoCorrect ?? (type === 'email' ? 'off' : undefined)}
        spellCheck={props.spellCheck ?? (type === 'email' ? false : undefined)}
        // Prevent zoom on focus in iOS
        style={{ fontSize: 'max(16px, 1em)' }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
