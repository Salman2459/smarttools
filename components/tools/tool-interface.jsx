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
import { GrammarCheckerTool } from "./grammer-checker-tool.jsx"
import { QrGeneratorTool } from "./qr-generator-tool.jsx"
import { BarcodeGeneratorTool } from "./barcode-tool.jsx"
import { ImageCropperTool } from "./Image-copper-tool.jsx"
import { VideoCropperTool } from "./video-cropper-tool.jsx"
import { VideoTrimmerTool } from "./Video-trimmer-tool.jsx"
import { VideoCompressorTool } from "./video-compressor-tool.jsx"
import { VideoResizerTool } from "./video-resize-tool.jsx"

export function ToolInterface({ tool }) {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {tool.id == "image-compressor" ? <CompressImageTool />
        : tool.id == "image-resizer" ? <ImageResizerTool />
          : tool.id == "image-cropper" ? <ImageCropperTool />
            : tool.id == "png-to-jpg" ? <ImageConverterTool fromFormat="png" toFormat="jpg" toolId="png-to-jpg" />
              : tool.id == "png-to-jpeg" ? <ImageConverterTool fromFormat="png" toFormat="jpeg" toolId="png-to-jpeg" />
                : tool.id == "png-to-svg" ? <ImageConverterTool fromFormat="png" toFormat="svg" toolId="png-to-svg" />
                  : tool.id == "png-to-webp" ? <ImageConverterTool fromFormat="png" toFormat="webp" toolId="png-to-webp" />
                    : tool.id == "jpg-to-png" ? <ImageConverterTool fromFormat="jpg" toFormat="png" toolId="jpg-to-png" />
                      : tool.id == "jpg-to-jpeg" ? <ImageConverterTool fromFormat="jpg" toFormat="jpeg" toolId="jpg-to-jpeg" />
                        : tool.id == "jpg-to-svg" ? <ImageConverterTool fromFormat="jpg" toFormat="svg" toolId="jpg-to-svg" />
                          : tool.id == "jpg-to-webp" ? <ImageConverterTool fromFormat="jpg" toFormat="webp" toolId="jpg-to-webp" />
                            : tool.id == "jpeg-to-png" ? <ImageConverterTool fromFormat="jpeg" toFormat="png" toolId="jpeg-to-png" />
                              : tool.id == "jpeg-to-jpg" ? <ImageConverterTool fromFormat="jpeg" toFormat="jpg" toolId="jpeg-to-jpg" />
                                : tool.id == "jpeg-to-svg" ? <ImageConverterTool fromFormat="jpeg" toFormat="svg" toolId="jpeg-to-svg" />
                                  : tool.id == "jpeg-to-webp" ? <ImageConverterTool fromFormat="jpeg" toFormat="webp" toolId="jpeg-to-webp" />
                                    : tool.id == "webp-to-png" ? <ImageConverterTool fromFormat="webp" toFormat="png" toolId="webp-to-png" />
                                      : tool.id == "webp-to-jpg" ? <ImageConverterTool fromFormat="webp" toFormat="jpg" toolId="webp-to-jpg" />
                                        : tool.id == "webp-to-jpeg" ? <ImageConverterTool fromFormat="webp" toFormat="jpeg" toolId="webp-to-jpeg" />
                                          : tool.id == "image-converter" ? <ImageConverterTool />
                                            : tool.id == "image-converter" ? <ImageConverterTool />
                                              : tool.id == "image-watermarker" ? <ImageWatermarkerTool />
                                                : tool.id == "image-to-pdf" ? <ImageToPdfTool />
                                                  : tool.id == "doc-to-pdf" ? <DocToPdfTool toolId="doc-to-pdf" />
                                                    : tool.id == "excel-to-pdf" ? <DocToPdfTool toolId="excel-to-pdf" />
                                                      : tool.id == "word-to-pdf" ? <DocToPdfTool toolId="word-to-pdf" />
                                                        : tool.id == "txt-to-pdf" ? <DocToPdfTool toolId="txt-to-pdf" />
                                                          : tool.id == "html-to-pdf" ? <DocToPdfTool toolId="html-to-pdf" />
                                                            : tool.id == "text-to-speech" ? <TextToSpeechTool />
                                                              : tool.id == "grammar-checker" ? <GrammarCheckerTool />
                                                                : tool.id == "text-summarizer" ? <TextSummarizerTool />
                                                                  : tool.id == "ai-humanizer" ? <AiHumanizerTool />
                                                                    : tool.id == "qr-generator" ? <QrGeneratorTool />
                                                                      : tool.id == "barcode-generator" ? <BarcodeGeneratorTool />
                                                                        : tool.id == "video-compressor" ? <VideoCompressorTool />
                                                                          : tool.id == "video-trimmer" ? <VideoTrimmerTool />
                                                                            : tool.id == "video-cropper" ? <VideoCropperTool />
                                                                              : tool.id == "video-resizer" ? <VideoResizerTool />
                                                                                : null}

    </div>
  )
}
