"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { toolsData } from "@/lib/tools-data"

type Tool = typeof toolsData[number]

interface ProcessingButtonProps {
  tool: Tool
  isProcessing: boolean
  onProcess: () => void
}

export function ProcessingButton({ tool, isProcessing, onProcess }: ProcessingButtonProps) {
  return (
    <Button
      onClick={onProcess}
      disabled={isProcessing}
      className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span className="animate-pulse">Processing...</span>
        </>
      ) : (
        <>
          <tool.icon className="w-5 h-5 mr-2" />
          {tool.id === "ai-humanizer" ? "Humanize Text" : "Process Files"}
        </>
      )}
    </Button>
  )
}
