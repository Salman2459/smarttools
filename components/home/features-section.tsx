"use client" // Add this directive to use React hooks

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react" // Import the Search icon
import { toolsData } from "@/lib/tools-data"

export function FeaturesSection() {
  // State to hold the user's search query
  const [searchQuery, setSearchQuery] = useState("")

  // Filter the tools based on the search query.
  // The filter is case-insensitive and checks both title and description.
  const filteredFeatures = toolsData.filter((tool) => {
    const query = searchQuery.toLowerCase()
    const titleMatch = tool.title.toLowerCase().includes(query)
    const descriptionMatch = tool.description.toLowerCase().includes(query)
    return titleMatch || descriptionMatch
  })

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

        {/* --- ADDED: Styled Search Bar --- */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for a tool by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
          />
        </div>

        {/* --- MODIFIED: Grid now uses the filtered list --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredFeatures.map((feature, index) => (
            <Link key={feature.id} href={`/tools/${feature.id}`} className="no-underline">
              <Card
                className="group h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-0 
             bg-gradient-to-br from-transparent to-transparent 
             dark:from-background dark:to-background/40 
             backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  // The animation can be applied to the component itself,
                  // assuming you have a fade-in animation defined in your global CSS
                  // animationName: "fadeInUp",
                  // animationDuration: "0.5s",
                  // animationFillMode: "forwards"
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

        {/* --- ADDED: "No Results" Message --- */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground">No Tools Found</h3>
            <p className="text-muted-foreground mt-2">
              We couldn't find any tools matching your search for "{searchQuery}".
            </p>
          </div>
        )}
      </div>
    </section>
  )
}