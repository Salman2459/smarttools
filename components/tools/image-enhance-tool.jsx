"use client"

import { useState, useCallback, useEffect } from "react"
import Script from "next/script"
import { Card, CardContent, CardDescription, CardHeader, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Upload, Download, Loader2, RotateCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const FABRIC_CDN = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"

export function ImageEnhanceTool({ toolId }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [enhancedUrl, setEnhancedUrl] = useState(null)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [sharpness, setSharpness] = useState(0)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (enhancedUrl) URL.revokeObjectURL(enhancedUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setEnhancedUrl(null)
    setBrightness(0)
    setContrast(0)
    setSharpness(0)
  }

  const processImage = useCallback(() => {
    if (!selectedFile || !previewUrl) return
    const fabric = window.fabric
    if (!fabric) {
      setIsProcessing(true)
      const canvas = document.createElement("canvas")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.filter = `brightness(${1 + brightness / 100}) contrast(${(100 + contrast) / 100})`
        ctx.drawImage(img, 0, 0)
        ctx.filter = "none"
        canvas.toBlob(
          (blob) => {
            setEnhancedUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev)
              return URL.createObjectURL(blob)
            })
            setIsProcessing(false)
          },
          selectedFile.type,
          0.92
        )
      }
      img.onerror = () => setIsProcessing(false)
      img.src = previewUrl
      return
    }

    setIsProcessing(true)
    fabric.Image.fromURL(
      previewUrl,
      (img) => {
        if (!img) {
          setIsProcessing(false)
          return
        }
        const filters = []
        if (brightness !== 0) {
          filters.push(new fabric.Image.filters.Brightness({ brightness: brightness / 100 }))
        }
        if (contrast !== 0) {
          filters.push(new fabric.Image.filters.Contrast({ contrast: (contrast + 50) / 150 }))
        }
        if (sharpness > 0) {
          const s = Math.min(1, sharpness / 100)
          filters.push(
            new fabric.Image.filters.Convolute({
              matrix: [0, -s, 0, -s, 1 + 4 * s, -s, 0, -s, 0],
            })
          )
        }
        img.filters = filters
        img.applyFilters(() => {
          const dataUrl = img.toDataURL({ format: selectedFile.type.replace("image/", "") || "png", quality: 0.92 })
          setEnhancedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return dataUrl
          })
          setIsProcessing(false)
        })
      },
      { crossOrigin: "anonymous" }
    )
  }, [selectedFile, previewUrl, brightness, contrast, sharpness])

  useEffect(() => {
    if (!selectedFile || !previewUrl) return
    processImage()
  }, [brightness, contrast, sharpness, selectedFile, previewUrl, processImage])

  const handleDownload = () => {
    if (!enhancedUrl || !selectedFile) return
    const a = document.createElement("a")
    a.href = enhancedUrl
    a.download = `enhanced_${selectedFile.name}`
    a.click()
  }

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (enhancedUrl) URL.revokeObjectURL(enhancedUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    setEnhancedUrl(null)
    setBrightness(0)
    setContrast(0)
    setSharpness(0)
    setIsProcessing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Script src={FABRIC_CDN} strategy="lazyOnload" />
      <Card className="border-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shadow-lg border border-amber-200/50 dark:border-amber-800/50">
              <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain className="text-2xl bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-100 bg-clip-text text-transparent">
                  Image Enhance
                </CardTitleMain>
                <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                  Image Tools
                </Badge>
              </div>
              <CardDescription className="text-base text-muted-foreground">
                Improve image quality with brightness, contrast, and sharpness. Powered by Fabric.js (CDN).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <h2 className="text-lg font-semibold text-foreground">Upload image</h2>
          <CardDescription>Select an image to enhance. Supports JPG, PNG, WebP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
            <Upload className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              {selectedFile ? selectedFile.name : "Click or drag to upload"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Brightness</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={([v]) => setBrightness(v)}
                    min={-80}
                    max={80}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contrast</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={([v]) => setContrast(v)}
                    min={-50}
                    max={80}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sharpness</label>
                  <Slider
                    value={[sharpness]}
                    onValueChange={([v]) => setSharpness(v)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Apply enhance
                </Button>
                {enhancedUrl && (
                  <Button variant="secondary" onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
                <Button variant="outline" onClick={handleClear} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Original</p>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full rounded-lg border border-border object-contain max-h-64"
                  />
                </div>
                {enhancedUrl && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Enhanced</p>
                    <img
                      src={enhancedUrl}
                      alt="Enhanced"
                      className="w-full rounded-lg border border-border object-contain max-h-64"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
