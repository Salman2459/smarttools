"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  Loader2,
  Settings,
  File,
  PlusCircle,
  Download,
  ImageIcon,
  FileSpreadsheet,
  FileVideo,
  FileCode,
  RotateCcw,
  Link as LinkIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from "xlsx"
import mammoth from "mammoth"
import { toolsData } from "@/lib/tools-data"

export function DocToPdfTool({ toolId }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [conversionMode, setConversionMode] = useState("file") // 'file' or 'url'
  const [url, setUrl] = useState("")

  // Settings state
  const [compressionLevel, setCompressionLevel] = useState("medium")
  const [orientation, setOrientation] = useState("portrait")
  const [pageSize, setPageSize] = useState("a4")
  const [marginOption, setMarginOption] = useState("default")
  const [pageBreakOption, setPageBreakOption] = useState("separate") // 'separate' or 'combine'

  const fileInputRef = useRef(null)
  const html2pdfRef = useRef(null)
  const toolData = toolsData.find((tool) => tool.id === toolId)

  useEffect(() => {
    import("html2pdf.js").then((module) => {
      html2pdfRef.current = module.default
    })
  }, [])

  useEffect(() => {
    setPdfPreviewUrl(null)
    setPdfBlob(null)
    if (conversionMode === 'file') {
      setUrl('');
    } else {
      setSelectedFiles([]);
    }
  }, [conversionMode])

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
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
        const supportedTypes = toolData.acceptedTypes.replace(/\./g, "").split(",")
        return supportedTypes.includes(ext)
      })
      if (newFiles.length === 0) {
        alert(`Please drop supported file types: ${toolData.acceptedTypes.replace(/\./g, "").replace(/,/g, ", ")}`)
        return
      }
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
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
      } else if (ext === "txt") {
        const text = await file.text()
        const pre = document.createElement("pre")
        pre.style.whiteSpace = "pre-wrap"
        pre.style.wordWrap = "break-word"
        pre.textContent = text
        container.appendChild(pre)
        // START: FIX FOR MISSING TABLE BORDERS
      } else if (["xlsx", "xls", "csv"].includes(ext)) {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const tableHtml = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName])

        // Inject CSS to add borders and basic styling to the table for PDF rendering.
        // The default output from XLSX.utils.sheet_to_html is an unstyled table.
        const tableStyles = `
          <style>
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-family: sans-serif;
              font-size: 10px; /* Adjust font size for better fit on PDF */
            }
            th, td { 
              border: 1px solid #333; /* Use a darker, visible border */
              padding: 4px 6px; /* Adjust padding for a cleaner look */
              text-align: left; 
              word-wrap: break-word; /* Ensure long cell content wraps */
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
            }
          </style>
        `
        container.innerHTML = tableStyles + tableHtml
        // END: FIX FOR MISSING TABLE BORDERS
      } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
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
      } else if (ext === "html") {
        container.innerHTML = await file.text()
      } else if (ext === "pptx") {
        container.innerHTML = `<div style="padding: 20px; border: 2px solid #ccc;"><p>PPTX preview is not supported. It will be represented by its name in the PDF.</p></div>`
      } else {
        throw new Error(`Unsupported file type: ${ext}`)
      }
      // Ensure content is visible on PDF
      const allElements = container.querySelectorAll("*")
      allElements.forEach((el) => {
        el.style.color = "black"
        el.style.backgroundColor = "transparent"
      })
    } catch (error) {
      console.error(`Failed to render file "${file.name}":`, error)
      throw new Error(`Could not process the file: ${file.name}.`)
    }
    return container.innerHTML
  }

  const handleClear = () => {
    setSelectedFiles([])
    setPdfPreviewUrl(null)
    setPdfBlob(null)
    setUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleProcess = async () => {
    if (!html2pdfRef.current) {
      alert("The PDF converter is still loading.")
      return
    }
    setIsProcessing(true)
    setPdfPreviewUrl(null)
    setPdfBlob(null)
    try {
      let contentElement;

      if (toolId === "html-to-pdf" && conversionMode === "url") {
        if (!url) throw new Error("Please enter a URL to convert.")
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Failed to fetch URL: ${errorData.error || response.statusText}`)
        }
        const htmlText = await response.text()
        contentElement = document.createElement("div")
        contentElement.innerHTML = htmlText
      } else {
        if (selectedFiles.length === 0) throw new Error("No files selected to convert.")
        contentElement = document.createElement("div")
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          const fileHtml = await renderFileToHtml(file)
          const fileContainer = document.createElement("div")
          fileContainer.innerHTML = fileHtml

          if (pageBreakOption === 'separate' && i < selectedFiles.length - 1) {
            fileContainer.style.pageBreakAfter = "always"
          }

          contentElement.appendChild(fileContainer)
        }
      }

      if (!contentElement || !contentElement.innerHTML.trim()) {
        throw new Error("No content could be rendered from the selected source.")
      }

      const qualityMap = { low: 0.98, medium: 0.95, high: 0.9 }
      const getPageFormat = () => {
        if (pageSize === "square") return [210, 210] // Custom format in mm
        return pageSize // 'a4' or 'letter'
      }

      const options = {
        margin: marginOption === "none" ? 0 : [10, 10, 10, 10],
        filename: "converted.pdf",
        image: { type: "jpeg", quality: qualityMap[compressionLevel] },
        html2canvas: { scale: 2, useCORS: true, logging: true, backgroundColor: "#ffffff" },
        jsPDF: {
          unit: "mm",
          format: getPageFormat(),
          orientation: orientation,
          compress: true,
        },
      }

      const pdfBlobResult = await html2pdfRef.current().set(options).from(contentElement).output("blob")
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
    if (!pdfBlob) return;
    try {
      const getFilename = () => {
        if (toolId === "html-to-pdf" && url && selectedFiles.length === 0) {
          try {
            const urlObject = new URL(url)
            return `converted-${urlObject.hostname.replace("www.", "").replace(/[^a-z0-9]/gi, "_")}.pdf`
          } catch { return "converted-from-url.pdf" }
        }
        return selectedFiles.length > 1 ? "converted_documents.pdf" : selectedFiles[0]?.name.replace(/\.[^/.]+$/, ".pdf") || "converted.pdf"
      }
      const linkUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = linkUrl
      link.download = getFilename()
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(linkUrl)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download the PDF.")
    }
  }

  const isProcessButtonDisabled = isProcessing || (toolId === 'html-to-pdf' && conversionMode === 'url' ? !url.trim() : selectedFiles.length === 0);

  const renderUploadUI = () => {
    const fileUploadZone = (
      <>
        <Label htmlFor="doc-files" className="cursor-pointer">
          <div
            className={`border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-current ${toolData.color} hover:bg-muted/30 transition-all group`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
          >
            <File className={`w-12 h-12 mx-auto ${toolData.color} mb-4 group-hover:scale-110 transition-all`} />
            <Input id="doc-files" type="file" accept={toolData.acceptedTypes} multiple onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <p className={`cursor-pointer text-sm text-muted-foreground hover:text-current font-medium`}>Click to browse or drag and drop your file here</p>
            <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-muted/40 rounded-full inline-block">Supported: {toolData.acceptedTypes.replace(/\./g, "").replace(/,/g, ", ")}</div>
          </div>
        </Label>
        {selectedFiles.length > 0 && renderSelectedFiles()}
      </>
    )

    if (toolId === "html-to-pdf") {
      return (
        <Tabs value={conversionMode} onValueChange={setConversionMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="pt-4">{fileUploadZone}</TabsContent>
          <TabsContent value="url" className="pt-4 space-y-4">
            <Label htmlFor="url-input" className="font-medium">Enter a public URL</Label>
            <div className="relative">
              <LinkIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${toolData.color}`} />
              <Input id="url-input" type="url" placeholder="https://example.com/page.html" value={url} onChange={(e) => setUrl(e.target.value)} className="pl-10 h-12" />
            </div>
            <p className="text-xs text-muted-foreground"><b>Note:</b> This works best for simple web pages. Complex sites may not render correctly.</p>
          </TabsContent>
        </Tabs>
      )
    }
    return fileUploadZone
  }

  const renderSelectedFiles = () => (
    <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <FileText className={`w-4 h-4 ${toolData.color}`} />Selected Documents ({selectedFiles.length})
      </h4>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {Array.from(selectedFiles).map((file, index) => {
          const ext = file.name.split(".").pop().toLowerCase()
          const isImage = ["png", "jpg", "jpeg", "gif", "svg"].includes(ext)
          const isSpreadsheet = ["xlsx", "xls", "csv"].includes(ext)
          const isPptx = ext === "pptx"
          const isHtml = ext === "html"
          return (
            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-muted/20">
              {isImage ? (<ImageIcon className={`w-4 h-4 ${toolData.color} shrink-0`} />)
                : isSpreadsheet ? (<FileSpreadsheet className={`w-4 h-4 ${toolData.color} shrink-0`} />)
                  : isPptx ? (<FileVideo className={`w-4 h-4 ${toolData.color} shrink-0`} />)
                    : isHtml ? (<FileCode className={`w-4 h-4 ${toolData.color} shrink-0`} />)
                      : (<FileText className={`w-4 h-4 ${toolData.color} shrink-0`} />)}
              <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center">
        <Label htmlFor="doc-files" className="inline-flex items-center bg-muted/40 hover:bg-muted/60 transition-colors px-4 py-2 rounded-lg text-sm cursor-pointer">
          <PlusCircle className="w-4 h-4 mr-2" />Select more files
        </Label>
      </div>
    </div>
  )

  return (
    <>
      <Card className={`border-0 bg-gradient-to-br from-${toolData.bgColor.split('-')[1]}-50/50 to-${toolData.bgColor.split('-')[1]}-100/30 dark:from-${toolData.bgColor.split('-')[1]}-950/20 dark:to-${toolData.bgColor.split('-')[1]}-900/10 shadow-lg`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl ${toolData.bgColor} dark:bg-${toolData.bgColor.split('-')[1]}-900/20 flex items-center justify-center shadow-lg border border-${toolData.bgColor.split('-')[1]}-200/50 dark:border-${toolData.bgColor.split('-')[1]}-800/50`}>
              <toolData.icon className={`w-8 h-8 ${toolData.color} dark:text-${toolData.color.split('-')[1]}-400`} />
            </div>
            <div className="text-left">
              <CardTitleMain className={`text-2xl bg-gradient-to-r from-${toolData.color.split('-')[1]}-600 to-${toolData.color.split('-')[1]}-800 bg-clip-text text-transparent`}>
                {toolData.title}
              </CardTitleMain>
              <CardDescription className="text-base">{toolData.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className={`w-5 h-5 ${toolData.color}`} />
                {toolId === 'html-to-pdf' ? "Select Source" : "Upload Documents"}
              </CardTitle>
              <CardDescription>
                {toolId === 'html-to-pdf' ? "Choose a file or enter a URL to convert to PDF" : `Select ${toolData.acceptedTypes.replace(/\./g, "").replace(/,/g, ", ")} files to convert to PDF`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">{renderUploadUI()}</CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className={`w-5 h-5 ${toolData.color}`} />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Multi-File Layout</Label>
                <Select value={pageBreakOption} onValueChange={setPageBreakOption}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="separate">Start each file on a new page</SelectItem>
                    <SelectItem value="combine">Combine files on same page</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-1">Only applies when converting multiple files.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Page Orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="square">Square (210mm x 210mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Page Margins</Label>
                <Select value={marginOption} onValueChange={setMarginOption}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="none">No Margins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Image Compression</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Larger file, better quality)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Smaller file, lower quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="space-y-2 min-h-[100px] py-4 bg-muted/30 border-muted/20">
                <p className="text-center text-foreground text-[12px]">Supported Types</p>
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  <div className="min-w-[50px] text-center rounded-md bg-background/50 px-2 py-[5px] text-[12px] text-foreground">
                    {toolData.acceptedTypes.replace(/\./g, "").replace(/,/g, ", ")}
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleProcess} disabled={isProcessButtonDisabled} className={`flex-1 h-12 text-base bg-gradient-to-r from-${toolData.color.split('-')[1]}-500 to-${toolData.color.split('-')[1]}-700 hover:brightness-110 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:transform-none`} size="lg">
              {isProcessing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /><span className="animate-pulse">Converting...</span></>)
                : (toolId === 'html-to-pdf' && conversionMode === 'url') ? (<><FileText className="w-5 h-5 mr-2" />Convert URL to PDF</>)
                  : (<><FileText className="w-5 h-5 mr-2" />Convert to PDF ({selectedFiles.length} file(s))</>)}
            </Button>
            <Button onClick={handleClear} variant="outline" className="h-12 px-6 bg-transparent" disabled={!url && selectedFiles.length === 0 && !pdfBlob}>
              <RotateCcw className="w-4 h-4 mr-2" />Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {pdfPreviewUrl && (
        <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg animate-in fade-in duration-500">
          <CardHeader className="border-b border-muted/20"><CardTitle className="flex items-center gap-2"><Download className={`w-5 h-5 ${toolData.color}`} />Your PDF is Ready</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-full h-[600px] rounded-lg border border-muted/30 overflow-hidden"><iframe src={pdfPreviewUrl} title="PDF Preview" className="w-full h-full" /></div>
              <Button onClick={handleDownload} className={`w-full h-12 text-base bg-gradient-to-r from-${toolData.color.split('-')[1]}-500 to-${toolData.color.split('-')[1]}-700 hover:brightness-110 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]`} size="lg">
                <Download className="w-5 h-5 mr-2" />Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}