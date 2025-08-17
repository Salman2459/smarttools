import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Zap, Download } from "lucide-react"

export function HowToUseSection() {
    const steps = [
        {
            step: 1,
            title: "Choose Your Tool",
            description: "Select from our powerful tools: compress images, convert to PDF,  video tools, or  text tools with one click.",
            icon: Zap,
        },
        {
            step: 2,
            title: "Upload Your File",
            description: "Simply drag and drop your file or select it from your device. We support all major formats.",
            icon: Upload,
        },
        {
            step: 3,
            title: "Download Result",
            description: "Get your processed file instantly. High quality results delivered in seconds, ready to use.",
            icon: Download,
        },
    ]

    return (
        <section className="py-16 sm:py-20 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <Badge variant="outline" className="mb-4 md:text-2xl">
                        How to Use
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Simple in 3 Steps</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Get started with SmartTools in just three easy steps. No registration required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon
                        return (
                            <Card key={index} className="bg-background/60 backdrop-blur border-0 relative overflow-hidden border">
                                <CardContent className="p-4 sm:p-6 text-center">
                                    <div className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs sm:text-sm font-bold text-primary">{step.step}</span>
                                    </div>

                                    <div className="mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}