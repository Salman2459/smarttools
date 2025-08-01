"use client"
import { useState, useRef } from "react"
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
    Download,
    FileSpreadsheet,
    FileSignature,
    RotateCcw,
} from "lucide-react"
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import { Document, Packer, Paragraph, TextRun } from "docx"
import * as XLSX from "xlsx"
import { toolsData } from "@/lib/tools-data"

// --- FIX APPLIED HERE ---
// Set up the PDF.js worker to use the local file from the `public` directory.
// This is the most reliable method and avoids CDN/versioning issues.
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
// --- END OF FIX ---

/**
 * JSDoc type definition for the output data state.
 * @typedef {object} OutputData
 * @property {Blob | null} blob
 * @property {string | null} url
 * @property {string | null} filename
 * @property {'txt' | 'word' | 'excel' | null} type
 */

/**
 * @param {{ toolId: string }} props
 */
export function PdfToDocTool({ toolId }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    /** @type {[OutputData, React.Dispatch<React.SetStateAction<OutputData>>]} */
    const [outputData, setOutputData] = useState({ blob: null, url: null, filename: null, type: null })
    const [txtPreview, setTxtPreview] = useState(null)

    const fileInputRef = useRef(null)
    const toolData = toolsData.find((tool) => tool.id === toolId)
    const outputFormat = toolId.split("-").pop()

    if (!toolData) {
        return <div>Error: Tool data for "{toolId}" not found.</div>
    }

    /** @param {React.ChangeEvent<HTMLInputElement>} event */
    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (file && file.type === "application/pdf") {
            setSelectedFile(file)
            setOutputData({ blob: null, url: null, filename: null, type: null })
            setTxtPreview(null)
        } else if (file) {
            alert("Please select a valid PDF file.")
        }
    }

    /** @param {React.DragEvent<HTMLDivElement>} event */
    const handleDragDrop = (event) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file && file.type === "application/pdf") {
            setSelectedFile(file)
            setOutputData({ blob: null, url: null, filename: null, type: null })
            setTxtPreview(null)
        } else if (file) {
            alert("Please drop a single valid PDF file.")
        }
    }

    const handleClear = () => {
        setSelectedFile(null)
        setOutputData({ blob: null, url: null, filename: null, type: null })
        setTxtPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    /**
     * @param {File} file The PDF file to process.
     * @returns {Promise<string>} The extracted text content.
     */
    const extractTextFromPdf = async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ""
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map((item) => item.str).join(" ")
            fullText += pageText + `\n\n--- Page ${i} ---\n\n`
        }
        return fullText.trim()
    }

    const handleProcess = async () => {
        if (!selectedFile) {
            alert("Please select a file first.")
            return
        }
        setIsProcessing(true)
        setOutputData({ blob: null, url: null, filename: null, type: null })
        setTxtPreview(null)
        try {
            const extractedText = await extractTextFromPdf(selectedFile)
            let blob
            let outputFilename
            const baseFilename = selectedFile.name.replace(/\.[^/.]+$/, "")

            switch (outputFormat) {
                case "txt":
                    blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" })
                    outputFilename = `${baseFilename}.txt`
                    setTxtPreview(extractedText)
                    break

                case "word":
                    const doc = new Document({
                        sections: [{
                            children: extractedText.split("\n").map((line) => new Paragraph({ children: [new TextRun(line)] })),
                        }],
                    })
                    blob = await Packer.toBlob(doc)
                    outputFilename = `${baseFilename}.docx`
                    break

                case "excel":
                    const lines = extractedText.split("\n").filter((line) => line.trim() !== "")
                    const data = lines.map((line) => [line]) // Each line in a new row, first column
                    const ws = XLSX.utils.aoa_to_sheet(data)
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, ws, "Extracted Data")
                    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
                    blob = new Blob([wbout], { type: "application/octet-stream" })
                    outputFilename = `${baseFilename}.xlsx`
                    break

                default:
                    throw new Error(`Unsupported output format: ${outputFormat}`)
            }

            const url = URL.createObjectURL(blob)
            setOutputData({ blob, url, filename: outputFilename, type: outputFormat })
        } catch (error) {
            console.error("Error during conversion:", error)
            alert(`Conversion failed: ${error instanceof Error ? error.message : "An unknown error occurred."}`)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!outputData.blob || !outputData.filename || !outputData.url) return
        const link = document.createElement("a")
        link.href = outputData.url
        link.download = outputData.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getOutputFormatDetails = () => {
        switch (outputFormat) {
            case "txt":
                return { name: "TXT", icon: <FileText className={`w-5 h-5 ${toolData.color}`} />, ext: "txt" }
            case "word":
                return { name: "WORD (DOCX)", icon: <FileSignature className={`w-5 h-5 ${toolData.color}`} />, ext: "docx" }
            case "excel":
                return { name: "EXCEL (XLSX)", icon: <FileSpreadsheet className={`w-5 h-5 ${toolData.color}`} />, ext: "xlsx" }
            default:
                return { name: "File", icon: <File className={`w-5 h-5 ${toolData.color}`} />, ext: "" }
        }
    }

    const renderSelectedFile = () => (
        <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-medium text-sm flex items-center gap-2">
                <File className={`w-4 h-4 ${toolData.color}`} />Selected PDF
            </h4>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                <FileText className={`w-4 h-4 ${toolData.color} shrink-0`} />
                <span className="text-sm truncate flex-1 font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        </div>
    )

    const renderResults = () => {
        if (!outputData.url) return null
        return (
            <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg animate-in fade-in duration-500">
                <CardHeader className="border-b border-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Download className={`w-5 h-5 ${toolData.color}`} />
                        Your File is Ready
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {outputData.type === "txt" && txtPreview && (
                            <div className="space-y-2">
                                <Label>Text Preview</Label>
                                <textarea readOnly value={txtPreview} className="w-full h-48 p-2 border rounded-md bg-muted/50 font-mono text-xs" />
                            </div>
                        )}
                        <Button onClick={handleDownload} className={`w-full h-12 text-base bg-gradient-to-r from-${toolData.color.split("-")[1]}-500 to-${toolData.color.split("-")[1]}-700 hover:brightness-110 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]`} size="lg">
                            <Download className="w-5 h-5 mr-2" />
                            Download .{getOutputFormatDetails().ext} File
                        </Button>
                        {outputData.type !== "txt" && (
                            <p className="text-xs text-muted-foreground text-center">Preview is not available for this file type.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className={`border-0 bg-gradient-to-br from-${toolData.bgColor.split("-")[1]}-50/50 to-${toolData.bgColor.split("-")[1]}-100/30 dark:from-${toolData.bgColor.split("-")[1]}-950/20 dark:to-${toolData.bgColor.split("-")[1]}-900/10 shadow-lg`}>
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-xl ${toolData.bgColor} dark:bg-${toolData.bgColor.split("-")[1]}-900/20 flex items-center justify-center shadow-lg border border-${toolData.bgColor.split("-")[1]}-200/50 dark:border-${toolData.bgColor.split("-")[1]}-800/50`}>
                            <toolData.icon className={`w-8 h-8 ${toolData.color} dark:text-${toolData.color.split("-")[1]}-400`} />
                        </div>
                        <div className="text-left">
                            <CardTitle className={`text-2xl bg-gradient-to-r from-${toolData.color.split("-")[1]}-600 to-${toolData.color.split("-")[1]}-800 bg-clip-text text-transparent`}>
                                {toolData.title}
                            </CardTitle>
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
                                Upload PDF File
                            </CardTitle>
                            <CardDescription>Select a single PDF file to convert.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Label htmlFor="pdf-file" className="cursor-pointer">
                                <div
                                    className={`border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-current ${toolData.color} hover:bg-muted/30 transition-all group`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDragDrop}
                                >
                                    <File className={`w-12 h-12 mx-auto ${toolData.color} mb-4 group-hover:scale-110 transition-all`} />
                                    <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                                    <p className="cursor-pointer text-sm text-muted-foreground hover:text-current font-medium">Click to browse or drag and drop your PDF here</p>
                                    <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-muted/40 rounded-full inline-block">Supports: .pdf</div>
                                </div>
                            </Label>
                            {selectedFile && renderSelectedFile()}
                        </CardContent>
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
                                <Label className="text-sm font-medium">Output Format</Label>
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    {getOutputFormatDetails().icon}
                                    <span className="font-semibold">{getOutputFormatDetails().name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground pt-1">The output format is determined by the tool you selected.</p>
                            </div>
                            <div className="space-y-2 pt-4">
                                <p className="text-sm font-medium">Important Notes</p>
                                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pl-2">
                                    <li>Conversion is performed entirely in your browser. Your files are not uploaded to a server.</li>
                                    {(outputFormat === "word" || outputFormat === "excel") && (
                                        <li>Layout, images, and complex formatting may not be perfectly preserved. This tool works best for text-heavy documents.</li>
                                    )}
                                    {outputFormat === "excel" && (
                                        <li>Table detection is basic; data is typically extracted line-by-line into a single column.</li>
                                    )}
                                    <li>Results may vary depending on the complexity and structure of the source PDF.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="mt-6 border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleProcess} disabled={!selectedFile || isProcessing} className={`flex-1 h-12 text-base bg-gradient-to-r from-${toolData.color.split("-")[1]}-500 to-${toolData.color.split("-")[1]}-700 hover:brightness-110 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:transform-none`} size="lg">
                            {isProcessing ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /><span className="animate-pulse">Converting...</span></>
                            ) : (
                                <><FileText className="w-5 h-5 mr-2" />Convert to {getOutputFormatDetails().name}</>
                            )}
                        </Button>
                        <Button onClick={handleClear} variant="outline" className="h-12 px-6 bg-transparent" disabled={!selectedFile && !outputData.url}>
                            <RotateCcw className="w-4 h-4 mr-2" />Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {renderResults()}
        </>
    )
}