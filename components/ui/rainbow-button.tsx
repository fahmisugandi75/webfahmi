import React from "react";

import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({ children, ...props }: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "h-11 px-8 py-2 inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative group animate-rainbow cursor-pointer border-0 bg-[length:200%] text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",

        // before styles
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-gradient-to-r before:from-orange-500 before:via-yellow-500 before:via-green-500 before:via-blue-500 before:to-purple-500 before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",

        // background color (light and dark mode)
        "bg-orange-500 dark:bg-orange-600 hover:bg-orange-700",

        // Rainbow gradient overlay
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-red-500 after:via-yellow-500 after:via-green-500 after:via-blue-500 after:to-purple-500 after:opacity-20 after:mix-blend-overlay"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
