import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, HelpCircle, Layers } from "lucide-react"
import { Footer } from "../footer"
export type ToolSeoGuideProps = {
  content: {
    intro: {
      title: string
      lead: string
      /** Single 50–100 word tool blurb; not repeated in intro.paragraphs */
      summary: string
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
    <>
      <article
        className="mt-12 lg:mt-16 border-t border-border pt-10 lg:pt-12"
        aria-labelledby="tool-seo-guide-heading"
      >
        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
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

          <header className="space-y-4">
            <h2
              id="tool-seo-guide-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              {intro.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{intro.lead}</p>
            <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm sm:text-base text-foreground leading-relaxed">
              {intro.summary}
            </p>
            <div className="space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
              {intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </header>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 scroll-mt-24" aria-labelledby={`${section.id}-heading`}>
              <h3 id={`${section.id}-heading`} className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                {section.heading}
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="tool-benefits-heading" className="space-y-4">
            <h3 id="tool-benefits-heading" className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {toolTitle} — at a glance
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefitCards.map((card, i) => (
                <Card key={i} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {card.body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="tool-faq-heading" className="space-y-4">
            <h3 id="tool-faq-heading" className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              Frequently asked questions
            </h3>
            <ul className="space-y-6 list-none p-0 m-0">
              {faqs.map((faq, i) => (
                <li key={i} className="space-y-2">
                  <p className="font-medium text-foreground text-sm sm:text-base">{faq.q}</p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-0 sm:pl-4 border-l-0 sm:border-l-2 sm:border-border">
                    {faq.a}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 max-w-4xl mx-auto px-4 lg:px-8">
          <Footer forceShow />
        </div>
      </article>
    </>
  )
}
