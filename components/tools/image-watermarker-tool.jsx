"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Droplets, Upload, Download, Loader2, Settings, RotateCcw, ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function ImageWatermarkerTool() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [watermarkFile, setWatermarkFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [watermarkType, setWatermarkType] = useState("text")
  const [watermarkText, setWatermarkText] = useState("© Your Watermark")
  const [position, setPosition] = useState("bottom-right")
  const [opacity, setOpacity] = useState([50])
  const [fontSize, setFontSize] = useState([24])
  const [color, setColor] = useState("#ffffff")
  const [processedImage, setProcessedImage] = useState(null)
  const canvasRef = useRef(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleWatermarkFileChange = (event) => {
    setWatermarkFile(event.target.files[0])
  }

  const handleProcess = async () => {
    if (!selectedFile) return
    if (watermarkType === "text" && !watermarkText.trim()) return
    if (watermarkType === "image" && !watermarkFile) return

    setIsProcessing(true)

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Apply watermark
        if (watermarkType === "text") {
          applyTextWatermark(ctx, canvas.width, canvas.height)
        } else if (watermarkType === "image" && watermarkFile) {
          const watermarkImg = new Image()
          watermarkImg.onload = () => {
            applyImageWatermark(ctx, watermarkImg, canvas.width, canvas.height)
            finalizeImage(canvas)
          }
          watermarkImg.crossOrigin = "anonymous"
          watermarkImg.src = URL.createObjectURL(watermarkFile)
          return
        }

        finalizeImage(canvas)
      }

      img.crossOrigin = "anonymous"
      img.src = URL.createObjectURL(selectedFile)
    } catch (error) {
      console.error("Error processing image:", error)
      setIsProcessing(false)
    }
  }

  const applyTextWatermark = (ctx, canvasWidth, canvasHeight) => {
    ctx.save()

    // Set text properties
    ctx.font = `${fontSize[0]}px Arial`
    ctx.fillStyle = color
    ctx.globalAlpha = opacity[0] / 100
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Calculate position
    const { x, y } = getWatermarkPosition(canvasWidth, canvasHeight, ctx.measureText(watermarkText).width, fontSize[0])

    // Add text shadow for better visibility
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = 2
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1

    ctx.fillText(watermarkText, x, y)
    ctx.restore()
  }

  const applyImageWatermark = (ctx, watermarkImg, canvasWidth, canvasHeight) => {
    ctx.save()
    ctx.globalAlpha = opacity[0] / 100

    // Scale watermark to be 20% of the main image width
    const scale = Math.min((canvasWidth * 0.2) / watermarkImg.width, (canvasHeight * 0.2) / watermarkImg.height)
    const watermarkWidth = watermarkImg.width * scale
    const watermarkHeight = watermarkImg.height * scale

    const { x, y } = getWatermarkPosition(canvasWidth, canvasHeight, watermarkWidth, watermarkHeight)

    ctx.drawImage(watermarkImg, x - watermarkWidth / 2, y - watermarkHeight / 2, watermarkWidth, watermarkHeight)
    ctx.restore()
  }

  const getWatermarkPosition = (canvasWidth, canvasHeight, watermarkWidth, watermarkHeight) => {
    const margin = 20

    switch (position) {
      case "top-left":
        return { x: margin + watermarkWidth / 2, y: margin + watermarkHeight / 2 }
      case "top-center":
        return { x: canvasWidth / 2, y: margin + watermarkHeight / 2 }
      case "top-right":
        return { x: canvasWidth - margin - watermarkWidth / 2, y: margin + watermarkHeight / 2 }
      case "center-left":
        return { x: margin + watermarkWidth / 2, y: canvasHeight / 2 }
      case "center":
        return { x: canvasWidth / 2, y: canvasHeight / 2 }
      case "center-right":
        return { x: canvasWidth - margin - watermarkWidth / 2, y: canvasHeight / 2 }
      case "bottom-left":
        return { x: margin + watermarkWidth / 2, y: canvasHeight - margin - watermarkHeight / 2 }
      case "bottom-center":
        return { x: canvasWidth / 2, y: canvasHeight - margin - watermarkHeight / 2 }
      case "bottom-right":
      default:
        return { x: canvasWidth - margin - watermarkWidth / 2, y: canvasHeight - margin - watermarkHeight / 2 }
    }
  }

  const finalizeImage = (canvas) => {
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob)
        setProcessedImage({
          url,
          blob,
          filename: `watermarked_${selectedFile.name}`,
          size: blob.size,
        })
        setIsProcessing(false)
      },
      selectedFile.type,
      0.9,
    )
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
    setWatermarkFile(null)
    setProcessedImage(null)
    setWatermarkType("text")
    setWatermarkText("© Your Watermark")
    setPosition("bottom-right")
    setOpacity([50])
    setFontSize([24])
    setColor("#ffffff")

    // Clear file inputs
    const fileInput = document.getElementById("watermark-files")
    const watermarkInput = document.getElementById("watermark-image-files")
    if (fileInput) fileInput.value = ""
    if (watermarkInput) watermarkInput.value = ""
  }

  const positionOptions = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "center-left", label: "Center Left" },
    { value: "center", label: "Center" },
    { value: "center-right", label: "Center Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-teal-50/50 to-teal-100/30 dark:from-teal-950/20 dark:to-teal-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center shadow-lg border border-teal-200/50 dark:border-teal-800/50">
              <Droplets className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                  Image Watermarker
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800"
                >
                  Image Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Add text or image watermarks to protect your images
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
                <Upload className="w-5 h-5 text-teal-600" />
                Upload Image
              </CardTitle>
              <CardDescription>Select an image to add watermark</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <label htmlFor="watermark-files">
              <div className="border-2 border-dashed border-teal-200 dark:border-teal-800/50 rounded-xl p-8 text-center hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/10 transition-all duration-300 group"
               onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileChange({ target: { files: [file] } })
                  }}>
                <ImageIcon className="w-12 h-12 mx-auto text-teal-400 mb-4 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300" />
                <Input
                  id="watermark-files"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="watermark-files"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-teal-600 transition-colors duration-300 font-medium"
                >
                  Click to browse or drag and drop your image here
                </Label>
                <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-teal-50 dark:bg-teal-950/20 rounded-full inline-block">
                  Supported: JPG, PNG, WEBP, GIF
                </div>
              </div>
              </label>

              {selectedFile && (
                <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-teal-600" />
                    Selected Image
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50/50 to-teal-100/30 dark:from-teal-950/20 dark:to-teal-900/10 rounded-lg border border-teal-200/50 dark:border-teal-800/30">
                    <ImageIcon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-sm truncate flex-1 font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {processedImage && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Watermarked Image Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <img
                    src={processedImage.url || "/placeholder.svg"}
                    alt="Watermarked"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md border"
                  />
                  <div className="text-sm text-muted-foreground">
                    File size: {(processedImage.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Watermarked Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" />
                Watermark Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Watermark Type</Label>
                <Select value={watermarkType} onValueChange={setWatermarkType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Watermark</SelectItem>
                    <SelectItem value="image">Image Watermark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watermarkType === "text" ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Watermark Text</Label>
                    <Textarea
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter your watermark text"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={100}
                      min={12}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-sm font-medium">Watermark Image</Label>
                  <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <Input
                      id="watermark-image-files"
                      type="file"
                      accept="image/*"
                      onChange={handleWatermarkFileChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="watermark-image-files"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-teal-600 transition-colors"
                    >
                      {watermarkFile ? watermarkFile.name : "Click to select watermark image"}
                    </Label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Opacity: {opacity[0]}%</Label>
                <Slider value={opacity} onValueChange={setOpacity} max={100} min={10} step={5} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Transparent</span>
                  <span>Opaque</span>
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
              disabled={
                isProcessing ||
                !selectedFile ||
                (watermarkType === "text" && !watermarkText.trim()) ||
                (watermarkType === "image" && !watermarkFile)
              }
              className="flex-1 h-12 text-base bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Adding watermark...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-5 h-5 mr-2" />
                  Add Watermark
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
