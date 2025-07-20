import { Badge } from "@/components/ui/badge"
import { Play, FileImage, ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choose Your Tool",
      description: "Select from our suite of productivity tools based on your needs",
      icon: Play,
    },
    {
      step: "02",
      title: "Upload Your Files",
      description: "Drag and drop or browse to upload your files securely",
      icon: FileImage,
    },
    {
      step: "03",
      title: "Process & Download",
      description: "Let our tools work their magic and download your results instantly",
      icon: ArrowRight,
    },
  ]

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Simple Process, Powerful Results</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get your work done in three simple steps. Our streamlined process ensures you spend less time on file
            management and more time on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="text-xs sm:text-sm font-mono text-primary mb-2 sm:mb-3">{step.step}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 sm:top-10 left-full w-full">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
