"use client"

import { Textarea } from "@/components/ui/textarea"

interface TextInputAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function TextInputArea({ value, onChange, placeholder }: TextInputAreaProps) {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{value.length} characters</span>
        <span>Maximum: 10,000 characters</span>
      </div>
    </div>
  )
}
