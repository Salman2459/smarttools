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
import { GanttChartSquare, Upload, Download, Loader2, Settings, XCircle, Timer } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// Helper to format time from seconds to MM:SS.ms
const formatTime = (timeInSeconds) => {
    if (timeInSeconds < 0) timeInSeconds = 0;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 100);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
};

export function VideoTrimmerTool() {
    const [videoSrc, setVideoSrc] = useState(null)
    const [videoFile, setVideoFile] = useState(null)
    const [duration, setDuration] = useState(0)
    const [trimRange, setTrimRange] = useState([0, 0])
    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputVideoUrl, setOutputVideoUrl] = useState(null);

    const ffmpegRef = useRef(null);
    const inputRef = useRef(null)
    const videoRef = useRef(null)

    // Load FFmpeg on client-side only
    useEffect(() => {
        const loadFFmpeg = async () => {
            if (!ffmpegRef.current) {
                ffmpegRef.current = new FFmpeg();
            }
            const ffmpeg = ffmpegRef.current;
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
            ffmpeg.on('log', ({ message }) => console.log(message));
            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.min(Math.round(progress * 100), 100));
            });
            if (!ffmpeg.loaded) {
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
            }
            setIsReady(true);
        };
        loadFFmpeg();
    }, [])

    const onVideoLoad = (e) => {
        const videoDuration = e.currentTarget.duration;
        setDuration(videoDuration);
        setTrimRange([0, videoDuration]);
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setOutputVideoUrl(null);
            setProgress(0);
        }
    }

    const handleClear = () => {
        setVideoSrc(null);
        setVideoFile(null);
        setOutputVideoUrl(null);
        setDuration(0);
        setTrimRange([0, 0]);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleSliderChange = (newRange) => {
        setTrimRange(newRange);
        if (videoRef.current && Math.abs(videoRef.current.currentTime - newRange[0]) > 0.5) {
            videoRef.current.currentTime = newRange[0];
        }
    }

    const handleTrimVideo = async () => {
        if (!videoFile) return;

        setIsProcessing(true);
        setProgress(0);

        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

        const [startTime, endTime] = trimRange;

        const command = [
            '-i', 'input.mp4',
            '-ss', `${startTime}`,
            '-to', `${endTime}`,
            '-preset', 'superfast',
            '-c:a', 'copy',
            'output.mp4'
        ];

        await ffmpeg.exec(command);
        const data = await ffmpeg.readFile('output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setOutputVideoUrl(url);
        setIsProcessing(false);
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-100/30 dark:from-slate-900/20 dark:to-blue-900/10 shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-blue-900/20 flex items-center justify-center shadow-lg border border-blue-200/50 dark:border-slate-800/50">
                            <GanttChartSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitleMain className="text-2xl bg-gradient-to-r from-slate-600 to-blue-700 bg-clip-text text-transparent dark:from-slate-300 dark:to-blue-400">
                                    Video Trimmer
                                </CardTitleMain>
                                <Badge variant="outline" className="bg-slate-50 dark:bg-blue-950/50 border-blue-200 dark:border-slate-800">
                                    Accurate & Fast
                                </Badge>
                            </div>
                            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                                Precisely cut your videos to the perfect length
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                {!videoSrc ? (
                    <>
                        <CardHeader className="border-b border-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-600" /> Upload Video
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <label htmlFor="trim-file">
                                <div className="border-2 border-dashed border-blue-200 dark:border-slate-800/50 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-all duration-300 group">
                                    <Timer className="w-12 h-12 mx-auto text-blue-400 mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                                    <Input id="trim-file" type="file" accept="video/*" onChange={handleFileChange} ref={inputRef} className="hidden" />
                                    <Label htmlFor="trim-file" className="cursor-pointer text-sm text-muted-foreground hover:text-blue-600 transition-colors duration-300 font-medium">Click to browse or drag & drop</Label>
                                </div>
                            </label>
                        </CardContent>
                    </>
                ) : (
                    <CardContent className="p-6 space-y-4">
                        {/* FIX 1: Set fixed height on video player */}
                        <div className="w-full flex justify-center bg-black rounded-lg">
                            <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onVideoLoad} className="w-[300px] h-[300px] rounded-lg shadow-inner mx-auto d-block" />
                        </div>

                        {/* FIX 2: Prominent Slider Controls with handles at both ends */}
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-4">
                            <div className="flex justify-between text-sm font-mono font-medium">
                                <span className="text-blue-600 dark:text-blue-400">Start: {formatTime(trimRange[0])}</span>
                                <span className="text-slate-500 dark:text-slate-400">Duration: {formatTime(trimRange[1] - trimRange[0])}</span>
                                <span className="text-blue-600 dark:text-blue-400">End: {formatTime(trimRange[1])}</span>
                            </div>
                            <Slider
                                value={trimRange}
                                onValueChange={handleSliderChange}
                                max={duration}
                                step={0.1}
                                disabled={!duration}
                                // These classes target both handles `[&_[role=slider]]`
                                className=""
                            />
                        </div>

                        <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
                            <XCircle className="w-4 h-4 mr-2" />
                            Clear Video
                        </Button>
                    </CardContent>
                )}
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardContent className="p-6">
                    <Button
                        onClick={handleTrimVideo}
                        disabled={!isReady || isProcessing || !videoSrc}
                        className="w-full h-12 text-base bg-gradient-to-r from-slate-700 to-blue-600 hover:from-slate-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                        size="lg"
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing... {progress}%</>
                        ) : !isReady ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading Engine...</>
                        ) : (
                            <><GanttChartSquare className="w-5 h-5 mr-2" /> Trim Video</>
                        )}
                    </Button>
                    {isProcessing && <Progress value={progress} className="w-full mt-4" />}
                </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardHeader className="border-b border-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" /> Download Trimmed Video
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {outputVideoUrl ? (
                        <div className="flex flex-col items-center gap-4">
                            {/* FIX 1: Set fixed height on output video as well */}
                            <div className="w-full flex justify-center bg-black rounded-lg">
                                <video src={outputVideoUrl} controls className="w-[300px] h-[300px] rounded-lg shadow-md border mx-auto d-block" />
                            </div>
                            <a href={outputVideoUrl} download="trimmed-video.mp4" className="w-full sm:w-auto">
                                <Button className="w-full">
                                    <Download className="w-4 h-4 mr-2" /> Download Video
                                </Button>
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                            <Timer className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
                            <p className="text-muted-foreground font-medium">Your trimmed video will appear here</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}