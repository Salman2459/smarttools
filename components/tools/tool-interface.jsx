"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Settings, Download, Loader2, RotateCcw } from "lucide-react"
import { ImageResizerTool } from "./image-resizer-tool.jsx"
import { CompressImageTool } from "./compress-image-tool.jsx"
import { ImageConverterTool } from "./image-converter-tool.jsx"
import { ImageWatermarkerTool } from "./image-watermarker-tool.jsx"
import { ImageToPdfTool } from "./image-to-pdf-tool.jsx"
import { DocToPdfTool } from "./doc-to-pdf-tool.jsx"
import { TextToSpeechTool } from "./text-to-speech-tool.jsx"
import { AiHumanizerTool } from "./ai-humanizer-tool.jsx"
import { TextSummarizerTool } from "./text-summarizer.jsx"
// import { VideoResizerTool } from "./video-resize-tool.jsx"

export function ToolInterface({ tool }) {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {tool.id == "image-compressor" ? <CompressImageTool />
        : tool.id == "image-resizer"  ? <ImageResizerTool /> 
        : tool.id == "png-to-jpg" ? <ImageConverterTool fromFormat="png" toFormat="jpg" toolId="png-to-jpg"/> 
        : tool.id == "png-to-jpeg" ? <ImageConverterTool fromFormat="png" toFormat="jpeg" toolId="png-to-jpeg"/> 
        : tool.id == "png-to-svg" ? <ImageConverterTool fromFormat="png" toFormat="svg" toolId="png-to-svg"/> 
        : tool.id == "png-to-webp" ? <ImageConverterTool fromFormat="png" toFormat="webp" toolId="png-to-webp"/> 
        : tool.id == "jpg-to-png" ? <ImageConverterTool fromFormat="jpg" toFormat="png" toolId="jpg-to-png"/> 
        : tool.id == "jpg-to-jpeg" ? <ImageConverterTool fromFormat="jpg" toFormat="jpeg" toolId="jpg-to-jpeg"/> 
        : tool.id == "jpg-to-svg" ? <ImageConverterTool fromFormat="jpg" toFormat="svg" toolId="jpg-to-svg"/> 
        : tool.id == "jpg-to-webp" ? <ImageConverterTool fromFormat="jpg" toFormat="webp" toolId="jpg-to-webp"/> 
        : tool.id == "jpeg-to-png" ? <ImageConverterTool fromFormat="jpeg" toFormat="png" toolId="jpeg-to-png"/>  
        : tool.id == "jpeg-to-jpg" ? <ImageConverterTool fromFormat="jpeg" toFormat="jpg" toolId="jpeg-to-jpg"/>  
        : tool.id == "jpeg-to-svg" ? <ImageConverterTool fromFormat="jpeg" toFormat="svg" toolId="jpeg-to-svg"/>  
        : tool.id == "jpeg-to-webp" ? <ImageConverterTool fromFormat="jpeg" toFormat="webp" toolId="jpeg-to-webp"/>  
        : tool.id == "webp-to-png" ? <ImageConverterTool fromFormat="webp" toFormat="png" toolId="webp-to-png"/>  
        : tool.id == "webp-to-jpg" ? <ImageConverterTool fromFormat="webp" toFormat="jpg" toolId="webp-to-jpg"/>  
        : tool.id == "webp-to-jpeg" ? <ImageConverterTool fromFormat="webp" toFormat="jpeg" toolId="webp-to-jpeg"/>  
        : tool.id == "image-converter" ? <ImageConverterTool /> 
        : tool.id == "image-converter" ? <ImageConverterTool /> 
        : tool.id == "image-watermarker" ? <ImageWatermarkerTool /> 
        : tool.id == "image-to-pdf" ? <ImageToPdfTool /> 
        : tool.id == "doc-to-pdf" ? <DocToPdfTool toolId={"doc-to-pdf"}/> 
        : tool.id == "excel-to-pdf" ? <DocToPdfTool toolId={"excel-to-pdf"}/> 
        : tool.id == "word-to-pdf" ? <DocToPdfTool toolId={"word-to-pdf"}/> 
        : tool.id == "txt-to-pdf" ? <DocToPdfTool toolId={"txt-to-pdf"}/> 
        : tool.id == "text-to-speech" ? <TextToSpeechTool /> 
        : tool.id == "text-summarizer" ? <TextSummarizerTool /> 
        : tool.id == "ai-humanizer" ? <AiHumanizerTool /> 
        // : tool.id == "video-resizer" ? <VideoResizerTool /> 
        : null}
      {/* Tool Header
      <Card className={`border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-xl ${tool.bgColor} flex items-center justify-center shadow-lg border border-white/20 dark:border-white/10`}
            >
              <IconComponent className={`w-8 h-8 ${tool.color}`} />
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
      {/* <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardHeader className="border-b border-muted/20">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${tool.bgColor} flex items-center justify-center`}>
              <IconComponent className={`w-4 h-4 ${tool.color}`} />
            </div>
            Tool Interface
          </CardTitle>
          <CardDescription>This is where the tool functionality would be implemented</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/1 transition-all duration-300 group">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            <p className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
              Tool interface placeholder - functionality would be implemented here
            </p>
            <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-muted/50 rounded-full inline-block">
              {tool.acceptedTypes ? `Supported: ${tool.acceptedTypes}` : "Text-based tool"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">Tool-specific settings would appear here</p>
              </CardContent>
            </Card>

            <Card className="border border-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">Processed results would be shown here</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Processing...</span>
                </>
              ) : (
                <>
                  <IconComponent className="w-5 h-5 mr-2" />
                  Process with {tool.title}
                </>
              )}
            </Button>
            <Button variant="outline" className="h-12 px-6 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* Results Placeholder */}
      {/* <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardHeader className="border-b border-muted/20">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
            <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
            <p className="text-muted-foreground font-medium">Processed files will appear here for download</p>
            <p className="text-xs text-muted-foreground mt-2">
              Files are automatically deleted after 24 hours for your privacy
            </p>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
