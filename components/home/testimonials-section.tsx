import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "This tool has saved me hours every week. The image to PDF conversion is flawless and so fast!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      content: "The image compression feature is incredible. I can reduce file sizes without losing quality.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Content Writer",
      content: "The AI text humanizer is a game-changer for my workflow. Makes my content sound more natural.",
      rating: 5,
    },
  ]

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-4 md:text-2xl">
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our users have to say about their experience with SmartTools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
