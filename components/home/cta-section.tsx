import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Boost Your Productivity?</h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
          Join thousands of users who have streamlined their workflow with our tools. Start converting, compressing, and
          optimizing today - completely free.
        </p>
        <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14">
          <Link href="/features">
            Try Our Tools Free
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
