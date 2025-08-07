"use client"

import { useState, useRef, useEffect } from "react"
import JsBarcode from "jsbarcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Barcode, Download, Loader2, Settings, RotateCcw, Palette } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function BarcodeGeneratorTool() {
  const [inputText, setInputText] = useState("Example 12345")
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128")
  const [isProcessing, setIsProcessing] = useState(false)
  const [barcodeUrl, setBarcodeUrl] = useState(null)
  const [height, setHeight] = useState([100])
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  const barcodeFormats = [
    { value: "CODE128", label: "CODE128 (Auto)" },
    { value: "CODE39", label: "CODE39" },
    { value: "EAN13", label: "EAN-13 (12 + 1 checksum digit)" },
    { value: "EAN8", label: "EAN-8 (7 + 1 checksum digit)" },
    { value: "UPC", label: "UPC (11 + 1 checksum digit)" },
    { value: "ITF", label: "ITF" },
    { value: "MSI", label: "MSI" },
    { value: "pharmacode", label: "Pharmacode" },
  ]

  const generateBarcode = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    setError(null) // Clear previous errors

    // Use a timeout to allow the loader to render before the blocking canvas operation
    setTimeout(() => {
      try {
        const canvas = canvasRef.current
        JsBarcode(canvas, inputText, {
          format: barcodeFormat,
          lineColor: foregroundColor,
          background: backgroundColor,
          height: height[0],
          displayValue: true, // Show text below barcode
          font: "monospace",
          margin: 10,
        })

        canvas.toBlob((blob) => {
          if (barcodeUrl) {
            URL.revokeObjectURL(barcodeUrl) // Clean up previous URL
          }
          const url = URL.createObjectURL(blob)
          setBarcodeUrl(url)
          setIsProcessing(false)
        })
      } catch (e) {
        console.error("Barcode generation error:", e)
        setError("Invalid data for the selected barcode format. Please check your input and the format's requirements.")
        setBarcodeUrl(null)
        setIsProcessing(false)
      }
    }, 50)
  }

  // Auto-generate on first load
  useEffect(() => {
    generateBarcode()
  }, [])

  const handleDownload = () => {
    if (barcodeUrl) {
      const link = document.createElement("a")
      link.href = barcodeUrl
      link.download = `barcode-${barcodeFormat}-${Date.now()}.png`
      link.click()
    }
  }

  const handleClear = () => {
    setInputText("")
    setBarcodeUrl(null)
    setBarcodeFormat("CODE128")
    setHeight([100])
    setForegroundColor("#000000")
    setBackgroundColor("#ffffff")
    setError(null)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/20 dark:to-slate-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900/20 flex items-center justify-center shadow-lg border border-slate-200/50 dark:border-slate-800/50">
              <Barcode className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitleMain className="text-2xl bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                  Barcode Generator
                </CardTitleMain>
                <Badge
                  variant="outline"
                  className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                >
                  Other Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Create and customize barcodes for various formats
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Input & Preview Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Barcode className="w-5 h-5 text-slate-600" />
                Barcode Content
              </CardTitle>
              <CardDescription>Enter the data for your barcode</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Barcode Format</Label>
                <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeFormats.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Data</Label>
                <Input
                  placeholder="Enter barcode data..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="border-slate-200 dark:border-slate-800/50 focus:border-slate-400 dark:focus:border-slate-600"
                />
                <div className="text-xs text-muted-foreground">{inputText.length} characters</div>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Barcode Preview */}
          {barcodeUrl && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Generated Barcode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                    <img
                      src={barcodeUrl}
                      alt="Generated Barcode"
                      className="mx-auto"
                      style={{ height: height[0] + 40 }} // Add padding for text below
                    />
                  </div>
                  <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Barcode
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
                <Settings className="w-5 h-5 text-slate-600" />
                Barcode Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Height: {height[0]}px</Label>
                <Slider value={height} onValueChange={setHeight} max={150} min={50} step={5} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Short</span>
                  <span>Tall</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Barcode Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="w-12 h-8 p-1 border rounded" />
                      <Input type="text" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="flex-1 text-xs" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Background Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-12 h-8 p-1 border rounded" />
                      <Input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 text-xs" />
                    </div>
                  </div>
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
              onClick={generateBarcode}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Generating...</span>
                </>
              ) : (
                <>
                  <Barcode className="w-5 h-5 mr-2" />
                  Generate Barcode
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 px-6 bg-transparent"
              disabled={!inputText && !barcodeUrl}
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