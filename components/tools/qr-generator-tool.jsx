"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Loader2, Settings, RotateCcw, Palette } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function QrGeneratorTool() {
  const [inputText, setInputText] = useState("")
  const [qrType, setQrType] = useState("text")
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [size, setSize] = useState([256])
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const canvasRef = useRef(null)

  // QR Code generation using a simple implementation
  const generateQRCode = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)

    try {
      // Using QR Server API for demonstration
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size[0]}x${size[0]}&data=${encodeURIComponent(inputText)}&color=${foregroundColor.replace("#", "")}&bgcolor=${backgroundColor.replace("#", "")}&ecc=${errorCorrection}`

      // Create canvas and draw QR code
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = size[0]
        canvas.height = size[0]
        ctx.drawImage(img, 0, 0, size[0], size[0])

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          setQrCodeUrl(url)
          setIsProcessing(false)
        })
      }

      img.crossOrigin = "anonymous"
      img.src = qrUrl
    } catch (error) {
      console.error("Error generating QR code:", error)
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `qr-code-${Date.now()}.png`
      link.click()
    }
  }

  const handleClear = () => {
    setInputText("")
    setQrCodeUrl(null)
    setQrType("text")
    setSize([256])
    setErrorCorrection("M")
    setForegroundColor("#000000")
    setBackgroundColor("#ffffff")
  }

  const qrTypes = [
    { value: "text", label: "Plain Text", placeholder: "Enter your text here..." },
    { value: "url", label: "Website URL", placeholder: "https://example.com" },
    { value: "email", label: "Email Address", placeholder: "mailto:example@email.com" },
    { value: "phone", label: "Phone Number", placeholder: "tel:+1234567890" },
    { value: "sms", label: "SMS Message", placeholder: "sms:+1234567890?body=Hello" },
    { value: "wifi", label: "WiFi Network", placeholder: "WIFI:T:WPA;S:NetworkName;P:Password;;" },
  ]

  const getCurrentPlaceholder = () => {
    const type = qrTypes.find((t) => t.value === qrType)
    return type ? type.placeholder : "Enter your text here..."
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Tool Header */}
      <Card className="border-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/20 dark:to-slate-900/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900/20 flex items-center justify-center shadow-lg border border-slate-200/50 dark:border-slate-800/50">
              <QrCode className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                  QR Code Generator
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                >
                  Other Tools
                </Badge>
              </div>
              <CardDescription className="text-base">
                Generate QR codes for text, URLs, contact info, and more
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Input Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5 text-slate-600" />
                QR Code Content
              </CardTitle>
              <CardDescription>Enter the content for your QR code</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Content Type</Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qrTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Content</Label>
                {qrType === "text" || qrType === "wifi" ? (
                  <Textarea
                    placeholder={getCurrentPlaceholder()}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[120px] resize-none border-slate-200 dark:border-slate-800/50 focus:border-slate-400 dark:focus:border-slate-600"
                  />
                ) : (
                  <Input
                    placeholder={getCurrentPlaceholder()}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="border-slate-200 dark:border-slate-800/50 focus:border-slate-400 dark:focus:border-slate-600"
                  />
                )}
                <div className="text-xs text-muted-foreground">{inputText.length} characters</div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Preview */}
          {qrCodeUrl && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
              <CardHeader className="border-b border-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Generated QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="Generated QR Code"
                      className="mx-auto"
                      style={{ width: size[0], height: size[0] }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Size: {size[0]} × {size[0]} pixels
                  </div>
                  <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
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
                QR Code Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Size: {size[0]}px</Label>
                <Slider value={size} onValueChange={setSize} max={512} min={128} step={32} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Error Correction</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (~7%)</SelectItem>
                    <SelectItem value="M">Medium (~15%)</SelectItem>
                    <SelectItem value="Q">Quartile (~25%)</SelectItem>
                    <SelectItem value="H">High (~30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </Label>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Foreground Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Background Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 text-xs"
                      />
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
              onClick={generateQRCode}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1 h-12 text-base bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Generating QR Code...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 px-6 bg-transparent"
              disabled={!inputText && !qrCodeUrl}
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
