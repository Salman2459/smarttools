"use client"

import { useState, useRef, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileVideo, Upload, Download, Loader2, Settings, XCircle, Gauge } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function VideoCompressorTool() {
    const [videoFile, setVideoFile] = useState(null)
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    // Settings State
    const [crf, setCrf] = useState([28]);
    const [preset, setPreset] = useState('fast');
    const [resolution, setResolution] = useState('original');

    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputVideoUrl, setOutputVideoUrl] = useState(null);

    const ffmpegRef = useRef(null);
    const inputRef = useRef(null)

    // Load FFmpeg
    useEffect(() => {
        const loadFFmpeg = async () => {
            if (!ffmpegRef.current) {
                ffmpegRef.current = new FFmpeg();
            }
            const ffmpeg = ffmpegRef.current;
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
            ffmpeg.on('log', ({ message }) => console.log(message));
            ffmpeg.on('progress', ({ progress }) => setProgress(Math.min(Math.round(progress * 100), 100)));
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setVideoFile(file);
            setOriginalSize(file.size);
            setOutputVideoUrl(null);
            setCompressedSize(0);
            setProgress(0);
        }
    }

    const handleClear = () => {
        setVideoFile(null);
        setOutputVideoUrl(null);
        setOriginalSize(0);
        setCompressedSize(0);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleCompressVideo = async () => {
        if (!videoFile) return;

        setIsProcessing(true);
        setProgress(0);

        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

        // Construct the FFmpeg command based on user settings
        const command = [
            '-i', 'input.mp4',
            '-c:v', 'libx264', // H.264 codec
            '-preset', preset,
            '-crf', `${crf[0]}`,
            '-c:a', 'aac', // Re-encode audio to a common format
            '-b:a', '128k' // Set audio bitrate
        ];

        if (resolution !== 'original') {
            command.push('-vf', `scale=-2:${resolution}`);
        }

        command.push('output.mp4');

        await ffmpeg.exec(command);
        const data = await ffmpeg.readFile('output.mp4');
        const blob = new Blob([data.buffer], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setOutputVideoUrl(url);
        setCompressedSize(blob.size);
        setIsProcessing(false);
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-0 bg-gradient-to-br from-rose-50 to-red-100/30 dark:from-rose-950/20 dark:to-red-900/10 shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-rose-100 dark:bg-red-900/20 flex items-center justify-center shadow-lg border border-red-200/50 dark:border-rose-800/50">
                            <FileVideo className="w-8 h-8 text-red-600 dark:text-rose-400" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-2xl bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent">
                                    Video Compressor
                                </CardTitle>
                                <Badge variant="outline" className="bg-rose-50 dark:bg-red-950/50 border-red-200 dark:border-rose-800">
                                    Optimization
                                </Badge>
                            </div>
                            <CardDescription className="text-base">
                                Reduce video file sizes while balancing quality and resolution
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
                                <Upload className="w-5 h-5 text-red-600" /> Upload Video
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {!videoFile ? (
                                <label htmlFor="compress-file">
                                    <div className="border-2 border-dashed border-red-200 dark:border-rose-800/50 rounded-xl p-8 text-center hover:border-red-400 dark:hover:border-rose-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all duration-300 group">
                                        <FileVideo className="w-12 h-12 mx-auto text-red-400 mb-4 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
                                        <Input id="compress-file" type="file" accept="video/*" onChange={handleFileChange} ref={inputRef} className="hidden" />
                                        <Label htmlFor="compress-file" className="cursor-pointer text-sm text-muted-foreground hover:text-red-600 transition-colors duration-300 font-medium">Click to browse or drag & drop</Label>
                                    </div>
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileVideo className="w-5 h-5 text-red-600 flex-shrink-0" />
                                            <span className="text-sm truncate font-medium">{videoFile.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={handleClear} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                            <XCircle className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <video
                                        src={URL.createObjectURL(videoFile)}
                                        controls
                                        className="w-[300px] h-[300px] rounded-lg shadow-inner bg-black mx-auto d-block"
                                    />

                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                        <CardHeader className="border-b border-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-red-600" /> Compression Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Quality (CRF): {crf[0]}</Label>
                                <Slider value={crf} onValueChange={setCrf} min={18} max={32} step={1} />
                                <div className="flex justify-between text-xs text-muted-foreground"><span>Better Quality</span><span>Smaller File</span></div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Resolution</Label>
                                <Select value={resolution} onValueChange={setResolution}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="original">Original</SelectItem>
                                        <SelectItem value="1080">1080p</SelectItem>
                                        <SelectItem value="720">720p</SelectItem>
                                        <SelectItem value="480">480p</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Encoding Speed</Label>
                                <Select value={preset} onValueChange={setPreset}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ultrafast">Ultrafast</SelectItem>
                                        <SelectItem value="fast">Fast</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="slow">Slow</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardContent className="p-6">
                    <Button
                        onClick={handleCompressVideo}
                        disabled={!isReady || isProcessing || !videoFile}
                        className="w-full h-12 text-base bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                        size="lg"
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Compressing... {progress}%</>
                        ) : !isReady ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading Engine...</>
                        ) : (
                            <><Gauge className="w-5 h-5 mr-2" /> Compress Video</>
                        )}
                    </Button>
                    {isProcessing && <Progress value={progress} className="w-full mt-4 [&>div]:bg-red-500" />}
                </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardHeader className="border-b border-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-red-600" /> Download Compressed Video
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {outputVideoUrl ? (
                        <div className="space-y-4">
                            <div className="flex flex-wrap justify-around gap-4 p-4 bg-muted/40 rounded-lg text-center">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Original Size</Label>
                                    <p className="font-semibold">{formatFileSize(originalSize)}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Compressed Size</Label>
                                    <p className="font-semibold">{formatFileSize(compressedSize)}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Reduction</Label>
                                    <p className="font-semibold text-green-600">
                                        {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                            <video
                                src={outputVideoUrl}
                                controls
                                className="w-[300px] h-[300px] rounded-lg shadow-md border mx-auto d-block"
                            />

                            <a href={outputVideoUrl} download={`compressed-${videoFile.name}`} className="w-full">
                                <Button className="w-full">
                                    <Download className="w-4 h-4 mr-2" /> Download Video
                                </Button>
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-muted/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                            <Gauge className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse-slow" />
                            <p className="text-muted-foreground font-medium">Your compressed video will appear here</p>
                            <p className="text-xs text-muted-foreground mt-2">Compression can take a few minutes for large files</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}