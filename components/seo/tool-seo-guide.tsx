import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, HelpCircle, Layers } from "lucide-react"
export type ToolSeoGuideProps = {
  content: {
    intro: {
      title: string
      lead: string
      paragraphs: string[]
    }
    sections: { id: string; heading: string; paragraphs: string[] }[]
    benefitCards: { title: string; body: string }[]
    faqs: { q: string; a: string }[]
    relatedNote: string
  }
  toolTitle: string
  category: string
}

export function ToolSeoGuide({ content, toolTitle, category }: ToolSeoGuideProps) {
  const { intro, sections, benefitCards, faqs, relatedNote } = content

  return (
    <article
      className="mt-12 lg:mt-16 border-t border-border pt-10 lg:pt-12"
      aria-labelledby="tool-seo-guide-heading"
    >
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Guide &amp; FAQ
            </Badge>
            <Badge variant="outline">{category}</Badge>
          </div>
          <h2 id="tool-seo-guide-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
            {intro.title}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{intro.lead}</p>
        </header>

        <div className="max-w-none text-sm sm:text-base text-foreground leading-relaxed space-y-4">
          {intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {benefitCards.map((card) => (
            <Card key={card.title} className="border bg-card/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary shrink-0" aria-hidden />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{card.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`sec-${section.id}`} className="space-y-4">
            <h3 id={`sec-${section.id}`} className="text-xl sm:text-2xl font-semibold scroll-mt-24">
              {section.heading}
            </h3>
            <div className="max-w-none text-sm sm:text-base text-foreground leading-relaxed space-y-4">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-4 py-1">
          {relatedNote}{" "}
          <Link href="/features/" className="text-primary font-medium underline-offset-4 hover:underline">
            Browse all tools
          </Link>{" "}
          or return to the{" "}
          <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
            home page
          </Link>{" "}
          for featured categories and search.
        </p>

        <section aria-labelledby="tool-faq-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden />
            <h3 id="tool-faq-heading" className="text-xl sm:text-2xl font-semibold">
              Frequently asked questions about {toolTitle}
            </h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-muted/30 border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-medium text-sm sm:text-base hover:bg-muted/50 transition-colors list-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 flex-shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-xl font-light">
                    +
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-muted-foreground leading-relaxed text-sm border-t border-muted">
                  <div className="pt-3">{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
