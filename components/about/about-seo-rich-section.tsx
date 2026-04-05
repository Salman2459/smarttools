import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, HeartHandshake, Rocket } from "lucide-react"

const storyCards = [
  {
    icon: Rocket,
    title: "From experiments to a public toolkit",
    body: "SmartTools.fun began as small utilities that solved repetitive file tasks faster than opening heavy desktop suites. Sharing them on the open web made sense: the same problems appear in classrooms, startups, and home offices worldwide. Publishing long guides next to each tool keeps the experience educational, not just transactional.",
  },
  {
    icon: GraduationCap,
    title: "Learning-first documentation",
    body: "We explain trade-offs—lossy versus lossless compression, when PDF beats DOCX, how DNS propagation affects go-live dates—so readers build judgment, not dependence on a single button. That depth matches what reviewers expect from helpful content in 2026 and beyond.",
  },
  {
    icon: HeartHandshake,
    title: "Community and sustainability",
    body: "Advertising through Google AdSense helps cover infrastructure and development. We aim to balance revenue with readable layouts: substantive articles, clear navigation, and honest disclosures about privacy and cookies, linked from every relevant page.",
  },
]

export function AboutSeoRichSection() {
  return (
    <section className="py-16 sm:py-24 bg-background border-y border-border" aria-labelledby="about-seo-heading">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="secondary">Our story in depth</Badge>
          <h2 id="about-seo-heading" className="text-2xl sm:text-4xl font-bold tracking-tight">
            Why SmartTools.fun invests in long-form guides and transparent policies
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Productivity sites can easily become grids of icons with one-line descriptions. That minimal approach loads fast but teaches little. We deliberately pair each utility with detailed context so visitors understand how a format works, when to choose it, and what privacy expectations apply—especially important for students, freelancers, and small teams without dedicated IT staff.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {storyCards.map((c) => (
            <Card key={c.title} className="border bg-muted/20">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
                  <c.icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle className="text-base leading-snug">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{c.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-5 text-sm sm:text-base text-foreground leading-relaxed">
          <p>
            Accessibility matters in both the narrow sense—keyboard navigation, legible typography, responsive layouts—and the broader sense: tools should be understandable on first visit. When we design a new feature, we ask whether someone who speaks English as a second language could follow the steps without a video tutorial. That standard pushes us toward clearer labels, predictable flows, and error messages that suggest a next step instead of a dead end.
          </p>
          <p>
            Security and privacy are not afterthoughts. Files are processed to fulfill your request and are not mined for unrelated purposes. We document limitations honestly: browser-based video encoding cannot always match every niche codec that desktop editors support, and extremely large uploads may fail on slow networks. Knowing those boundaries helps you plan hybrid workflows—quick edits online, precision finishing offline when needed.
          </p>
          <p>
            If you want to explore the full catalog, start at the{" "}
            <Link href="/features/" className="text-primary font-medium underline-offset-4 hover:underline">
              features directory
            </Link>
            . For policy detail, read the{" "}
            <Link href="/privacypolicy/" className="text-primary font-medium underline-offset-4 hover:underline">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/terms/" className="text-primary font-medium underline-offset-4 hover:underline">
              terms of service
            </Link>
            . To suggest a tool or report an issue, use the{" "}
            <Link href="/contact/" className="text-primary font-medium underline-offset-4 hover:underline">
              contact page
            </Link>
            . We read thoughtful feedback and it directly influences our roadmap.
          </p>
        </div>
      </div>
    </section>
  )
}
