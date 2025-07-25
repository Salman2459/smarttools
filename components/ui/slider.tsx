// Place this code in your `components/ui/slider.tsx` file

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils" // Assumes you have a `cn` utility function

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      // The parent is relative, allowing us to position the markers absolutely inside it.
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600 dark:bg-blue-500" />
    </SliderPrimitive.Track>

    {/* --- ADDITION: START MARKER --- */}
    {/* This div is the vertical line at the beginning of the slider. */}
    {/* It's positioned absolutely to the left edge. */}
    {/* The `items-center` on the parent Root automatically centers it vertically. */}
    <div className="absolute left-0 h-4 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />

    {/* --- ADDITION: END MARKER --- */}
    {/* This div is the vertical line at the end of the slider. */}
    {/* It's positioned absolutely to the right edge. */}
    <div className="absolute right-0 h-4 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />

    {/* 
      Radix UI's SliderPrimitive will automatically create a Thumb component 
      for each value in the `value` prop array. This is what enables the 
      two-handle range slider functionality.
    */}
    <SliderPrimitive.Thumb />

  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }