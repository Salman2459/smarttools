import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileImage, FileText, ImageIcon, Zap } from "lucide-react"
import { toolsData } from "@/lib/tools-data"
import Link from "next/link"

export function FeaturesSection() {
  // const features = [
  //   {
  //     icon: FileImage,
  //     title: "Image to PDF",
  //     description: "Convert your images to high-quality PDF documents instantly",
  //     color: "text-blue-600 dark:text-blue-400",
  //   },
  //   {
  //     icon: FileText,
  //     title: "Doc & Image to PDF",
  //     description: "Transform Excel and Word files into professional PDFs",
  //     color: "text-green-600 dark:text-green-400",
  //   },
  //   {
  //     icon: ImageIcon,
  //     title: "Image Compression",
  //     description: "Reduce file sizes while maintaining image quality",
  //     color: "text-purple-600 dark:text-purple-400",
  //   },
  //   {
  //     icon: Zap,
  //     title: "AI Text Humanizer",
  //     description: "Convert AI-generated text into natural, human-like content",
  //     color: "text-orange-600 dark:text-orange-400",
  //   },
  // ]

  const features = toolsData

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-4">
            Our Tools
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Powerful Tools for Every Need</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you work smarter, not harder. Choose from our collection of
            productivity enhancers designed for modern workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={`/tools/${feature.id}`} className="no-underline">
              <Card
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-0 
             bg-gradient-to-br from-transparent to-transparent 
             dark:from-background dark:to-background/40 
             backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <feature.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                    {feature.title.replace(" Converter", "")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-xs sm:text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
