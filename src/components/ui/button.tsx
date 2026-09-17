import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { hapticService } from "@/services/hapticService"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-heading font-bold ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-pill hover:bg-primary/90 hover:scale-102",
        destructive:
          "bg-destructive text-destructive-foreground rounded-pill hover:bg-destructive/90 hover:scale-102",
        outline:
          "border border-border bg-background text-foreground rounded-pill hover:bg-accent hover:text-accent-foreground hover:scale-102",
        "outline-glow": "border-2 border-primary bg-transparent text-primary rounded-pill hover:bg-primary/10 hover:scale-102 transition-smooth",
        secondary:
          "bg-secondary text-secondary-foreground rounded-pill hover:bg-secondary/80 hover:scale-102",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-secondary text-secondary-foreground rounded-pill hover:bg-secondary/90 hover:scale-102 shadow-lg",
        glass: "glass-effect text-foreground border border-border rounded-pill hover:bg-white/20 hover:scale-102",
        premium: "bg-primary text-primary-foreground rounded-pill hover:bg-primary/90 hover:scale-102 shadow-md",
      },
      size: {
        default: "h-11 px-10 py-2",
        sm: "h-10 px-6",
        lg: "h-12 px-10",
        icon: "h-11 w-11 rounded-full",
        xl: "h-14 px-12 text-lg",
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
