"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center h-10",
      className
    )}
    {...props}
  >
    {/* Track (Background bar) */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-in-out rounded-full" />
    </SliderPrimitive.Track>

    {/* Start Marker */}
    <div className="absolute left-0 h-4 w-1 rounded-full bg-blue-500 dark:bg-blue-400" />

    {/* End Marker */}
    <div className="absolute right-0 h-4 w-1 rounded-full bg-purple-500 dark:bg-purple-400" />

    {/* Thumb (Handle) */}
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
