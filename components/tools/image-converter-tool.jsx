"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Download, Loader2, Settings, RotateCcw, ImageIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function ImageConverterTool() {
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputFormat, setOutputFormat] = useState("png")
  const [quality, setQuality] = useState([90])
  const [processedImages, setProcessedImages] = useState([])
  const canvasRef = useRef(null)

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files)
  }

  const handleProcess = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return
    setIsProcessing(true)
    const results = []

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const isSvg = file.type === "image/svg+xml"

        // If SVG is selected and the target format is not SVG, alert and skip
        if (isSvg && outputFormat !== "svg") {
          alert(`SVG file "${file.name}" cannot be converted to ${outputFormat.toUpperCase()} at this time.`)
          continue
        }

        await new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            const mimeType = `image/${outputFormat}`
            const qualityValue = outputFormat === "png" ? undefined : quality[0] / 100

            canvas.toBlob(
              (blob) => {
                const originalName = file.name.split(".")[0]
                const newFilename = `${originalName}.${outputFormat}`
                results.push({
                  url: URL.createObjectURL(blob),
                  blob,
                  filename: newFilename,
                  originalSize: file.size,
                  newSize: blob.size,
                  format: outputFormat.toUpperCase(),
                })
                resolve()
              },
              mimeType,
              qualityValue,
            )
          }
          img.crossOrigin = "anonymous"
          img.src = URL.createObjectURL(file)
        })
      }
      setProcessedImages(results)
    } catch (error) {
      console.error("Error converting images:", error)
      alert("An error occurred during image conversion.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (image) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename
    link.click()
  }

  const handleDownloadAll = () => {
    processedImages.forEach((image) => {
      setTimeout(() => handleDownload(image), 100)
    })
  }

  const handleClear = () => {
    setSelectedFiles(null)
    setProcessedImages([])
    setOutputFormat("png")
    setQuality([90])
    // Clear file input
    const fileInput = document.getElementById("convert-files")
    if (fileInput) fileInput.value = ""
  }

  const formatOptions = [
    { value: "png", label: "PNG", description: "Best for graphics with transparency" },
    { value: "jpeg", label: "JPEG", description: "Best for photos, smaller file size" },
    { value: "jpg", label: "JPG", description: "Common photo format, same as JPEG" },
    { value: "webp", label: "WebP", description: "Modern format, smaller size, supports transparency" },
    { value: "gif", label: "GIF", description: "Best for simple animations or low-color images" },
    { value: "bmp", label: "BMP", description: "Uncompressed, large file size, high quality" },
    { value: "tiff", label: "TIFF", description: "High-quality format, often used in printing" },
    { value: "svg", label: "SVG", description: "Vector format for logos and illustrations" },
    { value: "avif", label: "AVIF", description: "Modern format with excellent compression and quality" },
    { value: "heic", label: "HEIC", description: "High-efficiency format used by Apple devices" },
    { value: "ico", label: "ICO", description: "Used for website favicons" },
    { value: "dds", label: "DDS", description: "DirectDraw Surface, used in game textures" },
    { value: "raw", label: "RAW", description: "Unprocessed image from digital cameras" },
    { value: "apng", label: "APNG", description: "Animated PNG with support for transparency" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center shadow-lg border border-cyan-200/50 dark:border-cyan-800/50">
              <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                  Image Converter
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800"
                >
                  Image Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Convert images between different formats (PNG, JPEG, WebP, BMP)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Grid with Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Upload Area */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg flex-1">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-600" />
                Upload Images
              </CardTitle>
              <CardDescription>Select images to convert to different formats</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <label htmlFor="convert-files">
                <div className="border-2 border-dashed border-cyan-200 dark:border-cyan-800/50 rounded-xl p-8 text-center hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/10 transition-all duration-300 group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileChange({ target: { files: [file] } })
                  }}>
                  <ImageIcon className="w-12 h-12 mx-auto text-cyan-400 mb-4 group-hover:text-cyan-600 group-hover:scale-110 transition-all duration-300" />
                  <Input
                    id="convert-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="convert-files"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-cyan-600 transition-colors duration-300 font-medium"
                  >
                    Click to browse or drag and drop your images here
                  </Label>
                  <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-cyan-50 dark:bg-cyan-950/20 rounded-full inline-block">
                    Supported: JPG, PNG, WEBP, GIF, BMP
                  </div>
                </div>
              </label>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-600" />
                    Selected Images ({selectedFiles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10 rounded-lg border border-cyan-200/50 dark:border-cyan-800/30"
                      >
                        <ImageIcon className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {processedImages.length > 0 && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-600" />
                    Converted Images ({processedImages.length})
                  </CardTitle>
                  <Button onClick={handleDownloadAll} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {processedImages.map((image, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{image.filename}</span>
                        <Badge variant="outline">{image.format}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Original: {(image.originalSize / 1024 / 1024).toFixed(2)} MB</div>
                        <div>Converted: {(image.newSize / 1024 / 1024).toFixed(2)} MB</div>
                        <div className={`${image.newSize < image.originalSize ? "text-green-600" : "text-orange-600"}`}>
                          {image.newSize < image.originalSize ? "↓" : "↑"}{" "}
                          {Math.abs(((image.newSize - image.originalSize) / image.originalSize) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <Button onClick={() => handleDownload(image)} size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel - Now matches height of left content */}
        <div className="flex flex-col">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg h-full flex flex-col">
            <CardHeader className="border-b border-muted/20 flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <Label className="text-sm font-medium">Output Format</Label>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {formatOptions.map((format) => (
                    <div
                      key={format.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${outputFormat === format.value
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20"
                        : "border-muted hover:border-cyan-300"
                        }`}
                      onClick={() => setOutputFormat(format.value)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{format.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${outputFormat === format.value ? "border-cyan-500 bg-cyan-500" : "border-muted"
                            }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(outputFormat === "jpeg" || outputFormat === "webp") && (
                <div className="space-y-3 flex-shrink-0 pt-4 border-t border-muted/20">
                  <Label className="text-sm font-medium">Quality: {quality[0]}%</Label>
                  <Slider value={quality} onValueChange={setQuality} max={100} min={10} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !selectedFiles || selectedFiles.length === 0}
              className="flex-1 h-12 text-base bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Converting images...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert Images ({selectedFiles?.length || 0} files)
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 px-6 bg-transparent"
              disabled={!selectedFiles && processedImages.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
