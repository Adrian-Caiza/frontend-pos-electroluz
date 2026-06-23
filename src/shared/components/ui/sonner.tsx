import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/18">
            <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
          </span>
        ),
        info: (
          <span className="flex size-7 items-center justify-center rounded-full bg-blue-500/18">
            <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />
          </span>
        ),
        warning: (
          <span className="flex size-7 items-center justify-center rounded-full bg-amber-500/18">
            <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />
          </span>
        ),
        error: (
          <span className="flex size-7 items-center justify-center rounded-full bg-red-500/18">
            <OctagonXIcon className="size-4 text-red-600 dark:text-red-400" />
          </span>
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--popover)",
          "--error-bg": "var(--popover)",
          "--warning-bg": "var(--popover)",
          "--info-bg": "var(--popover)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans !rounded-xl !shadow-lg !border !gap-3",
          title: "text-sm font-medium",
          description: "text-xs mt-0.5 leading-relaxed",
          success: "relative overflow-hidden !border-emerald-500/25 !bg-gradient-to-br from-emerald-500/15 to-[var(--popover)] [&_[data-title]]:!text-emerald-800 dark:[&_[data-title]]:!text-emerald-100 [&_[data-description]]:!text-emerald-700/80 dark:[&_[data-description]]:!text-emerald-300/70 !border-l-[4px] !border-l-[#10b981]",
          error: "relative overflow-hidden !border-red-500/25 !bg-gradient-to-br from-red-500/15 to-[var(--popover)] [&_[data-title]]:!text-red-800 dark:[&_[data-title]]:!text-red-100 [&_[data-description]]:!text-red-700/80 dark:[&_[data-description]]:!text-red-300/70 !border-l-[4px] !border-l-[#ef4444]",
          warning: "relative overflow-hidden !border-amber-500/25 !bg-gradient-to-br from-amber-500/15 to-[var(--popover)] [&_[data-title]]:!text-amber-800 dark:[&_[data-title]]:!text-amber-100 [&_[data-description]]:!text-amber-700/80 dark:[&_[data-description]]:!text-amber-300/70 !border-l-[4px] !border-l-[#f59e0b]",
          info: "relative overflow-hidden !border-blue-500/25 !bg-gradient-to-br from-blue-500/15 to-[var(--popover)] [&_[data-title]]:!text-blue-800 dark:[&_[data-title]]:!text-blue-100 [&_[data-description]]:!text-blue-700/80 dark:[&_[data-description]]:!text-blue-300/70 !border-l-[4px] !border-l-[#3b82f6]",
          closeButton: "!bg-transparent !border-none !text-muted-foreground hover:!text-foreground !left-auto !right-2 !top-2",
        },
      }}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
