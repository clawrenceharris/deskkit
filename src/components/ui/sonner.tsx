"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle, Info, TriangleAlert, X } from "lucide-react"
import { Loader2 } from "lucide-react"
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle strokeWidth={2} className="size-6 text-green-500" />
        ),
        info: (
          <Info strokeWidth={2} className="size-6 text-blue-500" />
        ),
        warning: (
          <TriangleAlert strokeWidth={2} className="size-6 text-yellow-500" />
        ),
        error: (
          <X strokeWidth={3} className="size-6 text-destructive" />
        ),
        loading: (
          <Loader2 strokeWidth={2} className="size-6 text-primary animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast flex items-center gap-4",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
