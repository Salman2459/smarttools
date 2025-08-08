"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Upload, Download, Loader2, Settings, XCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import imageCompression from "browser-image-compression"
import { toolsData } from "@/lib/tools-data"

export function CompressImageTool({ toolId }) {
  const inputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quality, setQuality] = useState([80])
  const [outputFormat, setOutputFormat] = useState("original")
  const [maxWidth, setMaxWidth] = useState("")
  const [maxHeight, setMaxHeight] = useState("")
  const [compressedImages, setCompressedImages] = useState([])
  const toolData = toolsData.find((tool) => tool.id === toolId)


  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files)
    setCompressedImages([])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFiles(event.dataTransfer.files)
      setCompressedImages([])
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleClear = () => {
    setSelectedFiles(null)
    setCompressedImages([])
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleProcess = async () => {
    if (!selectedFiles) return

    setIsProcessing(true)
    const results = []

    try {
      for (const file of selectedFiles) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: Math.max(Number(maxWidth) || 10000, Number(maxHeight) || 10000),
          useWebWorker: true,
          initialQuality: quality[0] / 100,
          fileType: outputFormat === "original" ? file.type : `image/${outputFormat}`,
        }

        const compressedFile = await imageCompression(file, options)
        const compressedUrl = URL.createObjectURL(compressedFile)

        results.push({
          name: file.name,
          url: compressedUrl,
          size: compressedFile.size,
        })
      }

      setCompressedImages(results)
    } catch (error) {
      console.error("Compression failed:", error)
      alert("Something went wrong during compression.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getCompressionLevel = () => {
    if (quality[0] >= 90) return "Minimal"
    if (quality[0] >= 70) return "Balanced"
    if (quality[0] >= 50) return "High"
    return "Maximum"
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shadow-lg border border-purple-200/50 dark:border-purple-800/50">
                <ImageIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitleMain className="text-2xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Image Compressor
                  </CardTitleMain>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800"
                  >
                    Optimization
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  Reduce image file sizes while maintaining visual quality
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Upload Images
                </CardTitle>
                <CardDescription>Select images to compress and optimize</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <label htmlFor="compress-files">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-purple-200 dark:border-purple-800/50 rounded-xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-all duration-300 group"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto text-purple-400 mb-4 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
                    <Input
                      id="compress-files"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      ref={inputRef}
                      className="hidden"
                    />
                    <Label
                      htmlFor="compress-files"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-purple-600 transition-colors duration-300 font-medium"
                    >
                      Click to browse or drag and drop your images here
                    </Label>
                    <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-purple-50 dark:bg-purple-950/20 rounded-full inline-block">
                      Supported: JPG, PNG, WEBP, GIF
                    </div>
                  </div>
                </label>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        Selected Images ({selectedFiles.length})
                      </h4>
                      <Button
                        variant="secondary"
                        onClick={handleClear}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 rounded-lg border border-purple-200/50 dark:border-purple-800/30"
                        >
                          <ImageIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
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
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  Compression Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Quality: {quality[0]}%</Label>
                    <Badge variant="outline" className="text-xs">
                      {getCompressionLevel()}
                    </Badge>
                  </div>
                  <Slider value={quality} onValueChange={setQuality} max={100} min={10} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
          <CardContent className="p-6">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !selectedFiles || selectedFiles.length === 0}
              className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Compressing images...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Compress Images ({selectedFiles?.length || 0} files)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
          <CardHeader className="border-b border-muted/20">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-600" />
              Download Compressed Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {compressedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compressedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-4 flex flex-col gap-2 items-center text-center bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-auto rounded-md max-h-48 object-contain" />
                    <p className="text-sm font-medium truncate">{img.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(img.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <a href={img.url} download={img.name} className="w-full">
                      <Button variant="secondary" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
                <p className="text-muted-foreground font-medium">Your compressed images will appear here</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Files are automatically deleted after soe time...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>

  )
}
