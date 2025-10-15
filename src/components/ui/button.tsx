import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { hapticService } from "@/services/hapticService"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 hover:scale-105 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/90 hover:scale-105 shadow-md",
        outline:
          "border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80 hover:scale-105 shadow-md",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-white border border-primary/30 hover:scale-105 shadow-xl hover:shadow-2xl",
        glass: "glass-effect text-foreground border border-border hover:bg-white/20 hover:scale-105 shadow-md",
        premium: "bg-gradient-primary text-white border border-primary/30 hover:scale-105 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-11 w-11",
        xl: "h-14 rounded-lg px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  haptic?: 'light' | 'medium' | 'heavy' | 'none'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, haptic = 'medium', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback based on button variant
      if (haptic !== 'none') {
        if (variant === 'destructive') {
          hapticService.heavy();
        } else if (variant === 'default' || variant === 'hero' || variant === 'premium') {
          hapticService[haptic]();
        } else {
          hapticService.light();
        }
      }
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
