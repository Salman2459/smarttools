"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  Loader2,
  Settings,
  File,
  X,
  PlusCircle,
  Download,
  ImageIcon,
  FileSpreadsheet,
  FileVideo,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"
import mammoth from "mammoth"
import $ from 'jquery';


// NOTE: No top-level jQuery import here.
export function DocToPdfTool() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [compressionLevel, setCompressionLevel] = useState("medium")
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  const fileInputRef = useRef(null)
  const html2pdfRef = useRef(null)

  useEffect(() => {
    // Dynamically import html2pdf.js once the component mounts
    import("html2pdf.js").then((module) => {
      html2pdfRef.current = module.default
    })
  }, [])

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      const allFiles = [...selectedFiles, ...newFiles]
      setSelectedFiles(allFiles)
      setPdfPreviewUrl(null)
      setPdfBlob(null)
    }
  }

  const handleDragDrop = async (event) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files) {
      const newFiles = Array.from(files).filter((file) => {
        const ext = file.name.split(".").pop().toLowerCase()
        return ["docx", "txt", "xlsx", "xls", "csv", "png", "jpg", "jpeg", "gif", "svg", "pptx"].includes(ext)
      })
      if (newFiles.length === 0) {
        alert("Please drop supported file types: DOCX, TXT, XLSX, PPTX, Images")
        return
      }
      const allFiles = [...selectedFiles, ...newFiles]
      setSelectedFiles(allFiles)
      setPdfPreviewUrl(null)
      setPdfBlob(null)
    }
  }

  const renderFileToHtml = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase()
    const container = document.createElement("div")

    try {
      if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        container.innerHTML = result.value
        const allElements = container.querySelectorAll("*")
        allElements.forEach((el) => {
          el.style.color = "black"
          el.style.backgroundColor = "transparent"
        })
      } else if (ext === "txt") {
        const text = await file.text()
        const pre = document.createElement("pre")
        pre.style.whiteSpace = "pre-wrap"
        pre.style.fontFamily = "Arial, sans-serif"
        pre.style.fontSize = "12px"
        pre.style.color = "black"
        pre.textContent = text
        container.appendChild(pre)
      } else if (["xlsx", "xls", "csv"].includes(ext)) {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName])
        const wrapper = document.createElement("div")
        wrapper.innerHTML = html
        wrapper.style.color = "black"
        const tables = wrapper.querySelectorAll("table")
        tables.forEach((table) => {
          table.style.borderCollapse = "collapse"
          table.style.width = "100%"
          table.style.fontFamily = "Arial, sans-serif"
          table.style.color = "black"
        })
        const cells = wrapper.querySelectorAll("td, th")
        cells.forEach((cell) => {
          cell.style.border = "1px solid #000"
          cell.style.padding = "8px"
          cell.style.color = "black"
        })
        container.appendChild(wrapper)
      } else if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
        const imageUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
        const img = document.createElement("img")
        img.src = imageUrl
        img.style.maxWidth = "100%"
        img.style.height = "auto"
        container.appendChild(img)
      } else if (ext === "svg") {
        const svgText = await file.text()
        const wrapper = document.createElement("div")
        wrapper.innerHTML = svgText
        const svgElement = wrapper.querySelector("svg")
        if (svgElement) {
          svgElement.style.maxWidth = "100%"
          svgElement.style.height = "auto"
        }
        container.appendChild(wrapper)
      } else if (ext === "pptx") {
        try {
          if (typeof window === "undefined" || typeof document === "undefined") {
            throw new Error("PPTX conversion requires a browser environment")
          }

          // ** CORRECTED JQUERY HANDLING WITH PROPER DOCUMENT CONTEXT **
          // Dynamically import both pptx2html and jQuery
          const [pptx2htmlModule, jqueryModule] = await Promise.all([import("pptx2html"), import("jquery")])
          const pptx2html = pptx2htmlModule.default

          // Initialize jQuery with the proper document context
          const jQuery = jqueryModule.default(window)

          // Assign jQuery to both window.jQuery AND window.$ with proper context
          window.jQuery = jQuery
          window.$ = jQuery

          const tempContainer = document.createElement("div")
          tempContainer.style.display = "none"
          document.body.appendChild(tempContainer)

          // The pptx2html library requires a jQuery object as its first argument
          const $tempContainer = jQuery(tempContainer)
          const options = {
            slideMode: false,
            usePng: true,
            showSlideNum: false,
            showTotalSlideNum: false,
            keyBoardShortCut: false,
            showSlideBarBtn: false,
          }

          try {
            // Now this call will succeed because jQuery is properly initialized
            await pptx2html($tempContainer, file, options)
            // Use the jQuery object to manipulate styles as the library expects
            $tempContainer.find("*").css({
              "background-color": "transparent",
              color: "black",
              "font-family": "Arial, sans-serif",
            })
            $tempContainer.find(".slide").css({
              "page-break-after": "always",
              margin: "20px 0",
              padding: "20px",
              border: "1px solid #ccc",
              "background-color": "white",
              "min-height": "500px",
              width: "100%",
            })
            $tempContainer.find(".slide:last").css("page-break-after", "auto")
            container.innerHTML = tempContainer.innerHTML
          } finally {
            // ** IMPORTANT CLEANUP STEP **
            // Remove the temporary container from the body
            document.body.removeChild(tempContainer)
            // Remove both jQuery and $ from the global window object to avoid conflicts
            delete window.jQuery
            delete window.$
          }
        } catch (pptxError) {
          console.error("PPTX conversion error:", pptxError)
          const fallbackDiv = document.createElement("div")
          fallbackDiv.innerHTML = `
            <div style="padding: 20px; border: 2px solid #ccc; margin: 10px 0; background-color: #f9f9f9;">
              <h3 style="color: black; margin-bottom: 10px;">PowerPoint Presentation: ${file.name}</h3>
              <p style="color: black;">This PowerPoint file could not be fully converted due to a technical issue.</p>
              <p style="color: black;">Error: ${pptxError.message}</p>
              <p style="color: black; font-size: 12px;">File size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          `
          container.appendChild(fallbackDiv)
        }
      } else {
        throw new Error(`Unsupported file type: ${ext}`)
      }
    } catch (error) {
      console.error(`Failed to render file "${file.name}":`, error)
      throw new Error(`Could not process the file: ${file.name}. Please check if the file is corrupted or unsupported.`)
    }

    return container.innerHTML
  }

  const handleClear = () => {
    setSelectedFiles([])
    setPdfPreviewUrl(null)
    setPdfBlob(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleProcess = async () => {
    if (!selectedFiles.length || !html2pdfRef.current) {
      alert("No files selected or the PDF converter is still loading.")
      return
    }

    setIsProcessing(true)
    setPdfPreviewUrl(null)
    setPdfBlob(null)

    try {
      const allFilesContent = document.createElement("div")

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileHtml = await renderFileToHtml(file)
        const fileContainer = document.createElement("div")
        fileContainer.innerHTML = fileHtml

        if (i < selectedFiles.length - 1) {
          fileContainer.style.pageBreakAfter = "always"
        }

        allFilesContent.appendChild(fileContainer)
      }

      if (!allFilesContent.innerHTML.trim()) {
        throw new Error("No content could be rendered from the selected files.")
      }

      const qualityMap = { low: 0.98, medium: 0.95, high: 0.9 }
      const options = {
        margin: [10, 10, 10, 10],
        filename: "converted_documents.pdf",
        image: { type: "jpeg", quality: qualityMap[compressionLevel] },
        html2canvas: { scale: 2, useCORS: true, logging: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
      }

      const pdfBlobResult = await html2pdfRef.current().set(options).from(allFilesContent).output("blob")

      if (pdfBlobResult.size === 0) {
        throw new Error("Generated PDF is empty. This might be due to a rendering issue.")
      }

      const dataUri = URL.createObjectURL(pdfBlobResult)
      setPdfBlob(pdfBlobResult)
      setPdfPreviewUrl(dataUri)
    } catch (error) {
      console.error("Error during PDF conversion process:", error)
      alert(`Failed to proceed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!pdfBlob) {
      alert("No PDF available for download. Please convert documents first.")
      return
    }

    try {
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download =
        selectedFiles.length > 1
          ? "converted_documents.pdf"
          : selectedFiles[0]?.name.replace(/\.[^/.]+$/, ".pdf") || "converted.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download the PDF. Please try again.")
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Upload Documents
              </CardTitle>
              <CardDescription>Select DOCX, TXT, XLSX, PPTX or Image files to convert to PDF</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Label htmlFor="doc-files" className="cursor-pointer">
                <div
                  className="border-2 border-dashed border-green-200 dark:border-green-800/50 rounded-xl p-8 text-center hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50/50 dark:hover:bg-green-950/10 transition-all duration-300 group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDragDrop}
                >
                  <File className="w-12 h-12 mx-auto text-green-400 mb-4 group-hover:text-green-600 group-hover:scale-110 transition-all duration-300" />
                  <Input
                    id="doc-files"
                    type="file"
                    accept=".docx,.txt,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.gif,.svg,.pptx"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <p className="cursor-pointer text-sm text-muted-foreground hover:text-green-600 transition-colors duration-300 font-medium">
                    Click to browse or drag and drop your file here
                  </p>
                  <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-green-50 dark:bg-green-950/20 rounded-full inline-block">
                    Supported: DOCX, TXT, XLSX, PPTX, Images
                  </div>
                </div>
              </Label>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      Selected Documents ({selectedFiles.length})
                    </h4>
                    <Button variant="destructive" size="sm" onClick={handleClear}>
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.from(selectedFiles).map((file, index) => {
                      const ext = file.name.split(".").pop().toLowerCase()
                      const isImage = ["png", "jpg", "jpeg", "gif", "svg"].includes(ext)
                      const isSpreadsheet = ["xlsx", "xls", "csv"].includes(ext)
                      const isPptx = ext === "pptx"

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 rounded-lg border border-green-200/50 dark:border-green-800/30"
                        >
                          {isImage ? (
                            <ImageIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : isSpreadsheet ? (
                            <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : isPptx ? (
                            <FileVideo className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                          )}
                          <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 text-center">
                    <Label
                      htmlFor="doc-files"
                      className="inline-flex items-center bg-green-100 text-green-700 hover:bg-green-200 transition-colors px-4 py-2 rounded-lg text-sm cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Select more files
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
                <Settings className="w-5 h-5 text-green-600" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Image Compression</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Larger file, better quality)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Smaller file, lower quality)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-2">Applies to images within the document.</p>
              </div>
              <div className="space-y-2 bg-[#080E1E] min-h-[100px] py-4" style={{ color: 'black' }}>
                <p className="text-center text-white text-[12px]">Supported Types</p>
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  {[
                    "docx", "txt", "xlsx", "xls", "csv",, "pptx", "png", "jpg", "jpeg", "gif"
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="min-w-[50px] text-center rounded-md bg-green-100 px-2 py-[5px] text-[12px] !text-black" style={{ color: 'black' }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardContent className="p-6">
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !selectedFiles || selectedFiles.length === 0}
            className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span className="animate-pulse">Converting to PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Convert to PDF ({selectedFiles?.length || 0} file(s))
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardHeader className="border-b border-muted/20">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Your PDF is Ready
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {pdfPreviewUrl ? (
            <div className="space-y-4">
              <div className="w-full h-[600px] rounded-lg border border-muted/30 overflow-hidden">
                <iframe src={pdfPreviewUrl} title="PDF Preview" className="w-full h-full" />
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
    </>
  )
}
