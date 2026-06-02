import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-500 hover:shadow-md focus-visible:ring-4 focus-visible:ring-blue-500/40 active:bg-blue-700",
        secondary:
          "bg-slate-800 text-white shadow-sm hover:bg-slate-700 hover:shadow-md focus-visible:ring-4 focus-visible:ring-slate-500/40 active:bg-slate-900",
        outline:
          "border border-slate-200 bg-transparent text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-500/30 active:bg-slate-200",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-md focus-visible:ring-4 focus-visible:ring-red-500/40 active:bg-red-700",
        danger: // Alias para destructive
          "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-md focus-visible:ring-4 focus-visible:ring-red-500/40 active:bg-red-700",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-500/30 active:bg-slate-200",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 rounded-md px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 rounded-lg px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "h-10 w-10 [&_svg:not([class*='size-'])]:size-4",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
