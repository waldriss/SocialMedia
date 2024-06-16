"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:max-w-[380px] sm:group-[.toaster]:max-w-none sm:group-[.toaster]:w-[400px] group-[.toaster]:bg-backgroundgrad2 group-[.toaster]:text-whiteShade group-[.toaster]:border-secondary group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-whiteShade",
          cancelButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-whiteShade",
            
            
            
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
