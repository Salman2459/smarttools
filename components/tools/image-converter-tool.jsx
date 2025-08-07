"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic" // Import 'dynamic' from Next.js
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Download, Loader2, Settings, RotateCcw, ImageIcon } from "lucide-react"
// REMOVED: import { Slider } from "@/components/ui/slider"
import { toolsData, iconMap } from "@/lib/tools-data" // Adjust this import path if needed
import { max } from "date-fns"
import Link from "next/link"

// Create a loading skeleton for the slider to prevent layout shift
const SliderSkeleton = () => (
  <div className="space-y-3 flex-shrink-0 pt-4 border-t border-muted/20 animate-pulse">
    <div className="h-5 bg-muted/50 rounded w-1/3"></div>
    <div className="h-5 bg-muted/50 rounded w-full"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-muted/50 rounded w-1/4"></div>
      <div className="h-4 bg-muted/50 rounded w-1/4"></div>
    </div>
  </div>
);

// Dynamically import the QualitySlider component with SSR disabled
// Make sure the path matches where you created the new file.
const QualitySlider = dynamic(
  () => import("@/components/qualitysilider").then((mod) => mod.QualitySlider),
  {
    ssr: false, // This is the key! It disables server-side rendering for this component.
    loading: () => <SliderSkeleton />, // Show a skeleton while the component loads on the client.
  }
);

export function ImageConverterTool({ toolId, fromFormat, toFormat }) {
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quality, setQuality] = useState([90])
  const [processedImages, setProcessedImages] = useState([])
  const canvasRef = useRef(null)

  // Find the tool data based on the toolId prop
  const toolData = toolsData.find(tool => tool.id === toolId)
  if (!toolData) return <div className="text-center text-red-500">Tool with ID '{toolId}' not found!</div>

  // Dynamically get the icon component
  const Icon = iconMap[toolData.iconName] || RefreshCw

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files)
    setProcessedImages([]) // Clear previous results on new file selection
  }

  const handleProcess = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return
    setIsProcessing(true)
    const results = []

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            const mimeType = `image/${toFormat}`
            const qualityValue = toFormat === "png" ? undefined : quality[0] / 100

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  console.error(`Failed to create blob for ${file.name}`);
                  reject(new Error(`Conversion failed for ${file.name}`));
                  return;
                }
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                const newFilename = `${originalName}.${toFormat}`
                results.push({
                  url: URL.createObjectURL(blob),
                  blob,
                  filename: newFilename,
                  originalSize: file.size,
                  newSize: blob.size,
                  format: toFormat.toUpperCase(),
                })
                resolve()
              },
              mimeType,
              qualityValue
            )
          }
          img.onerror = (err) => {
            console.error("Image failed to load.", err)
            alert(`Could not load image: ${file.name}. It might be corrupted or in an unsupported format.`)
            reject(err)
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
    URL.revokeObjectURL(image.url) // Clean up object URLs
  }

  const handleDownloadAll = () => {
    processedImages.forEach((image) => {
      setTimeout(() => handleDownload(image), 100)
    })
  }

  const handleClear = () => {
    setSelectedFiles(null)
    setProcessedImages([])
    setQuality([90])
    const fileInput = document.getElementById(`convert-files-${toolId}`)
    if (fileInput) fileInput.value = ""
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header - Dynamically Styled */}
      <Card className={`border-0 bg-gradient-to-br  shadow-lg`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl ${toolData.bgColor} flex items-center justify-center  border border-white/10`}>
              <Icon className={`w-8 h-8 ${toolData.color}`} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain
                  className={`text-2xl  bg-clip-text text-${toolData.color}`}
                >
                  {toolData.title}
                </CardTitleMain>
                <Badge variant="outline" className={`${toolData.bgColor} border-black/10`}>
                  Image Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                {toolData.description}
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
                <Upload className={`w-5 h-5 ${toolData.color}`} />
                Upload {fromFormat.toUpperCase()} Images
              </CardTitle>
              <CardDescription>Select the images you want to convert to {toFormat.toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <label htmlFor={`convert-files-${toolId}`}>
                <div className={`border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-current ${toolData.color} hover:bg-muted/30 transition-all duration-300 group`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (e.dataTransfer.files) handleFileChange({ target: { files: e.dataTransfer.files } })
                  }}>
                  <ImageIcon className={`w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-all duration-300 ${toolData.color}`} />
                  <Input
                    id={`convert-files-${toolId}`}
                    type="file"
                    accept={`image/${fromFormat}`}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor={`convert-files-${toolId}`} className="cursor-pointer text-sm text-muted-foreground hover:text-current transition-colors duration-300 font-medium">
                    Click to browse or drag & drop your images here
                  </Label>
                  <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-muted/40 rounded-full inline-block">
                    Accepts: .{fromFormat}
                  </div>
                </div>
              </label>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ImageIcon className={`w-4 h-4 ${toolData.color}`} />
                    Selected Images ({selectedFiles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                        <ImageIcon className={`w-4 h-4 ${toolData.color} flex-shrink-0`} />
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
                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{image.filename}</span>
                        <Badge variant="outline">{image.format}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Original: {(image.originalSize / 1024).toFixed(2)} KB</div>
                        <div>Converted: {(image.newSize / 1024).toFixed(2)} KB</div>
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

        {/* Settings Panel */}
        <div className="flex flex-col">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg h-full flex flex-col">
            <CardHeader className="border-b border-muted/20 flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className={`w-5 h-5 ${toolData.color}`} />
                Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <Label className="text-sm font-medium">Output Format</Label>
                <div className="p-3 rounded-lg border border-muted bg-muted/30">
                  <span className="font-medium text-sm">{toFormat.toUpperCase()}</span>
                </div>
              </div>

              {/* USE THE DYNAMICALLY IMPORTED COMPONENT HERE */}
              {(toFormat === "jpeg" || toFormat === "webp" || toFormat === "jpg") && (
                <QualitySlider quality={quality} onValueChange={setQuality} />
              )}

              <div style={{ maxHeight: processedImages.length > 0 ? "400px" : "250px", overflowY: "auto" }}>
                {toolsData.map((tool, index) => {
                  const isSame = tool.id === toolData.id;

                  if (index <= 2 || index >= 18) return null;

                  return (
                    <Link href={`/tools/${tool.id}`} key={tool.id}>
                      <Label
                        variant="outline"
                        className={`1h-10 px-6 mt-4 text-[15px]  w-full flex items-center justify-center p-2 rounded-md cursor-pointer`}
                        style={{
                          backgroundColor: isSame ? "#3B82F6" : "transparent",
                        }}
                        onClick={() => console.log(`Navigating to ${tool.id} ${toolData.id}`)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {tool.id}
                      </Label>
                    </Link>
                  );
                })}
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
              disabled={isProcessing || !selectedFiles || selectedFiles.length === 0}
              className={`flex-1 h-12 text-base bg-gradient-to-r ${toolData.color.replace('text-', 'from-')} ${toolData.color.replace('text-', 'to-').replace('400', '600').replace('500', '700')} hover:brightness-110 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none`}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Converting...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert to {toFormat.toUpperCase()} ({selectedFiles?.length || 0})
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