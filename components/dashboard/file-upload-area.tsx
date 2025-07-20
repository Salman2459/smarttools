"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileIcon } from "lucide-react"

interface FileUploadAreaProps {
  acceptedTypes?: string
  onFilesSelected: (files: FileList | null) => void
  selectedFiles: FileList | null
  toolId: string
}

export function FileUploadArea({ acceptedTypes, onFilesSelected, selectedFiles, toolId }: FileUploadAreaProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(event.target.files)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/1 transition-all duration-300 group">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
        <Input
          id={`file-${toolId}`}
          type="file"
          accept={acceptedTypes}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Label
          htmlFor={`file-${toolId}`}
          className="cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          Click to browse or drag and drop your files here
        </Label>
        <div className="text-xs text-muted-foreground mt-2 px-4 py-1 bg-muted/50 rounded-full inline-block">
          Supported formats: {acceptedTypes || "All formats"}
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-primary" />
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {Array.from(selectedFiles).map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-muted/50 hover:border-primary/20 transition-colors duration-200"
              >
                <FileIcon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
