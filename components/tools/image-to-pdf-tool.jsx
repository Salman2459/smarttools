"use-client"

import { useState, useRef } from "react"
import jsPDF from "jspdf"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileImage, Upload, Download, Loader2, Settings, X, PlusCircle } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toolsData } from "@/lib/tools-data"
import Head from "next/head"

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImageToPdfTool({ toolId }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [pageSize, setPageSize] = useState("A4")
  const [orientation, setOrientation] = useState("portrait")
  const [stackImages, setStackImages] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const fileInputRef = useRef(null)
  const toolData = toolsData.find((tool) => tool.id === toolId)

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles((prevFiles) => [...prevFiles, ...imageFiles]);
      setPdfUrl(null);
    }
  }

  const handleClear = () => {
    setSelectedFiles([])
    setPdfUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleProcess = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return
    setIsProcessing(true)
    setPdfUrl(null)

    try {
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: pageSize,
      })

      const filesArray = Array.from(selectedFiles)
      let addedImages = 0

      if (stackImages) {
        // --- LOGIC FOR STACKING IMAGES ---
        const pageMargin = 10 // 10mm margin
        const imageSpacing = 5 // 5mm spacing between images
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const usableWidth = pdfWidth - pageMargin * 2
        const usableHeight = pdfHeight - pageMargin * 2
        let currentY = pageMargin
        let isFirstImageOnPage = true

        for (const file of filesArray) {
          const imageData = await readFileAsDataURL(file)
          const img = new Image()
          img.src = imageData
          await new Promise((resolve) => { img.onload = resolve })

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const finalImageData = canvas.toDataURL('image/jpeg', 0.9);

          const ratio = usableWidth / img.width
          const imgWidth = img.width * ratio
          const imgHeight = img.height * ratio

          const requiredSpace = imgHeight + (isFirstImageOnPage ? 0 : imageSpacing);
          if (!isFirstImageOnPage && (currentY + requiredSpace) > (usableHeight + pageMargin)) {
            pdf.addPage()
            currentY = pageMargin
            isFirstImageOnPage = true
          }

          if (!isFirstImageOnPage) {
            currentY += imageSpacing
          }

          pdf.addImage(finalImageData, "JPEG", pageMargin, currentY, imgWidth, imgHeight)
          currentY += imgHeight
          isFirstImageOnPage = false
          addedImages++
        }

      } else {
        // --- ORIGINAL LOGIC: ONE IMAGE PER PAGE ---
        for (const file of filesArray) {
          const imageData = await readFileAsDataURL(file)
          const img = new Image()
          img.src = imageData
          await new Promise((resolve) => { img.onload = resolve })

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const finalImageData = canvas.toDataURL('image/jpeg', 0.9);

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()

          const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height)
          const imgWidth = img.width * ratio
          const imgHeight = img.height * ratio

          const x = (pdfWidth - imgWidth) / 2
          const y = (pdfHeight - imgHeight) / 2

          if (addedImages > 0) {
            pdf.addPage()
          }

          pdf.addImage(finalImageData, "JPEG", x, y, imgWidth, imgHeight)
          addedImages++
        }
      }

      if (addedImages > 0) {
        const pdfDataUri = pdf.output("datauristring")
        setPdfUrl(pdfDataUri)
      } else {
        alert("No valid image files were selected. Please select JPG, PNG, or WEBP files.")
      }
    } catch (error) {
      console.error("Error converting images:", error)
      alert("Failed to convert images. Please check the console for details.")
    }

    setIsProcessing(false)
  }

  const handleDownload = () => {
    if (!pdfUrl) return
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "converted.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  return (
    <>
      <head>
        <meta name="description" content={toolData.metaDescription} />
      </head>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shadow-lg border border-blue-200/50 dark:border-blue-800/50">
                <FileImage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitleMain className="text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Image to PDF Converter
                  </CardTitleMain>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                  >
                    Conversion
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  Convert your images (JPG, PNG, WEBP) to high-quality PDF documents with custom settings
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
                  <Upload className="w-5 h-5 text-blue-600" />
                  Upload Images
                </CardTitle>
                <CardDescription>Select multiple images to convert to a single PDF</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Label htmlFor="image-files" className="cursor-pointer">
                  <div className="border-2 border-dashed border-blue-200 dark:border-blue-800/50 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-all duration-300 group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        handleFileChange({ target: { files: files } });
                      }
                    }}>
                    <ImageIcon className="w-12 h-12 mx-auto text-blue-400 mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                    <Input
                      id="image-files"
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <p className="text-sm text-muted-foreground group-hover:text-blue-600 transition-colors duration-300 font-medium">
                      Click to browse or drag and drop your images here
                    </p>
                    <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-blue-50 dark:bg-blue-950/20 rounded-full inline-block">
                      Supported: JPG, PNG, WEBP
                    </div>
                  </div>
                </Label>

                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-blue-600" />
                        Selected Images ({selectedFiles.length})
                      </h4>
                      <Button variant="destructive" size="sm" onClick={handleClear}>
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/30"
                        >
                          <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-center">
                      <Label
                        htmlFor="image-files"
                        className="inline-flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-4 py-2 rounded-lg text-sm cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Select more images
                      </Label>
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
                  <Settings className="w-5 h-5 text-blue-600" />
                  PDF Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Page Size</Label>
                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                      <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                      <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Orientation</Label>
                  <Select value={orientation} onValueChange={setOrientation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <Label htmlFor="stack-images" className="flex flex-col gap-1 cursor-pointer">
                      <span className="font-medium">Stack Images</span>
                      <span className="text-xs text-muted-foreground">Place multiple images on one page</span>
                    </Label>
                    <Switch
                      id="stack-images"
                      checked={stackImages}
                      onCheckedChange={setStackImages}
                    />
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
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="animate-pulse">Converting to PDF...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5 mr-2" />
                  Convert to PDF ({selectedFiles?.length || 0} images)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
          <CardHeader className="border-b border-muted/20">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Your PDF is Ready
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {pdfUrl ? (
              <div className="space-y-4">
                <div className="w-full h-[600px] rounded-lg border border-muted/30 overflow-hidden">
                  <iframe src={pdfUrl} title="PDF Preview" className="w-full h-full" />
                </div>
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Your PDF preview will appear here after conversion</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Files are processed in your browser and are never uploaded
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}