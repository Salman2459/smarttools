import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Users } from "lucide-react"

export function WhyChooseUsSection() {
  const whyChooseUs = [
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your files are processed securely and deleted immediately after conversion. We never store or access your personal data.",
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description:
        "Our optimized processing engines deliver results in seconds, not minutes. Get your work done faster than ever.",
    },
    {
      icon: Users,
      title: "User Friendly",
      description:
        "Intuitive interface designed for everyone. No technical knowledge required - just upload, process, and download.",
    },
  ]

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Built for Modern Workflows</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            We understand the importance of efficiency, security, and simplicity in today's fast-paced digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
