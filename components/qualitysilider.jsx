"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function QualitySlider({ quality, onValueChange }) {
    return (
        <div className="space-y-3 flex-shrink-0 pt-4 border-t border-muted/20">
            <Label htmlFor="quality-slider" className="text-sm font-medium">Quality: {quality[0]}%</Label>
            <Slider
                id="quality-slider"
                value={quality}
                onValueChange={onValueChange}
                max={100}
                min={10}
                step={5}
                className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller file</span>
                <span>Better quality</span>
            </div>
        </div>
    )
}