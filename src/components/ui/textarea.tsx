import * as React from "react"
import { hapticService } from "@/services/hapticService"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onFocus, autoResize = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // Light haptic feedback on focus for mobile
      hapticService.light();
      onFocus?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
      props.onInput?.(e);
    };

    React.useImperativeHandle(ref, () => textareaRef.current!);

    return (
      <textarea
        className={cn(
          // Better touch target height
          "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2",
          // Mobile-friendly font size
          "text-base md:text-sm",
          // Standard styling
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Mobile optimizations
          "[-webkit-appearance:none] [appearance:none]",
          // Auto-resize
          autoResize && "resize-none overflow-hidden",
          className
        )}
        ref={textareaRef}
        onFocus={handleFocus}
        onInput={handleInput}
        // Prevent zoom on focus in iOS
        style={{ fontSize: 'max(16px, 1em)' }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
