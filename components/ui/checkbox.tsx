"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <div className="relative flex items-center justify-center">
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-[var(--aduti-primary)] appearance-none cursor-pointer transition-colors checked:bg-[var(--aduti-primary)] checked:border-[var(--aduti-primary)] focus:ring-2 focus:ring-[var(--aduti-primary)]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
  </div>
))

Checkbox.displayName = "Checkbox"

export { Checkbox }

