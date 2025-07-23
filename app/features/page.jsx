import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { toolsData } from "@/lib/tools-data"

export default function FeaturesPage() {
  const categories = [...new Set(toolsData.map((tool) => tool.category))]

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="outline" className="mb-4">
            Productivity Tools
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Choose Your Tool</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select a tool below to get started. All tools are free to use with no registration required.
          </p>
        </div>

        {/* Tool Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs sm:text-sm px-3 py-1">
              {category}
            </Badge>
          ))}
        </div>

        {/* Tool Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {toolsData.map((tool) => (
            <Card
              key={tool.id}
              className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-600 dark:border-gray-800"
            >
              <Link href={`/tools/${tool.id}`}>
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div
                    className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-lg ${tool.bgColor} flex items-center justify-center mb-3 sm:mb-4 shadow-lg border border-white/20 dark:border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <tool.icon className={`w-5 h-5 sm:w-8 sm:h-8 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-sm sm:text-lg group-hover:text-primary transition-colors duration-300">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-xs sm:text-sm leading-relaxed mb-2 group-hover:text-foreground/80 transition-colors duration-300">
                    {tool.description}
                  </CardDescription>
                  <Badge variant="outline" className="text-xs bg-background/50">
                    {tool.category}
                  </Badge>
                </CardContent>
              </Link>
            </Card>
          ))}

          {/* Coming Soon Card */}
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-md border-dashed border-2 opacity-60">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-muted flex items-center justify-center mb-3 sm:mb-4">
                <Plus className="w-5 h-5 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm sm:text-lg text-muted-foreground">More Tools</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <CardDescription className="text-xs sm:text-sm leading-relaxed mb-2">
                Additional productivity tools coming soon
              </CardDescription>
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Choose any tool above to begin processing your files. No registration required, completely free to use.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90">
            <Link href="/tools/image-to-pdf">
              Try Image to PDF
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
