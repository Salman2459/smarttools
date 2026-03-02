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
  File,
  Download,
  ImageIcon,
  FileSpreadsheet,
  FileVideo,
  FileCode,
  RotateCcw,
  Eye,
  Maximize2,
  Minimize2,
  X,
  Smartphone,
  Monitor,
} from "lucide-react"
import * as XLSX from "xlsx"
import mammoth from "mammoth"
import { renderAsync } from "docx-preview"
import { toolsData } from "@/lib/tools-data"

export function DocumentViewerTool({ toolId }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewContent, setPreviewContent] = useState(null)
  const [previewType, setPreviewType] = useState(null) // 'html', 'image', 'pdf', 'docx-render'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState("auto") // 'auto', 'mobile', 'desktop'
  
  const fileInputRef = useRef(null)
  const viewerRef = useRef(null)
  const toolData = toolsData.find((tool) => tool.id === toolId) || toolsData.find(t => t.id === 'document-viewer')

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragDrop = async (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Validate type based on toolId if specific
      const ext = file.name.split(".").pop().toLowerCase()
      if (toolData.acceptedTypes && !toolData.acceptedTypes.includes(ext)) {
          // Allow some flexibility but warn
      }
      processFile(file)
    }
  }

  const processFile = async (file) => {
    setIsProcessing(true)
    setSelectedFile(file)
    setPreviewContent(null)
    setPreviewType(null)

    const ext = file.name.split(".").pop().toLowerCase()
    
    try {
      if (ext === "docx" || ext === "doc") {
        const arrayBuffer = await file.arrayBuffer()
        setPreviewType("docx-render")
        setPreviewContent(arrayBuffer)
      } else if (ext === "pptx") {
          setPreviewType("html");
          setPreviewContent(`<div class="p-12 text-center">
             <div class="bg-orange-100 dark:bg-orange-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FileVideo className="w-10 h-10 text-orange-600" />
             </div>
             <h3 class="text-xl font-bold mb-2">PowerPoint Presentation</h3>
             <p class="text-muted-foreground mb-6">${file.name}</p>
             <div class="max-w-md mx-auto p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/20">
                 <p class="text-sm">Direct PPTX rendering in browser is limited. Please use the download button below to view it in your local presentation software.</p>
             </div>
          </div>`);
      } else if (["xlsx", "xls", "csv"].includes(ext)) {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const tableHtml = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName])
        
        // REMOVED background-color: transparent to allow original colors
        const styledHtml = `
          <div class="excel-viewer-container">
            <style>
              .excel-viewer-container { 
                width: 100%; 
                overflow-x: auto; 
                background: white; 
              }
              .excel-viewer-container table { 
                border-collapse: collapse; 
                width: 100%; 
                font-size: 13px; 
                border: 1px solid #e2e8f0;
              }
              .excel-viewer-container th, .excel-viewer-container td { 
                border: 1px solid #e2e8f0; 
                padding: 10px 12px; 
                text-align: left; 
                min-width: 100px;
                color: #334155;
              }
              /* Only apply zebra striping to rows that don't have an inline background color set */
              .excel-viewer-container tr:nth-child(even):not([style*="background-color"]) td:not([style*="background-color"]) { 
                background-color: #f8fafc; 
              }
              .excel-viewer-container th { 
                background-color: #f1f5f9; 
                font-weight: 600;
                color: #0f172a;
                position: sticky;
                top: 0;
                z-index: 10;
              }
              .excel-viewer-container a { color: #2563eb; text-decoration: underline; }
            </style>
            ${tableHtml}
          </div>
        `
        setPreviewType("html")
        setPreviewContent(styledHtml)
      } else if (ext === "pdf") {
        const url = URL.createObjectURL(file)
        setPreviewType("pdf")
        setPreviewContent(url)
      } else if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
        const url = URL.createObjectURL(file)
        setPreviewType("image")
        setPreviewContent(url)
      } else if (["txt", "html", "js", "css", "json", "md"].includes(ext)) {
        const text = await file.text()
        if (ext === "html") {
          setPreviewType("html")
          setPreviewContent(`<div class="bg-white p-4 rounded border">${text}</div>`)
        } else if (ext === "md") {
             setPreviewType("html")
             setPreviewContent(`<div class="prose dark:prose-invert max-w-none p-4">${text}</div>`)
        } else {
          setPreviewType("html")
          setPreviewContent(`<pre class="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-auto font-mono text-sm leading-relaxed border border-slate-800 shadow-xl">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`)
        }
      } else {
        throw new Error("Unsupported file type")
      }
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Error opening file. It might be corrupted or unsupported.")
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (previewType === "docx-render" && previewContent && viewerRef.current) {
        viewerRef.current.innerHTML = ""
        renderAsync(previewContent, viewerRef.current, null, {
            className: "docx-viewer",
            inWrapper: false,
            ignoreWidth: false,
            ignoreHeight: false,
            useBase64URL: true,
        }).catch(err => {
            console.error("docx-preview error:", err)
            mammoth.convertToHtml({ arrayBuffer: previewContent })
                .then(result => {
                    setPreviewType("html")
                    setPreviewContent(`<div class="bg-white p-8 shadow-sm rounded-lg docx-fallback">${result.value}</div>`)
                })
        })
    }
  }, [previewType, previewContent])

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewContent(null)
    setPreviewType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const downloadOriginal = () => {
      if (!selectedFile) return;
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }

  return (
    <>
      <Card className={`border-0 bg-gradient-to-br from-${toolData.bgColor.split('-')[1]}-50/50 to-${toolData.bgColor.split('-')[1]}-100/30 dark:from-${toolData.bgColor.split('-')[1]}-950/20 dark:to-${toolData.bgColor.split('-')[1]}-900/10 shadow-lg`}>
        <CardHeader className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl ${toolData.bgColor} dark:bg-${toolData.bgColor.split('-')[1]}-900/20 flex items-center justify-center shadow-lg border border-${toolData.bgColor.split('-')[1]}-200/50 dark:border-${toolData.bgColor.split('-')[1]}-800/50`}>
              <toolData.icon className={`w-8 h-8 ${toolData.color} dark:text-${toolData.color.split('-')[1]}-400`} />
            </div>
            <div className="text-center sm:text-left">
              <CardTitleMain className={`text-2xl bg-gradient-to-r from-${toolData.color.split('-')[1]}-600 to-${toolData.color.split('-')[1]}-800 bg-clip-text text-transparent`}>
                {toolData.title}
              </CardTitleMain>
              <CardDescription className="text-base">{toolData.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!selectedFile ? (
        <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg overflow-hidden">
          <CardContent className="p-4 sm:p-10">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 sm:p-12 text-center hover:border-blue-500 transition-all cursor-pointer bg-muted/20 group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={toolData.acceptedTypes}
              />
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Click to upload or drag & drop</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Directly view your files without uploading to any server
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {toolData.acceptedTypes && toolData.acceptedTypes.split(',').map((type, i) => (
                  <span key={i} className="px-2 py-1 bg-background border rounded-md text-[10px] sm:text-xs font-medium uppercase text-muted-foreground">
                    {type.trim().replace('.', '')}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={`mt-6 space-y-4 ${isFullscreen ? 'fixed inset-0 z-[100] bg-background flex flex-col p-0' : 'flex flex-col'}`}>
          <div className={`flex items-center justify-between gap-4 bg-muted/30 p-3 sm:p-4 ${isFullscreen ? 'border-b' : 'rounded-xl border'} border-muted/20`}>
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg shrink-0">
                    {toolData.icon ? <toolData.icon className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="truncate">
                    <p className="font-medium text-sm sm:text-base truncate">{selectedFile.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Local Preview</p>
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden sm:flex items-center bg-background rounded-lg border p-1 mr-2">
                    <Button variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('mobile')}>
                        <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('desktop')}>
                        <Monitor className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={handleClear} title="Close">
                    <X className="w-4 h-4" />
                </Button>
            </div>
          </div>

          <Card className={`border-0 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex-1 flex flex-col ${isFullscreen ? 'rounded-none' : 'rounded-2xl min-h-[600px] sm:min-h-[85vh]'}`}>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col relative">
                {isProcessing && (
                    <div className="absolute inset-0 z-10 bg-background/80 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                        <p className="font-medium">Opening your file...</p>
                    </div>
                )}
                
                <div className={`w-full flex-1 overflow-auto p-0 transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[400px] mx-auto border-x bg-white shadow-xl' : 'w-full'}`}>
                    <div className="w-full min-h-full flex flex-col items-center">
                        {previewType === "html" && (
                            <div 
                              className="w-full max-w-5xl prose dark:prose-invert animate-in fade-in duration-500 p-4 sm:p-8" 
                              dangerouslySetInnerHTML={{ __html: previewContent }} 
                            />
                        )}
                        {previewType === "image" && (
                            <div className="flex items-center justify-center w-full h-full p-4 lg:p-12">
                                <img src={previewContent} alt="Preview" className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg border bg-white" />
                            </div>
                        )}
                        {previewType === "pdf" && (
                            <iframe src={previewContent} className="w-full flex-1 min-h-[80vh] border-0" title="PDF Viewer" />
                        )}
                        {previewType === "docx-render" && (
                            <div className="w-full flex flex-col items-center bg-slate-200/50 dark:bg-slate-900/50 p-2 sm:p-6 md:p-12 min-h-full">
                                <div ref={viewerRef} className="w-full max-w-[850px] bg-white text-black shadow-2xl h-auto min-h-[1056px] docx-container" />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* FOOTER BAR FOR ACTIONS */}
                <div className="bg-background/80 backdrop-blur-md border-t p-3 flex justify-between items-center sm:hidden">
                     <span className="text-[10px] font-medium text-muted-foreground truncate">{selectedFile.name}</span>
                     <Button size="sm" onClick={downloadOriginal} className="h-8">
                        <Download className="w-3 h-3 mr-1" /> Download
                     </Button>
                </div>
            </CardContent>
          </Card>
          
          {!isFullscreen && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 py-4">
                 <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                   <RotateCcw className="w-4 h-4 mr-2" /> Open Different File
                 </Button>
                 <Button onClick={downloadOriginal} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                   <Download className="w-4 h-4 mr-2" /> Download Original
                 </Button>
              </div>
          )}
        </div>
      )}
      
      {/* GLOBAL STYLES FOR VIEWERS */}
      <style jsx global>{`
        .docx-wrapper {
            background-color: transparent !important;
            padding: 0 !important;
        }
        .docx {
            margin-bottom: 2rem !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
        .excel-viewer-container table {
            background: white !important;
            color: #1a1a1a !important;
        }
        @media (max-width: 640px) {
            .docx {
                padding: 1rem !important;
                width: 100% !important;
            }
        }
      `}</style>
    </>
  )
}
