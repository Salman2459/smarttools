"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleMain } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Video, Settings, Loader2, RotateCcw, Download, UploadCloud, Film, AlertCircle, Crop, StretchHorizontal } from "lucide-react"
// --- CHANGE 1: REMOVE THE STATIC IMPORT ---
// This line is the source of the error because it's evaluated in non-browser environments.
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

const presets = [
  { name: "Instagram Square", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Facebook Cover", width: 1200, height: 630 },
  { name: "Twitter Header", width: 1500, height: 500 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "HD (720p)", width: 1280, height: 720 },
  { name: "Full HD (1080p)", width: 1920, height: 1080 },
];


export function VideoResizerTool() {
  // We still use a ref to hold the ffmpeg instance once it's created.
  const ffmpegRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null)
  const [resizedVideo, setResizedVideo] = useState(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [width, setWidth] = useState(1280)
  const [height, setHeight] = useState(720)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [resizeStrategy, setResizeStrategy] = useState("fit")

  const uploadInputRef = useRef(null)
  const videoRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleClear()
      setVideoFile(file)
      setFileName(file.name)

      const previewUrl = URL.createObjectURL(file)
      setVideoPreviewUrl(previewUrl)

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        setOriginalDimensions({ width: video.videoWidth, height: video.videoHeight })
        setWidth(video.videoWidth)
        setHeight(video.videoHeight)
      }
      video.src = previewUrl
    }
  }

  const handleResize = async () => {
    if (!videoFile) return
    setIsProcessing(true)
    setResizedVideo(null)
    setError("")

    try {
      // --- CHANGE 2: DYNAMICALLY IMPORT THE LIBRARY HERE ---
      // This ensures the code is only ever loaded in the browser when this function is called.
      const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');

      // Get the ffmpeg instance from the ref, or create it if it doesn't exist.
      let ffmpeg = ffmpegRef.current;
      if (!ffmpeg) {
        ffmpeg = createFFmpeg({ log: true });
        ffmpegRef.current = ffmpeg;
      }

      // Load the ffmpeg core if it's not already loaded.
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      const inputFile = "input.mp4"
      const outputFile = "output.webm"

      ffmpeg.FS("writeFile", inputFile, await fetchFile(videoFile))

      const scaleFilter =
        resizeStrategy === "fit"
          ? `scale='min(${width},iw)':-2:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`
          : resizeStrategy === "crop"
            ? `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`
            : `scale=${width}:${height}` // stretch

      await ffmpeg.run(
        "-i", inputFile,
        "-vf", scaleFilter,
        "-c:v", "libvpx-vp9",
        "-b:v", "1M",
        "-c:a", "libvorbis",
        outputFile
      )

      const data = ffmpeg.FS("readFile", outputFile)
      const blob = new Blob([data.buffer], { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setResizedVideo(url)

    } catch (err) {
      console.error("Error:", err)
      setError("Video processing failed. " + err.message)
    }

    setIsProcessing(false)
  }

  const handlePresetClick = (preset) => {
    setWidth(preset.width)
    setHeight(preset.height)
  }

  const handleClear = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    if (resizedVideo) URL.revokeObjectURL(resizedVideo)
    setVideoFile(null)
    setResizedVideo(null)
    setVideoPreviewUrl(null)
    setFileName("")
    setError("")
    setOriginalDimensions({ width: 0, height: 0 })
    setWidth(1280)
    setHeight(720)
    if (uploadInputRef.current) uploadInputRef.current.value = ""
  }

  const handleDownload = () => {
    if (!resizedVideo) return
    const a = document.createElement("a")
    a.href = resizedVideo
    a.download = `resized-${fileName.replace(/\.[^/.]+$/, "")}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ... The rest of your JSX remains unchanged ... */}
      <Card className="border-0 bg-gradient-to-br from-yellow-50/50 to-yellow-100/30 dark:from-yellow-950/20 dark:to-yellow-900/10 shadow-lg" />

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg flex-1">
            <CardHeader className="border-b border-muted/20">
              <CardTitleMain className="text-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-yellow-600" />
                Your Video
              </CardTitleMain>
              <CardDescription>
                {videoFile ? "Preview of your selected video" : "Select a video file to resize"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {videoPreviewUrl ? (
                <div className="space-y-4">
                  <video ref={videoRef} src={videoPreviewUrl} controls className="w-full h-64 rounded-lg bg-black object-contain" />
                  <Button onClick={() => uploadInputRef.current?.click()} variant="outline" className="w-full">Change Video</Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-yellow-300 border-dashed rounded-lg cursor-pointer bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Video className="w-10 h-10 mb-3 text-yellow-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">MP4, WEBM, MOV, etc.</p>
                    </div>
                  </label>
                </div>
              )}
              <input id="dropzone-file" ref={uploadInputRef} type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
              {originalDimensions.width > 0 && (
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  Original: {originalDimensions.width} x {originalDimensions.height}
                </div>
              )}
            </CardContent>
          </Card>

          {resizedVideo && (
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-yellow-600" />
                  Resized Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <video src={resizedVideo} controls className="w-full h-64 rounded-lg bg-black object-contain" />
                <Button onClick={handleDownload} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Download Video</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg h-full">
            <CardHeader className="border-b border-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-600" />
                Resize Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Resize Mode</Label>
                <RadioGroup value={resizeStrategy} onValueChange={setResizeStrategy} className="grid grid-cols-1 gap-2" disabled={isProcessing}>
                  <Label className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:border-yellow-500 cursor-pointer transition-all hover:bg-muted/50">
                    <RadioGroupItem value="fit" id="fit" />
                    <div>
                      <p className="font-semibold">Fit with Padding</p>
                      <p className="text-xs text-muted-foreground">Maintains aspect ratio, adds black bars.</p>
                    </div>
                  </Label>
                  <Label className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:border-yellow-500 cursor-pointer transition-all hover:bg-muted/50">
                    <RadioGroupItem value="crop" id="crop" />
                    <Crop className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Crop to Fill</p>
                      <p className="text-xs text-muted-foreground">Fills dimensions, may crop edges.</p>
                    </div>
                  </Label>
                  <Label className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:border-yellow-500 cursor-pointer transition-all hover:bg-muted/50">
                    <RadioGroupItem value="stretch" id="stretch" />
                    <StretchHorizontal className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Stretch to Fit</p>
                      <p className="text-xs text-muted-foreground">Distorts video to fill dimensions.</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-medium">Custom Dimensions (px)</Label>
                <div className="flex items-center gap-4">
                  <Input type="number" value={width} onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))} placeholder="Width" disabled={isProcessing} />
                  <span className="text-muted-foreground">x</span>
                  <Input type="number" value={height} onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))} placeholder="Height" disabled={isProcessing} />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Quick Presets
                </Label>
                <div className="space-y-2">
                  {presets.map((preset) => (
                    <Button key={preset.name} onClick={() => handlePresetClick(preset)} variant="outline" className="w-full justify-between" disabled={isProcessing}>
                      <span>{preset.name}</span>
                      <span className="text-muted-foreground">{preset.width}×{preset.height}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleResize} disabled={isProcessing || !videoFile} className="flex-1 h-12 text-base bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none" size="lg">
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /><span className="animate-pulse">Processing Video...</span></>
              ) : (
                <><Video className="w-5 h-5 mr-2" />Resize Video</>
              )}
            </Button>
            <Button onClick={handleClear} variant="outline" className="h-12 px-6 bg-transparent" disabled={!videoFile && !resizedVideo}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            <p>Note: Processing happens in your browser. Larger videos may take time or fail on low-memory devices.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}