"use client"

import { useState, useRef } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardTitleMain,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Crop, Upload, Download, Loader2, Settings, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// --- UTILITY FUNCTIONS (Rewritten for react-image-crop) ---

// Helper to get a default centered crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

// Canvas utility to draw the cropped image
async function canvasPreview(image, canvas, crop) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )
    ctx.restore()
}


export function ImageCropperTool() {
    const [imageSrc, setImageSrc] = useState(null)
    const [originalFileName, setOriginalFileName] = useState("")
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [aspect, setAspect] = useState(16 / 9)
    const [isProcessing, setIsProcessing] = useState(false)

    const inputRef = useRef(null)
    const imgRef = useRef(null)
    const previewCanvasRef = useRef(null)

    function onImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
            setCompletedCrop(centerAspectCrop(width, height, aspect));
        }
    }

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setOriginalFileName(file.name)
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImageSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(file)
        }
    }

    const handleDrop = (event) => {
        event.preventDefault()
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0]
            setOriginalFileName(file.name)
            setCrop(undefined);
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImageSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(file)
            if (inputRef.current) inputRef.current.value = ""
        }
    }

    const handleDragOver = (event) => event.preventDefault()

    const handleAspectChange = (value) => {
        const newAspect = value === 'free' ? undefined : Number(value);
        setAspect(newAspect);

        if (imgRef.current) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, newAspect);
            setCrop(newCrop);
            setCompletedCrop(newCrop);
        }
    }

    const handleDownload = () => {
        if (!completedCrop || !previewCanvasRef.current) {
            return;
        }
        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
            const previewUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = previewUrl;
            const lastDot = originalFileName.lastIndexOf('.');
            const name = lastDot !== -1 ? originalFileName.substring(0, lastDot) : originalFileName;
            a.download = `${name}-cropped.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(previewUrl);
        }, 'image/png', 1);
    };

    const handleClear = () => {
        setImageSrc(null)
        setOriginalFileName("")
        setCrop(undefined)
        setCompletedCrop(undefined)
        if (inputRef.current) inputRef.current.value = ""
    }

    // A little trick to add rule-of-thirds grid
    const cropStyle = `
    .ReactCrop__rule-of-thirds::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 0 0 #fff, 0 0 0 0 #fff, inset 0 0 0 0 #fff, inset 0 0 0 0 #fff;
      transform: translateY(33.33%);
    }
    .ReactCrop__rule-of-thirds::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 0 0 #fff, 0 0 0 0 #fff, inset 0 0 0 0 #fff, inset 0 0 0 0 #fff;
      transform: translateX(33.33%);
    }
  `;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <style>{cropStyle}</style>
            <Card className="border-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 shadow-lg">
                {/* Header remains the same */}
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shadow-lg border border-purple-200/50 dark:border-purple-800/50">
                            <Crop className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitleMain className="text-2xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    Image Cropper
                                </CardTitleMain>
                                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
                                    Editing
                                </Badge>
                            </div>
                            <CardDescription className="text-base">
                                Drag the handles to crop your image exactly how you want it
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                        {!imageSrc ? (
                            <>
                                <CardHeader className="border-b border-muted/20">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-purple-600" /> Upload Image
                                    </CardTitle>
                                    <CardDescription>Select an image to start cropping</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <label htmlFor="crop-file">
                                        <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-purple-200 dark:border-purple-800/50 rounded-xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-all duration-300 group">
                                            <Crop className="w-12 h-12 mx-auto text-purple-400 mb-4 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
                                            <Input id="crop-file" type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} className="hidden" />
                                            <Label htmlFor="crop-file" className="cursor-pointer text-sm text-muted-foreground hover:text-purple-600 transition-colors duration-300 font-medium">Click to browse or drag and drop</Label>
                                        </div>
                                    </label>
                                </CardContent>
                            </>
                        ) : (
                            <div className="p-4 flex justify-center items-center bg-muted/30">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={async (c) => {
                                        setCompletedCrop(c);
                                        if (imgRef.current && previewCanvasRef.current && c.width && c.height) {
                                            await canvasPreview(imgRef.current, previewCanvasRef.current, c);
                                        }
                                    }}
                                    aspect={aspect}
                                    className="max-h-[60vh]"
                                >
                                    <img ref={imgRef} alt="Crop me" src={imageSrc} onLoad={onImageLoad} className="max-h-[60vh]" />
                                </ReactCrop>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                        <CardHeader className="border-b border-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-purple-600" /> Crop Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Aspect Ratio</Label>
                                <Select onValueChange={handleAspectChange} defaultValue="1.7777777777777777" disabled={!imageSrc}>
                                    <SelectTrigger><SelectValue placeholder="Select ratio" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1.7777777777777777">16:9</SelectItem>
                                        <SelectItem value="1.3333333333333333">4:3</SelectItem>
                                        <SelectItem value="1">1:1 (Square)</SelectItem>
                                        <SelectItem value="0.6666666666666666">2:3</SelectItem>
                                        <SelectItem value="free">Free Form</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    {imageSrc && (
                        <Button variant="secondary" onClick={handleClear} className="w-full">
                            <XCircle className="w-4 h-4 mr-2" /> Clear Image
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardHeader className="border-b border-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-purple-600" /> Download Cropped Image
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {completedCrop?.width && completedCrop?.height ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className='overflow-hidden rounded-lg shadow-md border'>
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                        objectFit: 'contain',
                                        width: completedCrop.width,
                                        height: completedCrop.height,
                                        maxWidth: '100%',
                                        maxHeight: '288px', // 18rem
                                    }}
                                />
                            </div>
                            <Button onClick={handleDownload} className="w-full sm:w-auto mt-4">
                                <Download className="w-4 h-4 mr-2" /> Download Image
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                            <Crop className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
                            <p className="text-muted-foreground font-medium">Your cropped image preview will appear here</p>
                            <p className="text-xs text-muted-foreground mt-2">Crop the image above to see the result</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}