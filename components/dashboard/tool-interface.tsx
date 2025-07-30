"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploadArea } from "@/components/dashboard/file-upload-area"
import { TextInputArea } from "@/components/dashboard/text-input-area"
import { ProcessingButton } from "@/components/dashboard/processing-button"
import { ResultsArea } from "@/components/dashboard/results-area"
import { Badge } from "@/components/ui/badge"
import type { toolsData } from "@/lib/tools-data"
type Tool = typeof toolsData[number]

interface ToolInterfaceProps {
  tool: Tool
}

export function ToolInterface({ tool }: ToolInterfaceProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [textInput, setTextInput] = useState("")

  const handleProcess = async () => {
    setIsProcessing(true)
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    alert(`${tool.title} processing completed!`)
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-xl ${tool.bgColor} flex items-center justify-center shadow-lg border border-white/20 dark:border-white/10`}
            >
              <tool.icon className={`w-8 h-8 ${tool.color}`} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {tool.title}
                </CardTitle>
                <Badge variant="outline" className="bg-background/50 border-primary/20">
                  {tool.category}
                </Badge>
              </div>
              <CardDescription className="text-base">{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tool Interface */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardHeader className="border-b border-muted/20">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${tool.bgColor} flex items-center justify-center`}>
              <tool.icon className={`w-4 h-4 ${tool.color}`} />
            </div>
            {tool.id === "ai-humanizer" ? "Text Input" : "File Upload"}
          </CardTitle>
          <CardDescription>
            {tool.id === "ai-humanizer"
              ? "Paste your AI-generated text below to humanize it"
              : "Upload your files to process them"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {tool.id === "ai-humanizer" ? (
            <TextInputArea
              value={textInput}
              onChange={setTextInput}
              placeholder="Enter the AI-generated text you want to humanize..."
            />
          ) : (
            <FileUploadArea
              acceptedTypes={tool.acceptedTypes}
              onFilesSelected={setSelectedFiles}
              selectedFiles={selectedFiles}
              toolId={tool.id}
            />
          )}

          <ProcessingButton tool={tool} isProcessing={isProcessing} onProcess={handleProcess} />
        </CardContent>
      </Card>

      {/* Results */}
      <ResultsArea />
    </div>
  )
}
