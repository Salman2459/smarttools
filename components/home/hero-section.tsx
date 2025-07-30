import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
  const benefits = [
    "No registration required",
    "Secure file processing",
    "Fast conversion speeds",
    "Multiple format support",
    "Privacy-focused design",
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 text-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 text-xs sm:text-sm font-medium mb-6 shadow-sm">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
            Productivity Tools Hub
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
          <span className="block mb-2">Simplify Your</span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
            Daily Tasks
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Transform, convert, and optimize your files with our suite of powerful productivity tools. Fast, secure, and
          designed for modern workflows. No registration required - start using our tools immediately.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/features">
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </Button>
          {/* <Button
            variant="outline"
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 bg-background/50 backdrop-blur-sm border-2 hover:bg-muted/50 transition-all duration-300"
          >
            Watch Demo
          </Button> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto px-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-lg p-3 sm:p-2 border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span className="text-center sm:text-left">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
