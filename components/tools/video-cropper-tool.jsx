"use client"

import { useState, useRef, useEffect } from "react"
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
import { Video, Upload, Download, Loader2, Settings, XCircle, Scissors } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { toolsData } from "@/lib/tools-data"
import Head from "next/head"

// Helper to get a default centered crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    )
}

export function VideoCropperTool({ toolId }) {
    const [videoSrc, setVideoSrc] = useState(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputVideoUrl, setOutputVideoUrl] = useState(null);

    // SOLVED: Step 1 - Initialize the ref to null
    // This prevents FFmpeg from being instantiated on the server.
    const ffmpegRef = useRef(null);
    const inputRef = useRef(null)
    const videoRef = useRef(null)
    const toolData = toolsData.find((tool) => tool.id === toolId)


    // SOLVED: Step 2 - Move all FFmpeg loading logic into useEffect
    // This ensures the code only runs on the client after the component has mounted.
    useEffect(() => {
        const loadFFmpeg = async () => {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

            // Instantiate FFmpeg and assign it to the ref
            const ffmpeg = new FFmpeg()
            ffmpegRef.current = ffmpeg;

            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });
            ffmpeg.on('progress', ({ progress, time }) => {
                setProgress(Math.round(progress * 100));
            });

            // toBlobURL is used to bypass CORS issue, urls with the same domain can be used directly.
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setIsReady(true);
        };

        loadFFmpeg();
    }, []) // The empty dependency array ensures this runs only once on mount

    function onVideoLoad(e) {
        const { videoWidth, videoHeight } = e.currentTarget;
        setVideoDimensions({ width: videoWidth, height: videoHeight });
        const initialCrop = centerAspectCrop(videoWidth, videoHeight, videoWidth / videoHeight);
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setOutputVideoUrl(null);
            setProgress(0);
        }
    }

    const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setOutputVideoUrl(null);
            setProgress(0);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleDragOver = (event) => event.preventDefault();

    const handleClear = () => {
        setVideoSrc(null);
        setOutputVideoUrl(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleCropVideo = async () => {
        if (!completedCrop || !videoSrc || !videoRef.current) {
            alert("Please select a video and define a crop area first.");
            return;
        }

        // The 'isReady' state already prevents this from running if ffmpegRef.current is null
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg) {
            alert("FFmpeg is not loaded yet. Please wait.");
            return;
        }

        setIsProcessing(true);
        setProgress(0);

        const inputFileName = 'input.mp4';
        const outputFileName = 'output.mp4';

        await ffmpeg.writeFile(inputFileName, await fetchFile(videoSrc));

        // Calculate crop parameters based on native video dimensions
        const scaleX = videoDimensions.width / videoRef.current.clientWidth;
        const scaleY = videoDimensions.height / videoRef.current.clientHeight;

        const cropX = Math.round(completedCrop.x * scaleX);
        const cropY = Math.round(completedCrop.y * scaleY);
        const cropWidth = Math.round(completedCrop.width * scaleX);
        const cropHeight = Math.round(completedCrop.height * scaleY);

        const command = [
            '-i', inputFileName,
            '-vf', `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY}`,
            '-preset', 'superfast', // Faster encoding
            '-c:a', 'copy', // Copy audio track without re-encoding
            outputFileName
        ];

        try {
            await ffmpeg.exec(command);
            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setOutputVideoUrl(url);
        } catch (error) {
            console.error("FFmpeg processing error:", error);
            alert("An error occurred during video processing. Check the console for details.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <>
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-0 bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center shadow-lg border border-cyan-200/50 dark:border-cyan-800/50">
                                <Scissors className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <CardTitleMain className="text-2xl bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                                        Video Cropper
                                    </CardTitleMain>
                                    <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800">
                                        FFmpeg
                                    </Badge>
                                </div>
                                <CardDescription className="text-base">
                                    Upload and crop your videos directly in the browser
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                            {!videoSrc ? (
                                <>
                                    <CardHeader className="border-b border-muted/20">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Upload className="w-5 h-5 text-cyan-600" /> Upload Video
                                        </CardTitle>
                                        <CardDescription>Select a video file to start cropping</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <label htmlFor="crop-file">
                                            <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-cyan-200 dark:border-cyan-800/50 rounded-xl p-8 text-center hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/10 transition-all duration-300 group">
                                                <Video className="w-12 h-12 mx-auto text-cyan-400 mb-4 group-hover:text-cyan-600 group-hover:scale-110 transition-all duration-300" />
                                                <Input id="crop-file" type="file" accept="video/*" onChange={handleFileChange} ref={inputRef} className="hidden" />
                                                <Label htmlFor="crop-file" className="cursor-pointer text-sm text-muted-foreground hover:text-cyan-600 transition-colors duration-300 font-medium">Click to browse or drag and drop</Label>
                                            </div>
                                        </label>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="p-4 flex justify-center items-center bg-muted/30">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={undefined} // Freeform is best for video
                                        className="max-h-[60vh]"
                                    >
                                        <video ref={videoRef} src={videoSrc} controls muted onLoadedMetadata={onVideoLoad} className="max-h-[60vh]" />
                                    </ReactCrop>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                            <CardHeader className="border-b border-muted/20">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-cyan-600" /> Options
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>1. Upload a video file.</p>
                                    <p>2. Drag the corners of the box on the video to define your crop area.</p>
                                    <p>3. Click the "Crop Video" button below.</p>
                                </div>
                            </CardContent>
                        </Card>
                        {videoSrc && (
                            <Button variant="secondary" onClick={handleClear} className="w-full">
                                <XCircle className="w-4 h-4 mr-2" /> Clear Video
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                    <CardContent className="p-6">
                        <Button
                            onClick={handleCropVideo}
                            disabled={!isReady || isProcessing || !videoSrc}
                            className="w-full h-12 text-base bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                            size="lg"
                        >
                            {isProcessing ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing... {progress}%</>
                            ) : !isReady ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading Engine...</>
                            ) : (
                                <><Scissors className="w-5 h-5 mr-2" /> Crop Video</>
                            )}
                        </Button>
                        {isProcessing && <Progress value={progress} className="w-full mt-4 bg-cyan-100 dark:bg-cyan-900" />}
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                    <CardHeader className="border-b border-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-cyan-600" /> Download Cropped Video
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 d-block">
                        {outputVideoUrl ? (
                            <div className="flex flex-col items-center gap-4">
                                <video src={outputVideoUrl} controls className="w-full rounded-lg shadow-md border" />
                                <a href={outputVideoUrl} download="cropped-video.mp4" className="w-full sm:w-auto">
                                    <Button className="w-full">
                                        <Download className="w-4 h-4 mr-2" /> Download Video
                                    </Button>
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
                                <p className="text-muted-foreground font-medium">Your cropped video will appear here</p>
                                <p className="text-xs text-muted-foreground mt-2">Processing may take some time depending on video length</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}