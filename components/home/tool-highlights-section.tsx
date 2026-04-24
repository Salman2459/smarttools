import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileImage, FileText, ImageIcon, Zap, Video, Type, QrCode, Scissors } from "lucide-react"
import Link from "next/link"

const toolHighlights = [
    {
        icon: FileImage,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        title: "Image to PDF",
        description: "Convert JPG, PNG, WebP, and JPEG images to high-quality PDF documents in seconds. No quality loss guaranteed.",
        link: "/tools/image-to-pdf"
    },
    {
        icon: FileText,
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        title: "Word & Excel to PDF",
        description: "Transform your Word documents and Excel spreadsheets into professional, universally-compatible PDF files.",
        link: "/tools/word-to-pdf"
    },
    {
        icon: ImageIcon,
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
        title: "Image Compression",
        description: "Reduce image file sizes by up to 80% while preserving visual quality. Perfect for web optimization and storage.",
        link: "/tools/image-compressor"
    },
    {
        icon: Zap,
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/30",
        title: "Grammar & writing check",
        description:
            "Paste essays, emails, or support macros to catch spelling and grammar issues before you send. Suggestions are advisory—always keep your brand voice and facts in mind.",
        link: "/tools/grammar-checker"
    },
    {
        icon: Video,
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        title: "Video Compressor",
        description: "Compress large video files for easy sharing and storage without sacrificing video quality.",
        link: "/tools/video-compressor"
    },
    {
        icon: Type,
        color: "text-teal-500",
        bgColor: "bg-teal-50 dark:bg-teal-950/30",
        title: "Text to Speech",
        description: "Convert any text to natural-sounding speech audio. Supports multiple voices and languages.",
        link: "/tools/text-to-speech"
    },
    {
        icon: QrCode,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        title: "QR Code Generator",
        description: "Create custom QR codes for links, text, contact info, and more. Download in high-resolution instantly.",
        link: "/tools/qr-generator"
    },
    {
        icon: Scissors,
        color: "text-pink-500",
        bgColor: "bg-pink-50 dark:bg-pink-950/30",
        title: "Image Cropper",
        description: "Crop and resize images with precision. Set custom dimensions or use preset aspect ratios for social media.",
        link: "/tools/image-cropper"
    },
]

export function ToolHighlightsSection() {
    return (
        <section className="py-16 sm:py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <Badge variant="outline" className="mb-4">
                        Popular Tools
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        Everything You Need in One Place
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                        From file conversion to AI-powered tools, SmartTools.fun gives you instant access to the most
                        essential digital tools — all for free, with no sign-up required.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {toolHighlights.map((tool, index) => (
                        <Link key={index} href={tool.link} className="no-underline group">
                            <Card className="h-full border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                <CardContent className="p-5">
                                    <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                    </div>
                                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
