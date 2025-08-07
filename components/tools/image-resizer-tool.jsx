"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Maximize, Upload, Download, Loader2, Settings, RotateCcw, ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function ImageResizerTool() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false)
  const [resizeMode, setResizeMode] = useState("exact")
  const [processedImage, setProcessedImage] = useState(null)
  const [originalDimensions, setOriginalDimensions] = useState(null)
  const canvasRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)

      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleWidthChange = (value) => {
    setWidth(value)
    if (maintainAspectRatio && originalDimensions && value) {
      const aspectRatio = originalDimensions.height / originalDimensions.width
      setHeight(Math.round(Number.parseInt(value) * aspectRatio).toString())
    }
  }

  const handleHeightChange = (value) => {
    setHeight(value)
    if (maintainAspectRatio && originalDimensions && value) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(Number.parseInt(value) * aspectRatio).toString())
    }
  }

  const handleProcess = async () => {
    if (!selectedFile || !width || !height) return

    setIsProcessing(true)

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        canvas.width = Number.parseInt(width)
        canvas.height = Number.parseInt(height)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob)
            setProcessedImage({
              url,
              blob,
              filename: `resized_${selectedFile.name}`,
              size: blob.size,
            })
            setIsProcessing(false)
          },
          selectedFile.type,
          0.9,
        )
      }

      img.crossOrigin = "anonymous"
      img.src = URL.createObjectURL(selectedFile)
    } catch (error) {
      console.error("Error processing image:", error)
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a")
      link.href = processedImage.url
      link.download = processedImage.filename
      link.click()
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setProcessedImage(null)
    setWidth("")
    setHeight("")
    setOriginalDimensions(null)
    setMaintainAspectRatio(true)
    setResizeMode("exact")

    const fileInput = document.getElementById("resize-files")
    if (fileInput) fileInput.value = ""
  }

  const presetSizes = [
    { name: "Instagram Square", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Cover", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
    { name: "HD (720p)", width: 1280, height: 720 },
    { name: "Full HD (1080p)", width: 1920, height: 1080 },
  ]

  const applyPreset = (preset) => {
    setWidth(preset.width.toString())
    setHeight(preset.height.toString())
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center shadow-lg border border-indigo-200/50 dark:border-indigo-800/50">
              <Maximize className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain className="text-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  Image Resizer
                </CardTitleMain>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800"
                >
                  Image Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Resize images to specific dimensions while maintaining quality
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Image
              </CardTitle>
              <CardDescription>Select an image to resize</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <label htmlFor="resize-files">
                <div
                  className="border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10 transition-all duration-300 group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileChange({ target: { files: [file] } })
                  }}
                >
                  <ImageIcon className="w-12 h-12 mx-auto text-indigo-400 mb-4 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300" />
                  <Input id="resize-files" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <Label
                    htmlFor="resize-files"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-indigo-600 transition-colors duration-300 font-medium"
                  >
                    Click to browse or drag and drop your image here
                  </Label>
                  <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-indigo-50 dark:bg-indigo-950/20 rounded-full inline-block">
                    Supported: JPG, PNG, WEBP, GIF
                  </div>
                </div>
              </label>

              {selectedFile && (
                <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    Selected Image
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
                    <ImageIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm truncate flex-1 font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  {originalDimensions && (
                    <div className="text-xs text-muted-foreground text-center">
                      Original: {originalDimensions.width} × {originalDimensions.height} pixels
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Download className="w-5 h-5 text-green-600" />
                Resized Image Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {processedImage ? (
                  <div>
                    <img
                      src={processedImage?.url || "/placeholder.svg"}
                      alt="Resized"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md border"
                    />
                    <div className="text-sm text-muted-foreground">
                      Size: {width} × {height} pixels | File size: {(processedImage?.size / 1024 / 1024)?.toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  <p>No image preview available</p>
                )}
                <Button
                  onClick={handleDownload}
                  className={processedImage ? "bg-green-600 hover:bg-green-700" : "bg-[#5D697D] hover:bg-[#5D697D] text-white"}
                  style={processedImage ? {} : { marginTop: "50px" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resized Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Resize Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Width (px)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Height (px)</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Maintain Aspect Ratio</Label>
                  <p className="text-xs text-muted-foreground">Keep original proportions</p>
                </div>
                <Switch checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Resize Mode</Label>
                <Select value={resizeMode} onValueChange={setResizeMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exact Size</SelectItem>
                    <SelectItem value="fit">Fit Within</SelectItem>
                    <SelectItem value="fill">Fill Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Presets</Label>
                <div className="grid grid-cols-1 gap-2">
                  {presetSizes.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="justify-start text-xs"
                    >
                      {preset.name}
                      <span className="ml-auto text-muted-foreground">
                        {preset.width}×{preset.height}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
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
              disabled={isProcessing || !selectedFile || !width || !height}
              className="flex-1 h-12 text-base bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Resizing image...</span>
                </>
              ) : (
                <>
                  <Maximize className="w-5 h-5 mr-2" />
                  Resize Image
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 px-6 bg-transparent"
              disabled={!selectedFile && !processedImage}
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



