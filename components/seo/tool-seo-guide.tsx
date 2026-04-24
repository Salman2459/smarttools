import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

        <section aria-labelledby="tool-faq-heading" className="space-y-4">
          {content}
        </section>
      </div>
    <div className="mt-12">
    <Footer forceShow />
    </div>
    </article>


    </>
  )
}
